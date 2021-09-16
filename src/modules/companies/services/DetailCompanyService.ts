import Company from '../typeorm/entities/Company';
import { getRepository } from 'typeorm';

import AppError from '../../../shared/errors/AppError';

interface Request {
	targetCompanyId: string;
	requestingUserRole: string;
}
interface userToReturn {
	role: string;
	name: string;
	email: string;
	password?: string;
	birth_date: Date;
	uf: string;
	city: string;
	education_level: string;
	company_id?: string;
}

interface companyToReturn {
	id?: string;
	name?: string;
	business_area?: string;
	description?: string;
	foundation_date?: Date;
	director_id?: string;
	created_at?: Date;
	updated_at?: Date;
	director?: userToReturn;
}

class DetailCompanyService {
	public async execute({
		targetCompanyId,
		requestingUserRole,
	}: Request): Promise<companyToReturn> {
		const companiesRepository = getRepository(Company);
		if (requestingUserRole !== 'admin') {
			throw new AppError('Permissão negada.');
		}

		const company = await companiesRepository.findOne({
			where: { id: targetCompanyId },
			relations: ['director'],
		});

		if (!company) {
			throw new AppError('Empresa não encontrada.');
		}

		const companyToReturn: companyToReturn = { ...company };
		delete companyToReturn.director_id;
		if (companyToReturn.director) {
			delete companyToReturn.director.password;
			delete companyToReturn.director.company_id;
		}

		return companyToReturn;
	}
}

export default DetailCompanyService;
