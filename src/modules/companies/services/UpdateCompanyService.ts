/* eslint-disable indent */
import moment from 'moment';
import Company from '../typeorm/entities/Company';
import User from '../../users/typeorm/entities/User';
import { getRepository } from 'typeorm';

import AppError from '../../../shared/errors/AppError';

interface Request {
	requestingUserRole: string;
	targetCompanyId: string;
	name: string;
	business_area: string;
	description: string;
	foundation_date: string;
	directorEmail: string;
}

class UpdateCompanyService {
	public async execute({
		requestingUserRole,
		targetCompanyId,
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

		const company = await companiesRepository.findOne({
			where: { id: targetCompanyId },
		});
		if (!company) {
			throw new AppError('Empresa não encontrada.');
		}

		const director = directorEmail
			? await usersRepository.findOne({
					where: { email: directorEmail },
			  })
			: null;
		if (directorEmail) {
			if (!director) {
				throw new AppError('Diretor não encontrado.');
			}
			if (
				(director.company_id !== company.id && director.job === 'diretor') ||
				director.role === 'admin'
			) {
				throw new AppError('Diretor Inválido');
			}
		}

		const parsedFoundationDate = () => {
			if (foundation_date) {
				if (
					!moment(foundation_date, 'DD-MM-YYYY').isValid() ||
					moment(foundation_date, 'DD-MM-YYYY').isAfter(moment())
				) {
					throw new AppError('Data de fundação inválida');
				}
				return moment(foundation_date, 'DD-MM-YYYY').toDate();
			}
		};

		company.name = name || company.name;
		company.business_area = business_area || company.business_area;
		company.description = description || company.description;
		company.foundation_date = parsedFoundationDate() || company.foundation_date;
		company.director_id =
			directorEmail && director ? director.id : company.director_id;

		await companiesRepository.save(company);
		if (director) {
			director.company_id = company.id;
			director.job = 'diretor';

			await usersRepository.save(director);
		}

		return company;
	}
}

export default UpdateCompanyService;
