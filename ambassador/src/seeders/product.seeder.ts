import { createConnection, getRepository } from "typeorm";
import { Product } from "../entity/product.entity";
import { randomInt } from "crypto";
import {faker} from "@faker-js/faker";
createConnection().then(async () => {
  const repo = getRepository(Product);
  for (let i = 0; i < 10; i++) {
    await repo.save({
      title: faker.lorem.words(2),
      decsription: faker.lorem.lines(10),
      image: faker.image.imageUrl(200, 200, "", true),
      price: randomInt(10, 100),
    });
  }
  process.exit();
});
