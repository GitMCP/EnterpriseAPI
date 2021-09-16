import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '../../../../config/auth';

import AppError from '../../../errors/AppError';

interface TokenPayLoad {
	userRole: string;
	userCompany: string;
	iat: number;
	exp: number;
	sub: string;
}

export default function ensureAutheticated(
	request: Request,
	response: Response,
	next: NextFunction,
): void {
	const authHHeader = request.headers.authorization;

	if (!authHHeader) {
		throw new AppError('Token de autenticação ausente.', 401);
	}

	const [, token] = authHHeader.split(' ');

	try {
		const decoded = verify(token, authConfig.jwt.secret);

		const { userRole, userCompany, sub, exp, iat } = decoded as TokenPayLoad;

		request.user = {
			id: sub,
			role: userRole,
			companyId: userCompany,
		};
		return next();
	} catch {
		throw new AppError('Token de autenticação inválido', 401);
	}
}
