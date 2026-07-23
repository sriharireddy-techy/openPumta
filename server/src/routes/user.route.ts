import express from 'express';
import passport from '../config/passport.js';
import {
  getAllUsers,
  deleteUser,
  addUser,
  updateUser,
  getLifetimeFocusTime,
  savePushToken,
} from '../controllers/user.controller.js';
const router = express.Router();

router
  .get('/', getAllUsers)
  .post('/', addUser)
  .post('/push-token', passport.authenticate('jwt', { session: false }), savePushToken)
  .get('/lifetime-focus', passport.authenticate('jwt', { session: false }), getLifetimeFocusTime)
  .patch('/:id', updateUser)
  .delete('/:id', deleteUser);

export default router;
