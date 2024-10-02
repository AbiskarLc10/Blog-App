import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Label, TextInput, Button, Alert, Spinner } from "flowbite-react";
import {  toast } from 'react-toastify';
import OAuth from "../Components/OAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {  useDispatch,useSelector } from "react-redux";
import { signInStart,signInSuccess,signInFailure } from "../redux/user/userSlice";

const Signup = () => {


  const navigate = useNavigate();
  const {loading} = useSelector(state=>state.user)
  const dispatch = useDispatch();
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    
    if (!user.username || !user.email || !user.password) {
      return toast.error("Please fill the fields");
    }
    try {
     dispatch(signInStart())
      await axios
        .post("http://localhost:8000/api/auth/signup", user, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log(res.data);
          dispatch(signInSuccess(res.data))
          setUser({
            username: "",
            email: "",
            password: "",
          });

          
          toast.success(res.data.message);
          navigate("/login");
        })
        .catch((err) => {
          const  {message,extraDetails} = err.response.data;
          dispatch(signInFailure(message));
            toast.error(extraDetails?extraDetails:message);
        });

    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  };

  const handleOnChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <div className=" md:min-h-20 md:mt-20 mt-4">
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

        {/* right */}
        <div className="flex-1 mt-3">
          <form className="flex flex-col gap-4" onSubmit={handleOnSubmit}>
            <div className="">
              <Label value="Username" className="text-md font-semibold" />
              <TextInput
                id="username"
                type="text"
                onChange={handleOnChange}
                value={user.username}
                name="username"
                placeholder="Enter your name"
                autoComplete="off"
              />
            </div>
            <div className="">
              <Label value="Email" className="text-md font-semibold" />
              <TextInput
                id="email"
                type="email"
                name="email"
                onChange={handleOnChange}
                value={user.email}
                placeholder="foo@example.com"
                autoComplete="off"
              />
            </div>
            <div className="">
              <Label value="Password" className="text-md font-semibold" />
              <TextInput
                id="password"
                name="password"
                onChange={handleOnChange}
                value={user.password}
                type="password"
                placeholder="Enter password"
                autoComplete="off"
              />
            </div>

            <Button gradientDuoTone={"purpleToPink"} type="submit" disable={loading}>
              {
                loading?(
                  <>
                  <Spinner size={"sm"}/>
                  <span className="pl-3">Loading...</span>
                  </>
                ):"Sign up"
              }
            </Button>
            <OAuth/>
          </form>

          <div className=" flex pt-3">
            <span>Have an account?</span>
            <Link to={"/login"} className="ml-2 text-blue-500 underline">
              Log In
            </Link>
          </div>

        
        </div>
      </div>
    </div>
  );
};

export default Signup;
