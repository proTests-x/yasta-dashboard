import { createReceivable } from "../domain/receivable.js";

export function makeListReceivables({ financeRepository }) {
  return (ownerId) => financeRepository.listReceivables(ownerId);
}

export function makeAddReceivable({ financeRepository }) {
  return async (ownerId, input) => financeRepository.addReceivable(createReceivable(input, ownerId));
}
