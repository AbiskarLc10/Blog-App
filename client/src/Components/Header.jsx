import React,{useContext, useEffect, useState} from "react";
import { Avatar, Button, Dropdown, DropdownItem, Navbar, TextInput, theme } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa6";
import { useLocation } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import  {toggleTheme} from "../redux/theme/themeSlice"
import { stateContext } from "../Context/BlogContext";

const Header = () => {


  const context = useContext(stateContext);
  const [searchTerm,setSearchTerm] = useState(null);
  const {handleSignOut} = context;
  const { currentUser } = useSelector((state) => state.user);
  const {theme} = useSelector(state=>state.theme)
const dispatch = useDispatch();
  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate();
const [active,setActive] = useState(false);
  useEffect(()=>{

    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm")
    if(searchTermFromUrl){
      setSearchTerm(searchTermFromUrl);
    }
  },[location.search])

  const handleSubmit = (e) =>{

    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm',searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }
  return (
    <>
      <Navbar className=" border-b-2">
        <Link
          to={"/"}
          className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
        >
          <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 via-green-400 to-pink-500 rounded-lg text-white">
            Abiskar's
          </span>
          Blog
        </Link>
        <form onSubmit={handleSubmit}>
          <TextInput
            type="text"
            placeholder="Search..."
            rightIcon={AiOutlineSearch}
            className={"hidden lg:inline"}
            onChange={(e)=> setSearchTerm(e.target.value)}
          ></TextInput>
        </form>
        <Button className="w-12 h-10 lg:hidden" color="gray" pill>
          <AiOutlineSearch />
        </Button>
        <div className="flex gap-2 md:order-2">
          <Button className="w-12 h-10  lg:inline cursor-pointer" color="gray" onClick={()=>dispatch(toggleTheme())} pill>

{
  theme==="light"? <FaMoon />: <FaSun/>
}
           
          </Button>
          {currentUser ? (
            <>
              <Dropdown arrowIcon={false} inline label={
                <Avatar alt="user" img={currentUser.rest.profilePicture} rounded/>
              }>
                <Dropdown.Header>
                  <span className="text-sm block">@{currentUser.rest.username}</span>
                  <span className="text-sm block font-medium truncate">{currentUser.rest.email}</span>
                </Dropdown.Header>
                <Link to={"/dashboard?tab=profile"}>
                  <DropdownItem>Profile</DropdownItem>
                </Link>
                <Dropdown.Divider/>
                <DropdownItem onClick={handleSignOut}>Sign Out</DropdownItem>
              </Dropdown>
            </>
          ) : (
            <>
              <Link to={"/signup"}>
                <Button gradientDuoTone={"purpleToBlue"} outline>
                  Sign Up
                </Button>
              </Link>
            </>
          )}

          <Navbar.Toggle />
        </div>

        <Navbar.Collapse>
          <Navbar.Link
            active={path === "/"}
            className=" font-bold text-base"
            as={"div"}
          >
            <Link to={"/"}>Home</Link>
          </Navbar.Link>
          <Navbar.Link
            active={path === "/about"}
            className=" font-bold text-base"
            as={"div"}
          >
            <Link to={"/about"}>About</Link>
          </Navbar.Link>
          <Navbar.Link
            active={path === "/project"}
            className=" font-bold text-base"
            as={"div"}
          >
            <Link to={"/project"}>Projects</Link>
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default Header;
