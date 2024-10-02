import { Button } from 'flowbite-react'
import React from 'react'

const CallToAction = (props) => {
  return (
    <div className='p-7 grid sm:grid-cols-2 border-2 gap-3 rounded-tl-xl rounded-br-xl'>
       <div className="flex flex-col gap-3">
        <h1 className='text-xl md:text-2xl font-semibold '>{props.heading}</h1>
        <p className='text-sm  md:text-lg'>{props.ptext}</p>
        <Button className=' rounded-tl-xl rounded-br-xl' gradientDuoTone={"purpleToPink"} outline>
            <a href="https://www.100jsprojects.com" target='__blank' >{props.btntext}</a></Button>
       </div>
       <div className=' w-full flex justify-center items-center'>
        <img src={props.image} className='w-full h-40 md:h-auto rounded-lg' alt="" srcSet="" />
       </div>
    </div>
  )
}

export default CallToAction
