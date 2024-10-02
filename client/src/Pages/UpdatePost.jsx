import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Button, Label, Select, TextInput, FileInput, Alert } from "flowbite-react";
import ReactQuill from "react-quill";
import {useNavigate, useParams} from "react-router-dom"
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import "react-quill/dist/quill.snow.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const UpdatePost = () => {

  const {postid} = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError,setPublishError] = useState(null)
  const [postCreated,setPostCreated] = useState(false)
  const [message,setMessage] = useState(null);

  const { currentUser } = useSelector((state) => state.user);
   const {_id} = currentUser.rest
  const handleUploadFile = async () => {
    if (!file) {
      setImageUploadError("please select a file");
      return;
    }
    setImageUploadError(null);
    try {
      const storage = getStorage(app);
      const filename = new Date().getTime() + "-" + file.filename;
      const storageRef = ref(storage, filename);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
          console.log(`File is uploaded ${progress.toFixed(0)}%`);
        },
        (error) => {
          setImageUploadProgress(null);
          setImageUploadError("unable to upload image");
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, postImage: downloadUrl });
          });
        }
      );
    } catch (error) {
      console.log(error);
      setImageUploadError("Failed to upload");
    }
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const getData = async () =>{


    try {
        
      await axios.get(`http://localhost:8000/api/admin/getposts?postId=${postid}`,{
        withCredentials:true,
      }).then((res)=>{
         setPublishError(null)
        setFormData(res.data.posts[0]);
      }).catch((err)=>{
            setPublishError(err.response.data.message)
        console.log(err.data);
      })
    } catch (error) {
        console.log(error);
    }
  }

  useEffect(()=>{
    getData();
  },[])

  const handleSubmit = async (e) =>{

e.preventDefault();
    try {

      await axios.put(`http://localhost:8000/api/admin/updatepost/${postid}/${_id}`,
      formData,
      {
        withCredentials:true,
        headers:{
          "Content-Type":"application/json"
        }
      }).then((res)=>{
        setPublishError(null);
        setPostCreated(true)
        setMessage(res.data.message)
       navigate("/dashboard?tab=posts")
       
      }).catch((error)=>{

        console.log(error.response.data);
      setPublishError(error.response.data.message);
       console.log(publishError);
      })
      
    } catch (error) {
      setPublishError("Something went wrong");
    }

  }
  return (
    <>
      <div className="w-full mx-auto p-3 max-w-3xl min-h-screen">
        <h1 className="text-center text-2xl my-7 font-semibold">
          Update post
        </h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {
               postCreated && 
               <Alert color={"success"}>
                   <span>{message}</span>
               </Alert>
          }
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <TextInput
              type="text"
              placeholder="Title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              className="flex-1"
            />
            <Select
              name="category"
              id="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value={"uncategorised"} >Select a category</option>
              <option value="javascript">Javascript</option>
              <option value="react.js">React.js</option>
              <option value="next.js">Next.js</option>
            </Select>
          </div>
          <div className="flex  sm:flex-row gap-4 items-center justify-between p-1 border-4 border-l-teal-500 border-dotted">
            <FileInput
              type="file"
              accept="images/*"
              onChange={(e) => setFile(e.target.files[0])}
              id="image"
              className="p-1"
            />
            <Button gradientDuoTone={"purpleToBlue"} onClick={handleUploadFile} disabled={imageUploadProgress}>
              {
                imageUploadProgress?
                <CircularProgressbar className="w-16 h-16" value={imageUploadProgress} text={`${imageUploadProgress}%`}/>:
                  " Upload file"
              }
             
            </Button>
          </div>
          {
            imageUploadError && 
            (
              <Alert color={"failure"} >
                <span>{imageUploadError}</span>
              </Alert>
            )
          }
          {
            formData.postImage &&
            (
             <img src={formData.postImage} alt="post image" className="w-full h-auto" />
            )
          }
          <ReactQuill
            theme="snow"
            value={formData.content}
            onChange={(value)=>{
              setFormData({
                ...formData,
                content: value
              })
            }}
            className="dark:bg-white h-72 mb-12 dark:text-black"
            placeholder="Write Something...."
            required
          />
          <Button gradientDuoTone={"purpleToPink"} type="submit">
            Update
          </Button>
          {
            publishError &&
            <Alert color={"failure"}>{publishError}</Alert>
          }
        </form>
      </div>
    </>
  );
};

export default UpdatePost;
