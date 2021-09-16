import { Router } from 'express';
import ensureAutheticated from '../../../../../shared/infra/http/middlewares/ensureAuthenticated';
import CreateCompanyService from '../../../services/CreateCompanyService';
import AppError from '../../../../../shared/errors/AppError';
import UpdateCompanyService from '../../../services/UpdateCompanyService';
import ListCompaniesService from '../../../services/ListCompaniesService';
import DetailCompanyService from '../../../services/DetailCompanyService';
import DeleteCompanyService from '../../../services/DeleteCompanyService';

const companiesRouter = Router();

companiesRouter.post(
	'/create',
	ensureAutheticated,
	async (request, response) => {
		const { name, business_area, description, foundation_date, directorEmail } =
			request.body;

		const createCompany = new CreateCompanyService();

		const company = await createCompany.execute({
			requestingUserRole: request.user.role,
			name,
			business_area,
			description,
			foundation_date,
			directorEmail,
		});

		return response.json(company);
	},
);

companiesRouter.put(
	'/update',
	ensureAutheticated,
	async (request, response) => {
		const { targetCompanyId } = request.query;

		if (!targetCompanyId) {
			throw new AppError('Informe o id da empresa a ser alterada');
		}
		const { name, business_area, description, foundation_date, directorEmail } =
			request.body;

		const updateCompany = new UpdateCompanyService();

		const company = await updateCompany.execute({
			targetCompanyId: targetCompanyId.toString(),
			requestingUserRole: request.user.role,
			name,
			business_area,
			description,
			foundation_date,
			directorEmail,
		});

		return response.json(company);
	},
);

companiesRouter.post('/list', ensureAutheticated, async (request, response) => {
	const { name, business_area, description, foundation_date, directorEmail } =
		request.body;

	const listCompanies = new ListCompaniesService();

	const company = await listCompanies.execute({
		requestingUserRole: request.user.role,
		name,
		business_area,
		description,
		foundation_date,
		directorEmail,
	});

	return response.json(company);
});

companiesRouter.get(
	'/detail',
	ensureAutheticated,
	async (request, response) => {
		if (!request.query.targetCompanyId) {
			throw new AppError('Informe o id da empresa a ser detalhada');
		}
		const targetCompanyId = request.query.targetCompanyId.toString();

		const detailCompany = new DetailCompanyService();

		const company = await detailCompany.execute({
			targetCompanyId,
			requestingUserRole: request.user.role,
		});

		return response.json(company);
	},
);

companiesRouter.delete(
	'/delete',
	ensureAutheticated,
	async (request, response) => {
		if (!request.query.targetCompanyId) {
			throw new AppError('Informe o id da empresa a ser deletada');
		}
		const targetCompanyId = request.query.targetCompanyId.toString();

		const deleteCompany = new DeleteCompanyService();

		const company = await deleteCompany.execute({
			targetCompanyId,
			requestingUserRole: request.user.role,
		});

		return response.json(company);
	},
);

export default companiesRouter;
