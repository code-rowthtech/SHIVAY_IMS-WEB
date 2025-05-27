import React, { useEffect, useState } from 'react'
import { Modal, Button, Row, Col, Form, InputGroup } from 'react-bootstrap';
import Select from 'react-select';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createSupplierActions, getLocationActions, updateSupplierActions } from '../../../../redux/actions';

const AddSupplierModal = ({ showModal, handleClose, SupplierData }) => {

    const { type } = SupplierData;
    const dispatch = useDispatch();
    const {
        handleSubmit,
        register,
        setValue,
        reset,
        formState: { errors },
    } = useForm();
    const [locationSelected, setLocationSelected] = useState(null);
    const { location } = useSelector((state) => state?.locationReducer || {});
    const locationData = location?.response || [];

    useEffect(() => {
        dispatch(getLocationActions());
    }, [dispatch]);

    const closeModal = () => {
        reset();
        handleClose();
        setLocationSelected(null);
    }

    useEffect(() => {

        if (SupplierData.data) {

            setValue('name', SupplierData.data?.name)
            setValue('email', SupplierData.data?.email)
            setValue('phoneNumber', SupplierData.data?.phoneNumber)
            setValue('gstNumber', SupplierData.data?.gstNumber)
            setValue('address', SupplierData.data?.address)

            setLocationSelected({
                label: SupplierData?.data?.location,
                value: SupplierData?.data?.location,
            });
        }
    }, [SupplierData]);

    const onSubmit = (data) => {
        const payload = {
            name: data?.name,
            email: data?.email,
            phoneNumber: data?.phoneNumber,
            gstNumber: data?.gstNumber,
            address: data?.address,
            location: locationSelected?.value,
        };
        if (SupplierData?.data?._id) {
            const updatedData = {
                ...payload,
                supplierId: SupplierData?.data?._id,
            };
            dispatch(updateSupplierActions(updatedData));
        } else {
            dispatch(createSupplierActions(payload));
        }
        closeModal();
    };

    return (
        <div>
            <Modal show={showModal} centered size='lg' onHide={closeModal} backdrop="static" keyboard={false}>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Header closeButton>
                        <Modal.Title className='text-black'>{type} Supplier</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* Your form or content here */}
                        <Row>
                            <Col sm={6}>
                                <Form.Group className="mb-1">
                                    <Form.Label className='mb-0'>
                                        Supplier Name <span className='text-danger'> *</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Supplier Name"
                                        name="name"
                                        {...register('name', {
                                            required: 'Supplier name is required',
                                            validate: value => value.trim() !== '' || 'Supplier name cannot be empty spaces'
                                        })}
                                    />
                                    {errors.name && (
                                        <small className="text-danger">{errors.name.message}</small>
                                    )}
                                </Form.Group>

                            </Col>
                            <Col sm={6}>
                                <Form.Group className="mb-1">
                                    <Form.Label className='mb-0'>
                                        Email Id <span className='text-danger'>*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Email Id"
                                        name="email"
                                        {...register('email', {
                                            required: 'Email Id is required',
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: 'Invalid email format'
                                            }
                                        })}
                                        onKeyDown={(e) => {
                                            if (e.key === ' ') e.preventDefault();
                                        }}
                                        onPaste={(e) => {
                                            const pasted = e.clipboardData.getData('text');
                                            if (/\s/.test(pasted)) {
                                                e.preventDefault();
                                            }
                                        }}
                                    />
                                    {errors.email && (
                                        <small className="text-danger">{errors.email.message}</small>
                                    )}
                                </Form.Group>


                            </Col>
                            <Col sm={6}>
                                <Form.Group className="mb-1">
                                    <Form.Label className="mb-0">
                                        Phone Number<span className='text-danger'>*</span>
                                    </Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text>+91</InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter Phone Number"
                                            name="Phone"
                                            maxLength={10}
                                            {...register('phoneNumber', {
                                                required: 'Phone is required',
                                                pattern: {
                                                    value: /^\d{10}$/,
                                                    message: 'Phone must be exactly 10 digits'
                                                },
                                                validate: value => value.trim() !== '' || 'Phone cannot be only empty spaces'
                                            })}
                                            onKeyDown={(e) => {
                                                const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
                                                if (!/^\d$/.test(e.key) && !allowedKeys.includes(e.key)) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            onPaste={(e) => {
                                                const pasted = e.clipboardData.getData('text');
                                                if (!/^\d+$/.test(pasted)) {
                                                    e.preventDefault();
                                                }
                                            }}
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
                            <Col sm={6}>
                                <Form.Group className="mb-1">
                                    <Form.Label className='mb-0'>GST Number <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter GST Number"
                                        required
                                        name="GST Number"
                                        {...register("gstNumber")}
                                    />
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group className="mb-1">
                                    <Form.Label className='mb-0'>Full Address <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Enter Full Address"
                                        required
                                        name="Full Address"
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
        </div>
    )
}

export default AddSupplierModal