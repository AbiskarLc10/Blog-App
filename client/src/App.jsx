import "./App.css";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Project from "./Pages/Project";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import PrivateRoute from "./Components/PrivateRoute";
import OnlyAdminRoute from "./Components/OnlyAdminRoute";
import Createpost from "./Pages/Createpost";
import UpdatePost from "./Pages/UpdatePost";
import Postpage from "./Pages/Postpage";
import ScrollToTop from "./Components/ScrollToTop";
import Search from "./Pages/Search";

function App() {
  return (
    <>
    <ScrollToTop/>
      <Header />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        bodyClassName="toastBody"
        c
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
<Route element={<OnlyAdminRoute/>}>
  <Route path="/create-post" element={<Createpost/>}/>
  <Route path="/update-post/:postid" element={<UpdatePost/>}/>
</Route>
        <Route path="/login" element={<Login />} />
        <Route path="/Project" element={<Project />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/search" element={<Search/>} />
        <Route path="/post/:postslug" element={<Postpage />} />
         
      </Routes>
      <Footer />
    </>
  );
}

export default App;
