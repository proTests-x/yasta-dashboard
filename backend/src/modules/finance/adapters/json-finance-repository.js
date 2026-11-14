import { FinanceRepository } from "../ports/finance-repository.js";

export class JsonFinanceRepository extends FinanceRepository {
  constructor(store) { super(); this.store = store; }

  async listTransactions(ownerId, { month } = {}) {
    return (await this.store.read()).transactions
      .filter((item) => item.ownerId === ownerId && (!month || item.date.startsWith(month)))
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
  }

  async addTransaction(transaction) {
    return this.store.update((data) => { data.transactions.push(transaction); return transaction; });
  }

  async deleteTransaction(ownerId, transactionId) {
    return this.store.update((data) => {
      const index = data.transactions.findIndex((item) => item.id === transactionId && item.ownerId === ownerId);
      if (index < 0) return false;
      data.transactions.splice(index, 1);
      return true;
    });
  }

  async listReceivables(ownerId) {
    return (await this.store.read()).receivables.filter((item) => item.ownerId === ownerId).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }

  async addReceivable(receivable) {
    return this.store.update((data) => { data.receivables.push(receivable); return receivable; });
  }
}
