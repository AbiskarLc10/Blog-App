import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  HiArrowNarrowDown,
  HiArrowNarrowUp,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { FaCommentAlt ,FaFileAlt } from "react-icons/fa";
import {Button, Table} from "flowbite-react";

import {Link} from "react-router-dom"

const DashComp = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [totalusers, setTotalUsers] = useState(null);
  const [totalcomments, setTotalComments] = useState(null);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalnumberofposts, setTotalNumberOfPosts] = useState(null);
  const [lastmonthusers, setLastMonthUsers] = useState(null);
  const [lastmonthcomments, setLastMonthComments] = useState(null);
  const [lastmonthposts, setLastMonthPosts] = useState(null);
  const [error, setError] = useState(null);
  const [likes, setLikes] = useState(null);

  const getAllUsers = async () => {
    try {
      await axios
        .get("http://localhost:8000/api/user/getusers?sort=asc&limit=5", {
          withCredentials: true,
        })
        .then((res) => {
          console.log(res.data);
          setUsers(res.data.users);
          setTotalUsers(res.data.totalUsers);
          setLastMonthUsers(res.data.lastMonthUsers);
          setError(null);
        })
        .catch((err) => {
          setError(err.response.data.message);
        });
    } catch (error) {
      console.log(error);
    }
  };
  const getCommentsData = async () => {
    try {
      await axios
        .get("http://localhost:8000/api/comment/getAllComments?sort=asc", {
          withCredentials: true,
        })
        .then((res) => {
          console.log(res.data);
          setComments(res.data.comments);

          setTotalComments(res.data.totalNumberofComments);
          setLastMonthComments(res.data.lastMonthsComments);
          setError(null);
        })
        .catch((err) => {
          setError(err.response.data.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllPosts = async () => {
    try {
      await axios
        .get(`http://localhost:8000/api/admin/getposts?limit=5`, {
          withCredentials: true,
        })
        .then((res) => {
          console.log(res.data);
          setError(null);
          setPosts(res.data.posts);
          setTotalNumberOfPosts(res.data.totalPosts)
          setLastMonthPosts(res.data.lastMonthPosts);
        })
        .catch((err) => {
          setError(err.response.data.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currentUser.rest.isAdmin) {
      getAllUsers();
      getCommentsData();
      fetchAllPosts();
    }
  }, []);

  return (
    <div className="p-3 md:mx-auto ">
        <div className=" flex flex-wrap gap-4 justify-center">
      <div className="flex flex-col gap-3 dark:bg-slate-600 md:w-72  shadow-md p-3 rounded-lg">
        <div className="flex justify-between">
          <div>
            <h3 className="text-gray-500 dark:text-gray-200 uppercase text-md">Total Users</h3>
            <p className="text-2xl">{totalusers}</p>
          </div>
          <HiOutlineUserGroup className="text-white bg-green-600 text-5xl rounded-full p-2" />
        </div>
        <div className="flex items-center gap-2 text-xs">
          {totalusers >= lastmonthusers ? (
            <span className=" text-md flex items-center text-green-500">
              <HiArrowNarrowUp />
              {lastmonthusers}
            </span>
          ) : (
            <span className=" text-md flex items-center text-red-500">
            <HiArrowNarrowUp />
            {lastmonthusers}
          </span>
          )}
          <div >Last Month</div>
        </div>
      </div>
      {/*  */}
      <div className="flex flex-col gap-3 dark:bg-slate-600 md:w-72  shadow-md p-3 rounded-lg">
        <div className="flex justify-between">
          <div>
            <h3 className="text-gray-500 uppercase  dark:text-gray-200  text-md">Total Comments</h3>
            <p className="text-2xl">{totalcomments}</p>
          </div>
          <FaCommentAlt className="text-white bg-blue-600 text-5xl rounded-full p-2" />
        </div>
        <div className="flex items-center gap-2 text-xs">
          {totalcomments >= lastmonthcomments ? (
            <span className=" text-md flex items-center text-green-500">
              <HiArrowNarrowUp />
              {lastmonthcomments}
            </span>
          ) : (
            <span className=" text-md flex items-center text-red-500">
            <HiArrowNarrowUp />
            {lastmonthcomments}
          </span>
          )}
          <div >Last Month</div>
        </div>
      </div>
      {/*  */}
      <div className="flex flex-col gap-3 dark:bg-slate-600 md:w-72  shadow-md p-3 rounded-lg">
        <div className="flex justify-between">
          <div>
            <h3 className="text-gray-500 uppercase  dark:text-gray-200  text-md">Total posts</h3>
            <p className="text-2xl">{totalnumberofposts}</p>
          </div>
          <FaFileAlt className="text-white bg-teal-600 text-5xl rounded-full p-2" />
        </div>
        <div className="flex items-center gap-2 text-xs">
          {totalnumberofposts >= lastmonthposts ? (
            <span className=" text-md flex items-center text-green-500">
              <HiArrowNarrowUp />
              {lastmonthposts}
            </span>
          ) : (
            <span className=" text-md flex items-center text-red-500">
            <HiArrowNarrowUp />
            {lastmonthposts}
          </span>
          )}
          <div >Last Month</div>
        </div>
      </div>
      </div>
      <div className="flex flex-wrap gap-4 py-7 mx-auto justify-center">
         <div className=" flex flex-col p-2 dark:bg-gray-800 w-full sm:w-auto shadow-md  rounded-md ">
            <div className="flex justify-between items-center text-sm p-2 font-semibold">
                <h1 >Recent Users</h1>
                <Button gradientDuoTone={"purpleToPink"} outline>
                    <Link to={"/dashboard?tab=users"}>See all</Link>
                </Button>
            </div>
            <Table hoverable className="text-center">
                <Table.Head>
                    <Table.HeadCell>User Image</Table.HeadCell>
                    <Table.HeadCell>Username</Table.HeadCell>
                </Table.Head>

<Table.Body className="divide-y">

    {

        users &&

        users.map((user,index)=>{

            return (
                
                <Table.Row key={user._id} className="bg-white dark:border-gray-700 dark:bg-gray-800 w-full sm:w-auto cursor-pointer">
                <Table.Cell>
                    <img src={user.profilePicture} className="w-16 h-16 rounded-full" alt={`profile image of ${user.username}`} />
                </Table.Cell>
                <Table.Cell>{user.username}</Table.Cell>
                </Table.Row>
                
            )

        })
    }
</Table.Body>
            </Table>
         </div>

         {/* posts */}
         <div className=" flex flex-col p-2 dark:bg-gray-800 w-full sm:w-auto shadow-md  rounded-md ">
            <div className="flex justify-between items-center text-sm p-2 font-semibold">
                <h1 >Recent Posts</h1>
                <Button gradientDuoTone={"purpleToPink"} outline>
                    <Link to={"/dashboard?tab=posts"}>See all</Link>
                </Button>
            </div>
            <Table hoverable >
                <Table.Head>
                    <Table.HeadCell>Post Image</Table.HeadCell>
                    <Table.HeadCell>Post Title</Table.HeadCell>
                    <Table.HeadCell>Post Category</Table.HeadCell>
                </Table.Head>

<Table.Body className="divide-y">

    {

        posts &&

        posts.map((post,index)=>{

            return (
                
                <Table.Row key={post._id} className="bg-white dark:border-gray-700 dark:bg-gray-800 cursor-pointer">
                <Table.Cell>
                    <img src={post.postImage} className="w-18 h-16 rounded-sm" alt={`profile image of ${post.title}`} />
                </Table.Cell>
                <Table.Cell> <p className="text-xs line-clamp-3">{post.title.length>15?post.title.slice(0,15)+"...":post.title}</p></Table.Cell>
                <Table.Cell>{post.category}</Table.Cell>
                </Table.Row>
                
            )

        })
    }
</Table.Body>
            </Table>
         </div>

         {/* comments */}
         <div className=" flex flex-col p-2 dark:bg-gray-800 shadow-md  rounded-md ">
            <div className="flex justify-between items-center text-sm p-2 font-semibold">
                <h1 >Recent Comments</h1>
                <Button gradientDuoTone={"purpleToPink"} outline>
                    <Link to={"/dashboard?tab=comments"}>See all</Link>
                </Button>
            </div>
            <Table hoverable >
                <Table.Head>
                    <Table.HeadCell>Content</Table.HeadCell>
                    <Table.HeadCell>Likes</Table.HeadCell>
                </Table.Head>

<Table.Body className="divide-y">

    {

        comments &&

        comments.map((comment,index)=>{

            return (
                
                <Table.Row key={comment._id} className="bg-white dark:border-gray-700 dark:bg-gray-800 cursor-pointer">
              <Table.Cell  className="w-96"><p >{comment.content.length > 20? comment.content.slice(0,20)+"...":comment.content}</p></Table.Cell>
                <Table.Cell>{comment.numberofLikes}</Table.Cell>
                </Table.Row>
                
            )

        })
    }
</Table.Body>
            </Table>
         </div>
      </div>
    </div>
  );
};

export default DashComp;
