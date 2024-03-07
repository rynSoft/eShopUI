// ** User List Component
import Table from './Table'

// ** Reactstrap Imports
import { Row, Col } from 'reactstrap'

// ** Custom Components
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'

// ** Icons Imports
import { User, UserPlus, UserCheck, UserX } from 'react-feather'

// ** Styles
import '@styles/react/apps/app-users.scss'

const UsersList = () => {
  return (
    <div className='app-user-list'>
      <Row>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='primary'
            statTitle='Toplam Kullanıcı Sayısı'
            icon={<User size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>178</h3>}
          />
        </Col>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='danger'
            statTitle='Aktif Kullanıcı'
            icon={<UserPlus size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>125</h3>}
          />
        </Col>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='success'
            statTitle='Pasif Kullanıcı'
            icon={<UserCheck size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>53</h3>}
          />
        </Col>
       
      </Row>
      <Table />
    </div>
  )
}

export default UsersList
