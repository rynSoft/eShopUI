// ** React Imports
import { Link } from 'react-router-dom'
import { useState,useEffect } from 'react'
import { isUserLoggedIn } from '@utils'
// ** Custom Components
import Avatar from '@components/avatar'
import { useDispatch } from 'react-redux'
import { handleLogout } from '@store/authentication'
import axios from "axios";
// ** Utils
// import { isUserLoggedIn } from '@utils'

// ** Third Party Components
import { User, Mail, CheckSquare, MessageSquare, Settings, CreditCard, HelpCircle, Power } from 'react-feather'

// ** Reactstrap Imports
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap'

// ** Default Avatar Image
import defaultAvatar from '@src/assets/images/portrait/small/avatar-s-11.jpg'
import { useHistory } from 'react-router-dom/cjs/react-router-dom'

const UserDropdown = () => {
  // ** State
  const history = useHistory();
  const dispatch = useDispatch()
  const [userData, setUserData] = useState(null)
  //** ComponentDidMount
  const TokenSessionControl = () => {
    // axios
    //   .get(
    //     process.env.REACT_APP_API_ENDPOINT +
    //     "api/Account/TokenSessionControl"
    //   )
    //   .then(response=>{
    //     if(!response.data.userData){
    //       dispatch(handleLogout())
    //       history.push("/login")
   
    //     } //false  veya true dönüyor    true ise  sesionTokeniDogru
    //   });
  
  };
  const myVar= ()=>setInterval(TokenSessionControl, 300000);
  useEffect(() => {
    TokenSessionControl();
    myVar()
    if (isUserLoggedIn() !== null) {

      setUserData(JSON.parse(localStorage.getItem('userData')))
      
    }
  }, [])

  //** Vars
  const userAvatar = (userData && userData.image) 


  return (
    <UncontrolledDropdown tag='li' className='dropdown-user nav-item'>
      <DropdownToggle href='/' tag='a' className='nav-link dropdown-user-link' onClick={e => e.preventDefault()}>
      <div className='user-nav d-sm-flex d-none'>
          <span className='user-name fw-bold'>{(userData && userData['userName']) }</span>
          <span className='user-status'>{(userData && userData.roles) || '-'}</span>
        </div>

       {userAvatar!=null ?  <Avatar img={`data:image/jpeg;base64,${userAvatar}`} imgHeight='40' imgWidth='40'status='online'  />:null}
       
      </DropdownToggle>
      <DropdownMenu end>
        <DropdownItem tag='a' href='/pages/profile' onClick={e => e.preventDefault()}>
          <User size={14} className='me-75' />
          <span className='align-middle'>Profil</span>
        </DropdownItem>
        <DropdownItem tag='a' href='/apps/email' onClick={e => e.preventDefault()}>
          <Mail size={14} className='me-75' />
          <span className='align-middle'>Mail Kutusu</span>
        </DropdownItem>
        <DropdownItem tag='a' href='/apps/todo' onClick={e => e.preventDefault()}>
          <CheckSquare size={14} className='me-75' />
          <span className='align-middle'>Görevlerim</span>
        </DropdownItem>
        {/* <DropdownItem tag='a' href='/apps/chat' onClick={e => e.preventDefault()}>
          <MessageSquare size={14} className='me-75' />
          <span className='align-middle'>Chats</span>
        </DropdownItem> */}
        <DropdownItem divider />
        <DropdownItem tag='a' href='/pages/account-settings' onClick={e => e.preventDefault()}>
          <Settings size={14} className='me-75' />
          <span className='align-middle'>Ayarlar</span>
        </DropdownItem>
        {/* <DropdownItem tag='a' href='/pages/pricing' onClick={e => e.preventDefault()}>
          <CreditCard size={14} className='me-75' />
          <span className='align-middle'>Pricing</span>
        </DropdownItem>
        <DropdownItem tag='a' href='/pages/faq' onClick={e => e.preventDefault()}>
          <HelpCircle size={14} className='me-75' />
          <span className='align-middle'>FAQ</span>
        </DropdownItem> */}
        <DropdownItem tag={Link} to='/login'  onClick={() => dispatch(handleLogout())}>
          <Power size={14} className='me-75' />
          <span className='align-middle'>Çıkış</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default UserDropdown
