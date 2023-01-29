import { BLOG_NAME, SITE_SHORT_DESC } from '../lib/constants'
import SnsIcons from './sns-icons'

const Intro = () => {
  return (
    <section className="">
      <h1 className="title text-xl font-bold text-center leading-tight mt-l">
        {BLOG_NAME}
      </h1>

      <SnsIcons />

      <h4 className="text-center border-b-intro">
        {SITE_SHORT_DESC}
      </h4>
    </section>
  )
}

export default Intro
