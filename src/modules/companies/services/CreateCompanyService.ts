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

class CreateCompanyService {
	public async execute({
		requestingUserRole,
		name,
		business_area,
		description,
		foundation_date,
		directorEmail,
	}: Request): Promise<Company> {
		const usersRepository = getRepository(User);
		const companiesRepository = getRepository(Company);
		if (requestingUserRole !== 'admin') {
			throw new AppError('Permissão negada.');
		}
		const director = await usersRepository.findOne({
			where: { email: directorEmail },
		});
		if (!director) {
			throw new AppError('Diretor não encontrado.');
		}
		if (
			(director.company_id && director.job === 'diretor') ||
			director.role === 'admin'
		) {
			throw new AppError('Diretor Inválido');
		}

		if (
			!moment(foundation_date, 'DD-MM-YYYY').isValid() ||
			moment(foundation_date, 'DD-MM-YYYY').isAfter(moment())
		) {
			throw new AppError('Data de fundação inválida');
		}
		const parsedFoundationDate = moment(foundation_date, 'DD-MM-YYYY').toDate();

		const company = companiesRepository.create({
			name,
			business_area,
			description,
			foundation_date: parsedFoundationDate,
			director_id: director.id,
		});

		await companiesRepository.save(company);

		director.company_id = company.id;
		director.job = 'diretor';

		await usersRepository.save(director);

		return company;
	}
}

export default CreateCompanyService;
