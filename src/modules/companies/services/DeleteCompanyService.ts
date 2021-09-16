import Company from '../typeorm/entities/Company';
import { getRepository } from 'typeorm';

import AppError from '../../../shared/errors/AppError';
import User from '../../users/typeorm/entities/User';

interface Request {
	targetCompanyId: string;
	requestingUserRole: string;
}

class DeleteCompanyService {
	public async execute({
		targetCompanyId,
		requestingUserRole,
	}: Request): Promise<Company> {
		const companiesRepository = getRepository(Company);
		const usersRepository = getRepository(User);
		if (requestingUserRole !== 'admin') {
			throw new AppError('Permissão negada.');
		}

		const company = await companiesRepository.findOne({
			where: { id: targetCompanyId },
		});

		if (!company) {
			throw new AppError('Empresa não encontrada.');
		}

		await companiesRepository.softDelete(targetCompanyId);

		await usersRepository.update(
			{ company_id: targetCompanyId },
			{ company_id: undefined, job: undefined },
		);

		return company;
	}
}

export default DeleteCompanyService;
