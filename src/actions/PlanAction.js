import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    plan: '1',
    showModal: false
}

export const planSlice = createSlice({
    name: "plan",
    initialState,
    reducers: {
        toggleModal: (state) => {
            state.showModal = !state.showModal
        },
        showModal: (state, action) => {
            console.log('show modal');
            state.showModal = action.payload
        }
    }
})

export const {toggleModal,showModal}=planSlice.actions;
export default planSlice.reducer;