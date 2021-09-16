import Company from '../typeorm/entities/Company';
import { getRepository } from 'typeorm';

import AppError from '../../../shared/errors/AppError';
import User from '../../users/typeorm/entities/User';
import { jobs } from '../../users/constants/jobs';

interface Request {
	targetUserId: string;
	targetCompanyId: string;
	targetJob: string;
	requestingUserRole: string;
	requestingUserId: string;
}

interface UserToReturn {
	id: string;
	role: string;
	name: string;
	email: string;
	password?: string;
	birth_date: Date;
	uf: string;
	city: string;
	education_level: string;
	company_id?: string | null;
	job: string | null;
	created_at: Date;
	updated_at: Date;
	deleted_at: Date;
}

class DismissEmployeeService {
	public async execute({
		targetUserId,
		targetCompanyId,
		targetJob,
		requestingUserRole,
		requestingUserId,
	}: Request): Promise<UserToReturn> {
		const companiesRepository = getRepository(Company);
		const usersRepository = getRepository(User);
		const requestingUser = await usersRepository.findOne({
			where: { id: requestingUserId },
		});
		if (!requestingUser) {
			throw new AppError('Permissão negada.');
		}
		if (
			requestingUserRole !== 'admin' &&
			!(
				requestingUser.company_id === targetCompanyId &&
				(requestingUser.job === 'diretor' || requestingUser.job === 'gestor')
			)
		) {
			throw new AppError('Permissão negada.');
		}

		const targetUser = await usersRepository.findOne({
			where: { id: targetUserId },
		});
		if (!targetUser) {
			throw new AppError('Usuário não encontrado.');
		}
		if (targetUser.role === 'admin') {
			throw new AppError('Usuário inválido.');
		}

		const targetCompany = await companiesRepository.findOne({
			where: { id: targetCompanyId },
		});

		if (!targetCompany) {
			throw new AppError('Empresa não encontrada.');
		}

		if (targetUser.job === 'diretor' && targetUser.company_id) {
			throw new AppError(
				'Este usuário é um diretor, vincule outro diretor em seu lugar para removê-lo.',
			);
		}

		if (targetCompanyId !== targetUser.company_id) {
			throw new AppError('Esse usuário não trabalha nessa empresa.');
		}

		targetUser.company_id = null;
		targetUser.job = null;

		await usersRepository.save(targetUser);

		const userToReturn: UserToReturn = { ...targetUser };
		delete userToReturn.password;

		return userToReturn;
	}
}

export default DismissEmployeeService;
