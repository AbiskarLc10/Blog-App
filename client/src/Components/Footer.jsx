import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebook,FaInstagram,FaYoutube,FaDiscord, Fa0 } from 'react-icons/fa6'

const Footer = () => {
  return (
    <footer className=' px-3 mt-16 md:mt-2 pt-4 border-t-4 border-t-teal-600 rounded-lg border-b-2 shadow-sm'>
      <Link to={"/"} className=' block md:text-2xl font-bold pb-4'>
        <span className='px-2 py-1 md:text-2xl bg-gradient-to-r from-indigo-500 via-purple-500 via-green-400 to-pink-500 rounded-lg text-white'>Abiskar's</span>
        Blog
      </Link>
    <div className=' grid md:grid-cols-3 gap-6 auto-fit '>
      <div className="flex flex-col gap-2  text-gray-400  ">
        <h6 className=' font-bold md:text-xl  uppercase'>About</h6>
       <Link  className='hover:underline'> <p className='font-semibold'>Follow us</p> </Link>
       <Link className='hover:underline' to={"/"}> <p className='font-semibold'>Abiskar's Blog</p></Link>
      </div>
      <div className="flex flex-col gap-2  text-gray-400  ">
        <h6 className=' font-bold md:text-xl  uppercase'>follow us</h6>
       <Link target='_blank' className='hover:underline' to={"https://github.com/AbiskarLc"}> <p className='font-semibold'>Github</p></Link>
       <Link target='_blank' className='hover:underline'  to={"https://www.discord.com"}> <p className='font-semibold'>Discord</p></Link>
      </div>
      <div className="flex flex-col gap-2  text-gray-400  ">
        <h6 className=' font-bold md:text-xl  uppercase'>Legal</h6>
       <Link className='hover:underline'> <p className='font-semibold'>privacy policy</p></Link>
       <Link className='hover:underline'> <p className='font-semibold'>Terms & Conditions</p></Link>
      </div>
    
    </div>
    <div className="md:pt-6 pt-3 flex flex-col  md:justify-center md:items-center">
        <span> © <span>{new Date().getFullYear()} </span>Abiskar Blog </span>
        <div className="flex py-3 text-2xl md:text-3xl gap-2">
        <Link to={"https://www.facebook.com/abiskar.neymar"} target='_blank'  > <FaFacebook  className=' text-blue-600 hover:text-gray-400 cursor-pointer'/></Link>
        <Link to={"https://www.instagram.com/abiskarlc/"} target='_blank'>   <FaInstagram  className='text-red-500 hover:text-gray-400 cursor-pointer'/></Link>
        <Link to={"https://www.youtube.com"} target='_blank'  > <FaYoutube className=' text-red-500 hover:text-gray-400  cursor-pointer'/></Link>
       <Link to={"https://www.discord.com"} target='_blank'  > <FaDiscord  className='text-purple-600 hover:text-gray-400 cursor-pointer'/></Link>
        </div>
    </div>
    </footer>
  )
}

export default Footer
