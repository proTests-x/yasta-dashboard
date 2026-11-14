export class FinanceRepository {
  async listTransactions(_ownerId, _filters) { throw new Error("Not implemented"); }
  async addTransaction(_transaction) { throw new Error("Not implemented"); }
  async deleteTransaction(_ownerId, _transactionId) { throw new Error("Not implemented"); }
  async listReceivables(_ownerId) { throw new Error("Not implemented"); }
  async addReceivable(_receivable) { throw new Error("Not implemented"); }
}
