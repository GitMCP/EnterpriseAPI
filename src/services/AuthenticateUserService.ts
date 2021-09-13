import User from '../models/User';
import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';

interface Request {
	email: string;
	password: string;
}

class AuthenticateUserService {
	public async execute({ email, password }: Request): Promise<User> {
		const usersRepository = getRepository(User);

		const user = await usersRepository.findOne({ where: { email } });

		if (!user) {
			throw new Error('Usuário não encontarado.');
		}

		const passwordMatched = await compare(password, user.password);

		if (!passwordMatched) {
			throw new Error('Senha incorreta.');
		}

		return user;
	}
}

export default AuthenticateUserService;
