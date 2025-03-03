import { getContext, setContext } from 'svelte';
import type { FacultyPageSchema } from './schema';

class TableState {
  #activeRow = $state<FacultyPageSchema | null>(null);

  getActiveRow() {
    return this.#activeRow;
  }

  setActiveRow(row: FacultyPageSchema | null) {
    this.#activeRow = row;
  }
}

const tableStateKey = Symbol('SubjectPage');

export const initTableState = () => {
  return setContext(tableStateKey, new TableState());
};

export const useFacultyTableState = () => {
  return getContext<ReturnType<typeof initTableState>>(tableStateKey);
};
