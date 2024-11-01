import mongoose from "mongoose";

type ConnectionObject = {
	isConnected?: number;
};

const connection: ConnectionObject = {};
async function dbConnect(): Promise<void> {
	if (connection.isConnected) {
		console.log("Already connected to Database");
		return;
	}
	try {
		const db = await mongoose.connect(process.env.MONGO_URI!, {});
		connection.isConnected = db.connections[0].readyState;
        console.log("Connected to Database Successfully");
	} catch (error) {
        console.log("Database Connection Failed",error);
        process.exit()
    }
}
