import React, { useEffect, useState } from "react";
import axios from "axios";
import {Link} from "react-router-dom"
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {
  Modal,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
const DashPosts = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { _id, isAdmin } = currentUser.rest;
  const [post, setPost] = useState([]);
  const [showMore,setShowMore] = useState(true);
  const [showModal,setShowModal] = useState({
    show:false,
    id:null
  });
  const fetchAllPosts = async () => {
    try {
      await axios
        .get(`http://localhost:8000/api/admin/getposts`, {
          withCredentials: true,
        })
        .then((res) => {
          console.log(res.data);
          setPost(res.data.posts);
          if(res.data.posts.length<9){
            setShowMore(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });

     
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowMore = async () =>{

    try {
      const startIndex = post.length;
      await axios.get(`http://localhost:8000/api/admin/getposts?userId=${_id}&startIndex=${startIndex}`,
      {
        withCredentials:true
      }).then((res)=>{

        console.log(res.data);
        
      setPost((prev)=>{
        return(
          [
            ...prev,
            ...res.data.posts
          ]
        )
      })
       if(res.data.posts.length < 9){
        setShowMore(false);
       }

      }).catch((err)=>{
       console.log(err.data.message)
      })
    } catch (error) {
      console.log(error.message)
    }
  }

  const deletePost = async (id) =>{

    try {
      await axios.delete(`http://localhost:8000/api/admin/deletepost/${id}`,{
        withCredentials:true
      }).then((res)=>{
           setPost((prev)=> prev.filter((post)=> post._id !== id));
           setShowModal(false);
      }).catch((err)=>{
        setShowModal(false);
        console.log(err);
      })
    } catch (error) {
      setShowModal(false);
      console.log(error);
    }
  }
  useEffect(() => {

    if(isAdmin){

      fetchAllPosts();
    }

  }, [currentUser._id]);
  return (
    <div className="min-h-screen  md:mx-auto overflow-x-auto p-3 scrollbar scrollbar-track-slate-300 scrollbar-thumb-slate-400 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-800">
      {isAdmin && post.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <TableHead>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </TableHead>
            <Table.Body>
              {post.map((epost, index) => {

                return (
                  <Table.Row className=" cursor-pointer" key={epost._id}>
                    <Table.Cell className="text-sm font-semibold text-start">{new Date(epost.updatedAt).toLocaleDateString()}</Table.Cell>
                    <Table.Cell>
                      <Link to={`/post/${epost.slug}`} >
                      <img src={epost.postImage} className=" min-w-22 w-22 h-16 bg-gray-500 object-cover" alt={`post-${epost.category}-image`}  />
                      </Link>
                    </Table.Cell>
                    <Table.Cell className="text-sm  font-semibold text-start"><Link to={`/post/${epost.slug}`}>{epost.title}</Link></Table.Cell>
                    <Table.Cell className="text-sm  font-semibold text-start">{epost.category}</Table.Cell>
                    <Table.Cell> <span className=" text-red-500 underline" onClick={()=> setShowModal({show:true,id:epost._id})}>Delete</span></Table.Cell>
                    <Table.Cell> <Link to={`/update-post/${epost._id}`}><span  className=" text-green-500 underline">Edit</span></Link></Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
          {
            
            showMore &&
            <Button className="py-3 self-center text-teal-400 dark:text-gray-800 w-full text-sm" onClick={handleShowMore}>
              Show more
            </Button>
          }
        </>
      ) : (
        <p className="pt-3 text-center text-2xl dark:text-gray-200">
          No posts Available
        </p>
      )}
          <Modal show={showModal.show} size={'md'} onClose={()=> setShowModal({show:false,id:null})} popup >
    <Modal.Header >
      <Modal.Body>
        <div className="text-center">
           <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto"/>
           <h1 className="text-lh mb-5 text-gray-500 dark:text-gray-200">Are you sure you want to delete this post?</h1>
        </div>
        <div className="flex justify-center gap-4 p-1">
          <Button color="failure" onClick={()=>deletePost(showModal.id)} >Yes, I'm sure</Button>
          <Button color="gray" onClick={()=> setShowModal(false)}>Cancel</Button>
        </div>
      </Modal.Body>
    </Modal.Header>
  </Modal>
    </div>
  );
};

export default DashPosts;
