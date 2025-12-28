import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "brainbin", // specify database here
        });

        mongoose.connection.on("connected", () => console.log("Database Connected"));
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
};

export default connectDB;
