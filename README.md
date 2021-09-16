# Enterprise API

Enterprise API é um projeto criado para o processo seletivo da Ioasys.

## Instruções para execução da aplicação

1. Após clonar o repositório para sua máquina, abra o terminal na raiz do projeto e execute o seguinte comando:

Obs: Certifique-se de possuir o Docker instalado em sua máquina.

```bash
docker-compose up
```

Esse comando irá subir o container do banco de dados da aplicação.

Não feche esse terminal, mantenha-o em execução.

2. Abra uma nova instância do terminal e execute o seguinte comando:

```bash
yarn
```

Isso irá instalar todas as dependências do projeto.

3. Execute o seguinte comando:

```bash
yarn typeorm migration:run
```

Isso irá executar as migrations para montar a estrutura do banco de dados.

4. Execute o comando:

```bash
yarn typeorm migration:run
```

Isso irá iniciar o servidor da aplicação.

Mantenha essa instância do terminal aberta para que a aplicação continue em execução.

5. Abra o Insomnia para importar a collection e começar a realizar requisições.

Obs: A collection do Insomnia está localizada na raiz do projeto com o nome ```Insomnia_EnterpriseAPI.json/yaml```

