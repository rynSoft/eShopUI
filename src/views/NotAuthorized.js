// ** React Imports
import { Link } from 'react-router-dom'

// ** Reactstrap Imports
import { Button } from 'reactstrap'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'

// ** Styles
import '@styles/base/pages/page-misc.scss'
import logo from '@src/assets/images/logo/lgo.png'
const NotAuthorized = () => {
  // ** Hooks
  const { skin } = useSkin()

  const illustration = skin === 'dark' ? 'not-authorized-dark.svg' : 'not-authorized.svg',
    source = require(`@src/assets/images/pages/${illustration}`).default
  return (
    <div className='misc-wrapper'>
      <Link className='brand-logo' to='/'>
      
      <img className='fallback-logo' src={logo} alt='logo' width={200}/>
      </Link>
      <div className='misc-inner p-2 p-sm-3'>
        <div className='w-100 text-center'>
          <h2 className='mb-1'>Yetkili Değilsin! 🔐</h2>
          <p className='mb-2'>
          Lütfen sistem yöneticinizle iletişime geçiniz.
          </p>
          <Button tag={Link} to='/' color='primary' className='btn-sm-block mb-1'>
            Ana Sayfaya Dön
          </Button>
          <img className='img-fluid' src={source} alt='Not authorized page' />
        </div>
      </div>
    </div>
  )
}
export default NotAuthorized
