import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isLoading: true,
  searched_filter: "",
};

const filterListSlice = createSlice({
  name: "listfilter",
  initialState,
  reducers: {
    updateFilter: (state, action) => {
      state.searched_filter = action.payload;
    },
    crealFilter: (state) => {
      //console.log(":Clear Search Reducer fired");
      state.searched_filter = "";
    },
  },
});

export const { updateFilter, crealFilter } = filterListSlice.actions;
export default filterListSlice.reducer;
