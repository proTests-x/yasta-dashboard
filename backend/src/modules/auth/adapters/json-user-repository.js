import { UserRepository } from "../ports/user-repository.js";

export class JsonUserRepository extends UserRepository {
  constructor(store) { super(); this.store = store; }

  async findByEmail(email) {
    return (await this.store.read()).users.find((user) => user.email === email) ?? null;
  }

  async findById(id) {
    return (await this.store.read()).users.find((user) => user.id === id) ?? null;
  }

  async add(user) {
    return this.store.update((data) => { data.users.push(user); return user; });
  }
}
