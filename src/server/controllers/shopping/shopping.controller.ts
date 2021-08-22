import express from 'express';
import { json } from 'body-parser';

const controller = express.Router();

controller.use(json());

controller.post('/shopping/add-item', (req, res) => {
    console.log(req.body);
    res.send(req.body);
});

export default controller;