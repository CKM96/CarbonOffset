import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  email: string;

  @Column()
  password_hash: string;
}
