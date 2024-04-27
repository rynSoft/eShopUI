import "@styles/base/core/menu/menu-types/vertical-menu.scss";
import "@styles/base/core/menu/menu-types/vertical-overlay-menu.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { Form, Popconfirm, Table } from 'antd';
import React, { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
    Button,
    Card,
    Col,
    Input,
    Row
} from "reactstrap";
import FormInput from "../../../@core/components/FormInput";
import './NewProduction.css';
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
        if (record[dataIndex] === "Ürün Adını Giriniz" ||
            record[dataIndex] === "Barkodu Okutun" ||
            record[dataIndex] === "Düşüm Miktarını Girin")
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
            console.log('Save failed:', errInfo);
        }
    };
    let childNode = children;
    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: false,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
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
    const [dataSource, setDataSource] = useState([]);
    const { t } = useTranslation();
    const [count, setCount] = useState(2);
    const handleDelete = (key) => {
        const newData = dataSource.filter((item) => item.key !== key);
        setDataSource(newData);
    };
    const defaultColumns = [
        {
            title: 'Ürün Adı',
            dataIndex: 'productName',
            width: '30%',
            editable: true,
        },
        {
            title: 'Kod',
            dataIndex: 'code',
            editable: true
        },
        {
            title: 'Düşüm Miktarı',
            dataIndex: 'decreaseQty',
            editable: true
        },
        {
            title: 'İşlem',
            width: "5%",
            dataIndex: 'operation',
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <Popconfirm title="Silmek istediğinize emin misiniz?" onConfirm={() => handleDelete(record.key)}>
                        <a>Sil</a>
                    </Popconfirm>
                ) : null,
        },
    ];
    const handleAdd = () => {
        const newData = {
            key: count,
            productName: "Ürün Adını Giriniz",
            code: 'Barkodu Okutun',
            decreaseQty: `Düşüm Miktarını Girin`
        };
        setDataSource([...dataSource, newData]);
        setCount(count + 1);
    };
    const handleSave = (row) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        const modified = newData.map(data => {
            return {
                ...data,
                code: data.code.replaceAll("ç", ".")
            };
        });
        console.log(modified)
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
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });
    const handleSaveProduction = (data) => {
        const uretimBilgisi = data;
        const hammadeBilgisi= dataSource
        console.log(uretimBilgisi);
        console.log(hammadeBilgisi)
        // axios.post(process.env.REACT_APP_API_ENDPOINT+"")
    };
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = data => handleSaveProduction(data);
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
                                            <Card style={{ height: "100%" }}>
                                                <h1 className="display-6 mx-2 mt-1">{t("uretimBilgisi")}</h1>
                                                <hr />
                                                <br></br>
                                                <dl>
                                                    <Row className={"align-items-center"}>
                                                        <Col sm="3" className=" text-end text-uppercase">
                                                            <dt>{t('Üretim Adı').toLocaleUpperCase()}</dt>
                                                        </Col>
                                                        <Col className="mx-2" >
                                                            <dd>
                                                                <FormInput
                                                            type="text"
                                                            placeholder="Üretim Adı Giriniz"
                                                                name="productionName"
                                                               register={register}
                                                            /></dd>
                                                        </Col>
                                                    </Row>
                                                </dl>
                                                <dl>
                                                    <Row className={"align-items-center"}>
                                                        <Col sm="3" className=" text-end text-uppercase">
                                                            <dt>{t('Açıklama').toLocaleUpperCase()}</dt>
                                                        </Col>
                                                        <Col className="mx-2" >
                                                            <dd>
                                                                <FormInput placeholder="Açıklama Giriniz"
                                                                name="description"
                                                                register={register}
                                                            /></dd>
                                                        </Col>
                                                    </Row>
                                                </dl>
                                                <dl>
                                                    <Row className={"align-items-center"}>
                                                        <Col sm="3" className=" text-end text-uppercase">
                                                            <dt>{t('Üretim Adedi').toLocaleUpperCase()}</dt>
                                                        </Col>
                                                        <Col className="mx-2" >
                                                            <dd>
                                                                 <FormInput
                                                                onKeyPress={(event) => {
                                                                    if (!/[0-9]/.test(event.key)) {
                                                                        event.preventDefault();
                                                                    }
                                                                }}
                                                                placeholder="Üretim Adedi Giriniz"
                                                                name="desciptionQty"
                                                                register={register}
                                                            /></dd>
                                                        </Col>
                                                    </Row>
                                                </dl>
                                                <dl>
                                                    <Row className={"align-items-center"}>
                                                        <Col sm="3" className=" text-end text-uppercase">
                                                            <dt>{t('Açılış Tarihi').toLocaleUpperCase()}</dt>
                                                        </Col>
                                                        <Col className="mx-2" >
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
                                                            /></dd>
                                                        </Col>
                                                    </Row>
                                                </dl>
                                                <dl>
                                                    <Row className={"align-items-center"}>
                                                        <Col sm="3" className=" text-end text-uppercase">
                                                            <dt>{t('Ürün Geçiş Süresi').toLocaleUpperCase()}</dt>
                                                        </Col>
                                                        <Col className="mx-2" >
                                                            <dd>
                                                                <FormInput
                                                                type="time"
                                                                name="transitionTime"
                                                                register={register}
                                                            />
                                                            </dd>
                                                        </Col>
                                                    </Row>
                                                </dl>

                                            </Card>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                        <Col sm={8}>
                            <PerfectScrollbar
                                className='main-menu-content'
                                options={{ suppressScrollX: false }}
                                style={{ height: "76vh" }}>
                                <Row>
                                    <Col>
                                        <Row>
                                            <Col sm={12} >

                                                <h1 className="display-6 mx-2 mt-1">{t("Hammadde Bilgisi")}</h1>
                                                <hr />
                                                <div style={{ textAlign: "end" }}>
                                                    <Button
                                                        onClick={handleAdd}
                                                        color="success"
                                                        outline
                                                        style={{
                                                            marginBottom: 16,
                                                        }}
                                                    >
                                                        Hammadde Ekle
                                                    </Button>

                                                </div>
                                                <Table
                                                    haderBg="#283046"
                                                    components={components}
                                                    rowClassName={() => 'editable-row'}
                                                    bordered
                                                    dataSource={dataSource}
                                                    columns={columns}

                                                />
                                                <Row className={"mt-2"}>
                                                    <div style={{ textAlign: "end" }}>
                                                        <Button
                                                            color="success"
                                                            outline
                                                            style={{
                                                                marginBottom: 16,
                                                            }}
                                                            type="submit"
                                                        >
                                                            Kaydet
                                                        </Button>
                                                    </div>
                                                </Row>
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
