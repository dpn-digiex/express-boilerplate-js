import jwt from 'jsonwebtoken';
import { SECRECT_KEY } from "../config/index.js";
import { Response } from '../utils/index.js';

export const verifyToken = (req, res, next) => {
  const token = req?.headers?.authorization || "";
  if (!token) return Response(res, 406, "Request was denied!");
  try {
    jwt.verify(token, SECRECT_KEY, (err, data) => {
      if (err) return Response(res, 406, "Token was expired!");
      if(!data?.id || !data?.email) {
        return Response(res, 406, "Unauthorized request!");
      }
      req.token = data;
      next();
    });

  } catch (error) {
    return Response(res, 406, "Forbidden request!");
  }
};
