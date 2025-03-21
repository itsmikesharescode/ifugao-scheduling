import { getContext, setContext } from 'svelte';
import type { SectionPageSchema } from './schema';

class TableState {
  #activeRow = $state<SectionPageSchema | null>(null);

  getActiveRow() {
    return this.#activeRow;
  }

  setActiveRow(row: SectionPageSchema | null) {
    this.#activeRow = row;
  }
}

const tableStateKey = Symbol('SubjectPage');

export const initTableState = () => {
  return setContext(tableStateKey, new TableState());
};

export const useSectionTableState = () => {
  return getContext<ReturnType<typeof initTableState>>(tableStateKey);
};
