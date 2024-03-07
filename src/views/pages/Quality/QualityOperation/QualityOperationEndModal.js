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
import FileUploaderRestrictions from "./FileUploaderRestrictions";
const QualityOperationEndModal = (props) => {
    const { modalState, setModal, operationId, qualityId, toastData,modalType } = props
    const [imagePath, setImagePath] = useState("");
    const handleImage = (msg) => setImagePath(msg);
    const [newImageBackup, setNewImage] = useState("");
    return (
        <Modal size="sm" isOpen={modalState} toggle={() => setModal(!modalState)}
            className='modal-dialog-centered'>
            <ModalHeader toggle={() => setModal(!modalState)}>{modalType=="Tamamla" ? "Operasyon Tamamla":"Belge Ekle"}</ModalHeader>
            <ModalBody>

                <div className='mb-1'>
                    <Label className='form-label' for='ad'>
                        Dosya
                    </Label>
                    <FileUploaderRestrictions
                    modalType={modalType}
                        handleImagePath={handleImage}
                        setModal={setModal}
                        toastData={toastData}
                        operationId={operationId}
                        qualityId={qualityId}
                        imageData={imagePath}
                        imageDataBackup={newImageBackup}
                    />
                </div>
            </ModalBody>
        </Modal>
    );
};

export default QualityOperationEndModal;
