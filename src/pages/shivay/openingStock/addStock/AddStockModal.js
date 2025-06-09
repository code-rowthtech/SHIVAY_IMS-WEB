import { useEffect, useMemo, useCallback, useState } from 'react';
import { Modal, Button, Form, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import {
    createStockActions,
    getWarehouseListActions,
    searchProductActions,
    searchProductResetActions
} from '../../../../redux/actions';

import { IoIosAdd } from 'react-icons/io';
import { MdDelete } from 'react-icons/md';
import { ButtonLoading } from '../../../../helpers/loader/Loading';

function AddStockModal({ show, onHide }) {
    const dispatch = useDispatch();
    const { handleSubmit, register, setValue, reset, formState: { errors } } = useForm();
    const store = useSelector((state) => state)

    const [today] = useState(new Date().toISOString().split('T')[0]);
    const [rows, setRows] = useState([{ searchType: 'modelName', selectedProduct: null, quantity: '', searchTerm: '' }]);

    const {
        searchProductReducer: {
            searchProduct: { response: ProductSearch = [], loading: productLoading },
            error: productError
        },
        getWarehouseListReducer: {
            searchWarehouse: { response: Warehouse = [] },
            error: warehouseError
        },
        createStockReducer: { createStock: { status: createResponse, loading: createLoading } = {} }
    } = useSelector(state => state);

    const createProductResponse = store?.createStockReducer?.createStock?.status;

    useEffect(() => {
        if (createProductResponse === 200) {
            onHide();
            reset();
            setRows([{ searchType: 'modelName', selectedProduct: null, quantity: '', searchTerm: '' }]);
            dispatch(searchProductResetActions());
        }
    }, [createProductResponse, onHide, reset]);

    const handleClose = () => {
        reset();
        onHide();
        setRows([{ searchType: 'modelName', selectedProduct: null, quantity: '', searchTerm: '' }]);
        dispatch(searchProductResetActions());
    };


    useEffect(() => {
        dispatch(getWarehouseListActions());
    }, [dispatch]);

    useEffect(() => {
        if (productError) toast.error(productError.message || 'Failed to search products');
        if (warehouseError) toast.error(warehouseError.message || 'Failed to load warehouses');
    }, [productError, warehouseError]);

    const warehouseOptions = useMemo(() => (
        Warehouse?.map(({ _id, name }) => ({ value: _id, label: name }))
    ), [Warehouse]);

    const productOptions = useMemo(() => (
        ProductSearch?.map(product => ({
            value: product._id,
            label: product.modelId?.name,
            code: product.code,
            name: product.name,
            data: product
        })) || []
    ), [ProductSearch]);

    const productOptionsCode = useMemo(() => (
        ProductSearch?.map(product => ({
            value: product._id,
            label: product.code,
            code: product.code,
            name: product.name,
            data: product
        })) || []
    ), [ProductSearch]);

    const handleSearch = useCallback((term, type) => {
        if (!term || term.length < 1) return;
        dispatch(searchProductActions(type === 'modelName' ? { modelName: term } : { code: term }));
    }, [dispatch]);

    const handleAddRow = useCallback(() => {
        setRows(prev => [...prev, { searchType: 'modelName', selectedProduct: null, quantity: '', searchTerm: '' }]);
    }, []);

    const handleDeleteRow = useCallback((index) => {
        if (rows.length <= 1) return;
        setRows(prev => prev.filter((_, i) => i !== index));
    }, [rows.length]);

    const handleProductChange = useCallback((selected, index) => {
        setRows(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], selectedProduct: selected, searchTerm: selected?.label || '' };
            return updated;
        });
    }, []);

    const handleQuantityChange = useCallback((e, index) => {
        const value = e.target.value === '' ? '' : parseInt(e.target.value);
        setRows(prev => {
            const updated = [...prev];
            updated[index].quantity = value;
            updated[index].quantityError = ''; 
            return updated;
        });
    }, []);

    const validateQuantity = useCallback((e, index) => {
        const value = e.target.value;
        if (value === '') {
            setRows(prev => {
                const updated = [...prev];
                updated[index].quantity = 1; 
                updated[index].quantityError = '';
                return updated;
            });
            return;
        }

        const numValue = parseInt(value);
        if (isNaN(numValue) || numValue <= 0) {
            setRows(prev => {
                const updated = [...prev];
                updated[index].quantityError = 'Quantity must be greater than 0';
                return updated;
            });
        } else {
            setRows(prev => {
                const updated = [...prev];
                updated[index].quantity = numValue;
                updated[index].quantityError = '';
                return updated;
            });
        }
    }, []);

    const onSubmit = useCallback((formData) => {
        const productStock = rows?.map(({ selectedProduct, quantity }) => {
            if (!selectedProduct) return toast.error('Please select a product for all rows');
            if (!quantity) return toast.error('Please enter quantity for all products');
            return {
                productId: selectedProduct.value,
                quantity,
                code: selectedProduct.code,
                name: selectedProduct.name || selectedProduct.label
            };
        }).filter(Boolean);

        if (productStock.length !== rows.length) return;

        const payload = {
            warehouseId: formData.warehouseId,
            productStock,
            description: formData.description,
            date: formData.date || today
        };

        dispatch(createStockActions(payload));
    }, [rows, dispatch, today]);

    return (
        <Modal show={show} onHide={handleClose} backdrop='static' size='xl' centered>
            <Modal.Header className='py-1' closeButton>
                <Modal.Title>Add Stock</Modal.Title>
            </Modal.Header>
            <Modal.Body className='pt-1'>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row className="mb-1">
                        <Col sm={4}>
                            <Form.Group className="mb-1">
                                <Form.Label>Warehouse <span className="text-danger">*</span></Form.Label>
                                <Select
                                    options={warehouseOptions}
                                    className='text-capitalize'
                                    placeholder="Select Warehouse"
                                    noOptionsMessage={() => "No warehouse found"}
                                    {...register('warehouseId', { required: true })}
                                    onChange={(selected) => setValue('warehouseId', selected?.value)}
                                    isClearable
                                    isLoading={!warehouseOptions.length}
                                />
                                {errors.warehouseId && <small className="text-danger">Warehouse is required</small>}
                            </Form.Group>
                        </Col>

                        <Col sm={4}>
                            <Form.Group className="mb-1">
                                <Form.Label>
                                    Date <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                    type="date"
                                    defaultValue={today}
                                    max={today} // Prevent future dates
                                    {...register('date', { required: true })}
                                />
                            </Form.Group>

                        </Col>

                        <Col sm={4}>
                            <Form.Group className="mb-1">
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" rows={1} {...register('description')} placeholder="Enter description" />
                            </Form.Group>
                        </Col>
                    </Row>

                    <hr className='mt-2 mb-1' />
                    <div style={{
                        maxHeight: rows?.length >= 3 ? '51vh' : 'auto',
                        overflowY: rows?.length >= 3 ? 'auto' : 'visible',
                        padding: '10px',
                    }}>
                        {rows?.map((row, index) => (
                            <div className='mb-1 rounded-1 ps-1' style={{ border: '1px solid rgba(218, 224, 225, 0.97)' }}>
                                <Row
                                    key={index}
                                    className="align-items-center mb-2 g-2"
                                >
                                    {/* Search By */}
                                    <Col xs={2} className='d-flex'>
                                        <small className="fw-semibold d-flex align-items-center me-1 mt-2 pt-1 text-nowrap">{index + 1}</small>
                                        <div>
                                            <Form.Group className='mb-0'>
                                                <Form.Label className="small mb-0">Search By</Form.Label>
                                                <Form.Select
                                                    value={row?.searchType}
                                                    onChange={(e) => setRows(prev => {
                                                        const updated = [...prev];
                                                        updated[index] = { ...updated[index], searchType: e.target.value, selectedProduct: null, searchTerm: '' };
                                                        return updated;
                                                    })}
                                                >
                                                    <option value="modelName">Model Name</option>
                                                    <option value="code">Product Code</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </div>
                                    </Col>

                                    {/* Dynamic Search Field */}
                                    <Col xs={3}>
                                        <Form.Group className='mb-0'>
                                            <Form.Label className="small mb-0">{row.searchType === 'modelName' ? 'Model Name' : 'Product Code'}</Form.Label>
                                            {row.searchType === 'modelName' ?
                                                <Select
                                                    value={row?.selectedProduct}
                                                    onChange={(selected) => handleProductChange(selected, index)}
                                                    onInputChange={(inputValue) => {
                                                        setRows(prev => {
                                                            const updated = [...prev];
                                                            updated[index].searchTerm = inputValue;
                                                            return updated;
                                                        });
                                                        handleSearch(inputValue, row.searchType);
                                                    }}
                                                    options={productOptions}
                                                    placeholder={`Search by ${row.searchType === 'modelName' ? 'model' : 'code'}`}
                                                    isClearable
                                                    isSearchable
                                                    isLoading={productLoading}
                                                    filterOption={() => true}
                                                />
                                                :
                                                <Select
                                                    value={row?.selectedProduct}
                                                    onChange={(selected) => handleProductChange(selected, index)}
                                                    onInputChange={(inputValue) => {
                                                        setRows(prev => {
                                                            const updated = [...prev];
                                                            updated[index].searchTerm = inputValue;
                                                            return updated;
                                                        });
                                                        handleSearch(inputValue, row.searchType);
                                                    }}
                                                    options={productOptionsCode}
                                                    placeholder={`Search by code`}
                                                    isClearable
                                                    isSearchable
                                                    isLoading={productLoading}
                                                    filterOption={() => true}
                                                />
                                            }
                                        </Form.Group>
                                    </Col>

                                    {/* Complementary Info */}
                                    <Col xs={2}>
                                        <Form.Group className='mb-0'>
                                            <Form.Label className="small mb-0">{row.searchType === 'modelName' ? 'Code' : 'Model'}</Form.Label>
                                            <Form.Control
                                                type='text'
                                                value={row.searchType === 'modelName' ? row.selectedProduct?.data?.code : row.selectedProduct?.data?.modelId?.name || ''}
                                                placeholder={row.searchType === 'modelName' ? 'Code' : 'Model'}
                                                readOnly
                                            />
                                        </Form.Group>
                                    </Col>

                                    {/* Product Name */}
                                    <Col xs={2}>
                                        <Form.Group className='mb-0'>
                                            <Form.Label className="small mb-0">Product Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={row.selectedProduct?.name || ''}
                                                readOnly
                                                placeholder="Product name"
                                            />
                                        </Form.Group>
                                    </Col>

                                    {/* Quantity */}
                                    <Col xs={2}>
                                        <Form.Group className='mb-0'>
                                            <Form.Label className="small mb-0">Qty</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={row.quantity}
                                                onChange={(e) => handleQuantityChange(e, index)}
                                                onBlur={(e) => validateQuantity(e, index)}
                                                placeholder="Qty"
                                                required
                                                isInvalid={!!row.quantityError}
                                            />
                                            {row.quantityError && (
                                                <Form.Control.Feedback type="invalid">
                                                    {row.quantityError}
                                                </Form.Control.Feedback>
                                            )}
                                        </Form.Group>
                                    </Col>

                                    <Col xs={1} className="text-center mt-2 pt-1">
                                        {rows.length > 1 && (
                                            <Button
                                                variant="outline-danger"
                                                onClick={() => handleDeleteRow(index)}
                                                className="p-1 mt-2"
                                                title="Delete row"
                                            >
                                                <MdDelete className="fs-6" />
                                            </Button>
                                        )}
                                    </Col>
                                </Row>
                            </div>
                        ))}
                    </div>

                    <div className="d-flex justify-content-between mt-3">
                        <Button className='outline-custom-button mt-2' style={{ height: '38px' }} onClick={handleAddRow}>
                            <IoIosAdd className="me-1" /> Add Row
                        </Button>

                        <div className='d-flex gap-2'>
                            <Button onClick={handleClose} style={{ height: '38px' }} className="cancel-button mt-2">Cancel</Button>
                            {rows?.some((data) => !data?.selectedProduct) ? (
                                <OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip>Please Fill required fields and select product...</Tooltip>}
                                >
                                    <div>
                                        <Button
                                            className='custom-button mt-2'
                                            type="submit"
                                            disabled
                                        >
                                            {createLoading ? 'Saving...' : 'Save'}
                                        </Button>
                                    </div>
                                </OverlayTrigger>
                            ) : (
                                <Button
                                    className='custom-button mt-2'
                                    type="submit"
                                    disabled={store?.createStockReducer?.loading}
                                    style={{ width: '70px !important' }}
                                >
                                    {store?.createStockReducer?.loading ? (
                                        'Saving...'
                                    ) : (
                                        'Save'
                                    )}

                                </Button>
                            )}

                        </div>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default AddStockModal;
