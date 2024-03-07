import { selectThemeColors } from "@utils";
import Select from "react-select";
import axios from "axios";
import { Fragment, useState } from "react";
import { useEffect } from "react";
import { Button, Input, Label, Modal, ModalBody, ModalHeader } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import toastData from "../../../components/toastData";
const ShiftDefinitionController = (props) => {
    const { userData } = props;
    const [shiftDefinitionModal, setShiftDefinitionModal] = useState(false);
    const [form, setForm] = useState();
    const [lineData, setLineData] = useState([
        { id: 0, name: "Hat Yok" },
    ]);
    const [lineDetail, setLineDetail] = useState({ value: 0, label: 'Hat Yok' })

    const [shiftList, setShiftList] = useState([
        { id: 0, name: "Vardiya Yok" },
    ]);
    const [selectShift, setSelectShift] = useState({ value: 0, label: 'Vardiya Yok' })
    const [quantity, setQuantity] = useState("")
    const [description, setDescription] = useState("")


    useEffect(() => {

        axios.get(process.env.REACT_APP_API_ENDPOINT + 'api/Line/GetAllFilter').then(response => {
            if (response.data.data.length > 0) {
                setLineData(response.data.data)
                setLineDetail({ value: response.data.data[0].id, label: response.data.data[0].name })
            }
        })

        axios.get(process.env.REACT_APP_API_ENDPOINT + 'api/ShiftDefinition/GetAllFilter').then(response => {
            if (response.data.data.length > 0) {
                setShiftList(response.data.data)
                setSelectShift({ value: response.data.data[0].id, label: response.data.data[0].name })
            }
        })
    }, []);
    useEffect(() => {
        getUserShiftProcess();
    }, [userData]);

    let parameters = {
        explanation:description,
        shiftDefinitionId: selectShift.value,
        lineId: lineDetail.value,
        userId: userData?.id,
        targetQuantity: quantity
    }
    const saveData = () => {
        // axios
        //     .post(
        //         process.env.REACT_APP_API_ENDPOINT + "api/ShiftDefinitionProcess/AddUserShiftDefinition",
        //         parameters
        //     )
        //     .then((res) => {
        //         if (res.data.success) {
        //             toastData("Vardiya Hedefi Başarıyla Eklendi", true);
        //             setQuantity('');
        //             form && form.reset();
        //             setShiftDefinitionModal(false);
        //         } else {
        //             toastData(res.data.message, false);
        //         }
        //     })
        //     .catch((err) => toastData("Vardiya Hedefi  Eklenemedi!", false));
        axios
            .post(
                process.env.REACT_APP_API_ENDPOINT + "api/ShiftDefinitionProcess/Add",
                parameters
            )
            .then((res) => {
                if (res.data.success) {
                    toastData("Vardiya Hedefi Başarıyla Eklendi", true);
                    setQuantity('');
                    form && form.reset();
                   // setShiftDefinitionModal(false);
                } else {
                    toastData(res.data.message, false);
                }
            })
            .catch((err) => toastData("Vardiya Hedefi  Eklenemedi!", false));
    };

    const getUserShiftProcess = () => {
        if (userData?.id) {

            axios
                .get(
                    process.env.REACT_APP_API_ENDPOINT +
                    "api/ShiftDefinitionProcess/GetUserShiftDefinition?userId=" +
                    userData?.id
                )
                .then((response) => {
                    if (!response.data.success) {
                        setShiftDefinitionModal(true);
                    }//vardiya kontrolü

                });
        }
    }

    return (
        <Fragment>
            <Modal
                isOpen={shiftDefinitionModal}
                className='modal-dialog-centered modal-lg'
                contentClassName='pt-0'
            >
                <ModalHeader className='mb-1' tag='div'>
                    <h5 className='modal-title'>Vardiyadaki Hat Hedef Tanımlama Ekranı</h5>
                </ModalHeader>
                <ModalBody>
                    <AvForm onValidSubmit={saveData} ref={c => (setForm(c))}>
                        <div className="mb-1">
                            <Label className="form-label" for="Hat">
                                Vardiya
                            </Label>
                            <Select
                                isClearable={false}
                                className='react-select'
                                classNamePrefix='select'
                                options={shiftList.map((option) => (
                                    { value: option.id, label: option.name }
                                ))}
                                theme={selectThemeColors}
                                defaultValue={selectShift}
                                value={selectShift}
                                onChange={(event) => setSelectShift({ value: event.value, label: event.label })}
                            />
                        </div>
                        <div className="mb-1">
                            <Label className="form-label" for="Hat">
                                Hat
                            </Label>
                            <Select
                                isClearable={false}
                                className='react-select'
                                classNamePrefix='select'
                                options={lineData.map((option) => (
                                    { value: option.id, label: option.name }
                                ))}
                                theme={selectThemeColors}
                                defaultValue={lineDetail}
                                value={lineDetail}
                                onChange={(event) => setLineDetail({ value: event.value, label: event.label })}
                            />
                        </div>
                        <div className="mb-1">
                            <Label className="form-label" for="names">
                                Hedef Miktarı
                            </Label>
                            <AvField
                                name="names"
                                placeholder="Hedef Miktarı"
                                type="number"
                                onChange={(event) => setQuantity(event.target.value)}
                                value={quantity}
                                validate={{
                                    pattern: { value: "^[0-9]+$", errorMessage: 'Sayısal Değer İçermeli' },
                                    required: { value: true, errorMessage: "Hedef Miktar Boş Olamaz" },
                                    maxLength: { value: 10, errorMessage: "En Fazla 10 Karakter" },
                                }}
                            />
                        </div>
                        <div className="mb-1">
                            <Label className="form-label" for="code">
                                Açıklama
                            </Label>
                            <Input
                                id='code'
                                type="textarea"
                                placeholder='Açıklama'
                                onChange={(event) => setDescription(event.target.value)}
                                value={description}
                            />
                        </div>
                       

                        <div className="text-center">
                            <Button className="me-1" color="primary">
                                Kaydet
                            </Button>
                            <Button className="me-1" color="secondary" outline onClick={() => setShiftDefinitionModal(false
                            )} >
                                Kapat
                            </Button>

                        </div>
                    </AvForm>
                </ModalBody>
            </Modal>
        </Fragment>
    );
};
export default ShiftDefinitionController;
