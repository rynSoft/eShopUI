// ** React Imports
import { useState, Fragment } from "react";
import imageCompression from 'browser-image-compression';
// ** Reactstrap Imports
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Button,
  ListGroup,
  ListGroupItem,
  Label,
  Input,
  Spinner,
} from "reactstrap";

// ** Custom Components
import Avatar from "@components/avatar";
import ExtensionsHeader from '@components/extensions-header'
// ** Styles
import "@styles/react/libs/file-uploader/file-uploader.scss";
// ** Third Party Imports
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import { X, DownloadCloud } from "react-feather";
import axios from "axios";

const ErrorToast = () => (
  <Fragment>
    <div className="toastify-header">
      <div className="title-wrapper">
        <Avatar size="sm" color="danger" icon={<X size={12} />} />
        <h6 className="toast-title">Hata!</h6>
      </div>
    </div>
    <div className="toastify-body">
      <span role="img" aria-label="toast-text">
        Seçilen Dosya Formatı Geçersiz
      </span>
    </div>
  </Fragment>
);

const FileUploaderRestrictions = ({
  handleImagePath,
  modalType,
  setModal, operationId, qualityId, toastData,
  imageData,
  imageDataBackup,
}) => {

  // ** State
  const [files, setFiles] = useState([]);

  const [ButtonValue, setButtonValue] = useState(false);
  const [description, setDescription] = useState("")
  const { getRootProps, getInputProps } = useDropzone({
    multiple: true,
    accept: "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,image/png,image/jpg,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword",

    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length) {
        toast.error(<ErrorToast />, { icon: false, hideProgressBar: true });
      } else {
        setFiles([
          ...files,
          ...acceptedFiles.map((file) => Object.assign(file)),
        ]);
      }
    },
  });
  const handleImageBase64 = () => {
    setButtonValue(true);
    const base64ListResponse = [];
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1400,
      useWebWorker: true,
    };



    Promise.all(
      files.map((file, index) => file.type == "image/png" || file.type == "image/jpg" ?
        imageCompression(file, options).then((image) =>
          getBase64(image).then((result) => {

            let resultBase = result.replace(/^data:image\/[a-z]+;base64,/, "");
            base64ListResponse.push({ data: resultBase, dataType: file.type, description: description, qualityOperationId: operationId });
          })
        ) : getBase64(file).then((result) => {
          if (result == "data:") {
            toastData("Dosya İçeriği Boş Olamaz !", false)
            base64ListResponse.push({ data: result, dataType: file.type, description: description, qualityOperationId: operationId });

          }
          else {
            let resultBase = result.replace("data:" + file.type + ";base64,", "");
            base64ListResponse.push({ data: resultBase, dataType: file.type, description: description, qualityOperationId: operationId });
          }

        })


      )
    ).then(() => {


      saveResponse(base64ListResponse);
    });
  };

  const getBase64 = (file) => {
    return new Promise((resolve) => {
      let baseURL = "";
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        baseURL = reader.result;
        resolve(baseURL);
      };
    });
  };
  const handleRemoveFile = (file) => {
    const uploadedFiles = files;
    const filtered = uploadedFiles.filter((i) => i.name !== file.name);
    handleImagePath(imageDataBackup);
    setFiles([...filtered]);
  };

  const renderFileSize = (size) => {
    if (Math.round(size / 100) / 10 > 1000) {
      return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`;
    } else {
      return `${(Math.round(size / 100) / 10).toFixed(1)} kb`;
    }
  };

  const fileList = files.map((file, index) => (

    <ListGroupItem
      key={`${file.name}-${index}`}
      className="d-flex align-items-center justify-content-between"
    >
      <div className="file-details d-flex align-items-center">

        {file.type == "image/png" || file.type == "image/jpg" ? <div className="file-preview me-1">
          <img
            className="rounded"
            alt={file.name}
            src={URL.createObjectURL(file)}
            height="28"
            width="28"
          />
        </div> : null}



        {file.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || file.type == "application/vnd.ms-excel" ? <div className="file-preview me-1">
          <img
            className="rounded"
            alt={file.name}
            src={require('@src/assets/images/logo/excel.png').default}
            height="28"
            width="28"
          />
        </div> : null}

        {file.type == "application/pdf" ? <div className="file-preview me-1">
          <img
            className="rounded"
            alt={file.name}
            src={require('@src/assets/images/logo/pdf.png').default}
            height="28"
            width="28"
          />
        </div> : null}
        {file.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.type == "application/msword" ? <div className="file-preview me-1">
          <img
            className="rounded"
            alt={file.name}
            src={require('@src/assets/images/logo/word.png').default}
            height="28"
            width="28"
          />
        </div> : null}

        <div>
          <p className="file-name mb-0">{file.name}</p>

          <p className="file-size mb-0">{renderFileSize(file.size)}</p>
        </div>
      </div>
      <Button
        color="danger"
        outline
        size="sm"
        className="btn-icon"
        onClick={() => handleRemoveFile(file)}
      >
        <X size={14} />
      </Button>
    </ListGroupItem>
  ));

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };
  const saveResponse = (data) => {
    let saveData;
    if (data.length == 0) {
      saveData = [{
        qualityOperationId: operationId,
        description: description
      }]
    }
    else {
      saveData = data;
    }
    if (modalType == "Tamamla") {
      axios.post(
        process.env.REACT_APP_API_ENDPOINT + "api/QualityOperationDocument/AddDocumentList", saveData
      ).then((res) => {
        if (res.data.success) {
          toastData("Operasyon Süreci Bitirildi.", true)
          setModal(false)
        }
        else {
          toastData("Operasyon Süreci Bitirilemedi.", false)
        }
        setButtonValue(false)
      }).catch((error) => { setButtonValue(false), toastData("Operasyon Süreci Bitirilemedi", false) });
    }
    else if(modalType=="Belge"){

      axios.post(
        process.env.REACT_APP_API_ENDPOINT + "api/QualityOperationDocument/AddDocumentOperation", saveData
      ).then((res) => {
        if (res.data.success) {
          toastData("Operasyon Belgeleri Eklendi.", true)
          setModal(false)
        }
        else {
          toastData("Operasyon Belgeleri Eklenemedi.", false)
        }
        setButtonValue(false)
      }).catch((error) => { setButtonValue(false), toastData("Operasyon Belgeleri Eklenemedi.", false) });

      
    }

  }

  return (
    <div>




      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <div className='d-flex align-items-center justify-content-center flex-column'>
          <DownloadCloud size={64} />
          <h5>Operasyon Dosyası Eklemek İçin Tıklayınız...</h5>

        </div>
      </div>
      {files.length ? (
        <Fragment>
          <PerfectScrollbar
            options={{ wheelPropagation: false, suppressScrollX: true }}

            style={{ maxHeight: 200, marginTop: 20 }}
          >
            <ListGroup className='my-2'>{fileList}</ListGroup>
          </PerfectScrollbar>
        </Fragment>
      ) : null}

      <div className='mb-1'>
        <Label className='form-label' for='ad'>
          Açıklama
        </Label>
        <Input
          id='ad'
          type="textarea"

          placeholder='Açıklama'
          onChange={(event) => setDescription(event.target.value)}
          value={description}
        />
      </div>
      <div className="text-center">
        {!ButtonValue ? (
          <Button
            className="me-1"
            color="primary"
            onClick={handleImageBase64}
          >
            Kaydet
          </Button>
        ) : (
          <Button className="me-1" color="primary" disabled>
            <Spinner color="white" size="sm" />
            <span className="ms-50">{modalType == "Tamamla" ? "Operasyon Tamamlanıyor.." : "Belge Ekleniyor..."}.</span>
          </Button>
        )}
        <Button color="secondary" outline onClick={() => setModal(false)}>
          İptal
        </Button>
      </div>
    </div>
  );
};

export default FileUploaderRestrictions;
