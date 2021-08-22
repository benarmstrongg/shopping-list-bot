import express from 'express';
import { text } from 'body-parser';
import * as shoppingBot from '../bot';

const controller = express.Router();

controller.use(text({ type: 'text/*' }));

controller.post('/shopping/add-item', (req, res) => {
    const itemName = req.body || '';
    shoppingBot.addItem(itemName);
    res.sendStatus(200);
});

export default controller;