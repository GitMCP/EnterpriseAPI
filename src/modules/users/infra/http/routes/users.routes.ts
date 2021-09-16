import { Router } from 'express';
import CreateUserService from '../../../services/CreateUserService';
import ensureAutheticated from '../../../../../shared/infra/http/middlewares/ensureAuthenticated';
import ListUsersService from '../../../services/ListUsersService';
import UpdateUserService from '../../../services/UpdateUserService';
import DetailUserService from '../../../services/DetailUserService';
import DeleteUserService from '../../..//services/DeleteUserService';
import AppError from '../../../../../shared/errors/AppError';

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
	targetUserId?: string;
	requestingUserId?: string;
	requestingUserRole?: string;
}

usersRouter.post('/create', async (request, response) => {
	const { name, email, password, birthDate, uf, city, education_level } =
		request.body;

	const createUser = new CreateUserService();

	const user = await createUser.execute({
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

usersRouter.post('/list', ensureAutheticated, async (request, response) => {
	const {
		role,
		name,
		email,
		birth_date,
		uf,
		city,
		education_level,
		company_id,
		job,
	} = request.body;

	const listCompanies = new ListUsersService();

	const company = await listCompanies.execute({
		requestingUserRole: request.user.role,
		role,
		name,
		email,
		birth_date,
		uf,
		city,
		education_level,
		company_id,
		job,
	});

	return response.json(company);
});

usersRouter.put('/update', ensureAutheticated, async (request, response) => {
	const { targetUserId } = request.query;
	if (!targetUserId) {
		throw new AppError('Informe o id do usuário a ser alterado');
	}
	const {
		role,
		name,
		email,
		password,
		oldPassword,
		birthDate,
		uf,
		city,
		education_level,
	} = request.body;

	const updateUser = new UpdateUserService();

	const user = await updateUser.execute({
		targetUserId: targetUserId.toString(),
		requestingUserId: request.user.id,
		requestingUserRole: request.user.role,
		role,
		name,
		email,
		password,
		oldPassword,
		birthDate,
		uf,
		city,
		education_level,
	});

	const userToReturn: userToReturn = { ...user };

	delete userToReturn.password;
	delete userToReturn.targetUserId;
	delete userToReturn.requestingUserId;
	delete userToReturn.requestingUserRole;

	return response.json(userToReturn);
});

usersRouter.get('/detail', ensureAutheticated, async (request, response) => {
	if (!request.query.targetUserId) {
		throw new AppError('Informe o id do usuário a ser detalhado');
	}
	const targetUserId = request.query.targetUserId.toString();

	const detailUser = new DetailUserService();

	const user = await detailUser.execute({
		targetUserId,
		requestingUserRole: request.user.role,
		requestingUserId: request.user.id,
	});

	return response.json(user);
});

usersRouter.delete('/delete', ensureAutheticated, async (request, response) => {
	if (!request.query.targetUserId) {
		throw new AppError('Informe o id da empresa a ser deletada');
	}
	const targetUserId = request.query.targetUserId.toString();

	const deleteUser = new DeleteUserService();

	const user = await deleteUser.execute({
		targetUserId,
		requestingUserRole: request.user.role,
	});

	return response.json(user);
});

export default usersRouter;
