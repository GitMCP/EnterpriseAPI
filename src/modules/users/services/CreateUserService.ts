import moment from 'moment';
import User from '../entities/User';
import { getRepository } from 'typeorm';
import { userEducationLevels } from '../constants/userEducationLevels';
import { userRoles } from '../constants/userRoles';
import { brasilUfs } from '../constants/brasilUfs';
import { hash } from 'bcryptjs';

import axios from 'axios';

import AppError from '../../../shared/errors/AppError';

interface Request {
	role: string;
	name: string;
	email: string;
	password: string;
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

class CreateUserService {
	public async execute({
		role,
		name,
		email,
		password,
		birthDate,
		uf,
		city,
		education_level,
	}: Request): Promise<User> {
		const usersRepository = getRepository(User);

		const IsEmailInUse = await usersRepository.findOne({
			where: { email },
		});
		if (IsEmailInUse) {
			throw new AppError('Email já cadastrado.');
		}

		if (!userRoles.includes(role)) {
			throw new AppError('Permissão do usuário inválida');
		}

		const hashedPassword = await hash(password, 8);

		if (!userEducationLevels.includes(education_level)) {
			throw new AppError('Nível de escolaridade inválido');
		}

		if (
			!moment(birthDate, 'DD-MM-YYYY').isValid() ||
			moment(birthDate, 'DD-MM-YYYY').isAfter(moment())
		) {
			throw new AppError('Data de nascimento inválida');
		}
		const parsedBirthDate = moment(birthDate, 'DD-MM-YYYY');

		if (!brasilUfs.includes(uf)) {
			throw new AppError('Unidade Federativa inválida');
		}

		const isCityValid = await validateCityUf(uf, city);

		if (!isCityValid) {
			throw new AppError('Cidade inválida');
		}

		const user = usersRepository.create({
			role,
			name,
			email,
			password: hashedPassword,
			birth_date: parsedBirthDate,
			uf,
			city,
			education_level,
		});

		await usersRepository.save(user);

		return user;
	}
}

export default CreateUserService;
