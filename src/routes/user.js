import express from 'express';
import {
	addUser,
	getUserDetail,
	searchUserList,
	updateUser,
	removeUser,
	activatedUser,
	getAllUser
} from '../controller/userController.js';

const router = express.Router();

router.post('/list', searchUserList);
router.post('/add', addUser);
router.post('/get-all', getAllUser);
router.post('/:id/detail', getUserDetail);
router.patch('/:id/update', updateUser);
router.delete('/:id/remove', removeUser);
router.post('/:id/lock', activatedUser);

export default router;
