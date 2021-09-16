import User from '../typeorm/entities/User';
import { getRepository } from 'typeorm';

import AppError from '../../../shared/errors/AppError';

interface Request {
	targetUserId: string;
	requestingUserId: string;
	requestingUserRole: string;
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
	company: companyToReturn;
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
	deleted_at?: Date;
}

class DetailUserService {
	public async execute({
		targetUserId,
		requestingUserId,
		requestingUserRole,
	}: Request): Promise<UserToReturn> {
		const usersRepository = getRepository(User);
		if (requestingUserRole !== 'admin' && targetUserId !== requestingUserId) {
			throw new AppError('Permissão negada.');
		}

		const user = await usersRepository.findOne({
			where: { id: targetUserId },
			relations: ['company'],
		});

		if (!user) {
			throw new AppError('Usuário não encontrado.');
		}

		const userToReturn: UserToReturn = { ...user };
		delete userToReturn.password;
		delete userToReturn.company_id;
		const companyToReturn: companyToReturn = { ...user.company };
		delete companyToReturn.director_id;
		userToReturn.company = companyToReturn;

		return userToReturn;
	}
}

export default DetailUserService;
