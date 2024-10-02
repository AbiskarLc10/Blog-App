import React, { useContext, useEffect, useState } from 'react'
import { Sidebar } from 'flowbite-react';
import {HiArrowSmRight, HiUser,HiDocumentText, HiChartPie} from "react-icons/hi";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { stateContext } from '../Context/BlogContext';
import { FaComment, FaInfoCircle, FaUsers } from "react-icons/fa";

const DashSidebar = ({tab}) => {
    
    const context = useContext(stateContext);
    const {handleSignOut} = context;

    const {currentUser} = useSelector(state=>state.user);
    const {isAdmin} = currentUser.rest;
  return (
    <>   
    <Sidebar className='w-full md:w-56'>
    <Sidebar.Items>
        <Sidebar.ItemGroup className='cursor-pointer flex flex-col gap-1'>
            <Link to={"/dashboard?tab=profile"}>
            <Sidebar.Item active={tab==="profile"} icon={HiUser} label={isAdmin?"Admin":"User"} labelColor="dark" as="div">
                Profile
            </Sidebar.Item>
            </Link>
            {
                isAdmin &&
                <>
                  <Link to={"/dashboard?tab=dash"}>
                <Sidebar.Item active={tab==="dash"} icon={HiChartPie} as="div">
                    Dashboard
                </Sidebar.Item>
            </Link>
                <Link to={"/dashboard?tab=posts"}>
                <Sidebar.Item active={tab==="posts"} icon={HiDocumentText} as="div">
                    Posts
                </Sidebar.Item>
            </Link>
                <Link to={"/dashboard?tab=users"}>
                <Sidebar.Item active={tab==="users"} icon={FaUsers} as="div">
                    Users
                </Sidebar.Item>
            </Link>
            </>
            }
            {
                isAdmin &&
                <>
                   <Link to={"/dashboard?tab=comments"}>
                <Sidebar.Item active={tab==="comments"} icon={FaComment} as="div">
                    Comments
                </Sidebar.Item>
            </Link>
                </>
            }
           
            <Sidebar.Item icon={HiArrowSmRight} >
               <span onClick={handleSignOut}> Sign Out</span>
            </Sidebar.Item>
        </Sidebar.ItemGroup>
    </Sidebar.Items>
   </Sidebar>
   </>

  )
}

export default DashSidebar
