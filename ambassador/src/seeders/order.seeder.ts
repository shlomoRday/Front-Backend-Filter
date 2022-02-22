import { createConnection, getRepository } from "typeorm";
import { Order } from "../entity/order.entity";
import {faker} from "@faker-js/faker";
import { randomInt } from "crypto";
import { OrderItem } from "../entity/orderItem.entity";
createConnection().then(async () => {
  const ordersRepo = getRepository(Order);
  const orderItemRepo = getRepository(OrderItem)
  for (let i = 0; i < 10; i++) {
    const order = await ordersRepo.save({
      user_id:randomInt(2,31),
      code:faker.random.alphaNumeric(6),
      ambassador_email:faker.internet.email(),
      first_name:faker.name.firstName(),
      last_name: faker.name.lastName(),
      email:faker.internet.email(),
      complete:true,
    });

    for (let i = 0; i < 10; i++) {
        await orderItemRepo.save({
            order,
            product_title:faker.lorem.words(2),
            price:randomInt(10,100),
            quantity:randomInt(1,5),
            admin_revenue: randomInt(10,100),
            ambassador_revenue:randomInt(10,100),

        });
   }
  }
  process.exit();
});
