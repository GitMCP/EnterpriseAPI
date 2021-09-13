import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable1631477015800 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'users',
				columns: [
					{
						name: 'id',
						type: 'uuid',
						isPrimary: true,
						generationStrategy: 'uuid',
					},
					{
						name: 'role',
						type: 'enum',
						enum: ['admin', 'user'],
					},
					{
						name: 'name',
						type: 'varchar',
					},
					{
						name: 'email',
						type: 'varchar',
						isUnique: true,
					},
					{
						name: 'password',
						type: 'varchar',
					},
					{
						name: 'birth_date',
						type: 'date',
					},
					{
						name: 'uf',
						type: 'varchar',
					},
					{
						name: 'city',
						type: 'varchar',
					},
					{
						name: 'education_level',
						type: 'enum',
						enum: [
							'infantil',
							'fundamental',
							'medio',
							'superior',
							'pos-graduacao',
							'mestrado',
							'doutorado',
						],
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
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('users');
	}
}
