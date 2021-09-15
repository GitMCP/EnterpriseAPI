import User from '../../../users/entities/User';
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToMany,
	JoinColumn,
} from 'typeorm';

@Entity('companies')
class Company {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column()
	business_area: string;

	@Column()
	description: string;

	@Column('date')
	foundation_date: Date;

	@Column()
	director_id: string;

	@ManyToMany(() => User)
	@JoinColumn({ name: 'director_id' })
	colaborator: User;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}

export default Company;
