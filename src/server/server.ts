import express from 'express';
import shoppingController from './controllers/shopping/shopping.controller';

const server = express();

server.use(shoppingController);

server.listen(process.env.PORT, () => {
    console.log(`server listening on port ${process.env.PORT}`);
});