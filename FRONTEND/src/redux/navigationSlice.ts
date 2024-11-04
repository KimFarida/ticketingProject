import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NavigationState {
    history: string[];
}

const initialState: NavigationState = {
    history: [],
};

const navigationSlice = createSlice({
    name: "navigation",
    initialState,
    reducers: {
        addToHistory: (state, action: PayloadAction<string>) => {
            state.history.push(action.payload);
        },
        goBack: (state) => {
            state.history.pop();
        },
        resetHistory: (state) => {
            state.history = [];
        },
    },
});

export const { addToHistory, goBack, resetHistory } = navigationSlice.actions;

export const selectHistory = (state: {navigation : NavigationState }) => state.navigation.history;

export default navigationSlice.reducer;