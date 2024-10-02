import React from "react";

const About = () => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className=" max-w-2xl mx-auto">
        <h1 className="text-3xl font-semibold text-center my-7">About Abiskar's Blog</h1>
        <div className="flex flex-col mt-4 gap-6 text-center max-w-2xl ">
          <p>
            Hello Everyone! Welcome to Abiskar Blog. I have created this app for
            my learning project and to share my idea and informations to outside
            world through this app.
          </p>
          <p>
            In this project, you can search for any articles realted to web
            development,software engineering and programming languages. I will
            create lots of posts and makke available for all of you.
          </p>
          <p>
            .I have used MERN stack to implement this project.To create this
            post I have made lots of efforts.Please visit my app by simply login
            into it and send your feedback in the comment section of posts.I
            hope you will find somethig informative in my website
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
