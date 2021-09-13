import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';

export type UserRoleType = 'admin' | 'user';
export type UserEducationLevelType =
	| 'infantil'
	| 'fundamental'
	| 'medio'
	| 'superior'
	| 'pos-graduacao'
	| 'mestrado'
	| 'doutorado';

@Entity('users')
class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({
		type: 'enum',
		enum: ['admin', 'user'],
		default: 'user',
	})
	role: UserRoleType;

	@Column()
	name: string;

	@Column()
	email: string;

	@Column()
	password: string;

	@Column('date')
	birthDate: Date;

	@Column()
	uf: string;

	@Column()
	city: string;

	@Column({
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
	})
	education_level: UserEducationLevelType;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}

export default User;
