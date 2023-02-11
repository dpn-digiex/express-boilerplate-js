import userRouter from './user.js';
import authRoute from './auth.js';
import { verifyToken, checkIPAccess } from '../middleware/index.js';

const router = (app) => {
  app.use('/api/auth', checkIPAccess, authRoute);
  app.use('/api/user', checkIPAccess, verifyToken, userRouter);
};

export default router;
