import axios from "axios";
import { Button, Label, Spinner, TextInput, Toast } from "flowbite-react";
import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import OAuth from "../Components/OAuth";
import { toast } from "react-toastify";
import {  useDispatch,useSelector } from "react-redux";
import { signInStart,signInSuccess,signInFailure } from "../redux/user/userSlice";

const Login = () => {

  const navigate = useNavigate();
  const {loading} = useSelector(state=>state.user)
  const dispatch = useDispatch();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    console.log("Hello");
    try {
      dispatch(signInStart())
      await axios.post(
        "http://localhost:8000/api/auth/login",
      
        user,
        {
          withCredentials:true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((response)=>{
        dispatch(signInSuccess(response.data));
        toast.success(response.data.message);
        navigate("/dashboard?tab=profile");
      }).catch((err)=>{
        dispatch(signInFailure(err.response.data))
        toast.error(err.response.data.message);
        toast.error(err.response.data.extraDetails);
      })
    
    } catch (error) {
      dispatch(signInFailure(error.message));
      console.log(error);
    }
  };
  const handleOnChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <div className="md:min-h-20 md:mt-20 mt-4">
      <div className="flex p-3 max-w-3xl md:gap-20 sm:gap-7  mx-auto flex-col md:flex-row md:items-center">
        {/* left */}
        <div className="flex-1">
          <Link
            to={"/"}
            className="  dark:text-white text-4xl sm:text-xl font-bold"
          >
            <span className=" py-1 px-2 bg-gradient-to-r from-indigo-500 via-purple-500 via-green-400 to-pink-500 rounded-lg text-4xl text-white">
              Abiskar's
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            This is my personal blog project created to learn more on mern
            project
          </p>
        </div>
        <div className="flex-1 pt-3">
          <form className=" flex flex-col gap-2" onSubmit={handleOnSubmit}>
            <div>
              <Label value="Email" className="text-lg font-semibold" />
              <TextInput
                id="email"
                type="email"
                name="email"
                value={user.email}
                placeholder="foo@company.com"
                autoComplete="off"
                onChange={handleOnChange}
              />
            </div>
            <div>
              <Label value="Password" className="text-lg font-semibold" />
              <TextInput
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                autoComplete="off"
                value={user.password}
                onChange={handleOnChange}
              />
            </div>
            <Button
              gradientDuoTone={"purpleToPink"}
              type="submit"
              disabled={loading}
            >
              {loading ?<> <Spinner size={"sm"} /> <span className="pl-3">Loading...</span> </>: "Log In"}
            </Button>
           <OAuth/>
          </form>

          <div className="flex pt-3">
            <span>Don't Have an Account?</span>
            <Link className="pl-2 underline text-blue-500" to={"/signup"}>
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
