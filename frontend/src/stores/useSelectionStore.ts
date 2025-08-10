import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  persist,
  createJSONStorage,
  devtools,
  PersistOptions,
} from "zustand/middleware";

import { StateCreator } from "zustand";
import { cookieStorage, forcePersist } from "@/lib/utils";

interface SelectionState {
  selectedResume: number | null;
  selectedJob: number | null;
}

interface SelectionActions {
  setSelectedResume: (id: number | null) => void;
  setSelectedJob: (id: number | null) => void;
  resetSelection: () => void;
}

type SelectionSlice = SelectionState & SelectionActions;

const createSelectionSlice: StateCreator<
  SelectionSlice,
  [["zustand/immer", never]],
  [],
  SelectionSlice
> = (set) => ({
  selectedResume: null,
  selectedJob: null,
  setSelectedResume: (id) => set({ selectedResume: id }),
  setSelectedJob: (id) => set({ selectedJob: id }),
  resetSelection: () => set({ selectedJob: null, selectedResume: null }),
});

const persistOptions: PersistOptions<SelectionSlice, SelectionState> = {
  name: "selection-storage",
  storage: createJSONStorage(() => cookieStorage),
  partialize: (state) => ({
    selectedResume: state.selectedResume,
    selectedJob: state.selectedJob,
  }),
};

const useSelectionStore = create<SelectionSlice>()(
  devtools(
    persist(
      immer((...a) => ({
        ...createSelectionSlice(...a),
      })),
      persistOptions
    ),

    { name: "selection-devtools" }
  )
);

forcePersist(useSelectionStore);

export default useSelectionStore;
