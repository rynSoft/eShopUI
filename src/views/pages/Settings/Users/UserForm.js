import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import axios from "axios";
import { PropTypes } from "prop-types";
import { Row, Col, Form, Card, Label, Input, Button, CardBody, CardTitle, CardHeader, FormFeedback, Spinner } from 'reactstrap'
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { selectThemeColors } from '@utils'
import Select from "react-select";

import FileUploaderRestrictions from './FileUploaderRestrictions';
import toastData from '../../../../@core/components/toastData';
const UserForm = forwardRef((props, ref) => {
    const [ButtonValue, setButtonValue] = useState(false);
    const [imagePath, setImagePath] = useState("");
    const [name, setName] = useState("");
    const [newImageBackup, setNewImage] = useState("");
    useEffect(() => {
        getRoles();
        setImagePath(props.userData?.image)
        setNewImage(props.userData?.image)
    }, [props.userData])

    const [roles, setRoles] = React.useState();
    const handleImage = (msg) => setImagePath(msg);
    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
    const validation = 


    props.userData?.id ? yup.object().shape({
        name: yup.string().min(3, "En az 3 karakter olmalıdır!").required("Adı zorunlu alandır!"),
        surname: yup.string().min(3, "En az 3 karakter olmalıdır!").required("Soyadı zorunlu alandır!"),
        username: yup.string().min(3, "En az 3 karakter olmalıdır!").required("Kullanıcı Adı zorunlu alandır!"),
        email: yup.string().email("Hatalı e-posta formatı!").min(3, "En az 3 karakter olmalıdır!").required("E-posta zorunlu alandır!"),
        password: yup.string().min(6, "En az 6 karakter olmalıdır!").required("Parola zorunlu alandır!"),
        passwordConfirm: yup.string().min(6, "En az 6 karakter olmalıdır!").required("Parola Doğrula zorunlu alandır!").oneOf([yup.ref('password'), null], 'Parola eşleşmiyor!'),

        phone:   yup.string().matches(phoneRegExp, 'Telefon Formatı Geçersiz')
    }) :

        yup.object().shape({
            name: yup.string().min(3, "En az 3 karakter olmalıdır!").required("Adı zorunlu alandır!"),
            surname: yup.string().min(3, "En az 3 karakter olmalıdır!").required("Soyadı zorunlu alandır!"),
            username: yup.string().min(3, "En az 3 karakter olmalıdır!").required("Kullanıcı Adı zorunlu alandır!"),
            email: yup.string().email("Hatalı e-posta formatı!").min(3, "En az 3 karakter olmalıdır!").required("E-posta zorunlu alandır!"),
            phone:   yup.string().matches(phoneRegExp, 'Telefon Formatı Geçersiz'),
          
            password: yup.string().min(6, "En az 6 karakter olmalıdır!").required("Parola zorunlu alandır!"),
            passwordConfirm: yup.string().min(6, "En az 6 karakter olmalıdır!").required("Parola Doğrula zorunlu alandır!").oneOf([yup.ref('password'), null], 'Parola eşleşmiyor!'),
            roleId: yup.object()
                .shape({
                    label: yup.string().required("Rol zorunlu alandır!"),
                    value: yup.string().required("Rol zorunlu alandır!")
                }).required("Rol zorunlu alandır!")
        })

    const {
        reset,
        control,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm({ mode: 'onChange', resolver: yupResolver(validation) })

    useImperativeHandle(ref, () => ({
        submitForm() {
            //form.submit();
        }
    }));




    const onSubmit = (e) => {
        setButtonValue(true)
        const data = props.userData?.id ? {
            id: props.userData?.id,
            name: e.name != null && e.name.trim() != '' ? e.name : null,
            surName: e.surname != null && e.surname.trim() != '' ? e.surname : null,
            email: e.email != null && e.email.trim() != '' ? e.email : null,
            phone: e.phone != null ? e.phone : null,
            
            userName: e.username != null && e.username.trim() != '' ? e.username : null,
            password: e.password != null && e.password.trim() != '' ? e.password : null,
            confirmPassword: e.passwordConfirm != null && e.passwordConfirm.trim() != '' ? e.passwordConfirm : null,
            image: imagePath === "" ? null : imagePath
        } : {
            ad: e.name != null && e.name.trim() != '' ? e.name : null,
            soyad: e.surname != null && e.surname.trim() != '' ? e.surname : null,
            email: e.email != null && e.email.trim() != '' ? e.email : null,
            telefonGSM: e.phone != null ? e.phone : null,
            userName: e.username != null && e.username.trim() != '' ? e.username : null,
            password: e.password != null && e.password.trim() != '' ? e.password : null,
            confirmPassword: e.passwordConfirm != null && e.passwordConfirm.trim() != '' ? e.passwordConfirm : null,
            roleId: e.roleId.value != null && e.roleId.value.trim() != '' ? e.roleId.value : null,
            image: imagePath === "" ? null : imagePath
        };

        save(data);
    }

    const getRoles = () => {
        axios({
            method: 'GET',
            url: process.env.REACT_APP_API_ENDPOINT + 'api/Role/getRoles',
        }).then(function (response) {
            setRoles(response.data.userData.map(i => {
                return {
                    value: i.id,
                    label: i.normalizedName
                }
            }))
        })
            .catch(function (error) {

            });
    }

 
    const save = (data) => {

        const method = props.userData?.id==undefined ? 'POST' : 'PUT';
        const urlSuffix = props.userData?.id ==undefined ? 'register' :  + props.userData.id;



        axios({
            method: method,
            url: process.env.REACT_APP_API_ENDPOINT + 'api/Account/' + urlSuffix,
            data: data

        })
    .then(response => {
  
        if( response.data)
        if(response.data.data){
            toastData(data?.id ? "Kullanıcı Başarıyla Güncellendi" : "Kullanıcı Başarıyla Kaydedildi", true);
            props.callBack(response.data);
            setButtonValue(false)
        }
        else{
            toastData(data?.id ? response.data.message : response.data.message, false);
            setButtonValue(false)
        }
    }).catch(error  => {
   
            setButtonValue(false)
            toastData(data?.id ? response.data.message : response.data.message, false);
    });

    

    }

    return (
        <div>
            <div className='text-center mb-2'>
                <h1 className='mb-1'>{props.userData?.id ? "Kullanıcı Güncelle" : "Kullanıcı Ekle"}</h1>
                <p></p>
            </div>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <FileUploaderRestrictions handleImagePath={handleImage} imageData={imagePath}
                        imageDataBackup={newImageBackup} />
                </Row>
                <Row className='mb-1'>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='nameVertical'>
                            Adı
                        </Label>
                        <Controller
                            id='nameVertical'
                            name='name'
                            defaultValue={props.userData?.name}

                            control={control}
                            render={({ field }) => <Input {...field} placeholder='Adı' invalid={errors.name && true} />}
                        />
                        {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
                    </Col>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='nameVertical'>
                            Soyadı
                        </Label>
                        <Controller
                            id='surnameVertical'
                            name='surname'
                            defaultValue={props.userData?.surName}
                            control={control}
                            render={({ field }) => <Input {...field} placeholder='Soyadı'
                                invalid={errors.surname && true} />}
                        />
                        {errors.surname && <FormFeedback>{errors.surname.message}</FormFeedback>}
                    </Col>
                </Row>
                <Row className='mb-1'>
                    <Col md={6} xs={12} className='mb-1'>
                        <Label className='form-label' for='usernameVertical'>
                            Kullanıcı Adı
                        </Label>
                        <Controller
                            id='usernameVertical'
                            name='username'
                            defaultValue={props.userData?.userName}
                            control={control}
                            render={({ field }) => <Input {...field} placeholder='Kullanıcı Adı'
                                invalid={errors.username && true} />}
                        />
                        {errors.username && <FormFeedback>{errors.username.message}</FormFeedback>}
                    </Col>
                    <Col md={6} xs={12} className='mb-1'>
                        <Label className='form-label' for='phoneVertical'>
                            Telefon
                        </Label>
                        <Controller
                            id='phoneVertical'
                            name='phone'
                            defaultValue={props.userData?.phone}
                            control={control}
                            type="number"
                            render={({ field }) => <Input {...field} placeholder='Telefon'
                                invalid={errors.phone && true} />}
                        />
                        {errors.phone && <FormFeedback>{errors.phone.message}</FormFeedback>}
                    </Col>
                </Row>
                <Row className='mb-1'>
                    <Col md={12} xs={12} className='mb-1'>
                        <Label className='form-label' for='emailVertical'>
                            E-posta
                        </Label>
                        <Controller
                            id='emailVertical'
                            name='email'
                            defaultValue={props.userData?.email}
                            control={control}
                            render={({ field }) => <Input {...field} placeholder='E-posta'
                                invalid={errors.email && true} />}
                        />
                        {errors.email && <FormFeedback>{errors.email.message}</FormFeedback>}
                    </Col>
                </Row>
             

                    <Row className='mb-1'>
                        <Col md={6} xs={12}>
                            <Label className='form-label' for='passwordVertical'>
                                Parola
                            </Label>
                            <Controller
                                id='passwordVertical'
                                name='password'
                                defaultValue=''
                                control={control}
                                render={({ field }) => <Input {...field} type='password' placeholder='Parola'
                                    invalid={errors.password && true} />}
                            />
                            {errors.password && <FormFeedback>{errors.password.message}</FormFeedback>}
                        </Col>
                        <Col md={6} xs={12}>
                            <Label className='form-label' for='passwordConfirmVertical'>
                                Parola Doğrula
                            </Label>
                            <Controller
                                id='passwordConfirmVertical'
                                name='passwordConfirm'
                                defaultValue=''
                                control={control}
                                render={({ field }) => <Input {...field} type='password' placeholder='Parola Doğrula'
                                    invalid={errors.passwordConfirm && true} />}
                            />
                            {errors.passwordConfirm && <FormFeedback>{errors.passwordConfirm.message}</FormFeedback>}
                        </Col>
                    </Row>
                    {props.userData?.id ? null :        <Row className='mb-1' >
                        <Col md={12} xs={12} className='mb-1'>
                            <Label className='form-label' for='roleVertical'>
                                Rol
                            </Label>
                            <Controller
                                id='roleVertical'
                                name='roleId'

                                control={control}
                                render={({ field }) => <Select
                                    options={roles}
                                    classNamePrefix='select'
                                    defaultInputValue={props.userData.role}
                                    theme={selectThemeColors}
                                    invalid={errors.roleId && true}
                                    {...field}
                                    placeholder='Rol seçiniz'
                                />}
                            />
                            {errors.roleId && <FormFeedback>{errors.roleId.message}</FormFeedback>}
                        </Col>

                    </Row> }
            
           
                <Col xs={12} className='text-center mt-2 pt-50'>


                    {!ButtonValue ? (
                        <Button className='me-1' color='primary' type='submit'>
                            {props.userData.id ? "Güncelle" : "Ekle"}
                        </Button>
                    ) : (
                        <Button className="me-1" color="primary" disabled>
                            <Spinner color="white" size="sm" />
                            <span className="ms-50">Kaydediliyor...</span>
                        </Button>
                    )}

                </Col>

            </Form>
        </div>
    )
});

UserForm.propTypes = {
    id: PropTypes.string,
    actionType: PropTypes.oneOf(['INSERT', 'UPDATE']),
    callBack: PropTypes.func,
};

UserForm.defaultProps = {
    callBack: () => {
    }
}

export default UserForm;