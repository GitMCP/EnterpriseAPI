import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableForeignKey,
	TableColumn,
} from 'typeorm';

export class CreateCompaniesTable1631665730437 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'companies',
				columns: [
					{
						name: 'id',
						type: 'uuid',
						isPrimary: true,
						generationStrategy: 'uuid',
						default: 'uuid_generate_v4()',
					},
					{
						name: 'name',
						type: 'varchar',
					},
					{
						name: 'business_area',
						type: 'varchar',
					},
					{
						name: 'description',
						type: 'varchar',
					},
					{
						name: 'foundation_date',
						type: 'date',
					},
					{
						name: 'director_id',
						type: 'uuid',
					},
					{
						name: 'created_at',
						type: 'timestamp',
						default: 'now()',
					},
					{
						name: 'updated_at',
						type: 'timestamp',
						default: 'now()',
					},
				],
			}),
		);

		await queryRunner.addColumns('users', [
			new TableColumn({
				name: 'company_id',
				type: 'uuid',
				isNullable: true,
			}),
			new TableColumn({
				name: 'job',
				type: 'enum',
				enum: ['diretor', 'gestor', 'empregado'],
				isNullable: true,
			}),
		]);

		await queryRunner.createForeignKey(
			'users',
			new TableForeignKey({
				name: 'CompanyId',
				columnNames: ['company_id'],
				referencedColumnNames: ['id'],
				referencedTableName: 'companies',
				onDelete: 'SET NULL',
			}),
		);

		await queryRunner.createForeignKey(
			'companies',
			new TableForeignKey({
				name: 'CompanyDirectorId',
				columnNames: ['director_id'],
				referencedColumnNames: ['id'],
				referencedTableName: 'users',
				onDelete: 'RESTRICT',
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropForeignKey('companies', 'CompanyDirectorId');

		await queryRunner.dropForeignKey('users', 'CompanyId');

		await queryRunner.dropColumns('users', ['company_id', 'job']);

		await queryRunner.dropTable('companies');
	}
}
