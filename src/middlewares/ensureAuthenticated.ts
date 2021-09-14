import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '../config/auth';

interface TokenPayLoad {
	userRole: string;
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
		throw new Error('Token de autenticação ausente.');
	}

	const [, token] = authHHeader.split(' ');

	try {
		const decoded = verify(token, authConfig.jwt.secret);

		const { userRole, sub, exp, iat } = decoded as TokenPayLoad;

		request.user = {
			id: sub,
			role: userRole,
		};
		return next();
	} catch {
		throw new Error('Token de autenticação inválido');
	}
}
