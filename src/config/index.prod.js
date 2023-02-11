/* config product environment */

// Bind Port
export const PORT = process.env.PORT || 5000;

// Bind IP
export const IP = process.env.IP || '127.0.0.1';

// App API URL -> Currently Not Used
export const ApiURL = process.env.API_URL || `http://${IP}:${PORT}` || `http://localhost:5000`;

// Mongo URL used to connect to MongoDB server
export const MongoURL = process.env.MONGO_URL || "";

// Redis URL used to connect to Redis server
export const RedisURL = process.env.REDIS_URL || "";

// Access Token and Refresh token
export const SECRECT_KEY = process.env.ACCESS_TOKEN_SECRET || 'server-access-token';
export const REFRESH_KEY = process.env.REFRESH_TOKEN_SECRET || 'server-refresh-token';
export const SALT_NUM = process.env.SALT_NUM || 10;

// Token Expired duration
export const AccessToken_Expired = process.env.ACCESS_TOKEN_EXPIRED || '4h';
export const RefreshToken_Expired = process.env.REFRESH_TOKEN_EXPIRED || '30d';

// Mail information used to send mail for Active account, reset password, ...
export const Mail_Sender = "No Reply<no-reply@operation.com>";
export const Mail_Transport = {
	service: "gmail",
	host: "smtp.gmail.com",
	port: 465,
	secure: false,
	pool: false,
	auth: {
		type: "login",
		user: "no-reply@operation.com",
		pass: "g@M5yxt3w9$:K"
	}
};

export const IPAccessList = [];