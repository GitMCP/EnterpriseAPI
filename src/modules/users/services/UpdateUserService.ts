import moment from 'moment';
import User from '../typeorm/entities/User';
import { getRepository } from 'typeorm';
import { userEducationLevels } from '../constants/userEducationLevels';
import { userRoles } from '../constants/userRoles';
import { brasilUfs } from '../constants/brasilUfs';
import { hash } from 'bcryptjs';
import { compare } from 'bcryptjs';

import axios from 'axios';

import AppError from '../../../shared/errors/AppError';

interface Request {
	targetUserId: string;
	requestingUserId: string;
	requestingUserRole: string;
	role: string;
	name: string;
	email: string;
	password: string;
	oldPassword: string;
	birthDate: string;
	uf: string;
	city: string;
	education_level: string;
}

async function validateCityUf(uf: any, city: any): Promise<boolean> {
	const response = await axios
		.get(
			`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`,
		)
		.then(response =>
			response.data.map((responseCity: { nome: any }) => responseCity.nome),
		);
	return response.includes(city);
}

class UpdateUserService {
	public async execute({
		targetUserId,
		requestingUserId,
		requestingUserRole,
		role,
		name,
		email,
		password,
		oldPassword,
		birthDate,
		uf,
		city,
		education_level,
	}: Request): Promise<User> {
		const usersRepository = getRepository(User);

		const isUserAdmin = requestingUserRole === 'admin';

		if (!isUserAdmin && requestingUserId != targetUserId) {
			throw new AppError('Permissão negada.');
		}
		console.log(isUserAdmin);

		const user = await usersRepository.findOne({
			where: { id: targetUserId },
		});
		if (!user) {
			throw new AppError('Usuário não encontrado');
		}

		const IsEmailInUse = await usersRepository.findOne({
			where: { email },
		});
		if (IsEmailInUse) {
			throw new AppError('Email já cadastrado.');
		}

		if (password) {
			if (!oldPassword) {
				throw new AppError('Informe sua senha atual.');
			}
			const passwordMatched = await compare(oldPassword, user.password);
			if (!passwordMatched) {
				throw new AppError('Senha atual incorreta.');
			}
		}

		if (!userRoles.includes(role)) {
			throw new AppError('Permissão do usuário inválida');
		}

		const hashedPassword = password ? await hash(password, 8) : null;

		if (!userEducationLevels.includes(education_level)) {
			throw new AppError('Nível de escolaridade inválido');
		}

		if (
			!moment(birthDate, 'DD-MM-YYYY').isValid() ||
			moment(birthDate, 'DD-MM-YYYY').isAfter(moment())
		) {
			throw new AppError('Data de nascimento inválida');
		}
		const parsedBirthDate = moment(birthDate, 'DD-MM-YYYY').toDate();

		if (!brasilUfs.includes(uf)) {
			throw new AppError('Unidade Federativa inválida');
		}

		const isCityValid = await validateCityUf(uf, city);

		if (!isCityValid) {
			throw new AppError('Cidade inválida');
		}

		user.role = role && isUserAdmin ? role : user.role;
		user.name = name ? name : user.name;
		user.email = email ? email : user.email;
		user.password = hashedPassword ? hashedPassword : user.password;
		user.birth_date = parsedBirthDate ? parsedBirthDate : user.birth_date;
		user.uf = uf ? uf : user.uf;
		user.city = city ? city : user.city;
		user.education_level = education_level
			? education_level
			: user.education_level;

		return await usersRepository.save(user);
	}
}

export default UpdateUserService;
