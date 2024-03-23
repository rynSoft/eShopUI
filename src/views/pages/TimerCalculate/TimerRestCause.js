// ** React Imports
import { useState, Fragment, useEffect } from "react";
import { X } from "react-feather";
import {
  Modal,
  Input,
  Label,
  Button,
  ModalHeader,
  ModalBody,
} from "reactstrap";
Select;
import "@styles/react/libs/flatpickr/flatpickr.scss";
import Select from "react-select";
import axios from "axios";
import toastData from "../../../@core/components/toastData";

const TimerCauseModal = (props) => {
  const {
    modalFunction,
    provisionId,
    userId,
    PproductionProcess,
    shiftTargetParametersId,
  } = props;
  const modalClose = () => {
    modalFunction(false);
  };
  const [restCauseValue, setRestCauseValue] = useState({
    value: 0,
    label: "Mola Seçeneği Yok",
  });
  const [restCauseData, setRestCauseData] = useState([
    { id: 0, name: "Mola Seçeneği Yok" },
  ]);

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_ENDPOINT + "api/RestCause/GetAll")
      .then((res) => {
        if (res.data.data.length > 0) {
          setRestCauseData(res.data.data);
          setRestCauseValue({
            value: res.data.data[0].id,
            label: res.data.data[0].name,
          });
        }
      });
  }, []);
  const [description, setDescription] = useState("");
  const addParameters = {
    productionId: provisionId,
    restCauseId: restCauseValue.value,
    productionTimeStatus: 2,
    message: description,
    productionProcess: PproductionProcess,
    userId: userId,
    shiftTargetParametersId: shiftTargetParametersId,
  };
  const [modalActive, setModalActive] = useState(true);
  const CloseBtn = (
    <X className="cursor-pointer" onClick={modalClose} size={15} />
  );

  const saveData = () => {
    axios
      .post(
        process.env.REACT_APP_API_ENDPOINT +
          "api/WorkProcessRouteTimeHistories/Pause",
        addParameters
      )
      .then((res) => {
        if (res.data.success) {
          toastData("Mola Başarıyla Kaydedildi", true);
          modalFunction(true);
        } else {
          toastData("Mola Kaydedilemedi !", false);
        }
      })
      .catch((err) => toastData("Mola Kaydedilemedi !", false));
  };
  return (
    <Modal
      isOpen={modalActive}
      className="modal-dialog-centered modal-lg"
      contentClassName="pt-0"
    >
      <ModalHeader className="mb-1" close={CloseBtn} tag="div">
        <h5 className="modal-title">Mola</h5>
      </ModalHeader>
      <ModalBody className="flex-grow-1">
        <div className="mb-1">
          <Label className="form-label" for="baslik">
            Mola Tip
          </Label>

          <Select
            isClearable={false}
            className="react-select"
            classNamePrefix="select"
            options={restCauseData.map((option) => ({
              value: option.id,
              label: option.name,
            }))}
            value={restCauseValue}
            onChange={(event) =>
              setRestCauseValue({ value: event.value, label: event.label })
            }
            styles={{ width: "100%" }}
          />
        </div>

        <div className="mb-1">
          <Label className="form-label" for="ad">
            Açıklama
          </Label>
          <Input
            id="ad"
            type="textarea"
            placeholder="Açıklama"
            onChange={(event) => setDescription(event.target.value)}
            value={description}
          />
        </div>

        <div className="text-center">
          <Button className="me-1" color="primary" onClick={saveData}>
            Ekle
          </Button>
          <Button color="secondary" onClick={modalClose} outline>
            İptal
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default TimerCauseModal;
