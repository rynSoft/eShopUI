// ** React Imports
import { useContext, Fragment } from 'react'
import { Link, useHistory } from 'react-router-dom'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'
import useJwt from '@src/auth/jwt/useJwt'
import axios from 'axios';

// ** Third Party Components
import { useDispatch } from 'react-redux'

import { useForm, Controller } from 'react-hook-form'
import { Facebook, Twitter, Mail, GitHub, HelpCircle, Coffee, XOctagon, Check } from 'react-feather'


// ** Actions
import { handleLogin } from '@store/authentication'

// ** Context
import { AbilityContext } from '@src/utility/context/Can'
const appLogoImage = require('@src/assets/images/logo/techiz.png').default

// ** Custom Components
import Avatar from '@components/avatar'
import InputPasswordToggle from '@components/input-password-toggle'

// ** Utils
import { getHomeRouteForLoggedInUser } from '@utils'

// ** Reactstrap Imports
import { Row, Col, Form, Input, Label, Alert, Button, CardText, CardTitle, UncontrolledTooltip } from 'reactstrap'

// ** Styles
import '@styles/react/pages/page-authentication.scss'
import toastData from '../@core/components/toastData';


const defaultValues = {
  password: '',
  email: ''
}

const Login = () => {
  // ** Hooks
  const { skin } = useSkin()
  const dispatch = useDispatch()
  const history = useHistory()
  const ability = useContext(AbilityContext)
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  const logo = require(`@src/assets/images/logo/techiz2.png`).default;
  const abilitys =  [
    {
      action: 'manage',
      subject: 'all'
    }
  ];

  const illustration = skin === 'dark' ? 'login-v2-dark.svg' : 'login-v2.svg',
  
  //source = require(`@src/assets/images/pages/${illustration}`).default
  source = require(`@src/assets/images/pages/manifacture.gif`).default
 
  const onSubmit = data => {
    if (Object.values(data).every(field => field.length > 0)) {
      
      useJwt
        .login({ email: data.email, password: data.password })
        .then(res => {
 
          const data = { ...res.data.userData, accessToken: res.data.userData.jwToken, refreshToken: res.data.userData.refreshToken }
          dispatch(handleLogin(data));
         // ability.update(abilitys);
          history.push(getHomeRouteForLoggedInUser( 'admin'))
          toastData("Hoşgeldiniz! "+data.userName,true)

        })

        .catch(err =>           toastData("Giriş Başarısız",false))
    } else {
      for (const key in data) {
        if (data[key].length === 0) {
          setError(key, {
            type: 'manual'
          })
        }
      }
    }
  }

  return (
    <div className='auth-wrapper auth-cover'>
        <span className='brand-logo'>
          {/* <img className='img-fluid' src={logo} alt='Not authorized page' margi height={150} width={150}/> */}
        </span>
      <Row className='auth-inner m-0'>
         <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
        {/*  <svg viewBox='0 0 139 95' version='1.1' height='28'>
            <defs>
              <linearGradient x1='100%' y1='10.5120544%' x2='50%' y2='89.4879456%' id='linearGradient-1'>
                <stop stopColor='#000000' offset='0%'></stop>
                <stop stopColor='#FFFFFF' offset='100%'></stop>
              </linearGradient>
              <linearGradient x1='64.0437835%' y1='46.3276743%' x2='37.373316%' y2='100%' id='linearGradient-2'>
                <stop stopColor='#EEEEEE' stopOpacity='0' offset='0%'></stop>
                <stop stopColor='#FFFFFF' offset='100%'></stop>
              </linearGradient>
            </defs>
            <g id='Page-1' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
              <g id='Artboard' transform='translate(-400.000000, -178.000000)'>
                <g id='Group' transform='translate(400.000000, 178.000000)'>
                  <path
                    d='M-5.68434189e-14,2.84217094e-14 L39.1816085,2.84217094e-14 L69.3453773,32.2519224 L101.428699,2.84217094e-14 L138.784583,2.84217094e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L6.71554594,44.4188507 C2.46876683,39.9813776 0.345377275,35.1089553 0.345377275,29.8015838 C0.345377275,24.4942122 0.230251516,14.560351 -5.68434189e-14,2.84217094e-14 Z'
                    id='Path'
                    className='text-primary'
                    style={{ fill: 'currentColor' }}
                  ></path>
                  <path
                    d='M69.3453773,32.2519224 L101.428699,1.42108547e-14 L138.784583,1.42108547e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L32.8435758,70.5039241 L69.3453773,32.2519224 Z'
                    id='Path'
                    fill='url(#linearGradient-1)'
                    opacity='0.2'
                  ></path>
                  <polygon
                    id='Path-2'
                    fill='#000000'
                    opacity='0.049999997'
                    points='69.3922914 32.4202615 32.8435758 70.5039241 54.0490008 16.1851325'
                  ></polygon>
                  <polygon
                    id='Path-2'
                    fill='#000000'
                    opacity='0.099999994'
                    points='69.3922914 32.4202615 32.8435758 70.5039241 58.3683556 20.7402338'
                  ></polygon>
                  <polygon
                    id='Path-3'
                    fill='url(#linearGradient-2)'
                    opacity='0.099999994'
                    points='101.428699 0 83.0667527 94.1480575 130.378721 47.0740288'
                  ></polygon>
                </g>
              </g>
            </g>
          </svg> */}
          {/* <h2 className='brand-text text-primary ms-1'>Udea</h2> */}
        
        </Link>
        <Col>
        <img  height="100%" width="100%"  src={source} alt='Login Cover' />
        </Col>
        {/* <Col className='d-none d-lg-flex align-items-center p-5' lg='8' sm='12'>
          <div className='w-100 d-lg-flex align-items-center justify-content-center px-5'>
            <img className='img-fluid' src={source} alt='Login Cover' />
          </div>
        </Col> */}
        <Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg='4' sm='12'>
        <span className='brand-logo'>
          <img className='img-fluid' src={logo} alt='Not authorized page' margi height={150} width={150}/>
        </span>
          <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
            <CardTitle tag='h2' className='fw-bold mb-1'>
              Hoşgeldiniz
            </CardTitle>
            {/* <CardText className='mb-2'>Please sign-in to your account and start the adventure</CardText> */}
          
            <Form className='auth-login-form mt-2' onSubmit={handleSubmit(onSubmit)}>
              <div className='mb-1'>
                <Label className='form-label' for='login-email'>
                  Email
                </Label>
                <Controller
                  id='email'
                  name='email'
                  control={control}
                  render={({ field }) => (
                    <Input
                      autoFocus
                      type='email'
                      placeholder='techiz@techiz.com'
                      invalid={errors.email && true}
                      {...field}
                    />
                  )}
                />
              </div>
              <div className='mb-1'>
                <div className='d-flex justify-content-between'>
                  <Label className='form-label' for='login-password'>
                    Şifre
                  </Label>
                  <Link to='/forgot-password'>
                    <small>Şifremi Unuttum</small>
                  </Link>
                </div>
                <Controller
                  id='password'
                  name='password'
                  control={control}
                  render={({ field }) => (
                    <InputPasswordToggle className='input-group-merge' invalid={errors.password && true} {...field} />
                  )}
                />
              </div>
              <div className='form-check mb-1'>
                <Input type='checkbox' id='remember-me' />
                <Label className='form-check-label' for='remember-me'>
                  Beni Hatırla
                </Label>
              </div>
              <Button type='submit' color='primary' block>
                Giriş
              </Button>
            </Form>
            <p className='text-center mt-2'>
              <span className='me-25'>Yeni bir hesap mı.</span>
              <Link to='/register'>
                <span>açmak istiyorsunuz?</span>
              </Link>
            </p>
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default Login
