import Footer from './footer'
import Meta from './meta'

type Props = {
  children: React.ReactNode
  title: string
  description: string
  path: string
}

const Layout = ({
  children,
  title,
  description,
  path,
}: Props) => {
  return (
    <>
      <Meta title={title} description={description} path={path} />
      <div className="min-h-vfull">
        <main>{children}</main>
      </div>
      <Footer />
    </>
  )
}

export default Layout
