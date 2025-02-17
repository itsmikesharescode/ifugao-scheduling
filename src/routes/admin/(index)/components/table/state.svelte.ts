import { getContext, setContext } from 'svelte';
import type { DepartmentPageSchema } from './schema';

class TableState {
  #activeRow = $state<DepartmentPageSchema | null>(null);

  getActiveRow() {
    return this.#activeRow;
  }

  setActiveRow(row: DepartmentPageSchema | null) {
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
