// src/pages/dispatch/editDispatch/EditDispatchModal.jsx

import { useEffect, useMemo, useCallback, useState, useRef } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import {
    getDispatchByIdActions,
    updateDispatchActions,
    deleteDispatchProductActions,
    updateDispatchProductActions,
    createDispatchProductActions,
    getWarehouseListActions,
    searchProductActions,
    listingCustomerActions,
    listingUsersActions,
    createStockCheckActions
} from '../../../../redux/actions';
import { IoIosAdd } from 'react-icons/io';
import { MdDelete, MdSave } from 'react-icons/md';
import { HiOutlineFolderDownload } from 'react-icons/hi';
import { CgCloseO } from 'react-icons/cg';
import { Loading } from '../../../../helpers/loader/Loading';

function EditDispatchModal({ show, onHide, stockId }) {
    const dispatch = useDispatch();
    const { handleSubmit, register, setValue, resetField } = useForm();

    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [attachmentType, setAttachmentType] = useState("");
    const fileInputRef = useRef();
    const [rows, setRows] = useState([]);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const store = useSelector((state) => state);
    const [today] = useState('');

    // Redux state selectors
    const {
        searchProductReducer: {
            searchProduct: { response: ProductSearch = [], loading: productLoading },
            error: productError
        },
        getWarehouseListReducer: {
            searchWarehouse: { response: Warehouse = [] },
            error: warehouseError
        },
        updateDispatchReducer: { updateDispatch: { status: updateResponse, loading: updateLoading } = {} },
        deleteDispatchProductReducer: { deleteDispatchProduct: { status: deleteResponse } = {} },
        createDispatchProductReducer: { createDispatchProduct: { status: createResponse } = {} }
    } = useSelector(state => state);

    const UsersList = store?.listingUsersReducer?.listingUsers?.response;
    const CustomerList = store?.listingCustomerReducer?.listingCustomer?.response;
    const DispatchDetails = store?.dispatchByIdReducer?.dispatchById?.response;
    const DispatchLoading = store?.dispatchByIdReducer?.loading
    const DeleteResponse = store?.deleteDispatchProductReducer?.deleteStockProduct?.status
    const CreateResponse = store?.createDispatchProductReducer?.createDispatchProduct?.status
    const UpdateResponse = store?.updateDispatchReducer?.updateDispatch?.status
    // Load data when modal opens
    useEffect(() => {
        if (show && stockId) {
            dispatch(getDispatchByIdActions(stockId));
            dispatch(getWarehouseListActions());
            dispatch(listingCustomerActions());
        }
    }, [show, stockId, dispatch]);

    // Handle successful API responses
    useEffect(() => {
        if (DeleteResponse === 200 || CreateResponse === 200) {
            dispatch(getDispatchByIdActions(stockId));
        }
    }, [DeleteResponse, CreateResponse, dispatch, stockId]);

    useEffect(() => {
        if (UpdateResponse === 200) {
            onHide();
        }
    }, [UpdateResponse, onHide]);

    // Initialize form with dispatch details
    useEffect(() => {
        if (DispatchDetails?.[0]) {
            console.log(DispatchDetails?.[0])
            const initialRows = DispatchDetails?.[0]?.dispatchProducts?.map(item => {
                const product = item?.productData || {};
                const modelName = product?.modelData?.[0]?.name || '';
                const code = product.code || '';

                const name = product.name || '';

                return {
                    _id: item._id,
                    searchType: 'modelName',
                    selectedProduct: {
                        value: product._id,
                        label: modelName,
                        code,
                        name,
                        data: item
                    },
                    quantity: item.quantity,
                    searchTerm: modelName || name
                };
            }) || [];

            setRows(initialRows);
            setIsInitialLoad(false);

            // Set form values
            setValue('date', DispatchDetails?.[0]?.date ? new Date(DispatchDetails?.[0]?.date).toISOString().split('T')[0] : today);
            setValue('grNumber', DispatchDetails?.[0]?.grNumber);
            setValue('description', DispatchDetails?.[0]?.description);
            setValue('invoiceAttachmentType', DispatchDetails?.[0]?.invoiceAttachmentType);

            const updateWarehouses = DispatchDetails?.[0]?.warehouseData
                ? { value: DispatchDetails?.[0].warehouseId, label: DispatchDetails?.[0].warehouseData?.find((ele) => ele?._id === DispatchDetails?.[0]?.warehouseId)?.name }
                : {};
            setSelectedWarehouse(updateWarehouses)

            const updatedUser = DispatchDetails?.[0]?.dispatchByData
                ? { value: DispatchDetails?.[0]?.dispatchBy, label: DispatchDetails?.[0].dispatchByData?.find((ele) => ele?._id === DispatchDetails?.[0]?.dispatchBy)?.name }
                : {};
            setSelectedUser(updatedUser)

            const updatedCustomer = DispatchDetails?.[0]?.customerData
                ? { value: DispatchDetails?.[0]?.customerId, label: DispatchDetails?.[0].customerData?.find((ele) => ele?._id === DispatchDetails?.[0]?.customerId)?.name }
                : {};
            setSelectedCustomer(updatedCustomer)

            setAttachmentType(DispatchDetails?.[0]?.invoiceAttachmentType || "");
        }
    }, [DispatchDetails, setValue, today, isInitialLoad]);

    // Load users when warehouse changes
    useEffect(() => {
        if (selectedWarehouse?.value) {
            dispatch(listingUsersActions({ warehouseId: selectedWarehouse.value }));
        }
    }, [selectedWarehouse, dispatch]);

    // Error handling
    useEffect(() => {
        if (productError) toast.error(productError.message || 'Failed to search products');
        if (warehouseError) toast.error(warehouseError.message || 'Failed to load warehouses');
    }, [productError, warehouseError]);

    // Memoized options
    const warehouseOptions = useMemo(() => (
        Warehouse?.map(({ _id, name }) => ({ value: _id, label: name }))
    ), [Warehouse]);

    const usersOptions = UsersList?.map((user) => ({
        value: user._id,
        label: user.name,
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

    // Handlers
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

    const handleSearch = useCallback((term, type) => {
        if (!term || term.length < 1) return;
        dispatch(searchProductActions(type === 'modelName' ? { modelName: term } : { code: term }));
    }, [dispatch]);

    const handleAddRow = useCallback(() => {
        setRows(prev => [...prev, { searchType: 'modelName', selectedProduct: null, quantity: '', searchTerm: '' }]);
    }, []);

    const handleDeleteRow = useCallback((index, rowId) => {
        if (rowId) {
            dispatch(deleteDispatchProductActions({
                dispatchProductId: rowId,
                action: 'delete'
            }));
        } else {
            if (rows.length <= 1) return;
            setRows(prev => prev.filter((_, i) => i !== index));
        }
    }, [dispatch, rows.length]);

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
                qty: rows[index].quantity || 1,
                oldQty: ''
            }));
        }
    }, [selectedWarehouse, dispatch, rows]);

    const handleWarehouseChange = (selectedOption) => {
        setSelectedWarehouse(selectedOption);
        setValue('warehouseId', selectedOption?.value);
    };

    const handleUserChange = (selectedUser) => {
        setSelectedUser(selectedUser);
        setValue('dispatchBy', selectedUser?.value);
    };

    const handleCustomerChange = (selectedCustomer) => {
        setSelectedCustomer(selectedCustomer);
        setValue('customerId', selectedCustomer?.value);
    };

    const handleQuantityChange = useCallback((e, index, item) => {
        const value = e.target.value === '' ? '' : parseInt(e.target.value);
        setRows(prev => {
            const updated = [...prev];
            updated[index].quantity = value;
            updated[index].quantityError = ''; // Clear error on change
            return updated;
        });

        if (rows[index]?.selectedProduct?.value && selectedWarehouse?.value) {
            dispatch(createStockCheckActions({
                warehouseId: selectedWarehouse.value,
                productId: rows[index].selectedProduct.value,
                qty: value,
                oldQty: DispatchDetails?.[0]?.dispatchProducts?.find((data) => data?._id === item?._id)?.quantity
            }));
        }
    }, [selectedWarehouse, dispatch, rows]);

    const validateQuantity = useCallback((e, index) => {
        const value = e.target.value;
        if (value === '') {
            setRows(prev => {
                const updated = [...prev];
                updated[index].quantity = 1; // Default to 1 if empty
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

    const handleSaveRow = useCallback((row, rowId) => {
        if (!row.selectedProduct) {
            toast.error('Please select a product');
            return;
        }
        if (!row.quantity) {
            toast.error('Please enter quantity');
            return;
        }

        if (rowId) {
            dispatch(updateDispatchProductActions({
                dispatchProductId: rowId,
                quantity: row.quantity
            }));
        } else {
            dispatch(createDispatchProductActions({
                dispatchId: stockId,
                productId: row.selectedProduct.value,
                quantity: row.quantity,
                warehouseId: selectedWarehouse?.value
            }));
        }
    }, [dispatch, stockId, selectedWarehouse]);

    const onSubmit = (data) => {
        const formData = new FormData();

        if (data?.attachmentGRfile?.[0] instanceof File) {
            formData.append('attachmentGRfile', data.attachmentGRfile[0]);
        }
        if (data?.invoiceAttachment?.[0] instanceof File) {
            formData.append('invoiceAttachment', data.invoiceAttachment[0]);
        }

        formData.append('warehouseId', selectedWarehouse?.value);
        formData.append('dispatchBy', selectedUser?.value);
        formData.append('customerId', selectedCustomer?.value);
        formData.append('description', data.description);
        formData.append('date', data.date);
        formData.append('grNumber', data.grNumber);
        formData.append('invoiceAttachmentType', attachmentType);
        formData.append('newProductArr', JSON.stringify([]));
        formData.append('dispatchId', stockId);

        dispatch(updateDispatchActions(formData));
    };

    if (DispatchLoading) {
        return (
            <Modal show={show} onHide={onHide} size='xl' centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Dispatch</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <Loading />
                </Modal.Body>
            </Modal>
        );
    }

    return (
        <Modal show={show} onHide={onHide} size='xl' backdrop="static" centered>
            <Modal.Header className="py-2">
                <div className="d-flex w-100 justify-content-between align-items-center">
                    <div className="col-4 text-start flex-grow-1">
                        <h4>Edit Dispatch</h4>
                    </div>
                    <div className="col-4 text-center flex-grow-1">
                        <span className='border border-1 rounded-2 px-2 text-black' title='Control Number'>{DispatchDetails?.[0]?.controlNumber}</span>
                    </div>
                    <div className="col-4 text-end">
                        <Button
                            variant="close"
                            aria-label="Close"
                            onClick={onHide}
                        />
                    </div>
                </div>
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
                                    type="number"
                                    placeholder="Enter GR Number"
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
                                    {DispatchDetails?.[0]?.attachmentGRfile && (
                                        <a
                                            href={DispatchDetails?.[0]?.attachmentGRfile}
                                            target="_blank"
                                            title='Download GR File'
                                            rel="noopener noreferrer"
                                            className="ms-1"
                                        >
                                            <HiOutlineFolderDownload className='fs-4' />
                                            {/* <span className="ms-1">View File</span> */}
                                        </a>
                                    )}
                                </Form.Label>
                                <Form.Control
                                    type="file"
                                    placeholder="Upload file"
                                    {...register('attachmentGRfile')}
                                />
                                {DispatchDetails?.[0]?.attachmentGRfile && (
                                    <small className="text-muted d-block mb-0 d-flex position-absolute gap-1">
                                        Current file: <a href={DispatchDetails?.[0]?.attachmentGRfile} target="_blank" rel="noopener noreferrer">
                                            {DispatchDetails?.[0]?.attachmentGRfile.split('/').pop()}
                                        </a>
                                    </small>
                                )}
                            </Form.Group>
                        </Col>

                        <Col sm={3}>
                            <Form.Group className="mb-1">
                                <Form.Label className="mb-0">
                                    Attachment
                                    {attachmentType && (
                                        <span className="text-capitalize"> ({attachmentType})</span>
                                    )}
                                    {DispatchDetails?.[0]?.invoiceAttachment && (
                                        <a
                                            href={DispatchDetails?.[0]?.invoiceAttachment}
                                            target="_blank"
                                            title='Download Attachment'
                                            rel="noopener noreferrer"
                                            className="ms-1"
                                        >
                                            <HiOutlineFolderDownload className='fs-4' />
                                            {/* <span className="ms-1">View File</span> */}
                                        </a>
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
                                            accept=".pdf,.docx,.jpg,.jpeg,.png"
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
                                {DispatchDetails?.[0]?.invoiceAttachment && (
                                    <small className="text-muted d-block mb-0 d-flex position-absolute gap-1">
                                        Current file: <a href={DispatchDetails?.[0]?.invoiceAttachment} target="_blank" rel="noopener noreferrer">
                                            {DispatchDetails?.[0]?.invoiceAttachment.split('/').pop()}
                                        </a>
                                    </small>
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

                    <hr className='mt-2 mb-0' />

                    <div style={{ maxHeight: rows?.length >= 3 ? '51vh' : 'auto', overflowY: rows?.length >= 3 ? 'auto' : 'visible', padding: '10px' }}>
                        {rows?.map((row, index) => (
                            <div className='mb-1 rounded-1 ps-1' style={{ border: '1px solid rgba(218, 224, 225, 0.97)' }} key={index}>

                                <Row key={index} className="align-items-center mb-2 g-2">
                                    <Col sm={2} className='d-flex'>
                                        <span className="fw-semibold d-flex align-items-center me-1 mt-2 pt-1">{index + 1}.</span>
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

                                    <Col sm={3}>
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
                                                    placeholder={`Search by model`}
                                                    isClearable
                                                    isSearchable
                                                    isLoading={productLoading}
                                                    filterOption={() => true}
                                                /> :
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

                                    <Col sm={2}>
                                        <Form.Group className='mb-0'>
                                            <Form.Label className="small mb-0">{row.searchType === 'modelName' ? 'Code' : 'Model '}</Form.Label>
                                            <Form.Control
                                                type='text'
                                                value={row.searchType === 'modelName' ? row.selectedProduct?.code : row.selectedProduct?.data?.modelId?.name || ''}
                                                placeholder={row.searchType === 'modelName' ? 'Code' : 'Model'}
                                                readOnly
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col sm={2}>
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
                                                disabled={!selectedWarehouse}
                                                isInvalid={!!row.quantityError}
                                            />
                                            {row.quantityError && (
                                                <Form.Control.Feedback type="invalid">
                                                    {row.quantityError}
                                                </Form.Control.Feedback>
                                            )}
                                        </Form.Group>
                                    </Col>

                                    <Col sm={1} className="d-flex justify-content-center mt-2 pt-1">
                                        <div className='d-flex'>
                                            <Button
                                                variant="outline-success"
                                                title='Save'
                                                onClick={() => handleSaveRow(row, row._id)}
                                                className="p-1 me-1 mt-2"
                                            >
                                                <MdSave className="fs-6" />
                                            </Button>

                                            <Button
                                                variant="outline-danger"
                                                title='Delete'
                                                onClick={() => handleDeleteRow(index, row._id)}
                                                className="p-1 mt-2"
                                            >
                                                <MdDelete className="fs-6" />
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        ))}
                    </div>

                    <div className="d-flex justify-content-between mt-3">
                        <Button className='outline-custom-button' onClick={handleAddRow}>
                            <IoIosAdd className="me-1" /> Add Row
                        </Button>

                        <div className='d-flex gap-2'>
                            <Button onClick={onHide} className="cancel-button">Cancel</Button>
                            {/* <Button type="submit" className='custom-button' disabled={updateLoading}>
                                {updateLoading ? 'Updating...' : 'Update'}
                            </Button> */}
                            <Button
                                className='custom-button'
                                type="submit"
                                disabled={store?.updateDispatchReducer?.loading}
                            >
                                {store?.updateDispatchReducer?.loading ? (
                                    "Updating..."
                                ) : (
                                    'Update'
                                )}

                            </Button>
                        </div>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default EditDispatchModal;