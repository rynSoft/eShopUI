// ** React Imports
import { useState, Fragment } from "react";
import imageCompression from 'browser-image-compression';
// ** Reactstrap Imports

// import '@styles/react/libs/file-uploader/file-uploader.scss'
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Button,
  ListGroup,
  ListGroupItem,
} from "reactstrap";

// ** Custom Components
import Avatar from "@components/avatar";
import ExtensionsHeader from '@components/extensions-header'

// ** Third Party Imports
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import { X, DownloadCloud } from "react-feather";

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
  imageData,
  imageDataBackup,
}) => {
  // ** State
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: "image/*",
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length) {
        toast.error(<ErrorToast />, { icon: false, hideProgressBar: true });
      } else {

 
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1400,
          useWebWorker: true
        }
        imageCompression(acceptedFiles[0], options).then((image)=>
        getBase64(image)
        .then((result) => {
          let resultBase = result.replace(/^data:image\/[a-z]+;base64,/, "");
   
          handleImagePath(resultBase);

        })
        
        );
       
      setFiles([
        ...files,
        ...acceptedFiles.map((file) => Object.assign(file)),
      ])

      }
    },
  });

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
        <div className="file-preview me-1">
          <img
            className="rounded"
            alt={file.name}
            src={URL.createObjectURL(file)}
            height="28"
            width="28"
          />
        </div>
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

  return (
    <div>

      {files.length ? (
        <Fragment>
          <ListGroup className="my-2">{fileList}</ListGroup>
        </Fragment>
      ) : (
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          <div className="d-flex align-items-center justify-content-center flex-column">
            {imageData == "" || imageData == undefined ? null : (
              <div className="d-flex align-items-center justify-content-center flex-column">
                <div className="file-preview me-1 text-center">
                  <img
                    className="rounded text-center"
                    alt={"resim"}
                    src={`data:image/jpeg;base64,${imageData}`}
                    height="100"
                    width="100"
                  />
                </div>
              </div>
            )}
            <DownloadCloud size={64} />
            <h5>Profil Resmi</h5>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploaderRestrictions;
