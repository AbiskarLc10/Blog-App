import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom';

const OnlyAdminRoute = () => {


    const {currentUser} = useSelector(state=> state.user);
    const {isAdmin} = currentUser.rest;
  return (
    <>
 {
    isAdmin? <Outlet/>:<></>
 }

</>
  )
}

export default OnlyAdminRoute
