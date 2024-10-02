
import React ,{ createContext,useState } from "react";
import { useDispatch } from "react-redux";
import { deleteStart,signOut,deleteFailure } from "../redux/user/userSlice";
import {toast} from "react-toastify";
import axios from "axios";

export const stateContext = createContext()

export const Contexts = (props) =>{

  const dispatch = useDispatch();

  const handleSignOut =  async () =>{

    try {
      
      dispatch(deleteStart());
      await axios.post("http://localhost:8000/api/auth/signout",null,{
        withCredentials:true,
      }).then((res)=>{
           dispatch(signOut());
           toast.success(res.data.message);
      }).catch((error)=>{
        dispatch(deleteFailure(error));
        console.log(error);
        toast.error(error.message);
        toast.error(error.extraDetails);

      })
    } catch (error) {
      console.log(error);
      dispatch(deleteFailure(error));
    }
  }
    return(
        <stateContext.Provider value={{handleSignOut}}>
              {props.children}
        </stateContext.Provider>
    )
}

