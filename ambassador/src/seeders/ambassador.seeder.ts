import { createConnection, getRepository } from "typeorm";
import { User } from "../entity/user.entity";
import {genSaltSync,hash} from "bcryptjs";
import {faker} from "@faker-js/faker";
createConnection().then(async () => {
  const repo = getRepository(User);
  const salt = genSaltSync(10);
  for (let i = 0; i < 10; i++) {
    await repo.save({
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      email: faker.internet.email(),
      password: await hash("123456",salt),
      is_ambassador: true,
    });
  }
  process.exit();
});
