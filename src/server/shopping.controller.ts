import * as express from 'express';
import * as shoppingBot from '../bot';

const controller = express.Router();

controller.post('/shopping/add-item', (req, res) => {
    const itemName: string = req.body;
    shoppingBot.addItem(itemName);
    res.send(200);
});

export default controller;