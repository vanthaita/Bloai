import Link from 'next/link'
import React from 'react'
import Image from 'next/image'

const Logo = () => {
  return (
    <Link href='/'>
      <Image
        src="https://res.cloudinary.com/dq2z27agv/image/upload/q_auto,f_auto,w_250,h_250,c_fill/v1778080489/vvgbbauib3zgshie7gln.png"
        alt="Bloai Logo"
        width={125}
        height={125}
        className='object-cover w-[125px] h-[125px]'
        priority
        fetchPriority="high"
        unoptimized
      />
    </Link>
  )
}

export default Logo