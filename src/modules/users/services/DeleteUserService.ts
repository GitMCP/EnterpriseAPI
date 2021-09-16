import User from '../typeorm/entities/User';
import Company from '../../companies/typeorm/entities/Company';
import { getRepository } from 'typeorm';

import AppError from '../../../shared/errors/AppError';

interface Request {
	targetUserId: string;
	requestingUserRole: string;
}

class DeleteCompanyService {
	public async execute({
		targetUserId,
		requestingUserRole,
	}: Request): Promise<User> {
		const companiesRepository = getRepository(Company);
		const usersRepository = getRepository(User);
		if (requestingUserRole !== 'admin') {
			throw new AppError('Permissão negada.');
		}

		const user = await usersRepository.findOne({
			where: { id: targetUserId },
		});

		if (!user) {
			throw new AppError('Usuário não encontrado.');
		}

		const directorOf = await companiesRepository.findOne({
			where: { director_id: user.id },
		});

		if (directorOf) {
			throw new AppError(
				'O usuário é o diretor de uma empresa, vincule um novo diretor para deletar o atual.',
			);
		}

		await usersRepository.softDelete(user);

		return user;
	}
}

export default DeleteCompanyService;
