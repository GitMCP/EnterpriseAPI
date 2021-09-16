import User from '../../users/typeorm/entities/User';
import { getRepository } from 'typeorm';

import AppError from '../../../shared/errors/AppError';

interface Request {
	requestingUserId: string;
	requestingUserRole: string;
	targetCompanyId: string;
	role: string;
	name: string;
	email: string;
	birth_date: Date;
	uf: string;
	city: string;
	education_level: string;
	job: string;
}

class ListCompaniesService {
	public async execute({
		requestingUserId,
		requestingUserRole,
		targetCompanyId,
		role,
		name,
		email,
		birth_date,
		uf,
		city,
		education_level,
		job,
	}: Request): Promise<User | User[]> {
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

		const conditions = Object.fromEntries(
			Object.entries({
				company_id: targetCompanyId,
				role,
				name,
				email,
				birth_date,
				uf,
				city,
				education_level,
				job,
			}).filter(([_, v]) => v != null),
		);

		const employees = await usersRepository.find({
			where: conditions,
		});

		return employees;
	}
}

export default ListCompaniesService;
