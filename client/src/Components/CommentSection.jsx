import { Alert, Button, Modal, Textarea } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import Comment from "./Comment";
import {HiOutlineExclamationCircle} from "react-icons/hi"

const CommentSection = ({ postid }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [postcomments, setPostComments] = useState([]);
  const [content, setContent] = useState("");
  const [errormessage, setErrorMessage] = useState(null);
  const [showmodal,setShowModal] = useState({
    id:null,
    show:false
  });
  const handleTextChange = (e) => {
   
    setContent(e.target.value);
  };



  const getAllComments = async () => {
    try {
      await axios
        .get(`http://localhost:8000/api/comment//getComments/${postid}`, {
          withCredentials: true,
        })
        .then((res) => {
          setPostComments(res.data.comments)
        })
        .catch((err) => {
          setErrorMessage(err.response.data.message);
        });

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(()=>{
  getAllComments();
  },[postid])
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios
        .post("http://localhost:8000/api/comment/postComment", {
          content,
          postId:postid,
          userId: currentUser.rest._id
        }, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        })
        .then((res) => {
          console.log(res.data.message);
          setErrorMessage(null);
          setContent("");
        })
        .catch((err) => {
          setErrorMessage(err.response.data.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () =>{

    const id = showmodal.id;
    try {
      
      await axios.delete(`http://localhost:8000/api/comment/deleteComment/${id}`,{
        withCredentials:true
      }).then((res)=>{
         setShowModal({show:false,id:null})
         setErrorMessage(null);
        console.log(res.data.comment);
        setPostComments(
          postcomments.filter((comment)=>{

            return comment._id !== id;
          })
        )
      }).catch((err)=>{
        setShowModal({show:false,id:null})
        setErrorMessage(err.response.data.message);
      })
      

    } catch (error) {
      setErrorMessage(null);
      setShowModal({show:false,id:null})
    }

  }

  const handleEdit = async (id,editedContent) =>{
    try {
      
      await axios.put(`http://localhost:8000/api/comment/editComment/${id}`,{
        content:editedContent
      },{
        withCredentials:true,
        headers:{
          "Content-Type":"application/json"
        }
      }).then((res)=>{

        const editedcomment = res.data.editedComment;
        setErrorMessage(null);
        setPostComments(
          postcomments.map((comment)=>{
               return comment._id === id? {
                 ...comment,
                  content: editedcomment.content
               } : comment
          })
        )
      }).catch((err)=>{
        setErrorMessage(err.response.data.message);
      })
    } catch (error) {
      
      console.log(error);
    }
  }
  const handleLike = async (commentId) =>{

    try {
        if(!currentUser){
          return;
        }
        
        await axios.put(`http://localhost:8000/api/comment/likeComment/${commentId}`,null,
        {
            withCredentials:true
        }).then((res)=>{
          const data = res.data.comment;
          setPostComments(
            postcomments.map((comment) => {
              return comment._id === commentId ? {
                ...comment,
                likes: data.likes,
                numberofLikes: data.numberofLikes
              } : comment;
            })
          );
          
        }).catch((err)=>{

          setErrorMessage(err.response.data.message);
        })
    } catch (error) {
        console.log(error);
    }

}

  if (errormessage) {
    setTimeout(() => {
      setErrorMessage(null);
    }, 4000);
  }
  return (
    <div className="max-w-4xl mx-auto w-full">
      {currentUser ? (
        <div className="flex gap-2 items-center mt-5 ">
          <p className="text-sm font-semibold">Signed in as:</p>
          <img
            src={currentUser.rest.profilePicture}
            className="w-10 cursor-pointer  h-10 rounded-full"
            alt={`profilePicture of ${currentUser.rest.username}`}
          />
          <Link
            to={"/dashboard?tab=profile"}
            className="text-xs text-cyan-600 hover:underline"
          >
            @{currentUser.rest.username}
          </Link>
        </div>
      ) : (
        <div className="my-5 text-md text-cyan-600 flex gap-2">
          <p>You must be signed in to add a comment:</p>
          <Link to={"/login"} className="hover:underline hover:text-red-600">
            Login
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          className="mt-3 p-4 border-2 border-teal-400 rounded-lg"
          onSubmit={handleSubmit}
        >
          <Textarea
            rows={"3"}
            maxLength={"200"}
            placeholder="Write a comment..."
            onChange={handleTextChange}
            value={content}
          />

          <div className="text-sm mt-2 text-gray-500 flex justify-between">
            <p className=" capitalize">
              remaining character: {200 - content.length}
            </p>
            <Button type="submit" gradientDuoTone={"purpleToBlue"} outline>
              Submit
            </Button>
          </div>
          {errormessage && (
            <Alert className="mt-2" color={"failure"}>
              <span>{errormessage}</span>
            </Alert>
          )}
        </form>
      )}
      {
        postcomments.length === 0?(
            <>
            <div className="mt-4 border-2 p-3">
            <h2 className="text-xl font-semibold ">No Comments to Show</h2>

            </div>
            </>
        ):(<>
        <div className="mt-4 border-2 p-3">
            <h2 className="text-2xl font-semibold">Comments: {currentUser && postcomments.length}</h2>
            {
                 postcomments.map((comment,index)=>{
                    return(
                        <div key={index}>
                        <Comment id={comment._id} userId={comment.userId} date={comment.updatedAt} likes={comment.likes} totallikes={comment.numberofLikes} onEdit={(id,editedContent)=> handleEdit(id,editedContent)} onDelete={()=>setShowModal({id:comment._id,show:true})}  onLike={handleLike} content={comment.content}/>
                        </div>
                    )

                 })

            }
        </div>
        </>)
      }
      {
       <Modal show={showmodal.show} size={'md'} onClose={()=> setShowModal({show:false,id:null})} popup >
       <Modal.Header >
         <Modal.Body>
           <div className="text-center">
              <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto"/>
              <h1 className="text-lh mb-5 text-gray-500 dark:text-gray-200">Are you sure you want to delete this post?</h1>
           </div>
           <div className="flex justify-center gap-4 p-1">
             <Button color="failure"  onClick={handleDelete}>Yes, I'm sure</Button>
             <Button color="gray" onClick={()=> setShowModal(false)}>Cancel</Button>
           </div>
         </Modal.Body>
       </Modal.Header>
     </Modal>
      }
    </div>
  );
};

export default CommentSection;
