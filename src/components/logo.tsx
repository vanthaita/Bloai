import Link from 'next/link'
import React from 'react'
import Image from 'next/image'

const Logo = () => {
  return (
    <Link href='/'>
      <Image
        src="https://res.cloudinary.com/dq2z27agv/image/upload/q_auto,f_webp,w_1200/v1778080489/vvgbbauib3zgshie7gln.png"
        alt="Bloai Logo"
        width={125}
        height={125}
        className='object-cover w-[125px] h-[125px]'
        priority
      />
    </Link>
  )
}

export default Logo