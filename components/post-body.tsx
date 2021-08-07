type Props = {
  content: string
}

const PostBody = ({ content }: Props) => {
  return (
    <div className="container-80 mx-auto">
      <div
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  )
}

export default PostBody
