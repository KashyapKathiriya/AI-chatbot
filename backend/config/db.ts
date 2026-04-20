import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    try {
        const mongoDB = process.env.MONGO_URI;
        if (!mongoDB) {
            throw new Error('MONGO_URI is undefined')
        }
        await mongoose.connect(mongoDB);
        console.log("MongoDB connected")
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("MongoDB connection failed:", error.message);
        } else {
            console.error("Unknown MongoDB connection error");
        }
        process.exit(1)
    }
};

export default connectDB;