import { Router } from 'express';
import AuthenticateUserService from '../services/AuthenticateUserService';

const sessionsRouter = Router();

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

sessionsRouter.post('/create', async (request, response) => {
	try {
		const { email, password } = request.body;

		const authenticateUser = new AuthenticateUserService();

		const user = await authenticateUser.execute({
			email,
			password,
		});

		const userToReturn: userToReturn = { ...user };

		delete userToReturn.password;

		return response.json(userToReturn);
	} catch (err) {
		return response.status(400).json({ error: err.message });
	}
});

export default sessionsRouter;
