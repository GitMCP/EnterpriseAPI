import { Router } from 'express';
import CreateUserService from '../services/CreateUserService';

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

export default usersRouter;
