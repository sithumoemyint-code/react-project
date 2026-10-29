import { useLocation } from 'react-router-dom' 
import { pageMeta } from '../data/pageMeta'

const usePageMeta = ()  => {
  const { pathname } = useLocation()

  if (pageMeta[pathname]) return pageMeta[pathname]

  const match = Object.keys(pageMeta).find(
    (key) => key !== '/' && pathname.startsWith(key + '/'),
  )

  return match ? pageMeta[match] : pageMeta['/']
}

export  {usePageMeta};