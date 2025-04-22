# WebSocket Deployment Options for Roadside Relief

Your application uses WebSockets for real-time communication, but Netlify Functions don't support WebSockets directly. Here are some options to handle this:

## Option 1: Use a Third-Party WebSocket Service

### Pusher

1. **Create a Pusher account:**
   - Go to [Pusher](https://pusher.com/) and sign up
   - Create a new Channels app

2. **Install Pusher client and server libraries:**
   ```bash
   # Server-side
   cd server
   npm install pusher

   # Client-side
   npm install pusher-js
   ```

3. **Update your server code:**
   ```javascript
   // In server.js or a separate file
   const Pusher = require('pusher');

   const pusher = new Pusher({
     appId: process.env.PUSHER_APP_ID,
     key: process.env.PUSHER_KEY,
     secret: process.env.PUSHER_SECRET,
     cluster: process.env.PUSHER_CLUSTER,
     useTLS: true
   });

   // Replace WebSocket broadcast with Pusher
   // Instead of: wss.broadcast(data)
   pusher.trigger('roadside-channel', 'update-event', data);
   ```

4. **Update your client code:**
   ```javascript
   // In your React component
   import Pusher from 'pusher-js';

   useEffect(() => {
     const pusher = new Pusher(process.env.PUSHER_KEY, {
       cluster: process.env.PUSHER_CLUSTER,
     });

     const channel = pusher.subscribe('roadside-channel');
     channel.bind('update-event', (data) => {
       // Handle the real-time update
       console.log('Received update:', data);
       // Update your state/UI
     });

     return () => {
       pusher.unsubscribe('roadside-channel');
     };
   }, []);
   ```

5. **Add environment variables to Netlify:**
   - `PUSHER_APP_ID`
   - `PUSHER_KEY`
   - `PUSHER_SECRET`
   - `PUSHER_CLUSTER`

## Option 2: Use a Dedicated WebSocket Server

### Render.com WebSocket Service

1. **Create a separate WebSocket server:**
   ```javascript
   // websocket-server.js
   const WebSocket = require('ws');
   const http = require('http');
   const express = require('express');
   const cors = require('cors');

   const app = express();
   app.use(cors());

   const server = http.createServer(app);
   const wss = new WebSocket.Server({ server });

   wss.on('connection', (ws) => {
     console.log('Client connected');
     
     ws.on('message', (message) => {
       console.log('Received:', message);
       // Broadcast to all clients
       wss.clients.forEach((client) => {
         if (client.readyState === WebSocket.OPEN) {
           client.send(message);
         }
       });
     });
     
     ws.on('close', () => {
       console.log('Client disconnected');
     });
   });

   const PORT = process.env.PORT || 8080;
   server.listen(PORT, () => {
     console.log(`WebSocket server running on port ${PORT}`);
   });
   ```

2. **Deploy to Render.com:**
   - Create a new Web Service
   - Set the start command: `node websocket-server.js`
   - Add environment variables as needed

3. **Update your client code:**
   ```javascript
   // In your React component
   useEffect(() => {
     const ws = new WebSocket(process.env.WEBSOCKET_URL || 'wss://your-websocket-server.onrender.com');
     
     ws.onopen = () => {
       console.log('Connected to WebSocket server');
     };
     
     ws.onmessage = (event) => {
       const data = JSON.parse(event.data);
       console.log('Received:', data);
       // Update your state/UI
     };
     
     ws.onclose = () => {
       console.log('Disconnected from WebSocket server');
     };
     
     return () => {
       ws.close();
     };
   }, []);
   ```

4. **Add environment variables to your frontend:**
   - `WEBSOCKET_URL`: The URL of your WebSocket server

## Option 3: Use Socket.io with a Dedicated Server

1. **Install Socket.io:**
   ```bash
   # Server-side
   cd server
   npm install socket.io

   # Client-side
   npm install socket.io-client
   ```

2. **Create a Socket.io server:**
   ```javascript
   // socket-server.js
   const express = require('express');
   const http = require('http');
   const { Server } = require('socket.io');
   const cors = require('cors');

   const app = express();
   app.use(cors());

   const server = http.createServer(app);
   const io = new Server(server, {
     cors: {
       origin: '*',
       methods: ['GET', 'POST']
     }
   });

   io.on('connection', (socket) => {
     console.log('Client connected:', socket.id);
     
     socket.on('request-update', (data) => {
       console.log('Request update:', data);
       // Broadcast to all clients
       io.emit('request-updated', data);
     });
     
     socket.on('disconnect', () => {
       console.log('Client disconnected:', socket.id);
     });
   });

   const PORT = process.env.PORT || 8080;
   server.listen(PORT, () => {
     console.log(`Socket.io server running on port ${PORT}`);
   });
   ```

3. **Update your client code:**
   ```javascript
   // In your React component
   import { io } from 'socket.io-client';

   useEffect(() => {
     const socket = io(process.env.SOCKET_URL || 'https://your-socket-server.onrender.com');
     
     socket.on('connect', () => {
       console.log('Connected to Socket.io server');
     });
     
     socket.on('request-updated', (data) => {
       console.log('Request updated:', data);
       // Update your state/UI
     });
     
     socket.on('disconnect', () => {
       console.log('Disconnected from Socket.io server');
     });
     
     return () => {
       socket.disconnect();
     };
   }, []);
   ```

4. **Deploy to a service that supports long-running processes:**
   - Render.com
   - Heroku
   - DigitalOcean App Platform

## Recommendation

For your Roadside Assistance application, Pusher is likely the easiest option to implement since it doesn't require maintaining a separate server. However, if you need more control or want to avoid third-party services, a dedicated WebSocket server on Render.com would be a good alternative.
