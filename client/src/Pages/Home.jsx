import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PostCard from "../Components/PostCard"
import CallToAction from "../Components/CallToAction";
import axios from "axios";
import { useSelector } from "react-redux";
const Home = () => {
  const [posts, setPosts] = useState([]);
const {currentUser} = useSelector(state=>state.user);
  const getPosts = async () => {
    try {
      await axios
        .get(`http://localhost:8000/api/admin/getposts?limit=9`, {
          withCredentials: true,
        })
        .then((res) => {
          console.log(res.data.posts);
          setPosts(res.data.posts);
        })
        .catch((err) => {
          console.log(err.response.data.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="min-h-screen  mt-4">
      <div className="md:mx-10 md:mt-20 md:text-start text-center flex flex-col gap-2 md:gap-4">
        <h1 className="text-3xl  md:text-4xl font-semibold capitalize">
          Welcome to my blog
        </h1>
        <p className="text-sm  text-gray-600 dark:text-gray-200 ">
          Get to know about various articles associated with front end
          Development.
        </p>
        <Link
          to={currentUser?"/search":"/login"}
          className="text-sm text-teal-600 font-bold hover:underline dark:text-teal-200"
        >
          View all posts
        </Link>
      </div>
      <div className="p-4 md:p-2 mt-20 md:mt-34 bg-cyan-500">
        <CallToAction
          image="https://www.interviewbit.com/blog/wp-content/uploads/2022/01/Web-Development-Projects-1-768x375.png"
          heading="Want to learn HTML,CSS and Javascript by building fun and engaging projects?"
          ptext="Check our website and get started with us"
          btntext="Check our 100 projects"
        />
      </div>
      <div className="mt-4 p-4  text-center ">
        <h1 className=" text-start md:text-center text-2xl font-semibold">Recent Posts</h1>
        {posts && posts.length > 0 && currentUser ? (
          <>        <div className="grid md:grid-rows-3 md:grid-cols-3 gap-4 mt-5 grid-cols-2 place-content-center">
        
            <>
              {posts.map((post,index) => {
                return(
                   <PostCard key={post._id} slug={post.slug} image={post.postImage} title={post.title} category={post.category}/>
                )
              })}
            </>
            
        </div>
        
        <div className="mt-4">

        
        <Link
          to={currentUser?"/search":"/login"}
          className="text-sm text-teal-600 font-bold hover:underline "
        >
          View all posts
        </Link>
        </div>
        </>

          ) : (
            <div className="mx-auto flex justify-center items-center flex-col">
              <h1 className="mt-4 text-gray-500 text-2xl capitalize">

                {

                  posts.length === 0 ?
                      " No Posts Available": "Login To See the Posts"
                }
               
              </h1>
              <Link to={"/login"} className="text-center text-blue-600 font-semibold hover:underline">Login</Link>
            </div>
          )}
         
      </div>
    
    </div>
  );
};

export default Home;
