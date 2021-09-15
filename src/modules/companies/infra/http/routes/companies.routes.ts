import { Router } from 'express';
import ensureAutheticated from '../../../../../shared/infra/http/middlewares/ensureAuthenticated';
import CreateCompanyService from '../../../services/CreateCompanyService';

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

export default companiesRouter;
