const express = require('express');
const Request = require('../models/Request');
const User = require('../models/User');
const Helper = require('../models/Helper');
const auth = require('../middleware/auth');
const router = express.Router();

// Create a new assistance request
router.post('/', auth, async (req, res) => {
  try {
    const {
      serviceType,
      description,
      location,
      estimatedPrice,
      isUrgent,
      vehicle
    } = req.body;

    // Validate required fields
    if (!serviceType || !description || !location || !estimatedPrice || !vehicle) {
      return res.status(400).json({
        message: 'Missing required fields',
        required: ['serviceType', 'description', 'location', 'estimatedPrice', 'vehicle']
      });
    }

    // Validate location format
    if (!location.coordinates || !location.address) {
      return res.status(400).json({
        message: 'Invalid location format',
        required: {
          coordinates: '[longitude, latitude]',
          address: 'string'
        }
      });
    }

    // Create the request
    const newRequest = new Request({
      user: req.userId,
      serviceType,
      description,
      location: {
        type: 'Point',
        coordinates: location.coordinates,
        address: location.address
      },
      estimatedPrice,
      isUrgent: isUrgent || false,
      vehicle
    });

    await newRequest.save();

    // Populate user details for the response
    const populatedRequest = await Request.findById(newRequest._id)
      .populate('user', 'fullName phone');

    res.status(201).json(populatedRequest);
  } catch (error) {
    console.error('Create request error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));

      return res.status(400).json({
        message: 'Validation Error',
        errors: validationErrors
      });
    }

    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Duplicate key error',
        field: Object.keys(error.keyPattern)[0]
      });
    }

    // Handle other errors
    res.status(500).json({
      message: 'Failed to create request',
      error: error.message,
      details: error.errInfo?.details,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get user's requests
router.get('/user', auth, async (req, res) => {
  try {
    if (req.userType !== 'customer') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const requests = await Request.find({ user: req.userId })
      .populate('helper', 'fullName phone rating')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error('Get user requests error:', error);
    res.status(500).json({ message: 'Failed to get requests', error: error.message });
  }
});

// Get helper's requests
router.get('/helper', auth, async (req, res) => {
  try {
    if (req.userType !== 'helper') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const requests = await Request.find({ helper: req.userId })
      .populate('user', 'fullName phone')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error('Get helper requests error:', error);
    res.status(500).json({ message: 'Failed to get requests', error: error.message });
  }
});

// Get available requests for helpers
router.get('/available', auth, async (req, res) => {
  try {
    if (req.userType !== 'helper') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get helper's location and services
    const helper = await Helper.findById(req.userId);

    if (!helper.isAvailable) {
      return res.status(400).json({ message: 'You must be available to see requests' });
    }

    // Find all pending requests
    const availableRequests = await Request.find({
      status: 'pending'
    }).populate('user', 'fullName phone');

    // Calculate distance for each request (mock calculation for now)
    // In a real app, you would use actual geospatial calculations
    const requestsWithDistance = availableRequests.map(request => {
      // Mock distance calculation (random between 1-10 miles)
      const distanceInMiles = Math.floor(Math.random() * 10) + 1;

      return {
        ...request.toObject(),
        distanceInMiles
      };
    });

    res.json(requestsWithDistance);
  } catch (error) {
    console.error('Get available requests error:', error);
    res.status(500).json({ message: 'Failed to get available requests', error: error.message });
  }
});

// Accept a request
router.post('/:id/accept', auth, async (req, res) => {
  try {
    if (req.userType !== 'helper') {
      return res.status(403).json({ message: 'Only helpers can accept requests' });
    }

    const requestId = req.params.id;

    // Find the request
    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'This request is no longer available' });
    }

    // Update the request
    request.status = 'accepted';
    request.helper = req.userId;
    request.acceptedAt = new Date();

    await request.save();

    // Return the updated request
    const updatedRequest = await Request.findById(requestId)
      .populate('user', 'fullName phone')
      .populate('helper', 'fullName phone');

    res.json(updatedRequest);
  } catch (error) {
    console.error('Accept request error:', error);
    res.status(500).json({ message: 'Failed to accept request', error: error.message });
  }
});

// Update request status
router.post('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const requestId = req.params.id;

    // Find the request
    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Verify the user has permission
    if (
      (req.userType === 'helper' && request.helper?.toString() !== req.userId.toString()) ||
      (req.userType === 'customer' && request.user.toString() !== req.userId.toString())
    ) {
      return res.status(403).json({ message: 'You do not have permission to update this request' });
    }

    // Validate status transitions
    const validTransitions = {
      pending: ['accepted', 'cancelled'],
      accepted: ['inProgress', 'cancelled'],
      inProgress: ['completed', 'cancelled'],
      completed: [],
      cancelled: []
    };

    if (!validTransitions[request.status].includes(status)) {
      return res.status(400).json({
        message: `Cannot change status from ${request.status} to ${status}`
      });
    }

    // Update the request
    request.status = status;

    // Set timestamp based on status
    if (status === 'inProgress') {
      request.startedAt = new Date();
    } else if (status === 'completed') {
      request.completedAt = new Date();

      // Update payment status
      request.payment = {
        ...request.payment,
        status: 'completed',
        amount: request.estimatedPrice
      };

      // Update helper's rating (if customer is updating)
      if (req.userType === 'customer' && request.helper) {
        const { rating, review } = req.body;

        if (rating && rating >= 1 && rating <= 5) {
          request.rating = rating;

          if (review) {
            request.review = review;
          }

          // Update helper's overall rating
          const helper = await Helper.findById(request.helper);

          if (helper) {
            const newTotalRatings = helper.totalRatings + 1;
            const newRating = ((helper.rating * helper.totalRatings) + rating) / newTotalRatings;

            helper.rating = newRating;
            helper.totalRatings = newTotalRatings;

            await helper.save();
          }
        }
      }
    } else if (status === 'cancelled') {
      request.cancelledAt = new Date();
    }

    await request.save();

    // Return the updated request
    const updatedRequest = await Request.findById(requestId)
      .populate('user', 'fullName phone')
      .populate('helper', 'fullName phone');

    res.json(updatedRequest);
  } catch (error) {
    console.error('Update request status error:', error);
    res.status(500).json({ message: 'Failed to update request status', error: error.message });
  }
});

// Get request history for a user
router.get('/history', auth, async (req, res) => {
  try {
    let requests;

    if (req.userType === 'customer') {
      // For customers, get all their requests
      requests = await Request.find({ user: req.userId })
        .populate('helper', 'fullName phone rating')
        .sort({ createdAt: -1 });
    } else if (req.userType === 'helper') {
      // For helpers, get all their completed or cancelled requests
      requests = await Request.find({
        helper: req.userId,
        status: { $in: ['completed', 'cancelled'] }
      })
        .populate('user', 'fullName phone')
        .sort({ createdAt: -1 });
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(requests);
  } catch (error) {
    console.error('Get request history error:', error);
    res.status(500).json({ message: 'Failed to get request history', error: error.message });
  }
});

// Get a single request
router.get('/:id', auth, async (req, res) => {
  try {
    const requestId = req.params.id;

    const request = await Request.findById(requestId)
      .populate('user', 'fullName phone')
      .populate('helper', 'fullName phone');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check if user has permission to view this request
    if (
      (req.userType === 'helper' && request.helper?.toString() !== req.userId.toString()) &&
      (req.userType === 'customer' && request.user.toString() !== req.userId.toString())
    ) {
      return res.status(403).json({ message: 'You do not have permission to view this request' });
    }

    res.json(request);
  } catch (error) {
    console.error('Get request error:', error);
    res.status(500).json({ message: 'Failed to get request', error: error.message });
  }
});

module.exports = router;
