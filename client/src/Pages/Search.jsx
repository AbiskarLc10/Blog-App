import axios from 'axios';
import { Button, Select, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Spinner } from 'flowbite-react';
import PostCard from '../Components/PostCard';
import {useSelector} from "react-redux"
const Search = () => {

  const navigate = useNavigate();


  const {currentUser} = useSelector(state=>state.user);
    const location = useLocation();
    const [sideBarData,setSideBarData] = useState({
     searchTerm:"",
     sort:"asc",
   category:"uncategorized"
    });
    const [showmore,setShowMore] = useState(false);
    const [loading,setLoading] = useState(false);
    const [posts,setPosts] =useState([]);


    console.log(sideBarData);

    useEffect(()=>{

const urlParams = new URLSearchParams(location.search);
const searchTermFromUrl = urlParams.get("searchTerm");
const sortFromUrl = urlParams.get("sort");
const categoryFromUrl = urlParams.get("category");

if(searchTermFromUrl || sortFromUrl || categoryFromUrl){
    setSideBarData({
        ...sideBarData,
        searchTerm:searchTermFromUrl,
        sort:sortFromUrl,
        category:categoryFromUrl
    })

}

const fetchAllPosts = async () =>{

  if(currentUser){

  
    const searchQuery = urlParams.toString();
    try {
      setLoading(true)
        await axios
          .get(`http://localhost:8000/api/admin/getposts?${searchQuery}`, {
            withCredentials: true,
          })
          .then((res) => {
            console.log(res.data.posts);
            setLoading(false)
            setPosts(res.data.posts);
            if(res.data.posts.length === 9){
              setShowMore(true);
            }else{
              setShowMore(false);
            }
          })
          .catch((err) => {
            setLoading(false)
            console.log(err.response.data.message);
          });
      } catch (error) {
        setLoading(false)
        console.log(error);
      }
}
}
fetchAllPosts();
    },[location.search])


    const handleSubmit = (e) =>{

      e.preventDefault();
      const urlParams = new URLSearchParams(location.search);
      urlParams.set("searchTerm",sideBarData.searchTerm);
      urlParams.set("sort",sideBarData.sort);
      urlParams.set("category",sideBarData.category);

      const searchOption = urlParams.toString();

      navigate(`/search?${searchOption}`);

    }

    const handleShowMore = async () =>{


      const startIndex = posts.length;
      const urlParams = new URLSearchParams(location.search);
      urlParams.set("startIndex",startIndex);

      const searchQuery = urlParams.toString();


      try {
        await axios
          .get(`http://localhost:8000/api/admin/getposts?${searchQuery}`, {
            withCredentials: true,
          }).then((res)=>{
            setPosts([...posts,...res.data.posts]);
            if(res.data.posts.length===9){
              setShowMore(true);
            }else{
              setShowMore(false);
            }
          }).catch((err)=>{
             console.log(err.response.data.message);
          })
      } catch (error) {
        console.log(error);
      }
    }
  return (
    <div className=' max-w-6xl md:min-h-screen flex md:flex-row flex-col'>

        <div className=' md:w-72 md:border-r-2'>
       
       <form onSubmit={handleSubmit}>
        <div className="flex flex-col p-7 gap-5  border-gray-600 md:min-h-screen">

<div className='flex md:justify-start w-full  gap-5 md:gap-1 md:items-center'>
            <p className='text-sm font-bold'>SearchTerm:</p>
            <TextInput type='text' className='w-full' onChange={(e)=> setSideBarData({...sideBarData,searchTerm:e.target.value})} placeholder='Search...' name='searchTerm' value={sideBarData.searchTerm}>

            </TextInput>
            </div>
<div className='flex md:justify-start gap-5 items-center'>
            <p className='text-sm font-bold'>Sort:</p>
            <Select value={sideBarData.sort} className='w-full' onChange={(e)=> setSideBarData({...sideBarData,sort:e.target.value})}>
                <option value={"desc"}>Latest</option>
                <option value={"asc"}>Older</option>

                
            </Select>
            </div>
<div className='flex justify-start gap-5 items-center'>
            <p className='text-sm font-bold'>Category:</p>
            <Select className='w-full' value={sideBarData.category} onChange={(e)=> setSideBarData({...sideBarData,category:e.target.value})}>
                <option value={"react.js"} selected>react.js</option>
                <option value="javascript" >Javascript</option>
                <option value="next.js" >next.js</option>
                
            </Select>
            </div>

            <Button gradientDuoTone={"purpleToPink"}  type='submit' outline>Apply Filters</Button>
        </div>
       </form>
        </div>

        {

          loading?
          <div className='flex justify-center md:items-center md:mx-auto'>
<Spinner size={"xl"} />
          </div>:<>
          <div className='flex-1  max-w-3xl'>
          <div className=' text-center md:text-start'>
            <h1 className='text-2xl p-3 font-semibold pb-8  '>Post results</h1>
          </div>
         {

          posts && posts.length >0 ? 
          <>
         <div className="p-10 grid sm:grid-cols-2 sm:grid-rows-2 gap-3">
     { posts.map((post,index)=>{

return <PostCard image={post.postImage} title={post.title} category={post.category} slug={post.slug}/>
})}

         </div>
         {

showmore && 
<div className='flex justify-center'>
 <Button onClick={handleShowMore} color='gray'>Show more</Button>
 </div>
}
         </>:<div className='flex justify-center'>
          <h1 className='text-2xl'>No Posts Available</h1>
             
         </div>
         }
        </div>
          </>
        }
        
    </div>
  )
}

export default Search
