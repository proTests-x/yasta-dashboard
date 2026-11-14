import { AppError } from "../../../shared/domain/app-error.js";

const monthPattern = /^\d{4}-(0[1-9]|1[0-2])$/;

export function makeGetOverview({ financeRepository, userRepository }) {
  return async function getOverview(ownerId, requestedMonth) {
    const month = requestedMonth || new Date().toISOString().slice(0, 7);
    if (!monthPattern.test(month)) {
      throw new AppError("El mes debe tener el formato AAAA-MM.", { status: 422, code: "INVALID_MONTH" });
    }
    const [transactions, receivables, user] = await Promise.all([
      financeRepository.listTransactions(ownerId, { month }),
      financeRepository.listReceivables(ownerId),
      userRepository.findById(ownerId)
    ]);
    const incomeCents = transactions.filter((item) => item.type === "income").reduce((sum, item) => sum + item.amountCents, 0);
    const expenseCents = transactions.filter((item) => item.type === "expense").reduce((sum, item) => sum + item.amountCents, 0);
    const profitCents = incomeCents - expenseCents;
    const marginPercent = incomeCents ? Math.round((profitCents / incomeCents) * 1000) / 10 : 0;
    const goalCents = user?.monthlyGoalCents ?? 0;
    const openReceivables = receivables.filter((item) => item.balanceCents > 0);
    const overdueCents = openReceivables
      .filter((item) => item.dueDate < new Date().toISOString().slice(0, 10))
      .reduce((sum, item) => sum + item.balanceCents, 0);

    return {
      month,
      incomeCents,
      expenseCents,
      profitCents,
      marginPercent,
      goalCents,
      goalProgressPercent: goalCents ? Math.min(Math.round((incomeCents / goalCents) * 1000) / 10, 100) : 0,
      openReceivablesCount: openReceivables.length,
      openReceivablesCents: openReceivables.reduce((sum, item) => sum + item.balanceCents, 0),
      overdueCents,
      transactionCount: transactions.length,
      recentTransactions: transactions.slice(0, 5),
      dailyFlow: buildDailyFlow(transactions)
    };
  };
}

function buildDailyFlow(transactions) {
  const days = new Map();
  for (const transaction of transactions) {
    const day = transaction.date.slice(-2);
    const current = days.get(day) ?? { day, incomeCents: 0, expenseCents: 0 };
    current[transaction.type === "income" ? "incomeCents" : "expenseCents"] += transaction.amountCents;
    days.set(day, current);
  }
  return [...days.values()].sort((a, b) => a.day.localeCompare(b.day)).slice(-10);
}
