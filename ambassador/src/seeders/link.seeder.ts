import { createConnection, getRepository } from "typeorm";
import { User } from "../entity/user.entity";
import { Links } from "../entity/links.entity";
import {faker} from "@faker-js/faker";
import { randomInt } from "crypto";
createConnection().then(async () => {
  const repo = getRepository(Links);
  for (let i = 0; i < 10; i++) {
    const user = new User();
    user.id = i+1;
    await repo.save({
      code:faker.random.alphaNumeric(6),
      user,
      price:[randomInt(1,30)]
    });
  }
  process.exit();
});
