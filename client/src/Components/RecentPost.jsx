import React,{useEffect, useState} from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import PostCard from './PostCard';


const RecentPost = () => {

    const [posts,setPosts] = useState([]);
    const {currentUser} = useSelector(state=>state.user);


    const getRecentPosts = async () =>{

        try {
            
            await axios.get("http://localhost:8000/api/admin/getposts?limit=3&order=asc",{
                withCredentials:true
            }).then((res)=>{
                setPosts(res.data.posts);
            }).catch((err)=>{
               console.log(err.response.data.message);
            })
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{

        getRecentPosts();
    },[])
  return (
    <div className='mx-auto mt-4 max-w-4xl'>
        <h2 className='text-gray-700 dark:text-gray-200 font-semibold text-xl'>Recent Posts</h2>
  <div className=' grid sm:grid-cols-3 gap-4 mt-5'>

       
          {

            posts.map((post)=>{

                return <PostCard key={post._id} slug={post.slug} image={post.postImage} title={post.title} category={post.category}/>
            })
          }
    </div>    
    </div>
  )
}

export default RecentPost
