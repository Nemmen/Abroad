import mongoose from 'mongoose';

const DbCon = async () => {
    if (!process.env.MONGODB_URL) {
        console.error('MongoDB URL is not defined in the environment variables');
        process.exit(1); // Exit process if URL is missing
    }

    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('MongoDB is successfully connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit process if connection fails
    }
};

export default DbCon;
