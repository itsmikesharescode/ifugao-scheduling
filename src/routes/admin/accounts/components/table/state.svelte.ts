import { getContext, setContext } from 'svelte';
import type { AccountsPageSchema } from './schema';

class TableState {
  #activeRow = $state<AccountsPageSchema | null>(null);
  showUpdate = $state(false);
  showDelete = $state(false);
  showOperational = $state(false);

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

export const useTableState = () => {
  return getContext<ReturnType<typeof initTableState>>(tableStateKey);
};
