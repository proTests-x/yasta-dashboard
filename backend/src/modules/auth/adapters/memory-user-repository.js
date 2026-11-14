import { UserRepository } from "../ports/user-repository.js";

export class MemoryUserRepository extends UserRepository {
  constructor(users) {
    super();
    this.users = users;
  }

  async findByEmail(email) {
    return this.users.find((user) => user.email === email) ?? null;
  }

  async findById(id) {
    return this.users.find((user) => user.id === id) ?? null;
  }

  async add(user) {
    this.users.push(user);
    return user;
  }
}
