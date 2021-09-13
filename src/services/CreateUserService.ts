import moment from 'moment';
import User from '../models/User';
import { getRepository } from 'typeorm';
import { userEducationLevels } from '../constants/userEducationLevels';
import { userRoles } from '../constants/userRoles';
import { brasilUfs } from '../constants/brasilUfs';
import validateCityUf from '../utils/validateCityUf';

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
			throw new Error('Email já cadastrado.');
		}

		if (!userRoles.includes(role)) {
			throw new Error('Permissão do usuário inválida');
		}

		if (!userEducationLevels.includes(education_level)) {
			throw new Error('Nível de escolaridade inválido');
		}

		if (
			!moment(birthDate, 'DD-MM-YYYY').isValid() ||
			moment(birthDate, 'DD-MM-YYYY').isAfter(moment())
		) {
			throw new Error('Data de nascimento inválida');
		}
		const parsedBirthDate = moment(birthDate, 'DD-MM-YYYY');

		if (!brasilUfs.includes(uf)) {
			throw new Error('Unidade Federativa inválida');
		}

		const isCityValid = await validateCityUf(uf, city);

		if (!isCityValid) {
			throw new Error('Cidade inválida');
		}

		const user = usersRepository.create({
			role,
			name,
			email,
			password,
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
