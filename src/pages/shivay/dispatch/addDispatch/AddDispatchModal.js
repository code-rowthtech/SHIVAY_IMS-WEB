// src/pages/dispatch/addDispatch/AddDispatchModal.jsx

import { useEffect, useMemo, useCallback, useState, useRef } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import {
    createDispatchActions,
    getWarehouseListActions,
    searchProductActions,
    listingCustomerActions,
    listingUsersActions,
    createStockCheckActions
} from '../../../../redux/actions';

import { IoIosAdd } from 'react-icons/io';
import { MdDelete } from 'react-icons/md';
import { CgCloseO } from 'react-icons/cg';

function AddDispatchModal({ show, onHide }) {
    const dispatch = useDispatch();
    const { handleSubmit, register, setValue, reset, resetField } = useForm();
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedUser, setSelectedUser] = useState();
    const store = useSelector((state) => state)
    const [attachmentType, setAttachmentType] = useState("");
    const fileInputRef = useRef();
    const [today] = useState(new Date().toISOString().split('T')[0]);
    const [rows, setRows] = useState([{ searchType: 'modelName', selectedProduct: null, quantity: '', searchTerm: '' }]);
    const UsersList = store?.listingUsersReducer?.listingUsers?.response;
    const CustomerList = store?.listingCustomerReducer?.listingCustomer?.response;
    const DispatchProductData = store?.dispatchByIdReducer?.dispatchById?.response;

    const {
        searchProductReducer: {
            searchProduct: { response: ProductSearch = [], loading: productLoading },
            error: productError
        },
        getWarehouseListReducer: {
            searchWarehouse: { response: Warehouse = [] },
            error: warehouseError
        },
        createDispatchReducer: { createDispatch: { status: createResponse, loading: createLoading } = {} }
    } = useSelector(state => state);

    useEffect(() => {
        if (createResponse === 200) {
            onHide();
            reset();
            setRows([{ searchType: 'modelName', selectedProduct: null, quantity: '', searchTerm: '' }]);
        }
    }, [createResponse, onHide, reset]);

    const handleAttachmentTypeChange = (e) => {
        const type = e.target.value;
        setAttachmentType(type);
        setValue("invoiceAttachmentType", type);
    };

    const resetAttachmentType = () => {
        setAttachmentType("");
        setValue("invoiceAttachmentType", "");
        resetField("invoiceAttachment");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    useEffect(() => {
        dispatch(getWarehouseListActions());
        dispatch(listingCustomerActions());
    }, [dispatch]);

    useEffect(() => {
        if (selectedWarehouse?.value) {
            dispatch(listingUsersActions({ warehouseId: selectedWarehouse.value }));
        }
    }, [dispatch, selectedWarehouse]);

    useEffect(() => {
        if (productError) toast.error(productError.message || 'Failed to search products');
        if (warehouseError) toast.error(warehouseError.message || 'Failed to load warehouses');
    }, [productError, warehouseError]);

    const warehouseOptions = useMemo(() => (
        Warehouse?.map(({ _id, name }) => ({ value: _id, label: name }))
    ), [Warehouse]);

    const usersOptions = UsersList?.map((users) => ({
        value: users._id,
        label: users.name,
    }));

    const customerOptions = CustomerList?.map((customer) => ({
        value: customer._id,
        label: customer.name,
    }));

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
        if (!term || term.length < 2) return;
        dispatch(searchProductActions(type === 'modelName' ? { modelName: term } : { code: term }));
    }, [dispatch]);

    const handleAddRow = useCallback(() => {
        setRows(prev => [...prev, { searchType: 'modelName', selectedProduct: null, quantity: '', searchTerm: '' }]);
    }, []);

    const handleDeleteRow = useCallback((index) => {
        if (rows?.length <= 1) return;
        setRows(prev => prev.filter((_, i) => i !== index));
    }, [rows?.length]);

    const handleProductChange = useCallback((selected, index) => {
        setRows(prev => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                selectedProduct: selected,
                searchTerm: selected?.label || ''
            };
            return updated;
        });

        if (selected?.value && selectedWarehouse?.value) {
            dispatch(createStockCheckActions({
                warehouseId: selectedWarehouse.value,
                productId: selected.value,
                qty: rows[index]?.quantity || 1,
                oldQty: ''
            }));
        }
    }, [selectedWarehouse, dispatch, rows]);


    const handleWarehouseChange = (selectedOption) => {
        setSelectedWarehouse(selectedOption);
    };

    const handleUserChange = (selectedUser) => {
        setSelectedUser(selectedUser);
    };

    const handleCustomerChange = (selectedCustomer) => {
        setSelectedCustomer(selectedCustomer);
    };

    const handleQuantityChange = useCallback((e, index) => {
        const value = Math.max(1, parseInt(e.target.value) || '');
        setRows(prev => {
            const updated = [...prev];
            updated[index].quantity = value;
            return updated;
        });

        if (rows[index]?.selectedProduct?.value && selectedWarehouse?.value) {
            dispatch(createStockCheckActions({
                warehouseId: selectedWarehouse.value,
                productId: rows[index].selectedProduct.value,
                qty: value,
                oldQty: ''
            }));
        }
    }, [selectedWarehouse, dispatch, rows]);

    const onSubmit = (data) => {

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

        const formData = new FormData();
        if (data?.attachmentGRfile?.[0] instanceof File) {
            formData.append('attachmentGRfile', data.attachmentGRfile[0] || DispatchProductData?.[0]?.attachmentGRfile);
        }
        if (data?.invoiceAttachment?.[0] instanceof File) {
            formData.append('invoiceAttachment', data.invoiceAttachment?.[0] || DispatchProductData?.[0]?.invoiceAttachment);
        }

        formData.append('warehouseId', selectedWarehouse?.value)
        formData.append('dispatchBy', selectedUser?.value);
        formData.append('customerId', selectedCustomer?.value);
        formData.append('description', data?.description);
        formData.append('date', data?.date);
        formData.append('grNumber', data?.grNumber);
        formData.append('invoiceAttachmentType', attachmentType);
        formData.append('productDispatchQty', JSON.stringify(productStock));

        dispatch(createDispatchActions(formData));
    };

    return (
        <Modal show={show} onHide={onHide} size='xl' backdrop="static" centered>
            <Modal.Header className='py-1' closeButton>
                <Modal.Title>Add Dispatch</Modal.Title>
            </Modal.Header>
            <Modal.Body className='pt-1'>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row className="mb-1">
                        <Col sm={3}>
                            <Form.Group className="mb-1">
                                <Form.Label className='mb-0'>Warehouse <span className='text-danger'>*</span></Form.Label>
                                <Select
                                    value={selectedWarehouse}
                                    onChange={handleWarehouseChange}
                                    options={warehouseOptions}
                                    placeholder="Select a Warehouse"
                                    isClearable
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col sm={3}>
                            <Form.Group className="mb-1">
                                <Form.Label className="mb-0">Customer <span className='text-danger'>*</span></Form.Label>
                                <Select
                                    value={selectedCustomer}
                                    onChange={handleCustomerChange}
                                    options={customerOptions}
                                    placeholder="Select a Customer"
                                    isClearable
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={3}>
                            <Form.Group className="mb-1">
                                <Form.Label className="mb-0">Dispatch By <span className='text-danger'>*</span></Form.Label>
                                <Select
                                    value={selectedUser}
                                    onChange={handleUserChange}
                                    className='text-capitalize'
                                    options={usersOptions}
                                    placeholder="Select a User"
                                    isClearable
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={3}>
                            <Form.Group className="mb-1">
                                <Form.Label className='mb-0'>Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    defaultValue={today}
                                    {...register('date')}
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={3}>
                            <Form.Group className="mb-1">
                                <Form.Label className="mb-0">GR Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Invoice Number"
                                    {...register('grNumber')}
                                    onKeyDown={(e) => {
                                        if (e.key === ' ') e.preventDefault();
                                    }}
                                    onPaste={(e) => {
                                        const pasted = e.clipboardData.getData('text');
                                        if (/\s/.test(pasted)) e.preventDefault();
                                    }}
                                />
                            </Form.Group>

                        </Col>
                        <Col sm={3}>
                            <Form.Group className="mb-1">
                                <Form.Label className="mb-0">Attach GR File <span className='text-danger'>*</span>
                                </Form.Label>
                                <Form.Control
                                    type="file"
                                    placeholder="Upload file"
                                    required
                                    {...register('attachmentGRfile', {
                                        required: !DispatchProductData?.[0]?.attachmentGRfile, 
                                    })}
                                />

                            </Form.Group>
                        </Col>
                        <Col sm={3}>
                            <Form.Group className="mb-1">
                                <Form.Label className="mb-0">
                                    Attachment
                                    {attachmentType && (
                                        <span className="text-capitalize"> ({attachmentType}) <span className="text-danger"> *</span></span>
                                    )}
                                </Form.Label>

                                {!attachmentType ? (
                                    <Form.Select
                                        className="mb-0"
                                        value={attachmentType}
                                        onChange={handleAttachmentTypeChange}

                                    >
                                        <option value="">Select Attachment Type</option>
                                        <option value="Invoice">Invoice</option>
                                        <option value="Delivery Challan">Delivery Challan</option>
                                    </Form.Select>
                                ) : (
                                    <div className="d-flex align-items-center gap-2">
                                        <Form.Control
                                            type="file"
                                            placeholder="Upload file"
                                            {...register("invoiceAttachment")}
                                        />
                                        <CgCloseO
                                            size={20}
                                            className='text-danger'
                                            style={{ cursor: "pointer" }}
                                            onClick={resetAttachmentType}
                                            title="Change attachment type"
                                        />
                                    </div>
                                )}
                            </Form.Group>
                        </Col>
                        <Col sm={3}>
                            <Form.Group className="mb-1">
                                <Form.Label className="mb-0">Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={1}
                                    placeholder="Enter Description"
                                    {...register('description')}
                                />
                            </Form.Group>
                        </Col>

                    </Row>

                    <hr className='mt-2 mb-1' />
                    <div style={{ maxHeight: rows?.length >= 3 ? '51vh' : 'auto', overflowY: rows?.length >= 3 ? 'auto' : 'visible', padding: '15px' }}>
                        {rows?.map((row, index) => (
                            <Row key={index} className="align-items-end">
                                <Col sm={3}>
                                    <Form.Group className='mb-1'>
                                        <Form.Label className="mb-0">Search By</Form.Label>
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
                                </Col>

                                <Col sm={3}>
                                    <Form.Group className='mb-1'>
                                        <Form.Label className="mb-0">{row.searchType === 'modelName' ? 'Model Name' : 'Product Code'}</Form.Label>
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
                                            placeholder={`Search by model`}
                                            isClearable
                                            isSearchable
                                            isLoading={productLoading}
                                            filterOption={() => true}
                                        />:
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

                                <Col sm={3}>
                                    <Form.Group className='mb-1'>
                                        <Form.Label className="mb-0">{row.searchType === 'modelName' ? 'Code' : 'Model '}</Form.Label>
                                        <Form.Control
                                            type='text'
                                            value={row.searchType === 'modelName' ? row.selectedProduct?.data?.code : row.selectedProduct?.data?.modelId?.name || ''}
                                            placeholder={row.searchType === 'modelName' ? 'Code' : 'Model'}
                                            readOnly
                                        />
                                    </Form.Group>
                                </Col>

                                <Col sm={3}>
                                    <Form.Group className='mb-1'>
                                        <Form.Label className="mb-0">Product Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={row.selectedProduct?.name || ''}
                                            readOnly
                                            placeholder="Product name"
                                        />
                                    </Form.Group>
                                </Col>

                                <Col sm={3}>
                                    <Form.Group className="mb-1">
                                        <Form.Label className="mb-0">Quantity</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Enter Number"
                                            value={row?.quantity}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value);
                                                handleQuantityChange(e, index); 
                                            }}
                                            required
                                            min={1}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col sm={9} className="d-flex justify-content-end">
                                    {rows.length > 1 && (
                                        <Button variant="outline-danger" title='Delete' onClick={() => handleDeleteRow(index)} className="p-1 mb-1">
                                            <MdDelete className="fs-5" />
                                        </Button>
                                    )}
                                </Col>
                                <hr className='mt-2 mb-1' />
                            </Row>
                        ))}
                    </div>

                    <div className="d-flex justify-content-between mt-3">
                        <Button className='outline-custom-button' onClick={handleAddRow}>
                            <IoIosAdd className="me-1" /> Add Row
                        </Button>

                        <div>
                            <Button onClick={onHide} className="cancel-button me-2">Cancel</Button>
                            <Button type="submit" className='custom-button' disabled={createLoading}>
                                {createLoading ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default AddDispatchModal;