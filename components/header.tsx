import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BLOG_NAME } from '../lib/constants'
import { faHandPointUp } from '@fortawesome/free-solid-svg-icons'

const Header = () => {
  return (
    <div className="text-l font-bold text-tight mb-xl mt-l">
      <Link href="/" className="logo">
        <FontAwesomeIcon icon={faHandPointUp} className="svg-l dondake-icon" />
        {BLOG_NAME}
      </Link>
    </div>
  )
}

export default Header
