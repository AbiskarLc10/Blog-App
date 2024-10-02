import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Button, Spinner } from "flowbite-react";
import CallToAction from "../Components/CallToAction";
import CommentSection from "../Components/CommentSection";
import RecentPost from "../Components/RecentPost";

const Postpage = () => {

    const [post, setPost] = useState({ content: "" });
  const { postslug } = useParams();
  const [loading, setLoading] = useState(false);

  const fetchPost = async () => {
    try {
      setLoading(true);
      await axios
        .get(`http://localhost:8000/api/admin/getposts?slug=${postslug}`, {
          withCredentials: true,
        })
        .then((res) => {
          setLoading(false);
          setPost(res.data.posts[0]);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    console.log(postslug);
    fetchPost();
  }, [postslug]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spinner size={"xl"} />
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen mx-auto flex flex-col max-w-6xl p-3">
        <h1 className="text-center text-3xl text-gray-700 dark:text-gray-200 lg:text-2xl mx-auto font-serif">
          {post && post.title}
        </h1>

        <Link to={`/search?category=${post && post.category}`}>
          <Button
            className="mt-5 self-center mx-auto"
            color="gray"
            pill
            size={"xs"}
          >
            {post && post.category}
          </Button>
        </Link>

        <img
          src={post && post.postImage}
          className="p-3 max-h-[600px] object-cover w-full mt-8"
          alt={`post image on:${post.category}`}
        />
        <div className="flex justify-between p-3 border-b border-slate-500 mx-auto max-w-2xl md:max-w-6xl w-full text-xs font-semibold">
          <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
          <span>
            {post && (post.content.length / 1000).toFixed(0)}mins read
          </span>
        </div>
        <div
          className="post-content p-3 mx-auto max-w-4xl text-justify"
          dangerouslySetInnerHTML={{ __html: post && post.content }}
        ></div>
        <div className="max-w-4xl mx-auto mt-4 text-center">
          <CallToAction
            image="https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210712212601/Top-10-Front-End-Web-Development-Projects-for-Beginners.png"
            heading="Want to learn HTML,CSS and Javascript by building fun and engaging projects?"
            ptext="Check our website and get started with us"
            btntext="Check our 100 projects"
          />
        </div>
        <CommentSection postid={post._id}/>

        <RecentPost />
      </main>
    </>
  );
};

export default Postpage;
