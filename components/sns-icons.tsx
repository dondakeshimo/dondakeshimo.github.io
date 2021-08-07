import Container from './container'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons'

const Footer = () => {
  return (
    <Container>
      <div className="py-m sns-container my-l">
        <GitHubIcon />
        <TwitterIcon />
      </div>
    </Container>
  )
}

const GitHubIcon = () => {
  return (
    <div className="mx-s github-icon">
      <a href="https://github.com/dondakeshimo">
        <FontAwesomeIcon icon={faGithub} />
      </a>
    </div>
  )
}

const TwitterIcon = () => {
  return (
    <div className="mx-s twitter-icon">
      <a href="https://twitter.com/dondakeshimo">
        <FontAwesomeIcon icon={faTwitter} />
      </a>
    </div>
  )
}

export default Footer
