import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser';
import logger from 'morgan';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import router from './src/routes/index.js';
import { connectMongoDB } from './src/service/mongo.js';
import { connectRedisDB } from './src/service/redis.js';
import { IP, PORT } from './src/config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

// * config
await connectRedisDB();
await connectMongoDB();

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

router(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  if (!req.user) 
    return next(createError(401, 'Please login to view this page.'))
  next()
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
});

app.listen(PORT, IP, () => {
  console.log(`Server is running at http://${IP}:${PORT}`);
});
