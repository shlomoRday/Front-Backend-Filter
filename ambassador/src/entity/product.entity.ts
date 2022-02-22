import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  decsription!: string;

  @Column()
  image!: string;

  @Column()
  price!: number;
  
}
