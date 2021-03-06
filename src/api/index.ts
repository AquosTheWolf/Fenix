import cors from 'cors';
import express from 'express';
import settings, { __prod__ } from './../settings';
import latestRouter from './routes/latest';

export const api = (client) => {
    const app = express();
    app.use(cors({
        origin: __prod__ ? 'https://api.furdevs.tech' : `*`,
        credentials: true
    }));
    app.use((req, res, next) => {
        req.client = client;
        next();
    });
    app.use('/latest', latestRouter);

    app.listen(settings.APIPort, () => {
        client.log('API is listening on port ' + settings.APIPort);
    });
};
