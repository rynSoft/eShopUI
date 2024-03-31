import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import BarcodeReader from "react-barcode-reader";
import { Plus, Trash } from "react-feather";
import { Button, Col, Row, Table, Modal, ModalBody, ModalHeader, Input } from "reactstrap";
import toastData from "../../../@core/components/toastData/index.js";
import TimerCalculate from "../TimerCalculate/TimerCalculate.js";
function ProductHistoriesExpanded(props) {
    const [readerState, setReaderState] = React.useState(false);
    const [finishStateButton, setFinishStateButton] = React.useState(false);
    const [data, setData] = React.useState([]);
    const [dataLeft, setDataLeft] = React.useState([]);
    const [dataRight, setDataRight] = React.useState([]);
    const [finishData, setFinishData] = React.useState(false);
    const [tableState, setTableState] = React.useState(false);
    const [id, setId] = useState(props.match.params.id);
    const [routeId, setRouteId] = useState(props.match.params.routeId);
    const [previousProcess, setbackRoute] = useState(props.match.params.previousProcess);
    const [tabInfo, setTabInfo] = useState(JSON.parse(localStorage.getItem("lastTab")));
    const [IsProductPage, setIsProductPage] = useState(false);
    const [show, setShow] = useState(false)
    const [tempBarcode, setTempBarcode] = useState([]);
    const [quantities, setQuantities] = useState([]);
    const [deductionQuantities, setDeductionQuantities] = useState([]);
    const [barcodes, setBarcodes] = useState([])
    const [userName, setuserName] = useState(JSON.parse(localStorage.getItem("userData")).userNameSurname);

    const handleError = (error) => {
        console.log("Error " + error);
    };
    const readerStateFunction = (stateValue) => {
        setReaderState(stateValue);
    };
    const handleQuantityChange = (index, value) => {
        const newQuantities = [...quantities];
        newQuantities[index] = value;
        setQuantities(newQuantities);
    };
    const handleDeductionQuantityChange = (index, value) => {
        const newDeductionQuantities = [...deductionQuantities];
        newDeductionQuantities[index] = value;
        setDeductionQuantities(newDeductionQuantities);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSubmit = () => {
        let tArray = []
        barcodes.map((item, index) => {
            tArray = [...tArray, { "barcode": item, "qty": quantities[index], "deductionQty": deductionQuantities[index] }]
        })
        setTempBarcode([...tempBarcode, tArray[0]]);
        clearInputs();
    };
    const clearInputs = () => {
        setBarcodes([]);
        setQuantities([]);
        setDeductionQuantities([]);
        setShow(false);
    }
    useEffect(() => { console.log(tempBarcode); }, [tempBarcode])
    const loadData = () => {
        axios
            .get(
                process.env.REACT_APP_API_ENDPOINT +
                "api/ProductHistories/GetAllAsyncProductHistories?workProcessRouteId=" + routeId + "&productionId=" + id)
            .then((response) => {
                //setDataLeft(response.data.data.notRead.filter((x) => x.beginDate == null));
                setDataLeft(response.data.data.notRead);
                setDataRight(response.data.data.read);

                response.data.data.read.filter((x) => x.elapsedTime == null && x.beginDate != null).length > 0
                    ? setFinishStateButton(true)
                    : setFinishStateButton(false);
            });
    };


    const tableStateChange = () => {
        setTableState(true);
    };

    const addData = (datas) => {
        axios
            .put(
                process.env.REACT_APP_API_ENDPOINT + "api/ProductHistories/Add", datas
            )
            .then((res) => {
                if (res.data.success) {
                    loadData();
                } else {
                    toastData("Kayıt Yapılamadı !", false);
                }
            }).catch(err => toastData("Kayıt Yapılamadı !", false));
    };


    // const updateState = (e) => {
    //     setBarcodes(e);
    // };

    const updateState = (e) => {
        if (e.indexOf("UMM") == -1)
        {
            const min = 1;
            const max = 1000;
            const random = min + (Math.random() * (max - min));
        
            if (readerState) {
              let datas =
              {
                id: random,
                workProcessRouteId: routeId,
                qrCode: e.replaceAll("ç", ".").replaceAll("*", "-").replaceAll("+", "-"),
                beginDate: new Date().toISOString()
              };
              setDataRight([...dataRight,datas
              ]);
            }
        }
    }

    return (
        <Fragment><Row>

            <Col xl="12" md="12" xs="12" style={{ minHeight: 100 }}>
                <TimerCalculate
                    finishController={finishData}
                    tableController={tableStateChange}
                    cols={{ xl: "12", sm: "12", xs: "12" }}
                    workProcessRouteId={routeId}
                    screenName={tabInfo.name}
                    readerStateFunction={readerStateFunction}
                />
            </Col>
            <BarcodeReader onError={handleError} onScan={(err, result) => {
                 updateState(err.replaceAll("*", "-").replaceAll("*", "-").replaceAll("+", "-"));
        }}
      />
        </Row>
            <Row>
              
                <Row>

                    <Col xl="9" md="9" xs="9">
                    <Input
                                                    placeholder="Panel QrCode"
                                                    // onChange={(e) => handleQuantityChange(i, e.target.value)}
                                                />
                        {tableState ? (
                            <Table responsive style={{ marginTop: 10 }} size="sm">
                                <thead>
                                    <tr>
                                        <th>QrCode</th>
                                        <th>Baslangıc Tarihi</th>
                                        <th>Bitiş Tarihi</th>
                                        <th>Gecen Süre</th>
                                        <th>Kullanıcı</th>
                                        <th style={{ textAlign: "right" }}>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody >
                                    {dataRight.length > 0 ? (
                                        <>
                                            {dataRight.map((obj) =>
                                                <tr
                                                    style={{ backgroundColor: "#3e92cc", color: "white" }}
                                                    key={`${obj.id}`}
                                                >
                                                    <td style={{ color: "white" }}>{obj.qrCode}</td>
                                                    <td style={{ color: "white" }}>{obj.beginDate ? new Date(obj.beginDate).toLocaleDateString() : null} {obj.beginDate ? new Date(obj.beginDate).toLocaleTimeString() : null}</td>
                                                    <td style={{ color: "white" }}>{obj.endDate ? new Date(obj.endDate).toLocaleDateString() : null} {obj.endDate ? new Date(obj.endDate).toLocaleTimeString() : null}</td>
                                                    <td style={{ color: "white" }}>{obj.elapsedTime}</td>
                                                    <td style={{ color: "white" }}>{userName}</td>
                                                    <td></td>
                                                </tr>

                                            )}
                                        </>
                                    ) : null}
                                </tbody>
                            </Table>
                        ) : null}
                    </Col>
                    <Col xl="3" md="3" xs="32">
                    <Input
                                                    placeholder="Hammadde Barkod"
                                                    // onChange={(e) => handleQuantityChange(i, e.target.value)}
                                                />
<Table responsive style={{ marginTop: 10 }} size="sm">
    <thead>
        <tr>
            <th style={{ overflow: "hidden" }}>
                <Row style={{ alignItems: "center", justifyItems: "" }}>
                    <Col sm='10'>
                        <span>QrCode</span>
                    </Col>
                    <Col sm={'2'}>
                        <Button.Ripple
                            outline
                            id="excelPrint"
                            className="btn-icon rounded-circle pull-right"
                            color="success"
                            style={{ marginRight: 10, padding: 0 }}
                            onClick={() => {
                                setShow(true);
                            }}
                        >
                            <Plus size={17} />
                        </Button.Ripple>
                    </Col>
                </Row>
            </th>
        </tr>
    </thead>
    <tbody>
        {tempBarcode.map(barcode => {
            return (
                <tr>
                    <td>{barcode?.barcode} | {barcode?.qty} | {barcode.deductionQty}</td>
                </tr>
            )
        })}
    </tbody>
</Table>
</Col>
                </Row>
            </Row>
            <Modal
                isOpen={show}
                onClosed={() => { }}
                toggle={() => setShow(!show)}
                className='modal-dialog-centered modal-lg'
            >
                <ModalHeader className='bg-transparent' toggle={() => setShow(!show)}></ModalHeader>
                <ModalBody className='pb-5 px-sm-4 mx-50'>
                    <h1 className={`address-title text-center ${barcodes.length > 0 ? "mb-2" : "mb-1"}`}>Malzeme Ekle</h1>
                    {barcodes.length > 0 ? <></> : <p className='address-subtitle text-center mb-2 pb-75'>Barkodu Okutunuz</p>}

                    <Row className='gy-1 gx-2' onSubmit={() => { }}>
                        <BarcodeReader
                            onError={handleError}
                            onScan={(result, err) => {
                                if (barcodes.includes(result.replaceAll("*", "-").replaceAll("*", "-").replaceAll("+", "|")))
                                    toastData("Bu barkod zaten okutulmuş", false)
                                else
                                    setBarcodes([...barcodes, result.replaceAll("*", "-").replaceAll("*", "-").replaceAll("+", "|")])
                            }}
                        />
                        {barcodes?.map((_barcodes, i) => {
                            return (
                                <Fragment >
                                    <Row style={{ border: '1px solid gray', borderRadius: "20px", marginBottom: "10px", padding: "10px", alignItems: "center" }}>
                                        <Col sm='11'>
                                            <Col sm='12' className="mb-1">
                                                <Input style={{ textAlign: "center" }} value={_barcodes} disabled></Input>
                                            </Col>
                                            <Row>
                                                <Col sm='6'> <Input
                                                    placeholder="Miktar"
                                                    onChange={(e) => handleQuantityChange(i, e.target.value)}
                                                /></Col>
                                                <Col sm='6'> <Input
                                                    placeholder="Düşülecek Miktar"
                                                    onChange={(e) => handleDeductionQuantityChange(i, e.target.value)}
                                                /></Col>
                                            </Row>
                                        </Col>
                                        <Col>
                                            <Trash
                                                onClick={() => {
                                                    let updatedList = barcodes.splice(i, 1);
                                                    setData(updatedList);
                                                }
                                                }
                                            />
                                        </Col>
                                    </Row>
                                </Fragment>
                            )
                        })}
                        {
                            barcodes.length > 0 ? <Col className='text-center' xs={12}>
                                <Button type='submit' className='me-1 mt-2' color='primary' onClick={handleSubmit}>
                                    Kaydet
                                </Button>
                                <Button type='reset' className='mt-2' color='secondary' outline onClick={clearInputs}>
                                    İptal
                                </Button>
                            </Col> :
                                <></>
                        }

                    </Row>
                </ModalBody>
            </Modal>
        </Fragment >
    );
}

export default ProductHistoriesExpanded;
