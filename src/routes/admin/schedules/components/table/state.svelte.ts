import { getContext, setContext } from 'svelte';
import type { SchedulePageSchema } from './schema';

class TableState {
  #activeRow = $state<SchedulePageSchema | null>(null);
  showView = $state(false);

  getActiveRow() {
    return this.#activeRow;
  }

  setActiveRow(row: SchedulePageSchema | null) {
    this.#activeRow = row;
  }
}

const tableStateKey = Symbol('SubjectPage');

export const initSchedTableState = () => {
  return setContext(tableStateKey, new TableState());
};

export const useSchedTableState = () => {
  return getContext<ReturnType<typeof initSchedTableState>>(tableStateKey);
};
