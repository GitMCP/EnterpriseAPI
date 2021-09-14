import { Router } from 'express';
import AuthenticateUserService from '../../modules/users/services/AuthenticateUserService';

const sessionsRouter = Router();

interface userToReturn {
	user: {
		role: string;
		name: string;
		email: string;
		password?: string;
		birth_date: Date;
		uf: string;
		city: string;
		education_level: string;
	};
	token: string;
}

sessionsRouter.post('/', async (request, response) => {
	const { email, password } = request.body;

	const authenticateUser = new AuthenticateUserService();

	const user = await authenticateUser.execute({
		email,
		password,
	});

	const userToReturn: userToReturn = { ...user };

	delete userToReturn.user.password;

	return response.json(userToReturn);
});

export default sessionsRouter;
