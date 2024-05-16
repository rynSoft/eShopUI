// ** Core Layout Import
// !Do not remove the Layout import
import Layout from '@layouts/VerticalLayout'

// ** Menu Items Array
import navigation from '@src/navigation/vertical'
import { useEffect } from 'react';
import { useState } from 'react'
import {
  Mail,
  Tv,
  Home,
  CloudRain,
  CloudDrizzle,
  LogIn,
  Lock,
  Layers,
  Activity,
  Circle,
  User,
  Sunrise,
  Codesandbox, Inbox, Clipboard, Square, Settings, Cpu, GitCommit, Coffee, Clock, Airplay, Flag, Crop, Check, Monitor, Tag, Loader, Shuffle, LifeBuoy, Pocket, Compass, BarChart, Camera
} from 'react-feather'
import { useTranslation } from 'react-i18next'

const VerticalLayout = props => {
  const { t } = useTranslation();
  const [menuData, setMenuData] = useState([])
  useEffect(()=>{
    let userData = JSON.parse(localStorage.getItem('userData'));
    let permissionList = userData ? userData.permissions : [];
    let menuList = [];

    if(permissionList!=null && permissionList.length>0 ){
    
      permissionList.map(permission => {
        permission == "Dashboard" ? menuList.push({
      
          id: 'home',
          title: t('dashboard'),
          icon: <Home size={20} />,
          navLink: '/dashboard'
        }) : null;   //Dashboard
      
      });

      permissionList.map(permission => {
        permission == "Oee Gösterim" ? menuList.push({
      
          id: 'oee',
          title: t('oeeGosterim'),
          icon: <BarChart size={20} />,
          navLink: '/oee'
        }) : null;   //Oee
      
      });

      permissionList.map((permission,index)=> {
     permission == "Üretim Planlama"  || permission=="Üretim Planlama Görüntüle" ? menuList.push({

          id: 'productionPlan'+index,
          title: t('uretimPlanlama'),
          icon: <Codesandbox size={20} />,
          navLink: '/production'
        }) : null;   //UretimPlanlama
      
      });
  

      permissionList.map(permission => {
        permission == "Setup Verification" ? menuList.push({
          id: 'setupVerificationList',
          title: t('setupDogrulama'),
          icon: <Lock size={20} />,
          navLink: '/setupVerificationList'
        }) : null;   //Setup Doğrulama
      
      });

      let uretimList=[];
      permissionList.map(permission => {
        permission == "Üretim Bandı" ? uretimList.push({
          id: 'productionProcess',
              title: t('uretimBandi'),
              icon: <Loader size={12} />,
              navLink: '/productionProcessList'
        }) : null;   //Üretim Bandı
      });
      
     
        uretimList.length>0 ? menuList.push({
          id: 'productionPr',
          title: t('uretim'),
          icon: <Activity size={20} />,
          children: uretimList
        }) : null;   //Ayarlar Tanımlar
    
        
 
      let qualityMenuList=[]
      
      permissionList.map(permission => {
        permission == "Kalite Süreçler" ? qualityMenuList.push({
          id: 'surec',
          title: t('surecler'),
          icon: <Airplay size={12} />,
          navLink: '/qualityList'
        }) : null;   //Test
      });

      permissionList.map(permission => {
        permission == "Kalite Onaylar" ? qualityMenuList.push({
          id: 'Onaylar',
          title: t('onaylar'),
          icon: <Clock size={12} />,
          navLink: '/qualityConfirmation'
        }) : null;   //Test
      });

      permissionList.map(permission => {
        permission == "Kalite Operasyonlar" ? qualityMenuList.push({
          id: 'Operasyon',
          title: t('Operasyonlar'),
          icon: <Flag size={12} />,
          navLink: '/qualityOperation'
        }) : null;   //Kalite Operasyon
      });

      permissionList.map(permission => {
        permission == "Tamamlanan Kalite Operasyonları" ? qualityMenuList.push({
          id: 'YetkiOperasyonları',
          title: t('tamamlananOperasyonlar'),
          icon: <Check size={12} />,
          navLink: '/qualityCompleted'
        }) : null;   // Tamamlanan Kalite Operasyonları
      });
   
      qualityMenuList.length>0 ? menuList.push({
          id: 'Quality',
          title: t('kalite'),
          icon: <Layers size={20} />,
          children: qualityMenuList
        }) : null;   //Kalite 

       
        
        let ayarlarMenuList=[]

        permissionList.map(permission => {
          permission == "Kullanıcı Görüntüle" ? ayarlarMenuList.push({
            id: 'users',
            title: t('kullanicilar'),
            icon: <User size={12} />,
            navLink: '/users'
          }) : null;   // Tamamlanan Kalite Operasyonları
        });
        permissionList.map(permission => {
          permission == "Rol Görüntüle" ? ayarlarMenuList.push({
            id: 'rolOperation',
            title: t('roller'),
            icon: <Lock size={12} />,
            navLink: '/rolOperations'
          }) : null;   // Tamamlanan Kalite Operasyonları
        });
        permissionList.map(permission => {
          permission == "Mola Tanımları" ? ayarlarMenuList.push({
            id: 'breakOperation',
            title: t('mola'),
            icon: <Coffee size={12} />,
            navLink: '/breakOperations'
          }) : null;   // Mola Tanımları
        });
        permissionList.map(permission => {
          permission == "Depo Tanımları" ? ayarlarMenuList.push({
            id: 'wareHouse',
            title: t('depoTanimlari'),
            icon: <Inbox size={12} />,
            navLink: '/wareHouses'
          }) : null;   // Depo Tanımları
        });
        permissionList.map(permission => {
          permission == "Hat Tanımları" ? ayarlarMenuList.push({
            id: 'LineDefinition',
            title: t('hatTanimlari'),
            icon: <GitCommit size={12} />,
            navLink: '/line'
          }) : null;   // Tamamlanan Kalite Operasyonları
        });
        permissionList.map(permission => {
          permission == "Makine Tanımları" ? ayarlarMenuList.push({
            id: 'MachineDefinition',
            title: t('makineTanimlari'),
            icon: <Cpu size={12} />,
            navLink: '/machine'
          }) : null;   // Tamamlanan Kalite Operasyonları
        });
        permissionList.map(permission => {
          permission == "vardiyaTanimlari" ? ayarlarMenuList.push({
            id: 'shiftDefinition',
            title: t('vardiyaTanimlari'),
            icon: <Compass size={12} />,
            navLink: '/shift'
          }) : null;   // Tamamlanan Kalite Operasyonları
        });
        permissionList.map(permission => {
          permission == "Vardiya Tanımları" ? ayarlarMenuList.push({
            id: 'cameraDefinition',
            title: t('kameraTanimlari'),
            icon: <Camera size={12} />,
            navLink: '/camera'
          }) : null;   // Tamamlanan Kalite Operasyonları
        });
  
        permissionList.map(permission => {
          permission == "Vardiya - Hat Hedef Miktar Tanımları" ? ayarlarMenuList.push({
            id: 'shiftDefinitionProcess',
            title: t('vardiyaHatHedefMiktarTanimlari'),
            icon: <Compass size={12} />,
            navLink: '/shiftDefinitionProcess'
          }) : null;   // Tamamlanan Kalite Operasyonları
        });

        ayarlarMenuList.length>0 ? menuList.push({
          id: 'breakOperations',
          title: t('tanimlar'),
          icon: <Settings size={20} />,
          children: ayarlarMenuList
        }) : null;   //Ayarlar Tanımlar
    
        

    }
      setMenuData(menuList);
  },[t])

  return (
    <Layout menuData={menuData} {...props}>
      {props.children}
    </Layout>
  )
}

export default VerticalLayout
