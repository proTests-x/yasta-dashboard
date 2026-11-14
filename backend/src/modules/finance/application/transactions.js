import { createTransaction } from "../domain/transaction.js";
import { AppError } from "../../../shared/domain/app-error.js";

export function makeListTransactions({ financeRepository }) {
  return (ownerId, filters = {}) => financeRepository.listTransactions(ownerId, filters);
}

export function makeAddTransaction({ financeRepository }) {
  return async (ownerId, input) => financeRepository.addTransaction(createTransaction(input, ownerId));
}

export function makeDeleteTransaction({ financeRepository }) {
  return async (ownerId, transactionId) => {
    const removed = await financeRepository.deleteTransaction(ownerId, transactionId);
    if (!removed) throw new AppError("Movimiento no encontrado.", { status: 404, code: "TRANSACTION_NOT_FOUND" });
  };
}
