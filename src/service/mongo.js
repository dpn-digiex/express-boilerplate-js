// connect model with database
import mongoose from 'mongoose';
import { MongoURL } from "../config/index.js";

mongoose.set("strictQuery", false);
export const connectMongoDB = async () => {
	try {
		await mongoose.connect(MongoURL, {
			useNewUrlParser: true,
			useUnifiedTopology: true
			// useCreateIndex: true,
		});
		console.log('Access Database Success!');

	} catch (error) {
		console.log('Access Database FAILED!', error);
	}
}
