
import React from 'react'
import { Link } from 'react-router-dom'

const PostCard = ({image,title,category,slug}) => {
  return (
    <>
      <div className='flex group relative flex-col  border-2 overflow-hidden rounded-t-2xl border-teal-400 cursor-pointer transition duration-1000 hover:-translate-y-2 '>
        <div>
            <img src={image} alt={slug} className='rounded-t-2xl cursor-pointer w-full md:h-40'/>
          
        </div>
        <div className='pl-2 flex flex-col gap-1  min-h-24  border-t-2 border-teal-400'>
          <p className='text-sm font-semibold'>{title.length>60?title.slice(0,60)+"...":title}</p>
          <span className='text-xs'>{category}</span>


          <Link to={`/post/${slug}`} className=' z-10 group-hover:bottom-0 absolute bottom-[-200px] right-0 left-0 border-2 border-teal-500 text-center hover:bg-teal-500 hover:text-gray-200 transition-all rounded-b-lg mx-1 mb-1 '>
            Read more
            
            </Link>
        </div>
      </div>
    </>
  )
}

export default PostCard
