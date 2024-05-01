import type { RootState } from "@/redux/store";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
interface AppState {
  textForEditor: string;
}

// Define the initial state using that type
const initialState: AppState = {
  textForEditor: "",
};

export const AppSlice = createSlice({
  name: "App",
  initialState,
  reducers: {
    updateTextForEditor: (state, action: PayloadAction<string>) => {
      state.textForEditor = action.payload;
    },
  },
});

export const { updateTextForEditor } = AppSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectTextForEditor = (state: RootState) =>
  state.app.textForEditor;

export default AppSlice.reducer;
