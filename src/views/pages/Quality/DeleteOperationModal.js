import { Col, Row } from "antd";
import Cleave from "cleave.js/react";
import { useState } from "react";

import { Button, ButtonGroup, Input, InputGroup, Label, Modal, ModalBody, ModalHeader, Table, UncontrolledTooltip } from "reactstrap";
import { selectThemeColors } from "@utils";
import Select from "react-select";
import { useEffect } from "react";

import axios from "axios";
import { useSkin } from '@hooks/useSkin'
const DeleteOperationModal = (props) => {
    const {operationId,setModal,modalState,toastData} = props
    const deleteOperation = () => {
        axios.delete(
            process.env.REACT_APP_API_ENDPOINT + "api/QualityOperation/Delete",{ params: { Id:operationId } }

         ).then((res) => {
            
            if (res.data.success) {
                
               toastData("Operasyon Silme Başarılı", true)
               setModal(false)
            }
            else {
               toastData("Operasyon Silme Başarısız", false)
            }
         }).catch((error) => toastData("Operasyon Silme Başarısız", false));
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
            <ModalHeader toggle={() => setModal(!modalState)}>Yeni Operasyon</ModalHeader>
            <ModalBody>


                <div className="mb-1" style={{textAlign:"center"}}>
                    <Label className="form-label" for="baslik">
                        Seçili Operasyon Silinecek !
                    </Label>

                </div>

       

                <div className="text-center">
                    <Button
                        className="me-1"
                        color="primary"
                    onClick={deleteOperation}
                    >
                        Sil
                    </Button>
                    <Button color="secondary" onClick={() => setModal(false)} outline>
                        İptal
                    </Button>
                </div>
            </ModalBody>
        </Modal>
    );
};

export default DeleteOperationModal;
