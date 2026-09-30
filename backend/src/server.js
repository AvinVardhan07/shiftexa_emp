const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const env = require('./config/env');
const connectDB = require('./config/db');
const seedData = require('./utils/seed');
const errorHandler = require('./middleware/errorHandler');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const employeeTemplateRoutes = require('./routes/employeeTemplateRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const leadRoutes = require('./routes/leadRoutes');
const callRoutes = require('./routes/callRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const integrationRoutes = require('./routes/integrationRoutes');
const billingRoutes = require('./routes/billingRoutes');
const webhookRoutes = require('./routes/webhookRoutes');

const app = express();
const server = http.createServer(app);

// Socket.IO setup for live audio/call updates
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
  }
});

app.use(cors());
app.use(express.json());

// Attach io to req for controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SHIFTEXA AI Employee Marketplace API',
    version: '1.0.0',
    timestamp: new Date()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/employee-templates', employeeTemplateRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/calls', callRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/integrations', integrationRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/webhooks', webhookRoutes);

// Error Handler Middleware
app.use(errorHandler);

// Socket Connection handling
io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

// Start Server
const startServer = async () => {
  await connectDB();
  await seedData(); // Auto-seed Meera and templates on launch

  server.listen(env.PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 SHIFTEXA Backend API running on port ${env.PORT}`);
    console.log(`📡 Health route: http://localhost:${env.PORT}/api/health`);
    console.log(`=======================================================`);
  });
};

startServer();
