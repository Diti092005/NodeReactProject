import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import axios from 'axios';
const UserForm =()=>{
    const [showMessage, setShowMessage] = useState(false);
    const [showMessageError, setShowMessageError] = useState(false);

    const [formData, setFormData] = useState();
    const defaultValues = {
        id: null,
        fullname: '',
        phone: null,
        email: '',
        address: null,
        birthDate: '',
        roles: '',
        userId: ''
    }
    return(
<></>
    )
}