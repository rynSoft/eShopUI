import { Col, Row } from "antd";
import Cleave from "cleave.js/react";
import { useState } from "react";

import { Button, ButtonGroup, Input, InputGroup, Label, Modal, ModalBody, ModalHeader, Table, UncontrolledTooltip } from "reactstrap";
import { selectThemeColors } from "@utils";
import Select from "react-select";
import { useEffect } from "react";

import axios from "axios";
import { useSkin } from '@hooks/useSkin'
const NewOperationModal = (props) => {
    const { userData, setModal, modalState, toastData, qualityId, updateOperationData } = props
    const [onaylayan, setOnaylayan] = useState({ value: 0, label: 'Personel Yok' })
    const [operation, setOperation] = useState("");
    const [sorumlu, setSorumlu] = useState({ value: 0, label: 'Personel Yok' })
    const [yetkili, setYetkili] = useState({ value: 0, label: 'Personel Yok' })
    const [updateData, setUpdateData] = useState(false)
    const [operationId, setOperationId] = useState(0)
    useEffect(() => {
        if (userData.length > 0) {
            setSorumlu({ value: userData[0].id, label: userData[0].name + ' ' + userData[0].surName })
            setYetkili({ value: userData[0].id, label: userData[0].name + ' ' + userData[0].surName })
            setOnaylayan({ value: userData[0].id, label: userData[0].name + ' ' + userData[0].surName })
        }
    }, [userData])

    useEffect(() => {
      
        if (updateOperationData) {
            let onaylayan=userData.find(x=>x.id==updateOperationData.sorumlu)
            let yetkili=userData.find(x=>x.id==updateOperationData.yetkili)
            let sorumlu=userData.find(x=>x.id==updateOperationData.onaylayan)
            setYetkili({ value:  yetkili?.id,label: yetkili?.name + ' ' + yetkili?.surName  })
            setOperationId(updateOperationData.id)
            setSorumlu({ value: sorumlu?.id,label: sorumlu?.name + ' ' + sorumlu?.surName })
            setOperation(updateOperationData.operation)
            setOnaylayan({ value:  onaylayan?.id,label: onaylayan?.name + ' ' + onaylayan?.surName  })
            setUpdateData(true)
        }
        else {
            setUpdateData(false)
        }
    }, [updateOperationData])


    const addOperation = () => {

        if(updateOperationData){
            axios.post(
                process.env.REACT_APP_API_ENDPOINT + "api/QualityOperation/Update",
                {
                    id:updateOperationData.id,
                    userLiableId: sorumlu.value,
                    authorizedPersonId:yetkili.value,
                    userApprovingId: onaylayan.value,
                    operation: operation,
                    qualityId: qualityId
                }
            ).then((res) => {
    
                if (res.data.success) {
    
                    toastData("Operasyon Güncelleme Başarılı", true)
                    setModal(false)
                }
                else {
                    toastData("Operasyon Güncelleme Başarısız", false)
                }
            }).catch((error) => toastData("Operasyon Güncelleme Başarısız", false));
        }
        else{
            axios.post(
                process.env.REACT_APP_API_ENDPOINT + "api/QualityOperation/Add",
                {
                    userLiableId: sorumlu.value,
                    authorizedPersonId:yetkili.value,
                    userApprovingId: onaylayan.value,
                    operation: operation,
                    qualityId: qualityId
                }
            ).then((res) => {
    
                if (res.data.success) {
    
                    toastData("Operasyon Ekleme Başarılı", true)
                    setModal(false)
                }
                else {
                    toastData("Operasyon Ekleme Başarısız", false)
                }
            }).catch((error) => toastData("Operasyon Ekleme Başarısız", false));
        }

    };

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

    return (
        <Modal size="lg" style={{ maxWidth: window.screen.width * 0.3, width: '100%' }} isOpen={modalState} toggle={() => setModal(!modalState)}
            className='modal-dialog-centered'>
            <ModalHeader toggle={() => setModal(!modalState)}>    {updateData ? "Operasyon Güncelle" : "Yeni Operasyon"} </ModalHeader>
            <ModalBody>


                <div className="mb-1">
                    <Label className="form-label" for="baslik">
                        Operasyon
                    </Label>
                    <InputGroup>
                        <Input
                            id="Operasyon"

                            placeholder="Operasyon"
                            onChange={(event) => setOperation(event.target.value)}
                            value={operation}
                        />
                    </InputGroup>
                </div>

                <div className="mb-1">
                    <Label className="form-label" for="Hat">
                        Sorumlu Teknisyen
                    </Label>
                    <Select
                        isClearable={false}
                        styles={styles}
                        className='react-select'
                        classNamePrefix='select'
                        options={userData.map((option) => ({
                            value: option.id,
                            label: option.name + ' ' + option.surName,
                        }))}
                        theme={selectThemeColors}
                        value={sorumlu}
                        defaultValue={sorumlu}
                        onChange={(event) => {
                            setSorumlu({ value: event.value, label: event.label });
                        }}
                    />
                </div>
                <div className="mb-1">
                    <Label className="form-label" for="Hat">
                        Ekip Sözcüsü
                    </Label>
                    <Select
                        isClearable={false}
                        styles={styles}
                        className='react-select'
                        classNamePrefix='select'
                        options={userData.map((option) => ({
                            value: option.id,
                            label: option.name + ' ' + option.surName,
                        }))}
                        theme={selectThemeColors}
                        value={onaylayan}
                        defaultValue={onaylayan}
                        onChange={(event) => {

                            setOnaylayan({ value: event.value, label: event.label });
                        }}

                    />
                </div>
                <div className="mb-1">
                    <Label className="form-label" for="Hat">
                        Kalite
                    </Label>
                    <Select
                        isClearable={false}
                        styles={styles}
                        className='react-select'
                        classNamePrefix='select'
                        options={userData.map((option) => ({
                            value: option.id,
                            label: option.name + ' ' + option.surName,
                        }))}
                        theme={selectThemeColors}
                        value={yetkili}
                        defaultValue={yetkili}
                        onChange={(event) => {
                            setYetkili({ value: event.value, label: event.label });
                        }}
                    />
                </div>
                <div className="text-center">
                    <Button
                        className="me-1"
                        color="primary"
                        onClick={addOperation}
                    >
                        {updateData ? "Güncelle" : "Ekle"}
                    </Button>
                    <Button color="secondary" onClick={() => setModal(false)} outline>
                        İptal
                    </Button>
                </div>
            </ModalBody>
        </Modal>
    );
};

export default NewOperationModal;
