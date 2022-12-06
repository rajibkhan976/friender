import { createSlice } from "@reduxjs/toolkit";
const initialState={
    isLoading:true,
    searched_filter:'',
}

const filterListSlice=createSlice({
     name:"listfilter",
     initialState,
     reducers:{
       updateFilter:(state,action)=>{
            state.searched_filter=action.payload;
        },
     },
})



export const {updateFilter}=filterListSlice.actions;
export default filterListSlice.reducer;
