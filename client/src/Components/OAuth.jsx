import React from 'react'
import { AiFillGoogleCircle} from "react-icons/ai";
import { Button } from 'flowbite-react';
import {GoogleAuthProvider, getAuth, signInWithPopup} from "firebase/auth";
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { toast } from "react-toastify";
import { signInSuccess,signInFailure } from '../redux/user/userSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = getAuth(app);
    const handleGoogleLogin = async () =>{
const provider = new GoogleAuthProvider();
provider.setCustomParameters({prompt:'select_account'})
try {
    
    const resultFromGoogle = await signInWithPopup(auth,provider)
    
    const data = {
       username: resultFromGoogle.user.displayName,
       email: resultFromGoogle.user.email,
       googlePhotoURL: resultFromGoogle.user.photoURL
    }
   await axios.post("http://localhost:8000/api/auth/google",data,
    {
        withCredentials:true,
        headers:{
            "Content-Type":"application/json"
        }
    }).then((res)=>{
        dispatch(signInSuccess(res.data))
        toast.success(res.data.message);
        navigate("/");
    }).catch((err)=>{
        dispatch(signInFailure(err.response.data))
        toast.error(err.response.data.message);
        toast.error(err.response.data.extraDetails);
    })
    
} catch (error) {
    console.log(error)
}
    }
  return (
    <Button gradientDuoTone={"pinkToOrange"} type="button" outline onClick={handleGoogleLogin}>
              <span className=" mr-2">
                <AiFillGoogleCircle className='text-2xl'/>
              </span>
              Continue with google
            </Button>
  )
}

export default OAuth
