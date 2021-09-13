import axios from 'axios';

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

export default validateCityUf;
