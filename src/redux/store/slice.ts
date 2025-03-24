import {createSlice} from "@reduxjs/toolkit";


const Slice = createSlice({
    name: 'Name',
    initialState:{
        currency: []
    },
    reducers: {
        addCurrency: (state, action) => {
            // @ts-ignore
            state.currency.push(action.payload)
        },
        copyCurrency: (state, action) => {
            state.currency = action.payload
        },
        removeCurrency: (state, action) => {
            state.currency = state.currency.filter(item => item !== action.payload);
        },
        filterCurrency: (state) => {
            // @ts-ignore
            state.currency = [...new Set(state.currency)];
        },
    }
});


export const {addCurrency, filterCurrency, copyCurrency, removeCurrency} = Slice.actions;
export default Slice.reducer;

