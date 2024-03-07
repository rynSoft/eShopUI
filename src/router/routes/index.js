import { lazy } from 'react'

// ** Document title
const TemplateTitle = '%s - Vuexy React Admin Template'

// ** Default Route
const DefaultRoute = '/dashboard'

// ** Merge Routes
const Routes = [
  {
    path: '/dashboard',
    component: lazy(() => import('../../views/pages/Dashboard/index'))
  },
  {
    path: '/oee',
    component: lazy(() => import('../../views/pages/Oee/index'))
  },
  {
    path: '/production/import-excel',
    component: lazy(() => import('../../views/pages/Production/ProductionImport'))
  },
  {
    path: '/production/:id',
    component: lazy(() => import('../../views/pages/Production/index'))
  },
  {
    path: '/production',
    component: lazy(() => import('../../views/pages/Production/ProductionList'))
  },
  {
    path: '/machine',
    component: lazy(() => import('../../views/pages/MachineDefinition/MachineList'))
  },

  {
    path: '/camera',
    component: lazy(() => import('../../views/pages/CameraDefinition/CameraList'))
  },
  {
    path: '/shift',
    component: lazy(() => import('../../views/pages/ShiftDefinition/ShiftList'))
  },
  {
    path: '/shiftDefinitionProcess',
    component: lazy(() => import('../../views/pages/ShiftDefinitionProcess/ShiftDefinitionProcessList'))
  },
  {
    path: '/uygunsuzlukKod',
    component: lazy(() => import('../../views/pages/NonComplianceCode/NonComplianceCodeList'))
  },
  {
    path: '/line',
    component: lazy(() => import('../../views/pages/LineDefinition/LineList'))
  },

  {
    path: '/kitProvisionList/:id',
    component: lazy(() => import('../../views/pages/KitProvision/Provision'))
  },
  {
    path: '/kitProvisionList',
    component: lazy(() => import('../../views/pages/KitProvision/ProvisionList'))
  },

  {
    path: '/setupVerificationList/:id',
    component: lazy(() => import('../../views/pages/SetupVerification/SetupVerification'))
  },
  {
    path: '/setupVerificationList',
    component: lazy(() => import('../../views/pages/SetupVerification/SetupVerificationList'))
  },

  {
    path: '/productionProcessList/:id',
    component: lazy(() => import('../../views/pages/ProductionProcess/ProductionProcess'))
  },
  {
    path: '/productionProcessList',
    component: lazy(() => import('../../views/pages/ProductionProcess/ProductionProcessList'))
  },
  {
    path: '/qualityList/:id',
    component: lazy(() => import('../../views/pages/Quality/QualityDetail'))
  },
  {
    path: '/qualityList',
    component: lazy(() => import('../../views/pages/Quality/QualityList'))
  },
  {
    path: '/qualityConfirmation/:id',
    component: lazy(() => import('../../views/pages/Quality/QualityConfirmation/QualityConfirmationDetail'))
  },
  {
    path: '/qualityConfirmation',
    component: lazy(() => import('../../views/pages/Quality/QualityConfirmation/QualityConfirmationList'))
  },
  {
    path: '/qualityOperation/:id',
    component: lazy(() => import('../../views/pages/Quality/QualityOperation/QualityOperationDetail'))
  },
  {
    path: '/qualityOperation',
    component: lazy(() => import('../../views/pages/Quality/QualityOperation/QualityOperationList'))
  },

  {
    path: '/qualityCompleted/:id',
    component: lazy(() => import('../../views/pages/Quality/QualityAutherization/QualityAutherizationDetail'))
  },
  {
    path: '/qualityCompleted',
    component: lazy(() => import('../../views/pages/Quality/QualityAutherization/QualityAutherizationList'))
  },
  
  {
    path: '/rolOperations',
    component: lazy(() => import('../../views/pages/Settings/roles-permissions/roles'))
  },


  {
    path: '/kitVerificationList/:id',
    component: lazy(() => import('../../views/pages/KitVerification/Verification'))
  },
  {
    path: '/kitVerificationList',
    component: lazy(() => import('../../views/pages/KitVerification/VerificationList'))
  },

  
  {
    path: '/createBarcode',
    component: lazy(() => import('../../views/pages/Barcode/Barcode'))
  },
  {
    path: '/breakOperations',
    component: lazy(() => import('../../views/pages/BreakOperations/BreakOperationsTable'))
  },
  {
    path: '/wareHouses',
    component: lazy(() => import('../../views/pages/WareHouse/WareHouseTable'))
  },
  {
    path: '/users',
    component: lazy(() => import('../../views/pages/Settings/Users/UserList'))
  },

  {
    path: '/login',
    component: lazy(() => import('../../views/Login')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/error',
    component: lazy(() => import('../../views/Error')),
    layout: 'BlankLayout'
  },
  {
    path: '/detachFromPanel/:id/:previousProcess',
    component: lazy(() => import('../../views/pages/ProductionStages/DetachFromPanel/DetachFromPanelDetail'))
  },
  {
    path: '/detachFromPanel',
    component: lazy(() => import('../../views/pages/ProductionStages/DetachFromPanel/DetachFromPanelList'))
  },

  {
    path: '/displayAssembly/:id/:previousProcess',
    component: lazy(() => import('../../views/pages/ProductionStages/DisplayAssembly/DisplayAssemblyDetail'))
  },
  {
    path: '/displayAssembly',
    component: lazy(() => import('../../views/pages/ProductionStages/DisplayAssembly/DisplayAssemblyList'))
  },
  
  {    
    path: '/labeling/:id/:previousProcess',
    component: lazy(() => import('../../views/pages/ProductionStages/Labeling/LabelingDetail'))
  },
  {
    path: '/labeling',
    component: lazy(() => import('../../views/pages/ProductionStages/Labeling/LabelingList'))
  },
  {
    path: '/productionTest/:id',
    component: lazy(() => import('../../views/pages/ProductionStages/ProductionTest/ProductionTestDetail'))
  },
  {
    path: '/productionTest',
    component: lazy(() => import('../../views/pages/ProductionStages/ProductionTest/ProductionTestList'))
  },

  {
    path: '/programming/:id/:previousProcess',
    component: lazy(() => import('../../views/pages/ProductionStages/Programming/ProgrammingDetail'))
  },
  {
    path: '/programming',
    component: lazy(() => import('../../views/pages/ProductionStages/Programming/ProgrammingList'))
  },

]

export { DefaultRoute, TemplateTitle, Routes }
