import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

// eslint-disable-next-line prettier/prettier
export class AddedDeletedAtColumnToTables1631752547908 implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn(
			'users',
			new TableColumn({
				name: 'deleted_at',
				type: 'timestamp',
				isNullable: true,
			}),
		);

		await queryRunner.addColumn(
			'companies',
			new TableColumn({
				name: 'deleted_at',
				type: 'timestamp',
				isNullable: true,
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropColumn('companies', 'deleted_at');

		await queryRunner.dropColumn('users', 'deleted_at');
	}
}
