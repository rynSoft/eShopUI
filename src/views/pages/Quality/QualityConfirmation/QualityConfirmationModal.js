import { Col, Row } from "antd";
import Cleave from "cleave.js/react";
import { useState } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown, Info, Plus, PlusSquare, Printer, Trash2 } from "react-feather";
import { Button, ButtonGroup, Input, Label, Modal, ModalBody, ModalHeader, Table, UncontrolledTooltip } from "reactstrap";
import { selectThemeColors } from "@utils";
import Select from "react-select";
import { useEffect } from "react";

import axios from "axios";
import { useSkin } from '@hooks/useSkin'
const QualityConfirmationModal = (props) => {
    const { modalState, setModal, confirmation, toastData } = props

    const save = () => {


        axios.put(
            process.env.REACT_APP_API_ENDPOINT + "api/QualityOperation/UpdateConfirmation?id="+confirmation.id
          
        ).then((res) => {
    
            if (res.data.success) {

                toastData("Operasyon Onaylama Başarılı", true)
                setModal(false)
            }
            else {
                toastData("Operasyon  Onaylama  Başarısız", false)
            }
        }).catch((error) => toastData("Operasyon  Onaylama Başarısız", false));
    }


    return (
        <Modal size="sm"  isOpen={modalState} toggle={() => setModal(!modalState)}
            className='modal-dialog-centered'>
            <ModalHeader toggle={() => setModal(!modalState)}>{confirmation.operation} Onay İşlemi</ModalHeader>
            <ModalBody>
                <div style={{ textAlign: "center" }}>
                    {confirmation.operation}  Operasyonu
                </div>
                <div style={{ textAlign: "center" }}>
                    {confirmation.name}  {confirmation.surName} Personeline Atanacak !
                </div>

                <div className="text-center">
                    <Button
                        className="me-1"
                        color="primary"
                        onClick={save}
                    >Onay
                    </Button>
                    <Button color="secondary" onClick={() => setModal(false)} outline>
                        İptal
                    </Button>
                </div>
            </ModalBody>
        </Modal>
    );
};

export default QualityConfirmationModal;
