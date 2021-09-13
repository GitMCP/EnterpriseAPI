import { Router } from 'express';

const usersRouter = Router();

usersRouter.post('/create', (request, response) => {
	const { role, name, email, password, birthDate, uf, city, education_level } =
		request.body;

	return response.json({
		role,
		name,
		email,
		password,
		birthDate,
		uf,
		city,
		education_level,
	});
});

export default usersRouter;
