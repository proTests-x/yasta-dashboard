import { bcryptPasswordHasher } from "../modules/auth/adapters/bcrypt-password-hasher.js";
import { makeJwtTokenService } from "../modules/auth/adapters/jwt-token-service.js";
import { MemoryUserRepository } from "../modules/auth/adapters/memory-user-repository.js";
import { JsonUserRepository } from "../modules/auth/adapters/json-user-repository.js";
import { makeGetCurrentUser, makeLogin, makeRegister } from "../modules/auth/application/login.js";
import { MemoryPlanRepository } from "../modules/plans/adapters/memory-plan-repository.js";
import { JsonPlanRepository } from "../modules/plans/adapters/json-plan-repository.js";
import { makeListPublicPlans } from "../modules/plans/application/list-public-plans.js";
import { MemoryFinanceRepository } from "../modules/finance/adapters/memory-finance-repository.js";
import { JsonFinanceRepository } from "../modules/finance/adapters/json-finance-repository.js";
import { makeGetOverview } from "../modules/finance/application/get-overview.js";
import { makeAddReceivable, makeListReceivables } from "../modules/finance/application/receivables.js";
import { makeAddTransaction, makeDeleteTransaction, makeListTransactions } from "../modules/finance/application/transactions.js";
import { makeAuthenticate } from "../shared/http/authenticate.js";
import { buildFinanceSeed, plans } from "./seed.js";
import { JsonStore } from "../shared/storage/json-store.js";

export async function createContainer(config) {
  const demoUser = {
    id: "usr_demo",
    fullName: "Usuario Demo",
    email: "demo@example.invalid",
    passwordHash: await bcryptPasswordHasher.hash("YastaDemo2026!"),
    businessName: "Café Horizonte",
    role: "owner",
    monthlyGoalCents: 1_200_000,
    planId: "plan_esencial",
    active: true
  };
  const financeSeed = buildFinanceSeed(demoUser.id);
  let userRepository;
  let planRepository;
  let financeRepository;

  if (config.storageDriver === "json" && config.nodeEnv !== "test") {
    const store = new JsonStore(config.dataFilePath, {
      meta: { version: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      users: [demoUser],
      plans,
      transactions: financeSeed.transactions,
      receivables: financeSeed.receivables
    });
    await store.initialize();
    userRepository = new JsonUserRepository(store);
    planRepository = new JsonPlanRepository(store);
    financeRepository = new JsonFinanceRepository(store);
  } else {
    userRepository = new MemoryUserRepository([demoUser]);
    planRepository = new MemoryPlanRepository(plans);
    financeRepository = new MemoryFinanceRepository(financeSeed);
  }
  const tokenService = makeJwtTokenService({ secret: config.jwtSecret, expiresIn: config.jwtExpiresIn });
  const authenticate = makeAuthenticate(tokenService);

  return {
    authenticate,
    login: makeLogin({ userRepository, passwordHasher: bcryptPasswordHasher, tokenService }),
    register: makeRegister({ userRepository, passwordHasher: bcryptPasswordHasher, tokenService }),
    getCurrentUser: makeGetCurrentUser({ userRepository }),
    listPublicPlans: makeListPublicPlans({ planRepository }),
    getOverview: makeGetOverview({ financeRepository, userRepository }),
    listTransactions: makeListTransactions({ financeRepository }),
    addTransaction: makeAddTransaction({ financeRepository }),
    deleteTransaction: makeDeleteTransaction({ financeRepository }),
    listReceivables: makeListReceivables({ financeRepository }),
    addReceivable: makeAddReceivable({ financeRepository })
  };
}
