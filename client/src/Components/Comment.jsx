import React, { useEffect, useState } from 'react'
import { FaThumbsUp } from "react-icons/fa";
import axios from 'axios';
import { useSelector } from 'react-redux';
import moment from "moment";
import { Textarea } from 'flowbite-react';
import { Button } from 'flowbite-react';

const Comment = ({userId,date,content,totallikes,id,onLike,likes,onDelete,onEdit}) => {


    const {currentUser} = useSelector(state=>state.user);
    const [user,setUser] = useState({});
    const [editedContent,setEditedContent] = useState(content);
    const [isEditing,setIsEditing] = useState(false);
  

const getUser = async () =>{

    try {
        
        await axios.get(`http://localhost:8000/api/user/getuser/${userId}`,{
            withCredentials:true
        }).then((res)=>{
             setUser(res.data.user);
        }).catch((err)=>{
               
        })
    } catch (error) {
        console.log(error);
    }
}




useEffect(()=>{
   getUser()
},[])
if(currentUser){
    return (
        <div className="flex flex-col gap-2 mt-3">
       {
        isEditing?(
            <>
             <div className="flex items-center gap-3">
            <img src={user && user.profilePicture} alt="image" className="w-10 h-10 rounded-full"/>
            <span className="text-sm  text-gray-600 truncate">@{user.username?user.username:"anynomous user"} ({moment(date).fromNow()})</span>
        </div>
            <Textarea maxLength={"200"} rows={"3"}
            value={editedContent}
               onChange={(e)=> setEditedContent(e.target.value)}
            />
            <div className="flex gap-2 ml-auto">
                <Button size={"sm"} gradientDuoTone={"purpleToPink"} onClick={()=> {onEdit(id,editedContent)
                setIsEditing(false)} } outline>Save</Button>
                   <Button size={"sm"} color='gray' onClick={()=> setIsEditing(false)}>Cancel</Button>
            </div>
            </>
        ):<>
         <div className="flex items-center gap-3">
            <img src={user && user.profilePicture} alt="image" className="w-10 h-10 rounded-full"/>
            <span className="text-sm  text-gray-600 truncate">@{user.username?user.username:"anynomous user"} ({moment(date).fromNow()})</span>
        </div>
        <div className=" pl-14 text-sm">
            {content}
        </div>
        <div className="pl-14 flex gap-2 items-center border-b-2 pb-4">
           
        <FaThumbsUp onClick={()=> onLike(id)} className={currentUser && likes.includes(currentUser.rest._id)?"cursor-pointer text-blue-500":"cursor-pointer text-gray-500"}/>
          <span className="text-xs" >{totallikes > 0  && totallikes+ " " +(totallikes === 1?"like":"likes")}  </span>
          { currentUser && (currentUser.rest._id === userId  || currentUser.rest.isAdmin) && 
      <>
      <span className="text-xs underline text-blue-600 cursor-pointer" onClick={()=> setIsEditing(true)}>Edit</span>
          <span className="text-xs underline text-red-700 cursor-pointer" onClick={onDelete} >Delete</span>
           
      </>
          
    }
         
        </div>
        </>
       }
    </div>
      )
}
  
}
// 

export default Comment
