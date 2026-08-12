import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eduassess';

  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host} | DB: ${conn.connection.name}`);
  } catch (error: any) {
    console.error(`[MongoDB] Connection failed: ${error.message}`);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB] Disconnected from database server');
});

mongoose.connection.on('error', (err) => {
  console.error('[MongoDB] Runtime database connection error:', err);
});
