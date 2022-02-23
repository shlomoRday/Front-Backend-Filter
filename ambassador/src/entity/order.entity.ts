import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Links } from "./links.entity";
import { OrderItem } from "./orderItem.entity";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id!:number

  @Column()
  user_id!:number

  @Column()
  code!:string


  @Column()
  ambassador_email!:string

  @Column()
  first_name!:string


  @Column()
  last_name!:string


  @Column()
  email!:string


  @Column({nullable:true})
  address!:string
  

  @Column({nullable:true})
   country!:string

   @Column({nullable:true})
   city!:string


   @Column({nullable:true})
   zip!:string

  @Column({default:true})
   complete!:boolean


  @CreateDateColumn()
  created_at!:string

  
  @OneToMany(()=> OrderItem, orderItem => orderItem.order)
  @JoinTable({name:"order_id"})
  order_items!: OrderItem[];

  @ManyToOne(()=>Links,Links=>Links.orders,{
      createForeignKeyConstraints:false
  })
  @JoinColumn({
    referencedColumnName:"code",
    name:"code"
  })
  link!:Links;

  get fullName(): string {
       return this.first_name + "" + this.last_name;
  }
  
  get total():number { return this.order_items.reduce((s,item)=> s + item.admin_revenue,0)}
  get ambassador_revenue():number { return this.order_items.reduce((s,item)=> s + item.ambassador_revenue,0)}

}