import { Button, ButtonGroup, Label, Modal, Spinner, TextInput } from "flowbite-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { toast } from "react-toastify";
import {HiOutlineExclamationCircle} from "react-icons/hi"
import {Link, useNavigate} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateSuccess,updateStart,updateFailure,deleteStart,deleteSuccess,deleteFailure,signOut } from "../redux/user/userSlice";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import axios from "axios";
import { app } from "../firebase";
import { stateContext } from "../Context/BlogContext";

const DashProfile = () => {


  const context = useContext(stateContext);
  const {handleSignOut} = context;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showModel,setShowModel] = useState(false);
  const [imageFileUploading,setImageFileUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [formdata,setformData] = useState({});
  const filePickerRef = useRef();
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };



  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {

    setImageFileUploading(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageref = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageref, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageUploadError(
          "Could not upload image (file must be less than 2MB)"
        );
        setImageFileUploading(false);
        setImageFile(null);
        setImageFileUrl(null);
        setImageUploadProgress(null);
        toast.error("Could not upload image (file must be less than 2MB)");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageFileUrl(downloadUrl);
          setImageFileUploading(false);
          setformData({...formdata,profilePicture:downloadUrl});
          setImageUploadProgress(null);
        });
      }
    );
  };

  const handleOnChange = (e) =>{

    setformData({
      ...formdata,
      [e.target.name]:e.target.value
    });
  }

  const handleSubmit = async (e)=>{
  e.preventDefault();

  if(Object.keys(formdata).length === 0){
    toast.error("No Changes made to update");
    return;
  }
  if(imageFileUploading){
    return;
  }
  try {
console.log(currentUser.rest._id);
    dispatch(updateStart());
    await axios.put(`http://localhost:8000/api/user/update/${currentUser.rest._id}`,
    formdata,
    {
      withCredentials:true,
      headers:{
        "Content-Type":"application/json"
      }
    }).then((res)=>{
         dispatch(updateSuccess(res.data));
         toast.success(res.data.message);
    }).catch((err)=>{
      const  {message,extraDetails} = err.response.data;
      dispatch(updateFailure(message));
        toast.error(extraDetails?extraDetails:message);
    })
  } catch (error) {
    dispatch(signInFailure(error.message))
  }
  }


  const handleDelete = async () =>{

    const id = currentUser.rest._id;

    try {
 
      dispatch(deleteStart());
      await axios.delete(`http://localhost:8000/api/user/delete/${id}`,{
        withCredentials:true,
        headers:{
          "Content-Type":"application/json"
        }
      }).then((res)=>{
        dispatch(deleteSuccess());
        toast.success(res.data.message);
        setShowModel(false);
      }).catch((error)=>{
        dispatch(deleteFailure(error.data.message));
        toast.error(error.data.message);
        toast.error(error.data.extraDetails);
        setShowModel(false);
      })
      
    } catch (error) {
      setShowModel(false);
      dispatch(deleteFailure(error));
    }
  }

 
  const { currentUser,loading } = useSelector((state) => state.user);

  const {isAdmin} = currentUser.rest;
  return (
    <>
    <div className="mx-auto max-w-lg p-3 w-full">
      <h1 className="text-center my-7 text-3xl font-semibold">Profile</h1>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          className=" hidden"
        />
        <div
          className= " relative w-32 h-32 cursor-pointer mx-auto  shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
            {
                imageUploadProgress && (
                    <CircularProgressbar
                      value={imageUploadProgress}
                      text={`${imageUploadProgress}%`}
                      strokeWidth={4}
                      styles={
                        {
                            root:{
                                width:"100%",
                                height:"100%",
                                position:"absolute",
                                top:0,
                                left:0
                            },
                            path:{
                                stroke:`rgba(62,192,28,${imageUploadProgress/100})`
                            }
                        }
                      }
                      />
                ) 
            }
         <img
                src={imageFileUrl || currentUser.rest.profilePicture}
                alt="Profile"
                className={`rounded-full w-full h-full object-cover text-center border-gray-100 border-4 ${imageUploadProgress && imageUploadProgress < 100? " opacity-60":"opacity-100"}`}
              />
        </div>
        <TextInput
          autoComplete="off"
          type="text"
          onChange={handleOnChange}
          id="username"
          name="username"
          defaultValue={currentUser.rest.username}
          placeholder="username"
        />
        <TextInput
          autoComplete="off"
          type="email"
          name="email"
          id="email"
          value={currentUser.rest.email}
          placeholder="username"
          readOnly
        />
        <TextInput
          autoComplete="off"
          onChange={handleOnChange}
          type="password"
          name="password"
          id="password"
          placeholder="Update your password"
        />
        <Button gradientDuoTone={"purpleToBlue"} type="submit" outline disabled={loading || imageFileUploading}>
         {
          loading?<><Spinner size={"sm"} /><span className="pl-3">...Loading</span></>:"Update"
         }
        </Button>
        {
          isAdmin && (
            <Button type="button"  gradientDuoTone={"purpleToPink"} ><Link  to={"/create-post"} className="w-full block">Create a Post</Link></Button>
          )
        }
      </form>
      <div className="flex justify-between mt-3 text-red-400">
        <span className="cursor-pointer hover:underline" onClick={()=> setShowModel(true)}>Delete Account</span>
        <span className="cursor-pointer hover:underline" onClick={handleSignOut}>SignOut</span>
      </div>

      <Modal show={showModel} size={'md'} onClose={()=> setShowModel(false)} popup >
    <Modal.Header >
      <Modal.Body>
        <div className="text-center">
           <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto"/>
           <h1 className="text-lh mb-5 text-gray-500 dark:text-gray-200">Are you sure you want to delete this account?</h1>
        </div>
        <div className="flex justify-center gap-4 p-1">
          <Button color="failure" onClick={handleDelete} >Yes, I'm sure</Button>
          <Button color="gray" onClick={()=> setShowModel(false)}>Cancel</Button>
        </div>
      </Modal.Body>
    </Modal.Header>
  </Modal>
    </div>
  </>
  );
};

export default DashProfile;
