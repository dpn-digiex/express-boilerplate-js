import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import {
  generateAccessToken,
	generateRefreshToken,
	mongooseTypeData,
	randomString,
	sendMailConfirmReset
} from '../utils/index.js';
import { Response } from '../utils/index.js';
import { REFRESH_KEY, SALT_NUM } from '../config/index.js';

import { UserModel } from "../model/user.js";
import { TokenModel } from '../model/token.js';
import { CodeModel } from '../model/code.js';

// * [POST] api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userLogin = await UserModel.findOne({ email: email });
    if (userLogin) {
      if (await bcrypt.compare(password, userLogin.password)) {
        const userResponse = mongooseTypeData.mongooseToObject(userLogin);
        // Delete old Token
        await TokenModel.deleteMany({ userId: userResponse._id });
        // Create new token
        const token = generateAccessToken(userResponse);
        const refToken = generateRefreshToken(userResponse._id);
        const refreshToken = new TokenModel({
          token: refToken,
          userId: userResponse._id,
        });
        await refreshToken.save();
        return Response(res, 200, {
          token: {
            token,
            refreshToken: refToken,
            createdAt: new Date(),
          },
          _id: userResponse?._id,
          name: userResponse?.name,
          email: userResponse?.email,
          status: userResponse?.status
        })
      } else return Response(res, 403, 'Password was wrong!');
    } else return Response(res, 401, 'User was not being existed!');
  } catch (error) {
    console.log("Error: ", error);
  }
  Response(res, 500);
}

// * [POST] /api/auth/logout
export const logout = async (req, res, next) => {
	try {
    if (req.token) {
      await TokenModel.deleteOne({ _id: req.token?.id });
      return Response(res, 200, 'Log out successfully!');
    }
    else return Response(res, 406, 'REQUIRED_LOGIN');
	} catch (error) {
		console.log("Error: ", error);
	}
	Response(res, 500);
}

// * [POST] /api/auth/refresh-access-token
export const generateNewAccessToken = async (req, res, next) => {
	try {
		const body = req?.body || {};
		const userId = (body?.userId || "").split("").reverse().join("");
		const token = body.token || body?.refreshToken;
    const rs = await TokenModel.findOne({ userId, token });
    if (!rs) return Response(res, 500, 'REQUIRED_LOGIN');
    else {
			jwt.verify(rs.token, REFRESH_KEY, async (err, data) => {
				if (err) return Response(res, 406, 'REQUIRED_LOGIN');
        if (userId !== data?.id) return Response(res, 500, "Unauthorized request");
        else {
          const userLogin = await UserModel.findOne({ id: mongoose.Types.ObjectId(userId) });
          const newAccessToken = generateAccessToken(userLogin);
          return Response(res, 200, { accessToken: newAccessToken, createdAt: new Date() });
        }
			});
		}

	} catch (error) {
		console.log("Error: ", error);
	}
  Response(res, 500);
};

// * [POST] /api/auth/forget-password
export const forgetPassword = async (req, res, next) => {
	try {
		const { email } = req.body;
		const user = await UserModel.findOne({ email: email });
		if (!user) {
			return Response(res, 401, 'User was not being existed!');
		}

		else {
			const codeConfirm = randomString(24, 'ALL');
			await CodeModel.findOneAndUpdate({ email: email }, { email: email, code: codeConfirm }, { upsert: true });
			return await sendMailConfirmReset(res, user, codeConfirm);
		}
	} catch (error) {
		console.log("Error: ", error);
	}
	Response(res, 500);
};

// * [POST] /api/auth/verify-code
export const verifyCode = async (req, res, next) => {
	try {
		const { email, code } = req.body;
		if (email && code) {
			const query = {
				email: email
				// createdAt: { $gt: new Date((new Date()).getTime() - 5 * 60 * 1000) }
			}
			const unexpiredTime = await CodeModel.findOne(query);
			if (unexpiredTime) {
				if (unexpiredTime.code === code) {
					await CodeModel.deleteOne({ email: email });
					return Response(res, 200, 'Verify code was success!');
				}
				else return Response(res, 403, 'The code was wrong! Please try again');
			}

			else {
				return Response(res, 500, 'Expired code');
			}
		}
		else return Response(res, 401, 'Please send mail confirm again');
	} catch (error) {
		console.log("Error: ", error);
	}
	Response(res, 500, 'Please try again');
};

// * [POST] /api/auth/reset-password
export const resetPassword = async (req, res, next) => {
	try {
		const { email, password } = req?.body;
		if (email && password) {
			const salt = await bcrypt.genSalt(SALT_NUM);
			const hashedPass = await bcrypt.hash(password, salt);
			await UserModel.findOneAndUpdate({ email: email }, { password: hashedPass}, { upsert: false });
			return Response(res, 200, 'Password has been changed success');
		}
		else return Response(res, 500);
	} catch (error) {
		console.log("Error", error);
	}
	Response(res, 500);
}
