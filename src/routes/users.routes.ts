import { Router } from 'express';
import CreateUserService from '../services/CreateUserService';

const usersRouter = Router();

usersRouter.post('/create', async (request, response) => {
	try {
		const {
			role,
			name,
			email,
			password,
			birthDate,
			uf,
			city,
			education_level,
		} = request.body;

		const createUser = new CreateUserService();

		const user = await createUser.execute({
			role,
			name,
			email,
			password,
			birthDate,
			uf,
			city,
			education_level,
		});

		return response.json(user);
	} catch (err) {
		return response.status(400).json({ error: err.message });
	}
});

export default usersRouter;
