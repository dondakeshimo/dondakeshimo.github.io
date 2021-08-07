import { ReactNode } from 'react'

type Props = {
  children?: ReactNode
}

const PostTitle = ({ children }: Props) => {
  return (
    <h1 className="title text-xl font-bold mb-l text-center">
      {children}
    </h1>
  )
}

export default PostTitle
