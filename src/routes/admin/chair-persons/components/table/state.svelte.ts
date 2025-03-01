import { getContext, setContext } from 'svelte';
import type { AccountsPageSchema } from './schema';

class TableState {
  #activeRow = $state<AccountsPageSchema | null>(null);

  getActiveRow() {
    return this.#activeRow;
  }

  setActiveRow(row: AccountsPageSchema | null) {
    this.#activeRow = row;
  }
}

const tableStateKey = Symbol('SubjectPage');

export const initTableState = () => {
  return setContext(tableStateKey, new TableState());
};

export const useChairPersonTableState = () => {
  return getContext<ReturnType<typeof initTableState>>(tableStateKey);
};
