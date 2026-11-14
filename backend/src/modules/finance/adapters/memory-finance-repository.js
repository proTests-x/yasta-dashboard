import { FinanceRepository } from "../ports/finance-repository.js";

export class MemoryFinanceRepository extends FinanceRepository {
  constructor({ transactions, receivables }) {
    super();
    this.transactions = transactions;
    this.receivables = receivables;
  }

  async listTransactions(ownerId, { month } = {}) {
    return this.transactions
      .filter((item) => item.ownerId === ownerId && (!month || item.date.startsWith(month)))
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
  }

  async addTransaction(transaction) {
    this.transactions.push(transaction);
    return transaction;
  }

  async deleteTransaction(ownerId, transactionId) {
    const index = this.transactions.findIndex((item) => item.id === transactionId && item.ownerId === ownerId);
    if (index < 0) return false;
    this.transactions.splice(index, 1);
    return true;
  }

  async listReceivables(ownerId) {
    return this.receivables.filter((item) => item.ownerId === ownerId).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }

  async addReceivable(receivable) {
    this.receivables.push(receivable);
    return receivable;
  }
}
