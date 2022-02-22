import { Column, CreateDateColumn, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id!:number;

  @Column()
  product_title!:string;

  @Column()
  price!:number;


  @Column()
  quantity!:number;

  @Column()
  ambassador_revenue!:number;


  @Column()
  admin_revenue!:number;

  @ManyToOne(()=> Order, order =>order.order_items)
  @JoinTable({name:"order_id"})
  order!:Order;
}