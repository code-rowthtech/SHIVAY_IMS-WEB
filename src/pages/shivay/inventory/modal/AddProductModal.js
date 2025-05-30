import React, { useCallback, useEffect, useState } from 'react'
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createProductActions, searchProductNameActions, updateProductActions } from '../../../../redux/actions';
import { ButtonLoading } from '../../../../helpers/loader/Loading';
import Select from 'react-select';

const AddProductModal = ({ showModal, handleClose, ProductData }) => {

    const { type } = ProductData;
    const dispatch = useDispatch();

    const {
        handleSubmit,
        register,
        setValue,
        reset,
        formState: { errors },
    } = useForm();
    const [threshold, setThreshold] = useState(100);
    const [productName, setProductName] = useState(null);
    const [modelName, setModelName] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [productType, setProductType] = useState('existing');
    const [modelType, setModelType] = useState('existing');
    const [newProductName, setNewProductName] = useState('');
    const [newModelName, setNewModelName] = useState('');
    const store = useSelector((state) => state)

    const closeModal = () => {
        reset();
        handleClose();
        setModelName();
        setProductName();
    };

    useEffect(() => {
        if (ProductData?.data) {
            setValue('name', ProductData.data?.name);
            setValue('model', ProductData.data?.modelData?.name);
            setValue('code', ProductData.data?.code);
            setValue('description', ProductData.data?.description);
            setThreshold(Number(ProductData?.data?.lowestStock));
        }
    }, [ProductData, setValue]);

    const onSubmit = (data) => {
        const payload = {
            name: data?.name || productName?.label,
            modelName: data?.model || modelName?.label,
            code: data?.code,
            description: data?.description,
            lowestStock: threshold,
        };

        if (ProductData?.data?._id) {
            const updatedData = {
                ...payload,
                productId: ProductData?.data?._id,
            };
            dispatch(updateProductActions(updatedData));
        } else {
            dispatch(createProductActions(payload));
        }

    };

    const createResponse = store?.createProductReducer?.createProduct?.status;

    useEffect(() => {
        if (createResponse === 200) {
            closeModal();
        }
    }, [createResponse]);

    const searchProductName = useSelector(state =>
        state?.searchProductNameReducer?.searchProductName?.response || []
    );

    // Debounced search function
    const handleSearch = useCallback((inputValue, field) => {
        const payload = {
            productName: field === 'product' ? inputValue : productName?.value || '',
            modelName: field === 'model' ? inputValue : modelName?.value || '',
        };
        dispatch(searchProductNameActions(payload));
    }, [dispatch, productName, modelName]);


    const productOptions = searchProductName.map(product => ({
        label: product.isNew ? `${product.name} (new)` : product.name,
        value: product.name,
        data: product
    }));
    const modelOptions = searchProductName.map(model => ({
        label: model.isNew ? `${model.name} (new)` : model.name,
        value: model.name,
        data: model
    }));

    return (
        <div>
            <Modal show={showModal} centered size='lg' onHide={closeModal} backdrop="static">
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Header closeButton>
                        <Modal.Title className='text-black'>{type} Product</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <>
                                {/* Product Name Section */}
                                <Col sm={6}>
                                    <Form.Group className="mb-3">
                                        <div className="d-flex align-items-center mb-2">
                                            <Form.Label className="mb-0 me-2 fw-semibold">Product Name <span className="text-danger">*</span></Form.Label>
                                            <div className="form-check form-check-inline">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    id="productExisting"
                                                    checked={productType === 'existing'}
                                                    onChange={() => setProductType('existing')}
                                                />
                                                <label className="form-check-label small" htmlFor="productExisting">
                                                    Existing
                                                </label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    id="productNew"
                                                    checked={productType === 'new'}
                                                    onChange={() => setProductType('new')}
                                                />
                                                <label className="form-check-label small" htmlFor="productNew">
                                                    New
                                                </label>
                                            </div>
                                        </div>

                                        {productType === 'existing' ? (
                                            <Select
                                                options={productOptions}
                                                placeholder="Search product..."
                                                onChange={(selectedOption) => {
                                                    setProductName(selectedOption);
                                                    setModelName(null);
                                                }}
                                                onInputChange={(inputValue) => {
                                                    setSearchInput(inputValue);
                                                    handleSearch(inputValue, 'product');
                                                }}
                                                value={productName}
                                                isSearchable
                                                required
                                                isLoading={store?.searchProductNameReducer?.loading}
                                                noOptionsMessage={() => (
                                                    <div className="p-2 text-muted">
                                                        No products found. <br />
                                                        <button
                                                            type="button"
                                                            className="btn btn-link p-0 text-primary"
                                                            onClick={() => setProductType('new')}
                                                        >
                                                            Add new product
                                                        </button>
                                                    </div>
                                                )}
                                                filterOption={() => true}
                                            />
                                        ) : (
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter new product name"
                                                {...register("name", {
                                                    required: "Product name is required",
                                                    minLength: {
                                                        value: 3,
                                                        message: "Minimum 3 characters required",
                                                    },
                                                    validate: (value) => !/\s/.test(value) || "Spaces are not allowed",
                                                })}
                                                value={newProductName}
                                                onChange={(e) => setNewProductName(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === " ") {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                isInvalid={!!errors.name}
                                            />

                                        )}
                                        <Form.Control.Feedback type="invalid">
                                            {errors.name?.message}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                {/* Model Section */}
                                <Col sm={6}>
                                    <Form.Group className="mb-3">
                                        <div className="d-flex align-items-center mb-2">
                                            <Form.Label className="mb-0 me-2 fw-semibold">Model</Form.Label>
                                            <div className="form-check form-check-inline">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    id="modelExisting"
                                                    checked={modelType === 'existing'}
                                                    onChange={() => setModelType('existing')}
                                                />
                                                <label className="form-check-label small" htmlFor="modelExisting">
                                                    Existing
                                                </label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    id="modelNew"
                                                    checked={modelType === 'new'}
                                                    onChange={() => setModelType('new')}
                                                />
                                                <label className="form-check-label small" htmlFor="modelNew">
                                                    New
                                                </label>
                                            </div>
                                        </div>

                                        {modelType === 'existing' ? (
                                            <Select
                                                options={modelOptions}
                                                placeholder="Search model..."
                                                onChange={(selectedOption) => {
                                                    setModelName(selectedOption);
                                                    setValue('model', selectedOption?.value);
                                                }}
                                                onInputChange={(inputValue) => {
                                                    setSearchInput(inputValue);
                                                    handleSearch(inputValue, 'model');
                                                }}
                                                value={modelName}
                                                isSearchable
                                                isLoading={store?.searchProductNameReducer?.loading}
                                                noOptionsMessage={() => (
                                                    <div className="p-2 text-muted">
                                                        No models found. <br />
                                                        <button
                                                            type="button"
                                                            className="btn btn-link p-0 text-primary"
                                                            onClick={() => setModelType('new')}
                                                        >
                                                            Add new model
                                                        </button>
                                                    </div>
                                                )}
                                                filterOption={() => true}
                                            />
                                        ) : (
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter new model name"
                                                {...register("model")}
                                                onChange={(e) => setNewModelName(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === ' ') {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            />
                                        )}
                                    </Form.Group>
                                </Col>
                            </>

                            <Col sm={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label className='mb-0'>Code <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Code"
                                        {...register("code", {
                                            required: "Code is required"
                                        })}
                                        onKeyDown={(e) => {
                                            if (e.key === ' ') {
                                                e.preventDefault();
                                            }
                                        }}
                                    />
                                    {errors.code && (
                                        <small className="text-danger">{errors.code.message}</small>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col sm={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label className=''>Low Stock Threshold</Form.Label>
                                    <div className="d-flex justify-content-between">
                                        <span>0</span>
                                        <input
                                            type="range"
                                            className="w-75"
                                            min="0"
                                            max="2000"
                                            step="100"
                                            defaultValue="100"
                                            onChange={(e) => setThreshold(Number(e.target.value))}
                                        />
                                        <span>2000</span>
                                    </div>
                                    {/* Display the current value */}
                                    <div className="text-center mt-2">
                                        <strong>Current Threshold: {threshold}</strong>
                                    </div>
                                </Form.Group>
                            </Col>
                            <Col sm={12}>

                                <Form.Group className="">
                                    <Form.Label className='mb-0'>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        placeholder="Enter Description"
                                        name="Description"
                                        {...register("description")}
                                    // required
                                    />
                                </Form.Group>
                            </Col>

                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className='cancel-button' onClick={closeModal}>
                            Close
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            className="custom-button"
                            disabled={store?.createProductReducer?.loading}
                            style={{ width: '70px !important' }}
                        >
                            {store?.createProductReducer?.loading ? (
                                <ButtonLoading color="white" />
                            ) : type === 'Add' ? (
                                'Save'
                            ) : (
                                'Update'
                            )}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    )
}

export default AddProductModal
