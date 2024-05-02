import type { RootState } from "@/redux/store";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
interface AppState {
  textForEditor: string;
  referencesForEditor: string[];
}

// Define the initial state using that type
const initialState: AppState = {
  textForEditor: "",
  referencesForEditor: [],
};

export const AppSlice = createSlice({
  name: "App",
  initialState,
  reducers: {
    updateTextForEditor: (state, action: PayloadAction<string>) => {
      state.textForEditor = action.payload;
    },

    updateReferencesForEditor: (state, action: PayloadAction<string[]>) => {
      state.referencesForEditor = action.payload;
    },
  },
});

export const { updateTextForEditor, updateReferencesForEditor } =
  AppSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectTextForEditor = (state: RootState) =>
  state.app.textForEditor;

export const selectReferencesForEditor = (state: RootState) =>
  state.app.referencesForEditor;

export default AppSlice.reducer;
