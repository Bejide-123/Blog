import React, { useEffect, useState } from 'react'
import NavbarPrivate from '../../Components/Private/Navbarprivate'
import FeedContent from '../../Components/Private/PostCards'
import { PageLoader } from '../../Components/Private/Loader'
import { useTheme } from '../../Context/themeContext'

const FullPostPage = () => {
  const { theme } = useTheme();
  const [isPageLoading, setIsPageLoading] = useState(true)
  
  useEffect(() => {
    // You can fetch initial data here if needed
    const timer = setTimeout(() => {
      setIsPageLoading(false)
    }, 1000); // Reduced loading time since posts will load separately
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <>
      {isPageLoading ? <PageLoader /> : (
        <div className={`${theme === 'light' ? 'bg-white' : 'bg-slate-900'}`}>
          <NavbarPrivate />
          <FeedContent />
        </div>
      )}
    </>
  )
}

export default FullPostPage