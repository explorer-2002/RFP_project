import express from 'express';
import createRpfRouter from './routes/create-rfp.js';
import vendorRouter from './routes/vendors.js';
import proposalRouter from './routes/proposals.js';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
// import { storeVendors } from './helpers/storeVendors.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/create-rfp', createRpfRouter);
app.use('/api/vendors', vendorRouter);
app.use('/api/proposals', proposalRouter);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const startServer = async () => {
  try {
    // Connect to MongoDB
    // Make sure MONGO_URI is defined in your .env file
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`MongoDB Connected`);

    // Start Express Server only after DB connection
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error(`Error executing MongoDB connection: ${error?.message}`);
    process.exit(1); // Exit process with failure
  }
};

startServer();
// storeVendors();