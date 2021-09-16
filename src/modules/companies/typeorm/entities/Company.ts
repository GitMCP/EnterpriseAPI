import User from '../../../users/typeorm/entities/User';
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	OneToOne,
	JoinColumn,
	DeleteDateColumn,
	OneToMany,
} from 'typeorm';

@Entity('companies')
class Company {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@OneToMany(() => User, User => User.company)
	@JoinColumn({ name: 'id' })
	employees: User[];

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

	@OneToOne(() => User)
	@JoinColumn({ name: 'director_id' })
	director: User;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@DeleteDateColumn()
	deleted_at: Date;
}

export default Company;
