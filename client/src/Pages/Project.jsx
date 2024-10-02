import React from 'react'
import CallToAction from '../Components/CallToAction'
const Project = () => {
  return (
    <div className='min-h-screen flex justify-center items-center'>
    <div className='flex flex-col gap-8 max-w-4xl'>
      <div className='flex flex-col text-center gap-3'>
        <h1 className='text-2xl font-semibold '>Projects</h1>
         <p>Have fun Building projects with html,css and javascript</p>
      </div>
      <div className='p-4'>
       <CallToAction
       image="https://i1.faceprep.in/fp/skillboard/img/90765_1643367377.png"
          heading="Want to learn HTML,CSS and Javascript by building fun and engaging projects?"
          ptext="Check our website and get started with us"
          btntext="Check our 100 projects"/>
      </div>
    </div>
    </div>
  )
}

export default Project
