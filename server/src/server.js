import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import router from './routes/allRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import cookieParser from 'cookie-parser';

BigInt.prototype.toJSON = function() {       
  return Number(this);
};

const port = process.env.SERVER_PORT;
const app = express()

const corsOptions = {
    origin: process.env.DOMAIN,
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api", router);
app.use(errorHandler);


const start = async () => {
    try {
        app.listen(port, () => console.log(`Server listening on port ${port}`));
    } catch (e) {
        console.log(e);
    }
};

start();
