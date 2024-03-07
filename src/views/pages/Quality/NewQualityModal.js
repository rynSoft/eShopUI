import { Col, Row } from "antd";
import Cleave from "cleave.js/react";
import { useState } from "react";
import DataTable from "react-data-table-component";
import { Check, ChevronDown, Info, Plus, PlusSquare, Printer, Trash2, XOctagon } from "react-feather";
import { Button, ButtonGroup, Input, Label, Modal, ModalBody, ModalHeader, Table, UncontrolledTooltip } from "reactstrap";
import { selectThemeColors } from "@utils";
import Select from "react-select";
import { useEffect } from "react";
import { toast, Slide } from "react-toastify";
import Avatar from "@components/avatar";
import axios from "axios";
import toastData from "../../../@core/components/toastData";
const NewQualityModal = (props) => {
    const [workOrderNumber, setWorkOrderNumber] = useState("")
    const [productionCode, setProductionCode] = useState("")
    const [serialCode, setSerialCode] = useState("")
    const [piece, setPiece] = useState("")
    const [userData, setUserData] = useState([])
    const [nonConformanceCode, setNonConformanceCode] = useState("")
    const [qualityTypeList, setQualityTypeList] = useState([
        { id: 1, ad: "Repair" },
        { id: 2, ad: "Rework" },
    ]);
    const [qualityType, setQualityType] = useState(1);
    const [mudurDetail, setMudurDetail] = useState([{ value: 0, label: 'Personel Yok' }])
    const [authorizedPersonDetail, setAuthorizedPersonDetail] = useState([{ value: 0, label: 'Personel Yok' }])
    

    const saveQuality = () => {

        if (mudurDetail.length > 0) {
            let quality = {
                workOrderNumber: workOrderNumber,
                productionCode: productionCode,
                serialCode: piece==1 ? serialCode:null,
                piece: piece,
                nonComplianceCode: nonConformanceCode,
                qualityType: qualityType
            }
            let operationList = []
            mudurDetail.map((mudur, index) => {
                operationList.push({ operation: operation[index], userLiableId: personelDetail[index].value, userApprovingId: mudurDetail[index].value,authorizedPersonId:authorizedPersonDetail[index].value})
            })

            axios.post(
                process.env.REACT_APP_API_ENDPOINT + "api/Quality/AddOperation",
                {
                    quality: quality,
                    operationList: operationList
                }
            ).then((res) => {

                if (res.data.success) {
                    setModal(false);
                    toastData("Kalite Emri Kaydı Başarılı", true)
                }
                else {
                    toastData("Kalite Emri Kaydı Başarısız", false)
                }
            }).catch((error) => toastData("Kalite Emri Kaydı Başarısız", false));
        }
        else {
            toastData("En Az 1 Personel Seçilmelidir", false)
        }



    };

    const [personelDetail, setPersonelDetail] = useState([{ value: 0, label: 'Personel Yok' }])


    const [operation, setOperation] = useState([""]);
    useEffect(() => {
        axios
            .get(process.env.REACT_APP_API_ENDPOINT + "api/Account/GetAllAsync")
            .then((res) => {
                if (res.data.data.length > 0) {
                    setUserData(res.data.data);

                    setMudurDetail([{
                        value: res.data.data[0].id,
                        label: res.data.data[0].name + " " + res.data.data[0].surName,
                    }])
                    setPersonelDetail([{
                        value: res.data.data[0].id,
                        label: res.data.data[0].name + " " + res.data.data[0].surName,
                    }])
                    setAuthorizedPersonDetail([{
                        value: res.data.data[0].id,
                        label: res.data.data[0].name + " " + res.data.data[0].surName,
                    }])
                  
                }
            });
    }, []);

    const [dataList, setDataList] = useState([{ id: 1, operasyon: 1, personel: 1, kaliteMüdürü: 1 }]);


    const styles = {
        menuList: (base) => ({
            ...base,
            height: "200px",

            "::-webkit-scrollbar": {
                width: "9px"
            },
            "::-webkit-scrollbar-track": {
                background: "dark"
            },
            "::-webkit-scrollbar-thumb": {
                background: "#888"
            },
            "::-webkit-scrollbar-thumb:hover": {
                background: "#555"
            }
        })
    }
    const { modalState, setModal } = props
    return (
        <Modal size="lg" style={{ maxWidth: window.screen.width * 0.7, width: '100%' }} isOpen={modalState} toggle={() => setModal(!modalState)}
            className='modal-dialog-centered'>
            <ModalHeader toggle={() => setModal(!modalState)}>Yeni Kalite Emri</ModalHeader>
            <ModalBody>
                <Row>
                    <Col span={6}>    <div className="mb-1">
                        <Label className="form-label" for="ad">
                            İş Emri No
                        </Label>
                        <Cleave
                            className="form-control"
                            placeholder="İş Emri No"
                            maxLength={30}
                            // options={{ numeral: true }}
                            id="numeral-formatting"
                            onChange={(event) => setWorkOrderNumber(event.target.value)}
                            value={workOrderNumber}
                        />
                    </div>
                        <div className="mb-1">
                            <Label className="form-label" for="ad">
                                Ürün Kodu
                            </Label>

                            {/* <InputGroupText>
    <User size={15} />
  </InputGroupText> */}
                            <Cleave
                                className="form-control"
                                placeholder="Ürün Kodu"
                                maxLength={30}

                                id="numeral-formatting"
                                onChange={(event) => setProductionCode(event.target.value)}
                                value={productionCode}
                            />
                        </div>

                        <div className="mb-1" style={{visibility:piece!=1 ?"hidden":"visible"}}>
                            <Label className="form-label" for="ad">
                                Seri No
                            </Label>

                            {/* <InputGroupText>
    <User size={15} />
  </InputGroupText> */}
                            <Cleave
                                className="form-control"
                                placeholder="Seri Numarası"
                                maxLength={30}
                                id="numeral-formatting"
                                onChange={(event) => setSerialCode(event.target.value)}
                                value={serialCode}
                            />
                        </div>


                    </Col>
                    <Col span={6} style={{ marginLeft: 20 }}>
                        <div className="mb-1">
                            <Label className="form-label" for="ad">
                                Ürün Adet
                            </Label>

                            {/* <InputGroupText>
    <User size={15} />
  </InputGroupText> */}
                            <Cleave
                                className="form-control"
                                placeholder="Ürün Adet Bilgisi"
                                maxLength={30}
                                options={{
                                    numeral: true,

                                }}
                                id="numeral-formatting"
                                onChange={(event) => setPiece(event.target.value)}
                                value={piece}
                            />
                        </div>
                        <div className="mb-1">
                            <Label className="form-label" for="Hat">
                                Uygunsuzluk Kodu
                            </Label>
                            <Cleave
                        className="form-control"
                        placeholder="Uygunsuzluk Kodu"
                        maxLength={30}
                 
                        id="numeral-formatting"
                        onChange={(event) => setNonConformanceCode(event.target.value)}
                        value={nonConformanceCode}
                     />
                        </div></Col>
                    <Col span={24} style={{ paddingLeft: 10 }}>
                        <div className="mb-1 text-center">
                            <ButtonGroup>
                                {qualityTypeList.map((prices) => (
                                    <Button
                                        color="primary"
                                        onClick={() => setQualityType(prices.id)}
                                        active={qualityType === prices.id}
                                        outline
                                        key={prices.id}
                                    >
                                        {prices.ad}
                                    </Button>
                                ))}
                            </ButtonGroup>
                        </div>
                        <Table >
                            <thead>
                                <tr>
                                    <th >Operasyon</th>
                                    <th>SORUMLU TEKNİSYEN</th>
                                    <th>EKİP SÖZCÜSÜ</th>
                                    <th>Kalite</th>
                                    <th style={{ textAlign: "right" }}>

                                        <div className='breadcrumb-right'>
                                            <Button.Ripple outline className="btn-icon rounded-circle pull-right" color='primary' id='newProductionOrder' onClick={() => {
                                                setDataList(oldArray => [...oldArray, { id: dataList.length == 0 ? 1 : dataList[dataList.length - 1].id + 1, operasyon: 1, personel: 1, kaliteMüdürü: 1 }]);
                                                setMudurDetail(oldArray => [...oldArray, { value: userData[0].id, label: userData[0].name + " " + userData[0].surName }]);
                                                setAuthorizedPersonDetail(oldArray => [...oldArray, { value: userData[0].id, label: userData[0].name + " " + userData[0].surName }]);
                                                setPersonelDetail(oldArray => [...oldArray, { value: userData[0].id, label: userData[0].name + " " + userData[0].surName }]);
                                                setOperation(oldArray => [...oldArray, ""]);
                                            }}>
                                                +
                                            </Button.Ripple>
                                            <UncontrolledTooltip placement='left' target='newProductionOrder'>
                                                Yeni Operasyon
                                            </UncontrolledTooltip>
                                        </div>


                                    </th>
                                </tr>
                            </thead>
                            <tbody >
                                {dataList.map((obj, index) =>
                                    <tr
                                        key={`${obj.id}`}
                                    >
                                        <td style={{ width: "33%" }}>                    <Input
                                            id="Operasyon"


                                            onChange={(event) => {
                                                const oprt = [...operation];
                                                oprt[index] = event.target.value;
                                                setOperation(oprt);
                                            }
                                            }
                                            value={operation[index]}
                                        /></td>
                                        <td>            <Select
                                            isClearable={false}
                                            styles={styles}
                                            className='react-select'
                                            classNamePrefix='select'
                                            options={userData.map((option) => ({
                                                value: option.id,
                                                label: option.name + ' ' + option.surName,
                                            }))}
                                            theme={selectThemeColors}
                                            value={personelDetail[index]}
                                            defaultValue={personelDetail[index]}
                                            onChange={(event) => {
                                                const newPersonel = [...personelDetail];
                                                newPersonel[index] = { value: event.value, label: event.label };
                                                setPersonelDetail(newPersonel);
                                            }}

                                        /></td>
                                        <td>            <Select
                                            isClearable={false}
                                            styles={styles}
                                            className='react-select'
                                            classNamePrefix='select'


                                            options={userData.map((option) => ({
                                                value: option.id,
                                                label: option.name + ' ' + option.surName,
                                            }))}
                                            theme={selectThemeColors}
                                            value={mudurDetail[index]}
                                            defaultValue={mudurDetail[index]}
                                            onChange={(event) => {

                                                const newMudur = [...mudurDetail];
                                                newMudur[index] = { value: event.value, label: event.label };
                                                setMudurDetail(newMudur);


                                            }}
                                        /></td>

<td>            <Select
                                            isClearable={false}
                                            styles={styles}
                                            className='react-select'
                                            classNamePrefix='select'
                                            options={userData.map((option) => ({
                                                value: option.id,
                                                label: option.name + ' ' + option.surName,
                                            }))}
                                            theme={selectThemeColors}
                                            value={authorizedPersonDetail[index]}
                                            defaultValue={authorizedPersonDetail[index]}
                                            onChange={(event) => {

                                                const newAuthPerson = [...authorizedPersonDetail];
                                                newAuthPerson[index] = { value: event.value, label: event.label };
                                                setAuthorizedPersonDetail(newAuthPerson);


                                            }}
                                        /></td>
                                        <td style={{ textAlign: "right" }}>                                     <div className='breadcrumb-right'>
                                            <Button.Ripple outline className="btn-icon  pull-right" color='danger' id='newProductionOrders' onClick={() => {
                                                {

                                                    setDataList(dataList.filter(item => item.id !== obj.id))
                                                    setMudurDetail(mudurDetail.filter((item, index2) => index2 !== index))
                                                    setAuthorizedPersonDetail(personelDetail.filter((item, index2) => index2 !== index))
                                                    setPersonelDetail(personelDetail.filter((item, index2) => index2 !== index))
                                                    setOperation(operation.filter((item, index2) => index2 !== index))
                                                }
                                            }}>

                                                <Trash2 size={14} />
                                            </Button.Ripple>
                                            <UncontrolledTooltip placement='left' target='newProductionOrders'>
                                                Sil
                                            </UncontrolledTooltip>
                                        </div>

                                            <div className="d-flex" style={{ textAlign: "right" }}>

                                            </div></td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Col>
                </Row>

                <div className="text-center">
                    <Button
                        disabled={mudurDetail.length == 0}
                        className="me-1"
                        color="primary"
                        onClick={saveQuality}
                    >
                        Kaydet
                    </Button>
                    <Button color="secondary" onClick={() => setModal(false)} outline>
                        İptal
                    </Button>
                </div>
            </ModalBody>
        </Modal>
    );
};

export default NewQualityModal;
