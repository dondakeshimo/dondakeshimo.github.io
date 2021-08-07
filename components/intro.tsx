import { BLOG_NAME } from '../lib/constants'
import SnsIcons from './sns-icons'

const Intro = () => {
  return (
    <section className="">
      <h1 className="title text-xl font-bold text-center leading-tight mt-l">
        {BLOG_NAME}
      </h1>

      <h5 className="text-center">
        マルタ島は最高
      </h5>

      <SnsIcons />

      <h4 className="text-center border-b-intro">
        Softwear Engineerのブログ
      </h4>
    </section>
  )
}

export default Intro
