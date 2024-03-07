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
const QualityProcessModal = (props) => {
    const { modalState, setModal, operationId,qualityId, toastData } = props


    const [qualityTypeList, setQualityTypeList] = useState([
        { id: 1, name: "Ekle" },
        { id: 2, name: "Çıkar" },
    ]);
    const [qualityType, setQualityType] = useState({ value: 1, label: "Ekle" })

    const [productionCode, setProductionCode] = useState("")
    const [lotInformation, setLotInformation] = useState("")
    const [description, setDescription] = useState("")
    const [piece, setPiece] = useState(0)
    const styles = {
        menuList: (base) => ({
            ...base,


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

    const save = () => {

        let params = {
            qualityId:qualityId,
            qualityOperationId: operationId,
            qualityProcessType: qualityType.value,
            productionCode: productionCode,
            lotInformation: lotInformation,
            description: description,
            piece: piece
        }
        axios.post(

            process.env.REACT_APP_API_ENDPOINT + "api/QualityInfo/Add",
            params
        ).then((res) => {

            if (res.data.success) {

                toastData("Operasyon İş Ekleme Başarılı", true)
                setModal(false)
            }
            else {
                toastData("Operasyon  İş Ekleme  Başarısız", false)
            }
        }).catch((error) => toastData("Operasyon  İş Ekleme  Başarısız", false));
    }


    return (
        <Modal size="lg" style={{ maxWidth: window.screen.width * 0.7, width: '100%' }} isOpen={modalState} toggle={() => setModal(!modalState)}
            className='modal-dialog-centered'>
            <ModalHeader toggle={() => setModal(!modalState)}>Operasyon İşlemi</ModalHeader>
            <ModalBody>
                <Row>
                    <Col span={24} style={{ paddingLeft: 10 }}>

                        <Table >
                            <thead>
                                <tr>
                                    <th >Tip</th>
                                    <th>Ürün Kodu</th>
                                    <th>LOT Bilgisi</th>
                                    <th>Tanım</th>
                                    <th>Adet</th>
                                </tr>
                            </thead>
                            <tbody >

                                <tr

                                >
                                    <td>            <Select
                                        isClearable={false}
                                        styles={styles}
                                        className='react-select'
                                        classNamePrefix='select'
                                        options={qualityTypeList.map((option) => ({
                                            value: option.id,
                                            label: option.name
                                        }))}
                                        theme={selectThemeColors}
                                        value={qualityType}
                                        defaultValue={qualityType}
                                        onChange={(event) => setQualityType({ value: event.value, label: event.label })}
                                    /></td>
                                    <td >                    <Input
                                        id="Operasyon"


                                        onChange={(event) => setProductionCode(event.target.value)}
                                        value={productionCode}
                                    /></td>
                                    <td >                    <Input
                                        id="Operasyon"


                                        onChange={(event) => setLotInformation(event.target.value)}
                                        value={lotInformation}
                                    /></td>
                                    <td >                    <Input
                                        id="Tanım"


                                        onChange={(event) => setDescription(event.target.value)}
                                        value={description}
                                    /></td>
                                    <td style={{ width: "10%" }}>                    <Input
                                        id="adet"
                                        onChange={(event) => {
                                            var pattern = /^\d+\.?\d*$/;
                                            if (event.target.value.match(pattern) != null) {

                                                setPiece(event.target.value)
                                            }

                                            else {
                                                setPiece(event.target.value.slice(0, -1))
                                            }
                                        }}

                                        value={piece}
                                    /></td>
                                </tr>

                            </tbody>
                        </Table>
                    </Col>
                </Row>

                <div className="text-center">
                    <Button
                        className="me-1"
                        color="primary"
                        onClick={save}
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

export default QualityProcessModal;
