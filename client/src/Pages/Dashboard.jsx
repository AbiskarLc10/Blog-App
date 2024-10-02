import React, { useEffect, useState } from 'react'
import { useLocation,} from 'react-router-dom'
import DashProfile from '../Components/DashProfile';
import DashSidebar from '../Components/DashSidebar';
import DashPosts from '../Components/DashPosts';
import DashUsers from '../Components/DashUsers';
import DashComments from '../Components/DashComments';
import DashComp from '../Components/DashComp';
const Dashboard = () => {
  const location = useLocation();
  const [tab,setTab] =  useState('');

   useEffect(()=>{

    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    setTab(tabFromUrl);

  },[location.search])
  return (
    <div className='min-h-screen flex md:flex-row flex-col ' >
      {/* sidebar */}
     <div className="md:w-56">
      <DashSidebar tab={tab}/>
     </div>
     {/* profile */}
      {
        tab==="profile"?<DashProfile/>:<></>
      }
      {
        tab==="posts"?<DashPosts/>:<></>
      }
{
  tab==="users"?<DashUsers/>:<></>
}
{
  tab==="comments"?<DashComments/>:<></>
}
{
  tab==="dash"?<DashComp/>:<></>
}
    </div>
  )
}

export default Dashboard
