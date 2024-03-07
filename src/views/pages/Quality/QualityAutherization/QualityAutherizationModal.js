import { Col, Row } from "antd";
import Cleave from "cleave.js/react";
import { Fragment, useState } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown, Info, Plus, PlusSquare, Printer, Trash2 } from "react-feather";
import { Button, ButtonGroup, Input, Label, Modal, ModalBody, ModalHeader, Table, UncontrolledTooltip } from "reactstrap";
import { selectThemeColors } from "@utils";
import Select from "react-select";
import { useEffect } from "react";

import axios from "axios";
import { useSkin } from '@hooks/useSkin'
const QualityAutherizationModal = (props) => {
    const { modalState, setModal, filesList, toastData } = props
    const downloadItem = (downloadFile) => {

        console.log()
        const blob = b64toBlob(downloadFile.data, downloadFile.dataType);
        const blobUrl = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = blobUrl;
        let Type = downloadFile.dataType == "image/png" ? ".png" : "image/jpg" ? ".jpg" : downloadFile.dataType;
        Type = downloadFile.dataType == "application/pdf" ? ".pdf" : Type;
        Type = downloadFile.dataType == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ? ".xlsx" : Type;
        Type = downloadFile.dataType == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ? ".docx" : Type;
        Type = downloadFile.dataType == "application/msword" ? ".doc" : Type;
        Type = downloadFile.dataType == "application/vnd.ms-excel" ? ".xls" : Type;
        a.download = new Date().toLocaleString()+"." + Type;
        a.click();
     }
  
     const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];
  
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
           const slice = byteCharacters.slice(offset, offset + sliceSize);
  
           const byteNumbers = new Array(slice.length);
           for (let i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
           }
  
           const byteArray = new Uint8Array(byteNumbers);
           byteArrays.push(byteArray);
        }
  
        const blob = new Blob(byteArrays, { type: contentType });
        return blob;
     }


    return (
        <Modal size="sm"  isOpen={modalState} toggle={() => setModal(!modalState)}
            className='modal-dialog-centered'>
            <ModalHeader toggle={() => setModal(!modalState)}>OPERASYON BELGELERİ</ModalHeader>
            <ModalBody>
            <div className="expandable-content p-2 " style={{ textAlign: "center" }}>
            <h5>Belgeler</h5>

            {filesList.map((x, index) => {

               return <Fragment key={index} > {x.dataType ? (x.dataType == "image/png" || x.dataType == "image/jpg" ? <img
                  className="rounded" src={`data:image/jpeg;base64,${x.data}`} height="28" width="28" style={{ margin: 20, cursor: "pointer" }}
                  onClick={() => downloadItem(x)}
               /> :
                  x.dataType == "application/pdf" ? <img
                     className="rounded" src={require('@src/assets/images/logo/pdf.png').default} height="28" width="28" style={{ margin: 20, cursor: "pointer" }}
                     onClick={() => downloadItem(x)} /> :
                     x.dataType == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || x.dataType == "application/vnd.ms-excel" ? <img style={{ margin: 20, cursor: "pointer" }}
                        className="rounded" src={require('@src/assets/images/logo/excel.png').default} height="28" width="28"
                        onClick={() => downloadItem(x)} /> :
                        x.dataType == "application/msword" || x.dataType == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ? <img style={{ margin: 20, cursor: "pointer" }}
                           className="rounded" src={require('@src/assets/images/logo/word.png').default} height="28" width="28"
                           onClick={() => downloadItem(x)} /> : "diğer") : null}</Fragment>
            })

            }

            <h5>Belge Açıklaması</h5>{filesList.length > 0 ? filesList[0].description : null}
         </div>
            </ModalBody>
        </Modal>
    );
};

export default QualityAutherizationModal;
