// ** Icons Import
import { Heart } from 'react-feather'

const Footer = () => {
  return (
    <p className='clearfix mb-0'>
      <span className='float-md-start d-block d-md-inline-block mt-25'>
        COPYRIGHT © {new Date().getFullYear()}{' '}
        <a href='https://www.techIz.ryn.com' target='_blank' rel='noopener noreferrer'>
          TECHİZ
        </a>
      </span>

    </p>
  )
}

export default Footer
