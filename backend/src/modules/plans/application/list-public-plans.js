export function makeListPublicPlans({ planRepository }) {
  return async function listPublicPlans() {
    const plans = await planRepository.listActive();
    return plans.map(({ active: _active, ...plan }) => plan);
  };
}
