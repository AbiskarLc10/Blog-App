import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser:null,
    loading:null,
    error:null
}

const userSlice = createSlice({
name:"user",
initialState,
reducers:{
    signInStart : (state)=>{
        state.loading = true,
        state.error =  null
    },
    signInSuccess: (state,action) =>{
        state.loading = false,
        state.currentUser = action.payload
    },
    signInFailure : (state,action) =>{
        state.loading = false,
      state.error = action.payload
    },
    updateStart :(state) =>{
        state.loading = true,
        state.error = null
    },
    updateSuccess: (state,action) =>{
        state.loading = false,
        state.currentUser = action.payload
    },
    updateFailure: (state,action) =>{
        state.loading = false,
        state.error = action.payload
    },
    deleteStart :(state) =>{
        state.loading = true,
        state.error = null
    },
    deleteSuccess: (state) =>{
      state.loading = false;
        state.currentUser = null;
    },
    deleteFailure: (state,action) =>{
        state.loading = false,
        state.error = action.payload
    },
    signOut: (state) =>{
        state.loading = false,
        state.currentUser = null
    }
}

})


export const { signInStart,signInSuccess,signInFailure,updateStart,updateSuccess,updateFailure,deleteStart,deleteSuccess,deleteFailure,signOut} = userSlice.actions;

export default userSlice.reducer;