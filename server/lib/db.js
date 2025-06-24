import mongoose from "mongoose";

// Function to connect to the MongoBDb 
export const connectDB = async () => {
    try{
        mongoose.connection.on('connected', () => console.log('Data Base connected successfully'));
        await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`)
    } catch(error){
        console.log(error);
    }
}