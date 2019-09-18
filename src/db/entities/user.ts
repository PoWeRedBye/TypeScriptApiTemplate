import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: true })
  login: string;

  @Column({ length: 500 })
  email: string;

  @Column({ length: 100, nullable: true })
  password: string|undefined;

  @Column({ length: 100, nullable: true })
  passwordHash: string|undefined;
}

export default User;