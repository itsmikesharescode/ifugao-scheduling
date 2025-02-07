import { getContext, setContext } from 'svelte';
import type { SchedulePageSchema } from './schema';

class TableState {
  #activeRow = $state<SchedulePageSchema | null>(null);
  showView = $state(false);
  showUpdate = $state(false);
  showDelete = $state(false);

  getActiveRow() {
    return this.#activeRow;
  }

  setActiveRow(row: SchedulePageSchema | null) {
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
