import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Projects {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  account_id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  date_created: Date;
}
