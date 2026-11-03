import mongoose from 'mongoose';

let connectionPromise;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sakhisetu')
      .then((conn) => {
        console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
        return conn;
      })
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }

  return connectionPromise;
};
