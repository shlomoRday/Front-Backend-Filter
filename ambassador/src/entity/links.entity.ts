import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, OneToMany,JoinColumn, JoinTable, ManyToOne } from "typeorm";
import { Order } from "./order.entity";
import { Product } from "./product.entity";
import { User } from "./user.entity";

@Entity()
export class Links {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({unique:true})
  code!: string;

  @ManyToOne(()=>User)
  @JoinColumn({name:"user_id"})
  user!:User

  @ManyToMany(()=>Product)
  @JoinTable({
      name:"link_products",
      joinColumn:{name:"link_id",referencedColumnName:"id"},
      inverseJoinColumn:{name:"product_id", referencedColumnName:"id"}
  })
  products!:Product[];

  @OneToMany(()=> Order, order => order.link,{
    createForeignKeyConstraints:false
  })
  @JoinColumn({
    referencedColumnName:"code",
    name:"code"
  })
  orders!:Order


}
