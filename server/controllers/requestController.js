const Request = require('../models/Request');
const Helper = require('../models/Helper');
const earningsService = require('../services/earningsService');

// Update request status
exports.updateRequestStatus = async (req, res) => {
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

      // Update the transaction status to in-progress
      try {
        await earningsService.recordTransaction(requestId, 'inProgress');
        console.log('Transaction updated to in-progress');
      } catch (transactionError) {
        console.error('Error updating transaction:', transactionError);
        // Continue with the request update even if transaction update fails
      }
    } else if (status === 'completed') {
      request.completedAt = new Date();

      // Update payment status
      request.payment = {
        ...request.payment,
        status: 'completed',
        amount: request.estimatedPrice
      };

      // Record or update the transaction for completed requests
      try {
        await earningsService.recordTransaction(requestId, 'completed');
        console.log('Transaction recorded as completed successfully');
      } catch (transactionError) {
        console.error('Error recording transaction:', transactionError);
        // Continue with the request update even if transaction recording fails
      }

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
};

// Accept a request
exports.acceptRequest = async (req, res) => {
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

    // Create a transaction record when a helper accepts a request
    try {
      await earningsService.recordTransaction(requestId, 'accepted');
      console.log('Transaction created for accepted request');
    } catch (transactionError) {
      console.error('Error creating transaction:', transactionError);
      // Continue with the request update even if transaction creation fails
    }

    // Return the updated request
    const updatedRequest = await Request.findById(requestId)
      .populate('user', 'fullName phone')
      .populate('helper', 'fullName phone');

    res.json(updatedRequest);
  } catch (error) {
    console.error('Accept request error:', error);
    res.status(500).json({ message: 'Failed to accept request', error: error.message });
  }
};
