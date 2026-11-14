import { PlanRepository } from "../ports/plan-repository.js";

export class JsonPlanRepository extends PlanRepository {
  constructor(store) { super(); this.store = store; }
  async listActive() { return (await this.store.read()).plans.filter((plan) => plan.active); }
}
