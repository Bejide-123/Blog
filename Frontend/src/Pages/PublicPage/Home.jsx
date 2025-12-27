import React from 'react'
import Navbar from '../../Components/Public/Navbar'
import Feed from '../../Components/Private/PostCards'
import { useTheme } from '../../Context/themeContext'

const Home = () => {
    const { theme } = useTheme();
  return (
    <div className={`${theme === 'light' ? 'bg-white' : 'bg-slate-900'}`}>
        <Navbar />
        <Feed />
    </div>
  )
}

export default Home