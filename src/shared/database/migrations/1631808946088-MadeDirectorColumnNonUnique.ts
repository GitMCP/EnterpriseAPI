/* eslint-disable prettier/prettier */
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class MadeDirectorColumnNonUnique1631808946088
implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.changeColumn(
			'companies',
			'director_id',
			new TableColumn({
				name: 'director_id',
				type: 'uuid',
				isUnique: false,
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.changeColumn(
			'companies',
			'director_id',
			new TableColumn({
				name: 'director_id',
				type: 'uuid',
				isUnique: true,
			}),
		);
	}
}
