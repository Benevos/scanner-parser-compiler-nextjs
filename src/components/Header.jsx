import React from 'react'
import Image from 'next/image'

function Navbar() {
  return (
    <header className='flex w-full flex-row justify-between items-center py-3 bg-slate-400'>
        <Image className='max-md:w-40' src={'/UAT.svg'} alt='uat' height={100} width={220} priority/>

        <div className='flex items-center'>
          <h1 className='text-3xl text-slate-700 font-semibold max-md:hidden'>
            Equipo Benevos
          </h1>
        </div>

        <Image className='mr-3 w-21 h-17 max-md:w-40 max-md:h-12' src={'/uamm.png'} alt='uat' height={80} width={260}/>
    </header>
  )
}

export default Navbar