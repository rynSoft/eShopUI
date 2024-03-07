// ** React Imports

import { Fragment, useState } from 'react'
// ** Roles Components
import Table from './Table'
import RoleCards from './RoleCards'
import { Breadcrumb, BreadcrumbItem, Button, UncontrolledTooltip } from 'reactstrap'
import { Link } from 'react-router-dom'
import { PlusSquare } from 'react-feather'

const Roles = () => {
    const [refreshData, setRefreshData] = useState(false)
  return (
    <Fragment>
            <div className='content-header row'>
                <div className='content-header-left col-md-9 col-12 mb-2'>
                    <div className='row breadcrumbs-top'>
                        <div className='col-12'>
                            <h2 className='content-header-title float-start mb-0'>{'Roller'}</h2>
                            <div className='breadcrumb-wrapper vs-breadcrumbs d-sm-block d-none col-12'>
                                <Breadcrumb className='ms-1'>
                                    <BreadcrumbItem>
                                        <Link to='/'> Dashboard </Link>
                                    </BreadcrumbItem>
                                    <BreadcrumbItem>
                                        <span> Tanımlar </span>
                                    </BreadcrumbItem>
                                    <BreadcrumbItem>
                                        <span> Roller </span>
                                    </BreadcrumbItem>
                                </Breadcrumb>
                            </div>
                        </div>
                    </div>
                </div>



            </div>
    
      <p className='mb-2'>
          Bir rol, ihtiyaç duyduğu şeye erişebilen bir yöneticiye atanan role bağlı olarak önceden tanımlanmış menülere ve özelliklere erişim sağlar..
      </p>
      <RoleCards  refreshData={refreshData} setRefreshData={setRefreshData}/>
      <h3 className='mt-50'>Rollerde tanımlı kullanıcı listesi</h3>
      {/* <p className='mb-2'>Find all of your company’s administrator accounts and their associate roles.</p> */}
      <div className='app-user-list'>
        <Table  refreshData={refreshData} setRefreshData={setRefreshData}/>
      </div>
    </Fragment>
  )
}

export default Roles
