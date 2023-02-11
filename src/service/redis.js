// connect model with database
import { createClient } from 'redis';

import { RedisURL } from "../config/index.js";

let redis = {};

const connectRedisDB = async () => {
	try {
		redis = createClient({
			url: RedisURL
		});
		console.log('Access Redis Success!');
	} catch (error) {
		console.log('Access Redis FAILED!');
	}
}

export { redis, connectRedisDB };
