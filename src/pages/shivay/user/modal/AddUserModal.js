import React, { useEffect, useState } from 'react';
import { Modal, Button, Row, Col, Form, InputGroup } from 'react-bootstrap';
import Select from 'react-select';
import { createUsersActions, getLocationActions, getWarehouseListActions, updateUsersActions } from '../../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import InputGroupText from 'react-bootstrap/esm/InputGroupText';

const AddUserModal = ({ showModal, handleClose, UserData }) => {

    const { type } = UserData;
    const dispatch = useDispatch();
    const {
        handleSubmit,
        register,
        control,
        setValue,
        reset,
        formState: { errors },
    } = useForm();

    const [selectedWarehouse, setSelectedWarehouse] = useState([]);
    const [locationSelected, setLocationSelected] = useState(null);
    const { location } = useSelector((state) => state?.locationReducer || {});
    const locationData = location?.response || [];
    const WarehouseData = useSelector((state) => state?.getWarehouseListReducer?.searchWarehouse?.response || []);


    useEffect(() => {
        dispatch(getLocationActions());
        dispatch(getWarehouseListActions({
            limit: '',
            page: '',
            search: '',
            stockFilter: true,
        }));
    }, [dispatch]);

    const closeModal = () => {
        reset();
        handleClose();
        setSelectedWarehouse(null);
        setLocationSelected(null);
    }

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    useEffect(() => {

        if (UserData?.data) {
            const updateWarehouses = UserData?.data?.warehouseData?.map((data) => (
                {
                    value: data?._id, label: data?.name
                }
            ))
            setSelectedWarehouse(updateWarehouses)

            setValue('name', UserData.data?.name)
            setValue('email', UserData.data?.email)
            setValue('password', UserData.data?.password)
            setValue('phoneNumber', UserData.data?.phoneNumber)
            setValue('address', UserData.data?.address)

            setLocationSelected({
                label: UserData?.data?.location,
                value: UserData?.data?.location,
            });
        }
    }, [UserData]);

    const onSubmit = (data) => {
        const payload = {
            name: data?.name,
            email: data?.email,
            password: data?.password,
            phoneNumber: String(data?.phoneNumber || ''),
            address: data?.address || '',
            location: locationSelected ? locationSelected.value : '',
            warehouseIds: selectedWarehouse?.map((item) => item.value),
        };
        if (UserData?.data?._id) {
            const updatedData = {
                ...payload,
                userId: UserData?.data?._id,
            };
            dispatch(updateUsersActions(updatedData));
        } else {
            dispatch(createUsersActions(payload));
        }
        closeModal();
    };

    return (
        <Modal show={showModal} centered size='lg' onHide={closeModal} backdrop="static" keyboard={false}>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Header closeButton>
                    <Modal.Title className='text-black'>{type} User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col sm={6}>
                            <Form.Group className="mb-1">
                                <Form.Label className="mb-0">Warehouse <span className="text-danger">*</span>
                                </Form.Label>
                                <Select
                                    value={selectedWarehouse}
                                    onChange={(selectedOption) => setSelectedWarehouse(selectedOption)}
                                    options={WarehouseData?.map((data) => ({
                                        label: data.name,
                                        value: data._id,
                                    }))}
                                    placeholder="Select warehouse"
                                    isClearable
                                    isMulti
                                    required
                                />

                                {errors.warehouse && (
                                    <small className="text-danger">{errors.warehouse.message}</small>
                                )}
                            </Form.Group>

                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-1">
                                <Form.Label className='mb-0'>User Name <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter User Name"
                                    {...register("name", {
                                        required: "User Name is required",
                                        validate: (value) => {
                                            const trimmed = value.trim();
                                            if (trimmed === "") return "User Name cannot be empty or spaces only";
                                            if (/\d/.test(trimmed)) return "User Name should not contain numbers";
                                            return true;
                                        }
                                    })}
                                />
                                {errors.name && <small className="text-danger">{errors.name.message}</small>}
                            </Form.Group>

                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-1">
                                <Form.Label className='mb-0'>Email Id <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter Email Id"
                                    {...register("email", { required: true })}
                                />
                                {errors.email && <small className="text-danger">Email is required</small>}
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-1 position-relative">
                                <Form.Label className='mb-0'>Password <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="position-relative">
                                    <Form.Control
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter Password"
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: {
                                                value: 8,
                                                message: "Minimum 8 characters"
                                            },
                                            pattern: {
                                                value: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                                message: "Must include uppercase, number, and special character"
                                            }
                                        })}
                                    />
                                    <span
                                        onClick={togglePasswordVisibility}
                                        className="position-absolute end-0 top-50 translate-middle-y me-2"
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </span>
                                </div>
                                {errors.password && (
                                    <small className="text-danger">{errors.password.message}</small>
                                )}
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-1">
                                <Form.Label className='mb-0'>Phone Number <span className="text-danger">*</span>
                                </Form.Label>

                                <InputGroup>
                                    <InputGroupText>+91</InputGroupText>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Phone Number"
                                        maxLength={10}
                                        onInput={(e) => {
                                            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                        }}
                                        {...register("phoneNumber", {
                                            required: "Phone number is required",
                                            pattern: {
                                                value: /^[0-9]{10}$/,
                                                message: "Phone number must be exactly 10 digits"
                                            }
                                        })}
                                    />
                                </InputGroup>
                                {errors.phoneNumber && (
                                    <small className="text-danger">{errors.phoneNumber.message}</small>
                                )}
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-1">
                                <Form.Label className="mb-0">Location</Form.Label>
                                <Select
                                    options={locationData?.map((loc) => ({
                                        label: loc.name,
                                        value: loc.name,
                                    }))}
                                    placeholder="Select Location"
                                    onChange={(selectedOption) => {
                                        setLocationSelected(selectedOption);
                                        setValue('location', selectedOption?.value);
                                    }}
                                    value={locationSelected}
                                    isSearchable
                                />
                            </Form.Group>
                        </Col>

                        <Col sm={12}>
                            <Form.Group className="mb-1">
                                <Form.Label className='mb-0'>Full Address</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Enter Full Address"
                                    {...register("address")}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='cancel-button' onClick={closeModal}>
                        Close
                    </Button>
                    <Button className='custom-button' type='submit'>
                        {type === 'Add' ? 'Save' : 'Update'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default AddUserModal;
