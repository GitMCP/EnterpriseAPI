import moment from 'moment';
import Company from '../typeorm/entities/Company';
import User from '../../users/typeorm/entities/User';
import { getRepository } from 'typeorm';

import AppError from '../../../shared/errors/AppError';

interface Request {
	requestingUserRole: string;
	name: string;
	business_area: string;
	description: string;
	foundation_date: string;
	directorEmail: string;
}

class ListCompaniesService {
	public async execute({
		requestingUserRole,
		name,
		business_area,
		description,
		foundation_date,
		directorEmail,
	}: Request): Promise<Company | Company[]> {
		const companiesRepository = getRepository(Company);
		const usersRepository = getRepository(User);
		if (requestingUserRole !== 'admin') {
			throw new AppError('Permissão negada.');
		}

		const director = await usersRepository.findOne({
			where: { email: directorEmail },
		});

		if (foundation_date && !moment(foundation_date, 'DD-MM-YYYY').isValid()) {
			throw new AppError('Data de fundação inválida.');
		}

		const conditions = Object.fromEntries(
			Object.entries({
				name,
				business_area,
				description,
				foundation_date,
				director_id: director ? director.id : null,
			}).filter(([_, v]) => v != null),
		);

		const companies = companiesRepository.find({
			where: conditions,
		});

		return companies;
	}
}

export default ListCompaniesService;
