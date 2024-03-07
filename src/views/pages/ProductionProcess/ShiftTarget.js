// ** Third Party Components
import Chart from "react-apexcharts";
import Flatpickr from "react-flatpickr";
import { Calendar, Check, XOctagon } from "react-feather";
import "@styles/react/libs/charts/apex-charts.scss";
// ** Reactstrap Imports
import {
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Label,
  InputGroup,
  Input,
  Badge,
} from "reactstrap";
import { Turkish } from "flatpickr/dist/l10n/tr.js"
import { Fragment, useState } from "react";
import { max } from "moment";
import { toast, Slide } from "react-toastify";
import axios from "axios";
import BarcodeReader from "react-barcode-reader";
import "@styles/base/core/menu/menu-types/vertical-menu.scss";
import toastData from "../../../@core/components/toastData";
import Select from "react-select";
import "@styles/base/core/menu/menu-types/vertical-overlay-menu.scss";
import { useEffect } from "react";

const ShiftTarget = (props) => {

  const { modalStateChange, lineId,ShiftTarget} = props;
  const [ShiftTargetId, setShiftTargetId] = useState();
  const [totalProductionCard, setTotalProductionCard] = useState();
  
  const [theoreticalSpeed, setTheoreticalSpeed] = useState(undefined);
  const [finishTarget, setFinishTarget] = useState(undefined);
  const [shiftDefinitionId, setShiftDefinitionId] = useState(null);
  const [shiftDefinitionName, setShiftDefinitionName] = useState(null);
  
  const [numberOfCard, setNumberOfCard] = useState(undefined);
  const [targetCardCount, setTargetCardCount] = useState(undefined);
  const [restCauseValue, setRestCauseValue] = useState({ value: 0, label: "Mola Seçiniz" });
  const [restCauseData, setRestCauseData] = useState([{ id: 0, name: "Mola Mevcut Değil" }]);
  const [delayTime, setDelayTime] = useState(undefined);
  const [startPicker, setStartPicker] = useState([new Date()])
  const [endPicker, setEndPicker] = useState([new Date()])
  const userData = JSON.parse(localStorage.getItem('userData'));
  const addParameters = {
    id: ShiftTargetId != undefined ? ShiftTargetId : undefined,
    theoreticalSpeed: theoreticalSpeed,
    numberOfCard: numberOfCard,
    targetCardCount:targetCardCount,
    delayTime: delayTime,
    shiftDefinitionId:shiftDefinitionId,
    restCauseId: restCauseValue.value,
    startDate: startPicker[0].toLocaleTimeString(),
    endDate: endPicker[0].toLocaleTimeString(),
    userId: userData != undefined ? userData.id : null,
    lineId: lineId
  };
  useEffect(() => {
    axios.get(process.env.REACT_APP_API_ENDPOINT + "api/RestCause/GetAll").then(res => {
      
      if (res.data.data.length > 0) {
        res.data.data.unshift({ id: null, name: "Mola Seçiniz" })
        setRestCauseData(res.data.data)
        setRestCauseValue({ value: null, label: "Mola Seçiniz" })
      }
    })

  }, [])
  useEffect(() => {
    if(restCauseData.length>1) {
      axios.get(process.env.REACT_APP_API_ENDPOINT + "api/ShiftTargetParameters/GetToday?userId=" + userData.id).then(res => {     
        if (res.data.data) {
          let data = res.data.data;
          setShiftTargetId(data.id);
          ShiftTarget(data.id);
          setTheoreticalSpeed(data.theoreticalSpeed);
          setTotalProductionCard(data.totalProductionCard)
          setNumberOfCard(null);
          setTargetCardCount(data.targetCardCount)
          let restCause = restCauseData.filter(x => x.id == data.restCauseId)[0]
          if (restCause) {
            setRestCauseValue({ value: restCause.id, label: restCause.name });
          }
          setDelayTime(data.delayTime);
          setEndPicker([new Date()]);
          setFinishTarget(data.editorId);
          setShiftDefinitionId(data.shiftDefinitionId)
          setShiftDefinitionName(data.shiftDefinition.name)
          setStartPicker([new Date(data.startDate)])
        }
        else{
  
          if(res.data.success){
            ShiftTarget(null);
            axios.get(process.env.REACT_APP_API_ENDPOINT + "api/ShiftTargetParameters/GetNowShiftTarget" ).then(res => {
              if(res.data.data){
    
                setShiftDefinitionName(res.data.data.vardiyaAdi)
                setShiftDefinitionId(res.data.data.id)
              }
            })
          }
          else{
            modalStateChange(false);
              toastData("Gün İçinde Vardiya Bitirilmiş",false)
          }
  
        }
      })
    } 
  
  }, [restCauseData])

  const saveShiftTarget = () => {
    if(ShiftTargetId){
      axios
      .post(
        process.env.REACT_APP_API_ENDPOINT + "api/ShiftTargetParameters/Update",
        addParameters
      )
      .then((res) => {
        if (res.data.success) {
          modalStateChange(false);
          toastData("Vardiya Bitirildi", true);
        } else {
          toastData(res.data.message, false);
        }
      })
      .catch((err) => toastData("Vardiya Kaydedilemedi !", false));
    }
    else{
      axios
      .post(
        process.env.REACT_APP_API_ENDPOINT + "api/ShiftTargetParameters/Add",
        addParameters
      )
      .then((res) => {
        if (res.data.success) {
          modalStateChange(false);
          toastData("Vardiya Başlatıldı", true);
        } else {
          toastData(res.data.message, false);
        }
      })
      .catch((err) => toastData("Vardiya Kaydedilemedi !", false));
    }


  }

  return (
    <div>
<Row>
{shiftDefinitionName ?              <Badge color='light-success'>{shiftDefinitionName}</Badge>:<Badge color='light-danger'>Vardiya Bulunamadı</Badge> } 
 
</Row>
{/* <Row>
        <Col sm={6}>      <div className="mb-1">
          <Label className="form-label" for="Hat">
            Vardiya Başlangıç Saati
          </Label>
          <Flatpickr
            style={{ textAlign: "center" }}
            value={startPicker}
            disabled={true}
            className='form-control'
            onChange={date => setStartPicker(date)}
            options={{
              enableTime: true,
            
              dateFormat: "d-m-Y H:i",

              locale: "tr",
              position: "auto center",

            }}
          />
        </div></Col>
        <Col sm={6}>        <div className="mb-1">
          <Label className="form-label" for="Hat">
            Vardiya Bitiş Saati
          </Label>
          <Flatpickr
            style={{ textAlign: "center" }}
            value={endPicker}
          disabled={true}
            className='form-control'
            onChange={date => setEndPicker(date)}
            options={{
              enableTime: true,
         
              dateFormat: "d-m-Y H:i",

              locale: "tr",
              position: "auto center",

            }}
          />
        </div></Col>
      </Row> */}

<Row>
        {ShiftTargetId===undefined  ? <>   

        <Col sm={6}>      <div className="mb-1">
          <Label className="form-label" for="Hat">
            Vardiya Hedef Miktarı Adet (Kart)
          </Label>
          <InputGroup>
            <Input
              id="numberOfCard"
              type="number"
              placeholder="Hedef Miktarı"
              onChange={(event) => setTargetCardCount(event.target.value)}
              value={targetCardCount}
            />
          </InputGroup>
        </div></Col></> : null}
      </Row>

      
      <Row>
      {ShiftTargetId===undefined  ? <>   
        <Col> <div className="mb-1">
          <Label className="form-label" for="Hat">
            Üretim Başlangıç Gecikme Zamanı
          </Label>
          <InputGroup>
            <Input
              id="delayTime"
              type="number"
              placeholder="Gecikme Zamanı (dk)"
              onChange={(event) => setDelayTime(event.target.value)}
              value={delayTime}
            />
          </InputGroup>
        </div></Col>
        <Col>
        
          <div className="mb-1" >
            <Label className="form-label" for="Hat">
              Üretim Başlangıç Gecikme Sebebi
            </Label>
            <Select
              isClearable={false}
              className='react-select'
              classNamePrefix='select'
              options={restCauseData.map((option) => ({
                value: option.id,
                label: option.name,
              }))}
         
              value={restCauseValue}
              onChange={(event) => setRestCauseValue({ value: event.value, label: event.label })}
              styles={{display: ShiftTargetId!=undefined ? 'none' : 'block', width: "100%" }}
            />

          </div></Col>
          </> : null}
     </Row>

       <Row>
        {ShiftTargetId!=undefined  ?  <>    <Col sm={  ShiftTargetId!=undefined ? 6:6}>      <div className="mb-1">
          <Label className="form-label" for="Hat">
            Teorik Hız (Dk.)
          </Label>
          <InputGroup>
            <Input
              id="theoreticallSoeed"
              type="number"
              placeholder="Teorik Hızı"
              onChange={(event) => setTheoreticalSpeed(event.target.value)}
              value={theoreticalSpeed}
            />
          </InputGroup>
        </div></Col>
       </> : null}
  
        {ShiftTargetId!=undefined ?  <>      <Col sm={6}>      <div className="mb-1">
          <Label className="form-label" for="Hat">
            Toplam Üretilen Kart Adeti
          </Label>
          <InputGroup>
            <Input
              id="numberOfCard"
              type="number"
              placeholder="Toplam Üretilen Kart"
              disabled={true}
              value={totalProductionCard}
            />
          </InputGroup>
        </div></Col>       <Col sm={6}>      <div className="mb-1">
          <Label className="form-label" for="Hat">
            Vardiya Sonu Arızalı Kart Adeti
          </Label>
          <InputGroup>
            <Input
              id="numberOfCard"
              type="number"
              placeholder="Kart Adeti"
              onChange={(event) => setNumberOfCard(event.target.value)}
              value={numberOfCard}
            />
          </InputGroup>
        </div></Col></> :null}
      </Row> 


      <div className="text-center">
       {!shiftDefinitionId ?     <Button  className="me-1" color="primary" disabled={true}>
        Vardiya Bulunamadı
        </Button>:     <Button  className="me-1" color="primary" onClick={() => saveShiftTarget()}>
          {ShiftTargetId==undefined? "Vardiya Başlat":"Vardiya Bitir"}
        </Button>} 

  
        <Button
          color="secondary"
          outline
          onClick={() => modalStateChange(false)}
        >
          İptal
        </Button>
      </div>
    </div>


  );
};

export default ShiftTarget;
