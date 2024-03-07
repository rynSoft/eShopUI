import { selectThemeColors } from "@utils";
import Select from "react-select";

import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardText,
  Table,
  Row,
  Col,
  Input,
  Label,
  CardFooter,
  Button,
  UncontrolledTooltip,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Breadcrumb,
  BreadcrumbItem,
} from "reactstrap";
import DataTable from "react-data-table-component";
import {
  Check,
  ChevronDown,
  Database,
  Edit,
  Edit2,
  Facebook,
  Home,
  Info,
  PlusSquare,
  Printer,
  Settings,
  XOctagon,
} from "react-feather";
import CustomPagination from "../../../../../@core/components/gridTable/CustomPagination";
import Avatar from "@components/avatar";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import toastData from "../../../../../@core/components/toastData";
import ReactPaginate from "react-paginate";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { Link, useHistory } from "react-router-dom";
import { Badge } from "reactstrap";
import Roles from ".";
import ExportPdf from "../../../../../@core/components/gridTable/ExportPdf/exportPdf";
import ExportExcel from "../../../../../@core/components/gridTable/ExportExcel";

const UsersList = (props) => {
  const [roleList, setRoleList] = useState([]);
  const [newRolId, setNewRolId] = useState({ label: "Rol Yok", value: "-1" });
  const [data, setData] = useState([]);

  const columns = [
    {
      name: "Rol",
      selector: "Rol",
      sortable: true,
      selector: (row) => row.role,
      cell: (row) => renderRole(row),
    },
    {
      name: "Ad",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Soyad",
      selector: (row) => row.surName,
      sortable: true,
    },

    {
      name: "EMAİL",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: <Fragment>DURUM <Button.Ripple style={{ marginLeft: 10 }}
      outline
      id="pdfPrint"
      className="btn-icon rounded-circle pull-right"
      color="danger"

      onClick={() => {

        ExportPdf(data, "rolPersonel", "ROL PERSONEL LİSTESİ");
      }}
    >
      <Printer size={17} />
    </Button.Ripple>
    <Button.Ripple
        outline
        id="excelPrint"
        className="btn-icon rounded-circle pull-right"
        color="success"
        style={{ marginLeft: 5 }}
        onClick={() => {
          ExportExcel(searchValue.length ? filteredData : data, "MolaTanimListesi", "MOLA TANIM LİSTESİ");
        }}
      >
          <Printer size={17} />
        </Button.Ripple>
    </Fragment>,
      sortable: true,
      maxWidth: "200px",
      minWidth: "200px",
      selector: (row) => row.status,
      cell: (row) => (
        <Badge className="text-capitalize" color={statusObj[row.status]} pill>
          {row.status}
        </Badge>
      ),
    },
  ];

  const statusObj = {
    active: "light-success",
    inactive: "light-secondary",
  };
  const roleObj = {
    DEMO: {
      class: "text-primary",
      icon: Home,
    },
    DEPO: {
      class: "text-success",
      icon: Database,
    },
    DEMO2: {
      class: "text-info",
      icon: Edit2,
    },
    SISTEMADMIN: {
      class: "text-warning",
      icon: Settings,
    },
  };
  const [roleUpdateModal, setUpdateModal] = useState(false);
  const [userRole, setUserRole] = useState(false);
  const [UserName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const renderRole = (row) => {
    const Icon = roleObj[row.role] ? roleObj[row.role].icon : Edit2;

    return (
      <span  style={{ cursor: "pointer" }}
        className="text-truncate text-capitalize align-middle"
       
        onClick={() => {
          setUpdateModal(true);
          setUserRole(row.role);
          setUserName(row.name + " " + row.surName);
  
          let role=roleList.filter(x=>x.label===row.role);
          if(role.length>0){
            setNewRolId(    { label: role[0].label, value: role[0].id })
          }
          else{
            setNewRolId(  { label: "Rol Yok", value: "-1" });
          }
    
          setUserId(row.id);
        }}
      >
        <Icon
          size={18}
          className={`${
            roleObj[row.role] ? roleObj[row.role].class : ""
          } me-50`}
        />
        {row.role === null ? "Rol Atanmamış" : row.role}
      </span>
    );
  };

  // ** User filter options
  const roleOptions = [
    { value: "", label: "Rol Seçiniz" },
    { value: "SISTEMADMIN", label: "Sistem Admin" },
    { value: "DEPO", label: "İl Admin" },
  ];

  const statusOptions = [
    { value: "", label: "Durum Seçiniz", number: 0 },
    { value: "active", label: "Aktif", number: 1 },
    { value: "inactive", label: "Pasif", number: 32 },
  ];
  const [currentPage, setCurrentPage] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectionModal, setSelectionModal] = useState(false);



  const handleFilter = (e) => {
    const value = e.target.value;
    let updatedData = [];
    setSearchValue(value);

    if (value.length) {
      updatedData = data.filter((item) => {
        const startsWith =
          item.name?.toLowerCase?.().startsWith(value.toLowerCase()) ||
          item.surName
            ?.toString()
            .toLowerCase?.()
            .startsWith(value.toLowerCase()) ||
          item.email
            ?.toString()
            .toLowerCase?.()
            .startsWith(value.toLowerCase()) ||
          item.role?.toString().toLowerCase?.().startsWith(value.toLowerCase());
        const includes =
          item.name?.toLowerCase?.().startsWith(value.toLowerCase()) ||
          item.surName
            ?.toString()
            .toLowerCase?.()
            .startsWith(value.toLowerCase()) ||
          item.email
            ?.toString()
            .toLowerCase?.()
            .startsWith(value.toLowerCase()) ||
          item.role?.toString().toLowerCase?.().startsWith(value.toLowerCase());

        if (startsWith) {
          return startsWith;
        } else if (!startsWith && includes) {
          return includes;
        } else return null;
      });
      setFilteredData(updatedData);
      setSearchValue(value);
    }
  };

  useEffect(() => {
    loadData();
  }, [props.refreshData]);

  const loadData = () => {
    axios
      .get(process.env.REACT_APP_API_ENDPOINT + "api/Account/GetAllAsync")
      .then((response) => {
        setData(response.data.data);
      });

      axios
      .get(process.env.REACT_APP_API_ENDPOINT + "api/Role/getRoles")
      .then((response) => {

        if(response.data.userData.length>0){
          let roleData=[]
    
          response.data.userData.map((item)=>roleData.push({id:item.id,label:item.normalizedName}))
  
          setRoleList(roleData);
          setNewRolId(    { label: response.data.userData[0].normalizedName, value: response.data.userData[0].id })
      
        }

      });
  };



  const history = useHistory();
  const openExcelImport = () => {
    setSelectionModal(false);
    let path = "/production/import-excel";
    history.push(path);
  };
  const openDetail = (id) => {
    setSelectionModal(false);
    let path = "/production/" + id;
    history.push(path);
  };


  const updateRolAPI = () => {
    axios
    .post(process.env.REACT_APP_API_ENDPOINT + "api/Role/RoleUpdate?userId="+userId+"&roleId="+newRolId.value)
    .then((response) => {
      if(response.data.succeeded){
        setUpdateModal(false);
        loadData();
        
        props.setRefreshData(!props.refreshData)
        toastData("Rol Başarıyla Güncellendi", true);
      }
      else{
        toastData("Rol Güncellenemedi", true);
      }
     
    });
  };


  return (
    <Fragment>
      <Modal
        isOpen={roleUpdateModal}
        onClosed={() => setUpdateModal(false)}
        toggle={() => setUpdateModal(false)}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader
          className="bg-transparent"
          toggle={() => setUpdateModal(false)}
        >
          {UserName} İsimli Personel - Yetki Ayarı
        </ModalHeader>
        <ModalBody>
          <Row>
            <div className="mb-1">
              <Label className="form-label" for="ad">
                Rol
              </Label>

              <Select
              isClearable={false}
              className="react-select"
              classNamePrefix="select"
              options={roleList}
              theme={selectThemeColors}
              defaultValue={newRolId}
              value={newRolId}
              onChange={(event) => {
                
                setNewRolId({ value: event.id, label: event.label });
              }}
            />
            </div>
            <Col className="text-center mt-2" xs={12}>
              {roleList.length>0 ?       <Button onClick={() => updateRolAPI() }color="primary" className="me-1" disabled={newRolId.value==-1}>
                Kaydet
              </Button>:null}
         
              <Button
                type="reset"
                outline
                onClick={() => setUpdateModal(false)}
              >
                İptal
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
      <div>
        <Card>
          <Row className="justify-content-end mx-0">
            <Col
              className="d-flex align-items-center justify-content-end mt-1"
              md="6"
              sm="12"
            >
              <Label className="me-1" for="search-input-1">
                {" "}
                {"Ara"}{" "}
              </Label>
              <Input
                className="dataTable-filter mb-50"
                type="text"
                bsSize="sm"
                id="search-input-1"
                value={searchValue}
                onChange={handleFilter}
              />
            </Col>
          </Row>
          <CardBody>
            <div className="react-dataTable">
              <DataTable
                noHeader
                pagination
                selectableRowsNoSelectAll
                columns={columns}
                className="react-dataTable"
                paginationPerPage={10}
                sortIcon={<ChevronDown size={10} />}
                paginationDefaultPage={currentPage + 1}
                paginationComponent={ ()=>CustomPagination(searchValue.length ? filteredData : data,currentPage,(value)=>setCurrentPage(value))}
      
                data={searchValue.length ? filteredData : data}
                noDataComponent={"Üretim Bulunamadı"}
              />
            </div>
          </CardBody>
          <CardFooter>
            <CardText className="mb-0"></CardText>
          </CardFooter>
        </Card>
      </div>
    </Fragment>
  );
};

export default UsersList;
