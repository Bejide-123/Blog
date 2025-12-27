import React from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../Context/themeContext'

const NotFound = () => {
    const { theme } = useTheme();
  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${theme === 'light' ? 'bg-gray-100' : 'bg-slate-900'}`}>
      <h1 className={`text-9xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>404</h1>
      <h2 className={`text-2xl font-semibold ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mt-4`}>Page Not Found</h2>
      <p className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-500'} mt-2`}>The page you are looking for does not exist.</p>
      <Link to="/" className="mt-6 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
        Go Home
      </Link>
    </div>
  )
}

export default NotFound