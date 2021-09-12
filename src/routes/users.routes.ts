import { Router } from 'express';

const usersRouter = Router();

const users = [];

usersRouter.post('/create', (request, response) => {
	const body = request.body;

	return response.json({ message: 'Received Body;', ...body });
});

export default usersRouter;
