import React from 'react'

const Loading = () => {
  return (
    <div className='min-h-[400px] w-full flex justify-center items-center flex-col gap-4 animate-fade-in'>
      <div className="flex space-x-2">
        <div className="w-4 h-4 bg-[#2B463C] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-4 h-4 bg-[#2B463C] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-4 h-4 bg-[#2B463C] rounded-full animate-bounce"></div>
      </div>
      <div className='font-bold text-2xl text-[#2B463C] animate-pulse-slow'>
        Bloai
      </div>
    </div>
  )
}

export default Loading