// ** Core Layout Import
// !Do not remove the Layout import
import Layout from '@layouts/HorizontalLayout'

// ** Menu Items Array
import navigation from '@src/navigation/horizontal'
import { useEffect } from 'react';
import { useState } from 'react';
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
import { useTranslation } from 'react-i18next';



const HorizontalLayout = props => {
  const { t } = useTranslation();
  const [menuData, setMenuData] = useState([])


  // useEffect(() => {
  //   axios.get(URL).then(response => setMenuData(response.data))
  // }, [])

  useEffect(() => {
    let userData = JSON.parse(localStorage.getItem('userData'));
    let permissionList = userData ? userData.permissions : [];
    let menuList = [];

    if (permissionList != null && permissionList.length > 0) {
      permissionList.map(permission => {
        permission == "Dashboard" ? menuList.push({

          id: 'home',
          title: t('Dashboard'),
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

      permissionList.map((permission, index) => {
        permission == "Üretim Planlama" || permission == "Üretim Planlama Görüntüle" ? menuList.push({

          id: 'productionPlan' + index,
          title: 'Üretim Planlama',
          icon: <Codesandbox size={20} />,
          navLink: '/production'
        }) : null;   //UretimPlanlama

      });


      permissionList.map(permission => {

        permission == "Kit Hazırlama" ? menuList.push({
          id: 'kitProvisionList',
          title: 'Kit Hazırlama',
          icon: <Inbox size={20} />,
          navLink: '/kitProvisionList'
        }) : null;   //Kit Hazırlama

      });

      permissionList.map(permission => {

        permission == "Kit Doğrulama" ? menuList.push({
          id: 'kitVerificationList',
          title: 'Kit Doğrulama',
          icon: <Clipboard sie={20} />,
          navLink: '/kitVerificationList'
        }) : null;   //Kit Dogrulama


      });
      permissionList.map(permission => {
        permission == "Setup Verification" ? menuList.push({
          id: 'setupVerificationList',
          title: 'Setup Doğrulama',
          icon: <Lock size={20} />,
          navLink: '/setupVerificationList'
        }) : null;   //Setup Doğrulama

      });

      let uretimList = [];
      permissionList.map(permission => {
        permission == "Üretim Bandı" ? uretimList.push({
          id: 'productionProcess',
          title: 'Üretim Bandı',
          icon: <Loader size={12} />,
          navLink: '/productionProcessList'
        }) : null;   //Üretim Bandı
      });

      permissionList.map(permission => {
        permission == "Etiketleme" ? uretimList.push({

          id: 'labeling',
          title: 'Etiketleme',
          icon: <Tag size={12} />,
          navLink: '/labeling'

        }) : null;   //Etiketleme
      });

      permissionList.map(permission => {
        permission == "Display Montajı" ? uretimList.push({
          id: 'displayAssembly',
          title: 'Display Montajı',
          icon: <Monitor size={12} />,
          navLink: '/displayAssembly'
        }) : null;   //Display Montajı
      });

      permissionList.map(permission => {
        permission == "Programlama" ? uretimList.push({
          id: 'programming',
          title: 'Programlama',
          icon: <LifeBuoy size={12} />,
          navLink: '/programming'
        }) : null;   //Programlama
      });

      permissionList.map(permission => {
        permission == "Panelden Ayırma" ? uretimList.push({
          id: 'detachFromPanel',
          title: 'Panelden Ayırma',
          icon: <Shuffle size={12} />,
          navLink: '/detachFromPanel'
        }) : null;   //Panelden Ayırma
      });

      permissionList.map(permission => {
        permission == "Test" ? uretimList.push({
          id: 'productionTest',
          title: 'Test',
          icon: <Pocket size={12} />,
          navLink: '/productionTest'
        }) : null;   //Test
      });


      uretimList.length > 0 ? menuList.push({
        id: 'productionPr',
        title: 'Üretim',
        icon: <Activity size={20} />,
        children: uretimList
      }) : null;   //Ayarlar Tanımlar



      let qualityMenuList = []

      permissionList.map(permission => {
        permission == "Kalite Süreçler" ? qualityMenuList.push({
          id: 'surec',
          title: 'Süreçler',
          icon: <Airplay size={12} />,
          navLink: '/qualityList'
        }) : null;   //Test
      });

      permissionList.map(permission => {
        permission == "Kalite Onaylar" ? qualityMenuList.push({
          id: 'Onaylar',
          title: 'Onaylar',
          icon: <Clock size={12} />,
          navLink: '/qualityConfirmation'
        }) : null;   //Test
      });

      permissionList.map(permission => {
        permission == "Kalite Operasyonlar" ? qualityMenuList.push({
          id: 'Operasyon',
          title: 'Operasyonlar',
          icon: <Flag size={12} />,
          navLink: '/qualityOperation'
        }) : null;   //Kalite Operasyon
      });

      permissionList.map(permission => {
        permission == "Tamamlanan Kalite Operasyonları" ? qualityMenuList.push({
          id: 'YetkiOperasyonları',
          title: 'Tamamlanan Operasyonlar',
          icon: <Check size={12} />,
          navLink: '/qualityCompleted'
        }) : null;   // Tamamlanan Kalite Operasyonları
      });

      qualityMenuList.length > 0 ? menuList.push({
        id: 'Quality',
        title: 'Kalite',
        icon: <Layers size={20} />,
        children: qualityMenuList
      }) : null;   //Kalite 



      let ayarlarMenuList = []

      permissionList.map(permission => {
        permission == "Kullanıcı Görüntüle" ? ayarlarMenuList.push({
          id: 'users',
          title: 'Kullanıcılar',
          icon: <User size={12} />,
          navLink: '/users'
        }) : null;   // Tamamlanan Kalite Operasyonları
      });
      permissionList.map(permission => {
        permission == "Rol Görüntüle" ? ayarlarMenuList.push({
          id: 'rolOperation',
          title: 'Roller',
          icon: <Lock size={12} />,
          navLink: '/rolOperations'
        }) : null;   // Tamamlanan Kalite Operasyonları
      });
      permissionList.map(permission => {
        permission == "Mola Tanımları" ? ayarlarMenuList.push({
          id: 'breakOperation',
          title: 'Mola',
          icon: <Coffee size={12} />,
          navLink: '/breakOperations'
        }) : null;   // Mola Tanımları
      });
      permissionList.map(permission => {
        permission == "Depo Tanımları" ? ayarlarMenuList.push({
          id: 'wareHouse',
          title: 'Depo Tanımları',
          icon: <Inbox size={12} />,
          navLink: '/wareHouses'
        }) : null;   // Depo Tanımları
      });
      permissionList.map(permission => {
        permission == "Hat Tanımları" ? ayarlarMenuList.push({
          id: 'LineDefinition',
          title: 'Hat Tanımları',
          icon: <GitCommit size={12} />,
          navLink: '/line'
        }) : null;   // Tamamlanan Kalite Operasyonları
      });
      permissionList.map(permission => {
        permission == "Makine Tanımları" ? ayarlarMenuList.push({
          id: 'MachineDefinition',
          title: 'Makine Tanımları',
          icon: <Cpu size={12} />,
          navLink: '/machine'
        }) : null;   // Tamamlanan Kalite Operasyonları
      });
      permissionList.map(permission => {
        permission == "Vardiya Tanımları" ? ayarlarMenuList.push({
          id: 'shiftDefinition',
          title: 'Vardiya Tanımları',
          icon: <Compass size={12} />,
          navLink: '/shift'
        }) : null;   // Tamamlanan Kalite Operasyonları
      });
      permissionList.map(permission => {
        permission == "Vardiya Tanımları" ? ayarlarMenuList.push({
          id: 'cameraDefinition',
          title: 'Kamera Tanımları',
          icon: <Camera size={12} />,
          navLink: '/camera'
        }) : null;   // Tamamlanan Kalite Operasyonları
      });
      permissionList.map(permission => {
        permission == "Vardiya - Hat Hedef Miktar Tanımları" ? ayarlarMenuList.push({
          id: 'shiftDefinitionProcess',
          title: 'Vardiya - Hat Hedef Miktar Tanımları',
          icon: <Compass size={12} />,
          navLink: '/shiftDefinitionProcess'
        }) : null;   // Tamamlanan Kalite Operasyonları
      });

      ayarlarMenuList.length > 0 ? menuList.push({
        id: 'breakOperations',
        title: 'Tanımlar',
        icon: <Settings size={20} />,
        children: ayarlarMenuList
      }) : null;   //Ayarlar Tanımlar



    }








    setMenuData(menuList);
  }, [])







  return (
    <Layout menuData={menuData} {...props}>
      {props.children}
    </Layout>
  )
}

export default HorizontalLayout
