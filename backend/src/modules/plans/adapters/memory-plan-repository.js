import { PlanRepository } from "../ports/plan-repository.js";

export class MemoryPlanRepository extends PlanRepository {
  constructor(plans) { super(); this.plans = plans; }
  async listActive() { return this.plans.filter((plan) => plan.active); }
}
