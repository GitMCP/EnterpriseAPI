import { Router } from 'express';
import CreateUserService from '../services/CreateUserService';
import ensureAutheticated from '../middlewares/ensureAuthenticated';

import User from '../models/User';
import { getRepository } from 'typeorm';

const usersRouter = Router();

interface userToReturn {
	role: string;
	name: string;
	email: string;
	password?: string;
	birth_date: Date;
	uf: string;
	city: string;
	education_level: string;
}

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

		const userToReturn: userToReturn = { ...user };

		delete userToReturn.password;

		return response.json(userToReturn);
	} catch (err) {
		return response.status(400).json({ error: err.message });
	}
});

usersRouter.get('/list', ensureAutheticated, async (request, response) => {
	try {
		if (request.user.role != 'admin') {
			throw new Error('Permissão negada.');
		}

		const usersRepository = getRepository(User);

		const [users, total] = await usersRepository.findAndCount();

		return response.json({ ...users, total });
	} catch (err) {
		return response.status(400).json({ error: err.message });
	}
});

export default usersRouter;
