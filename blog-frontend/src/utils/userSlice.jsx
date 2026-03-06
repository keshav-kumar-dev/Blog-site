import {createSlice} from "@reduxjs/toolkit";

const savedUser = JSON.parse(localStorage.getItem("user")) || null;

const userSlice = createSlice({

    name : "user",
    initialState : {user : savedUser}
    ,
    reducers:{
        addUser:(state,action)=>{
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        removeUser:(state, action)=>{
            state.user = null;
            localStorage.removeItem('user');
        }
    }

})

export const {addUser , removeUser} = userSlice.actions;

export default userSlice.reducer;