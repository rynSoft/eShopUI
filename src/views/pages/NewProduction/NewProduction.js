import "@styles/base/core/menu/menu-types/vertical-menu.scss";
import "@styles/base/core/menu/menu-types/vertical-overlay-menu.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { Form, Popconfirm, Table, InputNumber } from "antd";
import { useDropzone } from "react-dropzone";
import React, {
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
    X,
    DownloadCloud,
    Save,
  } from "react-feather";
import XLSX from "xlsx";
import Select from "react-select";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Button, Card, Col, Input, Label, Row } from "reactstrap";
import axios from "axios";
import FormInput from "../../../@core/components/FormInput";
import "./NewProduction.css";
import { useHistory } from "react-router-dom";
import toastData from "../../../@core/components/toastData";

const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell = ({
  title,
  editable,
  inputType,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    if (
      record[dataIndex] === "-" ||
      record[dataIndex] === "-" ||
      record[dataIndex] === "-" ||
      record[dataIndex] === "-" ||
      record[dataIndex] === "-" ||
      record[dataIndex] === "-" ||
      record[dataIndex] === "-"
    )
      form.setFieldsValue({
        [dataIndex]: "",
      });
    else
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };
  let childNode = children;
  const inputNode =
    inputType === "number" ? (
      <InputNumber ref={inputRef} onPressEnter={save} onBlur={save} />
    ) : (
      <Input ref={inputRef} onPressEnter={save} onBlur={save} />
    );
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        {inputNode}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

const NewProduction = () => {
  const history = useHistory();
  const [dataSource, setDataSource] = useState([]);
  const [tempdataSource, setTempDataSource] = useState([]);
  const { t } = useTranslation();
  const [count, setCount] = useState(2);
  const [productionId, setproductionId] = useState();
  const [stateAdd, satStateAdd] = useState(false);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [value, setValue] = useState("");
  const [wareHouseValue, setWareHouseValue] = useState({
    value: 0,
    label: "Seçiniz",
  });
  const [wareHouseData, setWareHouseData] = useState([
    { id: 0, name: "Seçiniz", code:'' },
  ]);

  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };
  const defaultColumns = [
    {
      title: "Ürün Adı",
      dataIndex: "name",
      editable: true,
    },
    {
      title: "Kod",
      dataIndex: "code",
      editable: true,
    },
    {
      title: "Açıklama",
      dataIndex: "description",
      editable: true,
    },
    {
      title: "Parti Numarası",
      dataIndex: "partyNumber",
      editable: true,
    },
    {
      title: "Miktar",
      dataIndex: "quantity",
      editable: true,
    },
    {
      title: "Düşüm Miktarı",
      dataIndex: "decreaseQuantity",
      editable: true,
    },
    {
      title: "Birim",
      dataIndex: "unit",
      editable: true,
    },
    {
      title: "İşlem",
      width: "5%",
      dataIndex: "operation",
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm
            title="Silmek istediğinize emin misiniz?"
            onConfirm={() => handleDelete(record.key)}
          >
            <a>Sil</a>
          </Popconfirm>
        ) : null,
    },
  ];
  const handleAdd = () => {
    let newData = {
      key: count,
      name: "-",
      code: "-",
      wareHouse: wareHouseValue.value > 0 ? wareHouseValue : '-',
      decreaseQuantity: 0,
      description: "-",
      partyNumber: "-",
      quantity: 0,
      unit: "-",
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };
  const handleSave = (row) => {
    let newData = [...dataSource];
    let index = newData.findIndex((item) => row.key === item.key);
    let item = newData[index];

    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    const modified = newData.map((data) => {
      return {
        ...data,
        code: data.code.replaceAll("ç", "."),
      };
    });
    setDataSource(modified);
  };
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType:
          col.dataIndex === "quantity" || col.dataIndex === "decreaseQuantity"
            ? "number"
            : "text",
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_ENDPOINT + "api/WareHouse/GetAll")
      .then((res) => {
        if (res.data.data.length > 0) {
          let data = [ { id: 0, name: "Seçiniz" }];
          res.data.data.forEach(element => {
            data.push({id:element.id,name:element.name,code:element.code})  ; 
          });
        
          setWareHouseData(data);
          setWareHouseValue({
            value: data[0].id,
            label: data[0].name,
          });
        }
      });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: (result) => {
      const reader = new FileReader();
      reader.onload = function () {
        const fileData = reader.result;
        const wb = XLSX.read(fileData, { type: "binary" });
        let i = 0;
        wb.SheetNames.forEach(function (sheetName) {
            debugger;
          if (i == 0) {
            const rowObj = XLSX.utils.sheet_to_row_object_array(
              wb.Sheets[sheetName],
              { defval: "" }
            );
            let tempData = [];
            rowObj.forEach(element => {
                let data = {
                    key: count,
                    name: element.URUN_ADI,
                    code: element.URUN_KODU,
                    decreaseQuantity: element.DUSUM_MIKTARI,
                    description: element.ACIKLAMA,
                    partyNumber: element.PARTI_NO,
                    quantity: element.MIKTAR,
                    unit: element.BIRIM,
                    wareHouseId:  wareHouseData.find(y=> y.code === element.URUN_YERI)?.id
                }
                debugger;
                tempData.push(data);
              });

            setDataSource(tempData);
          } 
        });
      };
      if (result.length && result[0].name.endsWith("xlsx")) {
        reader.readAsBinaryString(result[0]);
      } else {
        toast.error(<ErrorToast />, { icon: false, hideProgressBar: true });
      }
    },
  });

  const handleSaveProduction = async (data) => {
    const uretimBilgisi = data;
    if (productionId == null) {
      await axios
        .post(
          process.env.REACT_APP_API_ENDPOINT + "api/Production/Add",
          uretimBilgisi
        )
        .then((res) => {
          setproductionId(res.data.data);

          let logData = {
            productionId : res.data.data,
            message : 'Üretim İş Emri Oluşturuldu.',
            userId : userData.id
          }
           axios
        .post(
          process.env.REACT_APP_API_ENDPOINT + "api/ProductionLog/Add",
          logData
        );

          toastData(
            "İş Emri Kaydedildi. Hammadde ekleme işlemine başlayabilirsiniz.!",
            true
          );
        })
        .catch((err) => {
          toastData(err.message, false);
          return;
        });
    }

    if (productionId != null && stateAdd) {
      const hammadeBilgisi = dataSource;
      hammadeBilgisi.forEach(async (data) => {
        data.productionId = productionId;
        if (wareHouseValue.value > 0) 
            data.wareHouseId = wareHouseValue.value;

        await axios
          .post(process.env.REACT_APP_API_ENDPOINT + "api/Material/Add", data)
          .then((res) => console.log(res.data))
          .catch((err) => console.log(err));
      });
      history.push("production/" + productionId);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => handleSaveProduction(data);
  return (
    <Fragment>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col sm={4}>
              <Row>
                <Col>
                  <Row style={{ paddingTop: 10 }}>
                    <Col sm={12} style={{ paddingTop: 5 }}>
                      <Card
                        style={{
                          paddingLeft: 15,
                          paddingTop: 15,
                          height: "60rem",
                        }}
                      >
                        <h3>{t("isEmri")}</h3>
                        <hr />
                        <br></br>
                        <dl>
                          <Row className={"align-items-center"}>
                            <Col sm="3" className=" text-end text-uppercase">
                              <dt>{t("Üretim Emri").toLocaleUpperCase()}</dt>
                            </Col>
                            <Col className="mx-2">
                              <dd>
                                <FormInput
                                  type="text"
                                  placeholder="Üretim Emri Giriniz"
                                  name="orderNo"
                                  register={register}
                                />
                              </dd>
                            </Col>
                          </Row>
                        </dl>
                        <dl>
                          <Row className={"align-items-center"}>
                            <Col sm="3" className=" text-end text-uppercase">
                              <dt>{t("Üretim Adı").toLocaleUpperCase()}</dt>
                            </Col>
                            <Col className="mx-2">
                              <dd>
                                <FormInput
                                  type="text"
                                  placeholder="Üretim Adı Giriniz"
                                  name="uretimAdi"
                                  register={register}
                                />
                              </dd>
                            </Col>
                          </Row>
                        </dl>
                        <dl>
                          <Row className={"align-items-center"}>
                            <Col sm="3" className=" text-end text-uppercase">
                              <dt>{t("Açıklama").toLocaleUpperCase()}</dt>
                            </Col>
                            <Col className="mx-2">
                              <dd>
                                <FormInput
                                  placeholder="Açıklama Giriniz"
                                  name="aciklama"
                                  register={register}
                                />
                              </dd>
                            </Col>
                          </Row>
                        </dl>
                        <dl>
                          <Row className={"align-items-center"}>
                            <Col sm="3" className=" text-end text-uppercase">
                              <dt>{t("Üretim Adedi").toLocaleUpperCase()}</dt>
                            </Col>
                            <Col className="mx-2">
                              <dd>
                                <FormInput
                                  onKeyPress={(event) => {
                                    if (!/[0-9]/.test(event.key)) {
                                      event.preventDefault();
                                    }
                                  }}
                                  placeholder="Üretim Adedi Giriniz"
                                  name="quantity"
                                  register={register}
                                />
                              </dd>
                            </Col>
                          </Row>
                        </dl>
                        <dl>
                          <Row className={"align-items-center"}>
                            <Col sm="3" className=" text-end text-uppercase">
                              <dt>{t("Açılış Tarihi").toLocaleUpperCase()}</dt>
                            </Col>
                            <Col className="mx-2">
                              <dd>
                                <FormInput
                                  onKeyPress={(event) => {
                                    if (!/[0-9]/.test(event.key)) {
                                      event.preventDefault();
                                    }
                                  }}
                                  type="date"
                                  name="startDate"
                                  register={register}
                                />
                              </dd>
                            </Col>
                          </Row>
                        </dl>
                        <Row className={"mt-2"}>
                          <div style={{ textAlign: "end", paddingRight: 40 }}>
                            <Button
                              outline
                              style={{
                                width: "20%",
                                height: 50,
                                backgroundColor: "#8576FF",
                                color: "#FFFFFF",
                              }}
                              type="submit"
                            >
                              Kaydet
                            </Button>
                          </div>
                        </Row>
                      </Card>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col sm={8}>
              <PerfectScrollbar
                className="main-menu-content"
                options={{ suppressScrollX: true }}
                suppressScrollX
                style={{ height: "76vh", width: "100%" }}
              >
                <Row>
                  <Col>
                    <Row style={{ paddingTop: 5 }}>
                      
                      <Col sm={12} style={{ paddingTop: 5 }}>
                        <Card
                          style={{
                            paddingLeft: 15,
                            paddingTop: 15,
                            height: "60rem",
                          }}
                        >
                          <h3>{t("Hammadde Tanım")}</h3>
                          <hr />

                        
                          
                          <Row> 
                            <Col sm={1} style={{ paddingLeft: 10 }}>
                              <Label style={{ paddingTop:40, paddingLeft: 10 }}>DEPO/RAF SEÇİMİ</Label>
                            </Col>
                            <Col sm={3} style={{ paddingTop:30 }}>
                              <Select 
                                isClearable={false}
                                className="react-select"
                                classNamePrefix="select"
                                options={wareHouseData.map((option) => ({
                                  value: option.id,
                                  label: option.name,
                                }))}
                                value={wareHouseValue}
                                onChange={(event) =>
                                  setWareHouseValue({
                                    value: event.value,
                                    label: event.label,
                                  })
                                }
                                styles={{ width: "100%" }}
                              />
                            </Col>
                            <Col sm={5}>
                           
                            </Col>
                            <Col sm={3}>
                            <div
                                {...getRootProps({
                                  className: "dropzone mt-1 mb-2",
                                })}
                              >
                                <input {...getInputProps()} />
                                <div className="d-flex align-items-center justify-content-center flex-column">
                                  <DownloadCloud size={30} />
                                  <h5>Dosya sürükle ya da seçmek için tıkla</h5>
                                </div>
                              </div>
                            </Col>
                          </Row>

                          <Table style={{ paddingTop: 10 }}
                            haderBg="#1C1678"
                            components={components}
                            rowClassName={() => "editable-row"}
                            bordered
                            dataSource={dataSource}
                            columns={columns}
                          />

                          <Row className={"mt-2"}>
                            <Col sm={6}>
                            <div style={{ textAlign: "left", paddingRight: 10,paddingTop:10 }}>
                            <Button
                              onClick={handleAdd}
                              outline
                              style={{
                                width: "40%",
                                height: 40,
                                marginBottom: 16,
                                color: "white",
                                backgroundColor: "#d9138a",
                              }}
                            >
                              Hammadde Ekle
                            </Button>
                          </div>
                            </Col>
                            <Col sm={6}>
                              <div
                                style={{
                                  textAlign: "right",
                                  paddingTop: 10,
                                  paddingRight: 10,
                                }}
                              >
                                <Button
                                  outline
                                  style={{
                                    width: "40%",
                                    height: 50,
                                    marginBottom: 16,
                                    color: "black",
                                    backgroundColor: "#e2d810",
                                  }}
                                  type="submit"
                                  onClick={() => satStateAdd(true)}
                                >
                                  Tamamla
                                </Button>
                              </div>
                            </Col>
                          </Row>
                        </Card>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </PerfectScrollbar>
            </Col>
          </Row>
        </form>
      </div>
    </Fragment>
  );
};

export default NewProduction;
