import moment from 'moment';
import User from '../typeorm/entities/User';
import { getRepository } from 'typeorm';

import AppError from '../../../shared/errors/AppError';

interface Request {
	requestingUserRole: string;
	role: string;
	name: string;
	email: string;
	birth_date: Date;
	uf: string;
	city: string;
	education_level: string;
	company_id: string;
	job: string;
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
	company_id?: string;
	job: string;
	created_at: Date;
	updated_at: Date;
	deleted_at: Date;
}

class ListUsersService {
	public async execute({
		requestingUserRole,
		role,
		name,
		email,
		birth_date,
		uf,
		city,
		education_level,
		company_id,
		job,
	}: Request): Promise<UserToReturn[]> {
		const usersRepository = getRepository(User);
		if (requestingUserRole !== 'admin') {
			throw new AppError('Permissão negada.');
		}

		if (birth_date && !moment(birth_date, 'DD-MM-YYYY').isValid()) {
			throw new AppError('Data de nascimento inválida.');
		}

		const conditions = Object.fromEntries(
			Object.entries({
				role,
				name,
				email,
				birth_date,
				uf,
				city,
				education_level,
				company_id,
				job,
			}).filter(([_, v]) => v != null),
		);

		const users = await usersRepository.find({
			where: conditions,
			relations: ['company'],
		});
		const userToReturn: UserToReturn[] = [...users];
		userToReturn.map(user => {
			delete user.password;
		});

		return users;
	}
}

export default ListUsersService;
