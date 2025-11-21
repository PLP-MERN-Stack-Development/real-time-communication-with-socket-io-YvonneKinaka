import { Router } from 'express';
import { IndexController } from '../controllers/index';

const router = Router();
const indexController = new IndexController();

export function setRoutes(app) {
    app.get('/', indexController.getIndex.bind(indexController));
    app.post('/', indexController.postIndex.bind(indexController));
    
    // Add more routes as needed
}