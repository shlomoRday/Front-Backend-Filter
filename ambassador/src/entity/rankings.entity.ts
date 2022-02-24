import { Column, CreateDateColumn, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Ranks {
  @PrimaryGeneratedColumn()
  id!:number;

  @Column()
  fullName!:string;

  @Column()
  score!:number;

}