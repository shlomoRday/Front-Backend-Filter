
import { getRepository, createConnection } from "typeorm";
import { Order } from "../entity/order.entity";
import { User } from "../entity/user.entity";
import { client } from "../index";
import {Ranks} from "../entity/rankings.entity";
createConnection().then(async () => {
    const ambassadors = await getRepository(User).find({
        is_ambassador:true
      });

      console.log("consle.")
      for(let i=0; i < ambassadors.length; i++){
        const orders = await getRepository(Order).find({
            where:{
              user_id:ambassadors[i].id,
              complete:true,
            },
            relations:["order_items"]
        });

        const rev = orders.reduce((s,item)=> s+item.ambassador_revenue,0);
       await getRepository(Ranks).save({
         fullName:ambassadors[i].fullName,
         score:rev
       });
        //client.zadd("rankings","value",ambassadors[i].fullName, "score",rev); 
      }
      process.exit();
});