import User from '../typeorm/entities/User';
import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import authConfig from '../../../config/auth';

import AppError from '../../../shared/errors/AppError';

interface Request {
	email: string;
	password: string;
}

interface Response {
	user: User;
	token: string;
}

class AuthenticateUserService {
	public async execute({ email, password }: Request): Promise<Response> {
		const usersRepository = getRepository(User);

		const user = await usersRepository.findOne({ where: { email } });

		if (!user) {
			throw new AppError('Usuário não encontarado.', 401);
		}

		const passwordMatched = await compare(password, user.password);

		if (!passwordMatched) {
			throw new AppError('Senha incorreta.', 401);
		}

		const { secret, expiresIn } = authConfig.jwt;

		const token = sign(
			{ userRole: user.role, userCompany: user.company_id },
			secret,
			{
				subject: user.id,
				expiresIn: expiresIn,
			},
		);
		return {
			user,
			token,
		};
	}
}

export default AuthenticateUserService;
