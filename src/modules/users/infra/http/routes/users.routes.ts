import { Router } from 'express';
import CreateUserService from '../../../services/CreateUserService';
import ensureAutheticated from '../../../../../shared/infra/http/middlewares/ensureAuthenticated';

import User from '../../../typeorm/entities/User';
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
	const { role, name, email, password, birthDate, uf, city, education_level } =
		request.body;

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
});

usersRouter.get('/list', ensureAutheticated, async (request, response) => {
	if (request.user.role != 'admin') {
		throw new Error('Permissão negada.');
	}

	const usersRepository = getRepository(User);

	const [users, total] = await usersRepository.findAndCount();

	return response.json({ ...users, total });
});

export default usersRouter;
