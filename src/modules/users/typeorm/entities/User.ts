import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	DeleteDateColumn,
	JoinColumn,
	ManyToOne,
} from 'typeorm';

import { userRoles } from '../../constants/userRoles';
import { userEducationLevels } from '../../constants/userEducationLevels';
import { brasilUfs } from '../../constants/brasilUfs';
import { jobs } from '../../constants/jobs';
import Company from '../../../companies/typeorm/entities/Company';

@Entity('users')
class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({
		type: 'enum',
		enum: userRoles,
		default: 'user',
	})
	role: string;

	@Column()
	name: string;

	@Column()
	email: string;

	@Column()
	password: string;

	@Column('date')
	birth_date: Date;

	@Column({
		type: 'enum',
		enum: brasilUfs,
	})
	uf: string;

	@Column()
	city: string;

	@Column({
		type: 'enum',
		enum: userEducationLevels,
	})
	education_level: string;

	@Column()
	company_id: string;

	@ManyToOne(() => Company, Company => Company.id)
	@JoinColumn({ name: 'company_id' })
	company: Company;

	@Column({
		type: 'enum',
		enum: jobs,
	})
	job: string;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@DeleteDateColumn()
	deleted_at: Date;
}

export default User;
