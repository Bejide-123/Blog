import React, { useEffect, useState } from 'react'
import NavbarPrivate from '../../Components/Private/Navbarprivate'
import FeedContent from '../../Components/Private/PostCards'
import { PageLoader } from '../../Components/Private/Loader'

const FullPostPage = () => {
  const [isPageLoading, setIsPageLoading] = useState(true)
  
  useEffect(() => {
    setTimeout(() => {
      setIsPageLoading(false)
    }, 3000);
  })
  return (
    <>
      {isPageLoading ? <PageLoader /> : (
        <div>
          <NavbarPrivate />
          <FeedContent />
        </div>
      )}
    </>
  )
}

export default FullPostPage
