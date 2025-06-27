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
    createStockCheckActions,
} from '../../../../redux/actions';
import { IoIosAdd, IoMdArrowBack } from 'react-icons/io';
import { MdDelete, MdSave } from 'react-icons/md';
import { HiOutlineFolderDownload } from 'react-icons/hi';
import { CgCloseO } from 'react-icons/cg';
import { CartLoading, Loading } from '../../../../helpers/loader/Loading';
import { useFetcher, useLocation, useNavigate } from 'react-router-dom';
import { RiDeleteBinLine } from 'react-icons/ri';
import { AiOutlineEdit } from 'react-icons/ai';

function EditDispatchPage() {
    const dispatch = useDispatch();
    const location = useLocation();
    const editData = location.state?.editData;
    const navigate = useNavigate();
    const { handleSubmit, register, setValue, resetField } = useForm();

    // State management
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [attachmentType, setAttachmentType] = useState('');
    const [today] = useState(new Date().toISOString().split('T')[0]);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [editCase, setEditCase] = useState(false);
    const [productFormData, setProductFormData] = useState({
        searchType: 'modelName',
        selectedProduct: null,
        searchTerm: '',
        quantity: '',
        quantityError: '',
        modalName: null,
        productCode: null,
    });

    // Refs
    const fileInputRef = useRef();

    // Redux store selectors
    const store = useSelector((state) => state);
    const {
        searchProductReducer: {
            searchProduct: { response: ProductSearch = [], loading: productLoading },
            error: productError,
        },
        getWarehouseListReducer: {
            searchWarehouse: { response: Warehouse = [] },
            error: warehouseError,
        },
        updateDispatchReducer: { updateDispatch: { status: updateResponse, loading: updateLoading } = {} },
        deleteDispatchProductReducer: { deleteDispatchProduct: { status: deleteResponse } = {} },
        createDispatchProductReducer: { createDispatchProduct: { status: createResponse } = {} },
    } = useSelector((state) => state);

    const UsersList = store?.listingUsersReducer?.listingUsers?.response;
    const CustomerList = store?.listingCustomerReducer?.listingCustomer?.response;
    const DispatchDetails = store?.dispatchByIdReducer?.dispatchById?.response;
    const DispatchLoading = store?.dispatchByIdReducer?.loading;
    const updateProductDispatchStatus = store?.updateDispatchProductReducer?.updateStockProduct?.status;
    // Memoized options
    const warehouseOptions = useMemo(
        () => Warehouse?.map(({ _id, name }) => ({ value: _id, label: name })),
        [Warehouse]
    );

    const usersOptions = UsersList?.map((user) => ({
        value: user._id,
        label: user.name,
    }));

    const customerOptions = CustomerList?.map((customer) => ({
        value: customer._id,
        label: customer.name,
    }));

    const productOptions = useMemo(
        () =>
            ProductSearch?.map((product) => ({
                value: product._id,
                label: product.modelId?.name,
                code: product.code,
                name: product.name,
                data: product,
            })) || [],
        [ProductSearch]
    );

    const productOptionsCode = useMemo(
        () =>
            ProductSearch?.map((product) => ({
                value: product._id,
                label: product.code,
                code: product.code,
                name: product.name,
                data: product,
            })) || [],
        [ProductSearch]
    );

    // Effect hooks
    useEffect(() => {
        if (editData) {
            dispatch(getDispatchByIdActions(editData._id));
            dispatch(getWarehouseListActions());
            dispatch(listingCustomerActions());
        }
    }, [editData, dispatch]);

    useEffect(() => {
        if (
            deleteResponse === 200 ||
            createResponse === 200 ||
            updateResponse === 200 ||
            updateProductDispatchStatus === 200
        ) {
            dispatch(getDispatchByIdActions(editData._id));
        }
    }, [deleteResponse, createResponse, updateResponse, dispatch, editData, updateProductDispatchStatus]);

    useEffect(() => {
        dispatch(getDispatchByIdActions(editData._id));
    }, []);

    useEffect(() => {
        if (DispatchDetails?.[0]) {
            setValue(
                'date',
                DispatchDetails?.[0]?.date ? new Date(DispatchDetails?.[0]?.date).toISOString().split('T')[0] : today
            );
            setValue('grNumber', DispatchDetails?.[0]?.grNumber);
            setValue('description', DispatchDetails?.[0]?.description);
            setValue('invoiceAttachmentType', DispatchDetails?.[0]?.invoiceAttachmentType);

            const updateWarehouses = DispatchDetails?.[0]?.warehouseData
                ? {
                      value: DispatchDetails?.[0].warehouseId,
                      label: DispatchDetails?.[0].warehouseData?.find(
                          (ele) => ele?._id === DispatchDetails?.[0]?.warehouseId
                      )?.name,
                  }
                : {};
            setSelectedWarehouse(updateWarehouses);

            const updatedUser = DispatchDetails?.[0]?.dispatchByData
                ? {
                      value: DispatchDetails?.[0]?.dispatchBy,
                      label: DispatchDetails?.[0].dispatchByData?.find(
                          (ele) => ele?._id === DispatchDetails?.[0]?.dispatchBy
                      )?.name,
                  }
                : {};
            setSelectedUser(updatedUser);

            const updatedCustomer = DispatchDetails?.[0]?.customerData
                ? {
                      value: DispatchDetails?.[0]?.customerId,
                      label: DispatchDetails?.[0].customerData?.find(
                          (ele) => ele?._id === DispatchDetails?.[0]?.customerId
                      )?.name,
                  }
                : {};
            setSelectedCustomer(updatedCustomer);

            setAttachmentType(DispatchDetails?.[0]?.invoiceAttachmentType || '');
        }
    }, [DispatchDetails, setValue, today]);

    useEffect(() => {
        if (selectedWarehouse?.value) {
            dispatch(listingUsersActions({ warehouseId: selectedWarehouse.value }));
        }
    }, [selectedWarehouse, dispatch]);

    useEffect(() => {
        if (productError) toast.error(productError.message || 'Failed to search products');
        if (warehouseError) toast.error(warehouseError.message || 'Failed to load warehouses');
    }, [productError, warehouseError]);

    // Handlers
    const handleAttachmentTypeChange = (e) => {
        const type = e.target.value;
        setAttachmentType(type);
        setValue('invoiceAttachmentType', type);
    };

    const resetAttachmentType = () => {
        setAttachmentType('');
        setValue('invoiceAttachmentType', '');
        resetField('invoiceAttachment');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSearch = useCallback(
        (term, type) => {
            if (!term || term.length < 1) return;
            dispatch(searchProductActions(type === 'modelName' ? { modelName: term } : { code: term }));
        },
        [dispatch]
    );

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

    const handleProductChange = useCallback(
        (selected) => {
            setProductFormData((prev) => ({
                ...prev,
                selectedProduct: selected,
                searchTerm: selected?.label || '',
            }));

            if (selected?.value && selectedWarehouse?.value) {
                dispatch(
                    createStockCheckActions({
                        warehouseId: selectedWarehouse.value,
                        productId: selected.value,
                        qty: productFormData.quantity || 1,
                        oldQty: '',
                    })
                );
            }
        },
        [selectedWarehouse, dispatch, productFormData.quantity]
    );

    const handleQuantityChange = useCallback(
        (e) => {
            const value = e.target.value === '' ? '' : parseInt(e.target.value);
            setProductFormData((prev) => ({
                ...prev,
                quantity: value,
                quantityError: '',
            }));

            if (productFormData?.selectedProduct?.value && selectedWarehouse?.value) {
                dispatch(
                    createStockCheckActions({
                        warehouseId: selectedWarehouse.value,
                        productId: productFormData.selectedProduct.value,
                        qty: value,
                        oldQty: '',
                    })
                );
            }
        },
        [selectedWarehouse, dispatch, productFormData.selectedProduct]
    );

    const validateQuantity = useCallback((e) => {
        const value = e.target.value;
        if (value === '') {
            setProductFormData((prev) => ({
                ...prev,
                quantity: 1,
                quantityError: '',
            }));
            return;
        }

        const numValue = parseInt(value);
        if (isNaN(numValue) || numValue <= 0) {
            setProductFormData((prev) => ({
                ...prev,
                quantityError: 'Quantity must be greater than 0',
            }));
        } else {
            setProductFormData((prev) => ({
                ...prev,
                quantity: numValue,
                quantityError: '',
            }));
        }
    }, []);

    const handleDelete = (product) => {
        dispatch(
            deleteDispatchProductActions({
                dispatchProductId: product._id,
            })
        );
    };

    const handleEdit = (product) => {
        setEditCase(true);
        setProductFormData({
            _id: product._id,
            searchType: 'modelName',
            selectedProduct: {
                value: product.productId,
                label: product.productData?.modelData?.[0]?.name || product.productData?.name,
                code: product.productData?.code,
                name: product.productData?.name,
                data: product,
            },
            quantity: product.quantity,
            searchTerm: product.productData?.modelData?.[0]?.name || product.productData?.name,
            modalName: {
                label: product.productData?.modelData?.[0]?.name,
                value: product.productData?.modelData?.[0]?._id,
            },
            productCode: {
                label: product.productData?.code,
                value: product.productData?._id,
            },
        });
    };

    const handleDeleteRow = () => {
        setProductFormData({
            searchType: 'modelName',
            selectedProduct: null,
            searchTerm: '',
            quantity: '',
            quantityError: '',
            modalName: null,
            productCode: null,
        });
        setEditCase(false);
    };

    const handleSaveRow = useCallback(async () => {
        if (!productFormData.selectedProduct) {
            toast.error('Please select a product');
            return;
        }
        if (!productFormData.quantity) {
            toast.error('Please enter quantity');
            return;
        }

        try {
            if (editCase && productFormData._id) {
                // Update existing product
                const res = await dispatch(
                    updateDispatchProductActions({
                        dispatchProductId: productFormData._id,
                        quantity: productFormData.quantity,
                        productId: productFormData.selectedProduct.value,
                    })
                );
                if (res?.payload?.status === 200) {
                    await dispatch(getDispatchByIdActions(editData._id));
                    toast.success('Product updated successfully');
                }
            } else {
                // Create new product
                const res = await dispatch(
                    createDispatchProductActions({
                        dispatchId: editData._id,
                        productId: productFormData.selectedProduct.value,
                        quantity: productFormData.quantity,
                        warehouseId: selectedWarehouse?.value,
                    })
                );
                if (res?.payload?.status === 201 || res?.payload?.status === 200) {
                    await dispatch(getDispatchByIdActions(editData._id));
                    toast.success('Product added successfully');
                }
            }

            // Reset form after save
            setProductFormData({
                searchType: 'modelName',
                selectedProduct: null,
                searchTerm: '',
                quantity: '',
                quantityError: '',
                modalName: null,
                productCode: null,
            });
            setEditCase(false);
        } catch (error) {
            toast.error('An error occurred while saving the product');
            console.error('Save product error:', error);
        }
    }, [dispatch, editData, selectedWarehouse, editCase, productFormData]);
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
        formData.append('dispatchId', editData._id);

        dispatch(updateDispatchActions(formData));
    };

    return (
        <div className="container-fluid">
            {/* Header Section */}

            <div className="d-flex w-100 justify-content-between align-items-center ">
                <div className="col-4 text-start flex-grow-1">
                    <Row className="align-items-center my-2">
                        <Col xs="auto">
                            <IoMdArrowBack
                                size={24}
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    window.history.back(); // native back
                                    setTimeout(() => window.location.reload(), 500); // wait a bit longer
                                }}
                                className=""
                            />
                        </Col>
                        <Col className="p-0 ">
                            <h3 className="mb-0 m-0">Edit Stock</h3>
                        </Col>
                    </Row>
                </div>

                <div className="col-4 text-center flex-grow-1">
                    <span className="border border-1 rounded-2 px-2 text-black" title="Control Number">
                        {editData?.controlNumber}
                    </span>
                </div>
                <div className="col-4 text-end">{/* <Button variant="close" aria-label="Close" /> */}</div>
            </div>

            {/* Main Form */}
            <Form onSubmit={handleSubmit(onSubmit)} className="rounded-3 p-3 border">
                <Row>
                    <Col sm={3}>
                        <Form.Group className="mb-1">
                            <Form.Label className="mb-0">
                                Warehouse <span className="text-danger">*</span>
                            </Form.Label>
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
                            <Form.Label className="mb-0">
                                Customer <span className="text-danger">*</span>
                            </Form.Label>
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
                            <Form.Label className="mb-0">
                                Dispatch By <span className="text-danger">*</span>
                            </Form.Label>
                            <Select
                                value={selectedUser}
                                onChange={handleUserChange}
                                className="text-capitalize"
                                options={usersOptions}
                                placeholder="Select a User"
                                isClearable
                                required
                            />
                        </Form.Group>
                    </Col>

                    <Col sm={3}>
                        <Form.Group className="mb-1">
                            <Form.Label className="mb-0">Date</Form.Label>
                            <Form.Control type="date" defaultValue={today} {...register('date')} />
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
                            <Form.Label className="mb-0">
                                Attach GR File
                                {DispatchDetails?.[0]?.attachmentGRfile && (
                                    <a
                                        href={DispatchDetails?.[0]?.attachmentGRfile}
                                        target="_blank"
                                        title="Download GR File"
                                        rel="noopener noreferrer"
                                        className="ms-1">
                                        <HiOutlineFolderDownload className="fs-4" />
                                    </a>
                                )}
                            </Form.Label>
                            <Form.Control type="file" placeholder="Upload file" {...register('attachmentGRfile')} />
                            {DispatchDetails?.[0]?.attachmentGRfile && (
                                <small className="text-muted d-block mb-0 d-flex position-absolute gap-1">
                                    Current file:{' '}
                                    <a
                                        href={DispatchDetails?.[0]?.attachmentGRfile}
                                        target="_blank"
                                        rel="noopener noreferrer">
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
                                {attachmentType && <span className="text-capitalize"> ({attachmentType})</span>}
                                {DispatchDetails?.[0]?.invoiceAttachment && (
                                    <a
                                        href={DispatchDetails?.[0]?.invoiceAttachment}
                                        target="_blank"
                                        title="Download Attachment"
                                        rel="noopener noreferrer"
                                        className="ms-1">
                                        <HiOutlineFolderDownload className="fs-4" />
                                    </a>
                                )}
                            </Form.Label>

                            {!attachmentType ? (
                                <Form.Select
                                    className="mb-0"
                                    value={attachmentType}
                                    onChange={handleAttachmentTypeChange}>
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
                                        {...register('invoiceAttachment')}
                                    />
                                    <CgCloseO
                                        size={20}
                                        className="text-danger"
                                        style={{ cursor: 'pointer' }}
                                        onClick={resetAttachmentType}
                                        title="Change attachment type"
                                    />
                                </div>
                            )}
                            {DispatchDetails?.[0]?.invoiceAttachment && (
                                <small className="text-muted d-block mb-0 d-flex position-absolute gap-1">
                                    Current file:{' '}
                                    <a
                                        href={DispatchDetails?.[0]?.invoiceAttachment}
                                        target="_blank"
                                        rel="noopener noreferrer">
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
                    <div className="text-end mt-2">
                        <Button
                            className="custom-button"
                            type="submit"
                            disabled={store?.updateDispatchReducer?.loading}>
                            {store?.updateDispatchReducer?.loading ? 'Updating...' : 'Update'}
                        </Button>
                    </div>
                </Row>
            </Form>

            {/* Product Form Section */}
            <div className="py-2 my-0">
                <div className="border rounded mb-2 p-2">
                    <Row className="align-items-center g-2">
                        <Col xs={1} className="text-center mt-3">
                            <span className="fw-bold">1.</span>
                        </Col>

                        <Col sm={2}>
                            <Form.Group className="mb-0">
                                <Form.Label className="small mb-0">Search By</Form.Label>
                                <Form.Select
                                    value={productFormData?.searchType}
                                    onChange={(e) => {
                                        setEditCase(false);
                                        setProductFormData({
                                            ...productFormData,
                                            searchType: e.target.value,
                                            selectedProduct: null,
                                            searchTerm: '',
                                        });
                                    }}>
                                    <option value="modelName">Model Name</option>
                                    <option value="code">Product Code</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col sm={2}>
                            <Form.Group className="mb-0">
                                <Form.Label className="small mb-0">
                                    {productFormData?.searchType === 'modelName' ? 'Model Name' : 'Product Code'}
                                </Form.Label>
                                {productFormData?.searchType === 'modelName' ? (
                                    <Select
                                        value={
                                            productFormData?.modalName
                                                ? productFormData?.modalName
                                                : productFormData?.selectedProduct || null
                                        }
                                        onChange={(selected) => handleProductChange(selected)}
                                        onInputChange={(inputValue) => {
                                            setProductFormData((prev) => ({
                                                ...prev,
                                                searchTerm: inputValue,
                                            }));
                                            handleSearch(inputValue, productFormData?.searchType);
                                        }}
                                        options={productOptions}
                                        placeholder="Search by model"
                                        isClearable
                                        isSearchable
                                        isDisabled={editCase}
                                        isLoading={productLoading}
                                        filterOption={() => true}
                                    />
                                ) : (
                                    <Select
                                        value={
                                            productFormData?.productCode
                                                ? productFormData?.productCode
                                                : productFormData?.selectedProduct || null
                                        }
                                        onChange={(selected) => handleProductChange(selected)}
                                        onInputChange={(inputValue) => {
                                            setProductFormData((prev) => ({
                                                ...prev,
                                                searchTerm: inputValue,
                                            }));
                                            handleSearch(inputValue, productFormData?.searchType);
                                        }}
                                        options={productOptionsCode}
                                        placeholder={`Search by code`}
                                        isClearable
                                        isSearchable
                                        isDisabled={editCase}
                                        isLoading={productLoading}
                                        filterOption={() => true}
                                    />
                                )}
                            </Form.Group>
                        </Col>

                        <Col sm={2}>
                            <Form.Group>
                                <Form.Label className="small mb-0">
                                    {productFormData.searchType === 'modelName' ? 'Code' : 'Model'}
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    value={
                                        !editCase
                                            ? productFormData.searchType === 'modelName'
                                                ? productFormData?.selectedProduct?.code
                                                : productFormData?.selectedProduct?.data?.modelId?.name
                                            : productFormData.searchType === 'modelName'
                                            ? productFormData.productCode?.label || ''
                                            : productFormData.modalName?.label || ''
                                    }
                                    readOnly
                                    className="form-control-sm bg-light"
                                    style={{ padding: '0.47rem' }}
                                />
                            </Form.Group>
                        </Col>

                        <Col sm={2}>
                            <Form.Group>
                                <Form.Label className="small mb-0">Product Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={productFormData?.selectedProduct?.name || ''}
                                    readOnly
                                    className="form-control-sm bg-light"
                                    style={{ padding: '0.47rem' }}
                                />
                            </Form.Group>
                        </Col>

                        <Col xs={2}>
                            <Form.Group>
                                <Form.Label className="small mb-0">Qty</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={productFormData?.quantity || ''}
                                    onChange={handleQuantityChange}
                                    onBlur={validateQuantity}
                                    required
                                    isInvalid={!!productFormData?.quantityError}
                                    className="form-control-sm"
                                    style={{ padding: '0.47rem' }}
                                />
                                {productFormData?.quantityError && (
                                    <Form.Control.Feedback type="invalid" className="d-block">
                                        {productFormData?.quantityError}
                                    </Form.Control.Feedback>
                                )}
                            </Form.Group>
                        </Col>

                        <Col xs={1} className="text-center" style={{ paddingTop: '16px' }}>
                            <div className="d-flex justify-content-center gap-1">
                                <Button
                                    variant="outline-success"
                                    className="border-0 fs-3"
                                    size="sm"
                                    title="Save"
                                    onClick={handleSaveRow}>
                                    <MdSave />
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    className="border-0 fs-3"
                                    size="sm"
                                    title="Delete"
                                    onClick={handleDeleteRow}>
                                    <MdDelete />
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>

            {/* Products Table */}
            {DispatchLoading ? (
                <CartLoading />
            ) : (
                <div className="table-responsive border" style={{ borderRadius: '6px' }}>
                    <table className="table table-striped bg-white mb-0">
                        <thead>
                            <tr className="table_header">
                                <th scope="col">#</th>
                                <th scope="col">Product Name</th>
                                <th scope="col">Model Name</th>
                                <th scope="col">Code</th>
                                <th scope="col">Quantity</th>
                                <th scope="col">Created At</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {store?.dispatchByIdReducer?.loading ? (
                                <tr>
                                    <td className="text-center" colSpan={8}>
                                        <Loading />
                                    </td>
                                </tr>
                            ) : DispatchDetails?.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center">
                                        <p className="my-5 py-5">No data found in Dispatch.</p>
                                    </td>
                                </tr>
                            ) : (
                                (() => {
                                    let rowIndex = 0;
                                    const capitalizeFirst = (str) => {
                                        if (!str) return '-';
                                        return str.charAt(0).toUpperCase() + str.slice(1);
                                    };

                                    return DispatchDetails?.map((dispatch) =>
                                        dispatch?.dispatchProducts?.map((product) => {
                                            rowIndex++;
                                            return (
                                                <tr key={product._id} className="text-dark text-nowrap highlight-row">
                                                    <td className="font_work">{rowIndex}</td>
                                                    <td className="font_work">
                                                        {capitalizeFirst(product?.productData?.name)}
                                                    </td>
                                                    <td className="font_work">
                                                        {product?.productData?.modelData?.[0]?.name
                                                            ? capitalizeFirst(
                                                                  product?.productData?.modelData?.[0]?.name.slice(
                                                                      0,
                                                                      25
                                                                  )
                                                              ) +
                                                              (product?.productData?.modelData?.[0]?.name.length > 25
                                                                  ? '...'
                                                                  : '')
                                                            : '-'}
                                                    </td>
                                                    <td className="font_work">{product?.productData?.code || '-'}</td>
                                                    <td className="font_work">{product?.quantity ?? '-'}</td>
                                                    <td className="font_work">
                                                        {product?.createdAt
                                                            ? new Date(product.createdAt).toLocaleDateString()
                                                            : '-'}
                                                    </td>
                                                    <td>
                                                        <span
                                                            className="icon-wrapper"
                                                            title="Edit"
                                                            onClick={() => handleEdit(product)}>
                                                            <AiOutlineEdit
                                                                className="fs-4"
                                                                style={{ cursor: 'pointer' }}
                                                            />
                                                        </span>
                                                        <span
                                                            className="icon-wrapper"
                                                            title="Delete"
                                                            onClick={() => handleDelete(product)}>
                                                            <RiDeleteBinLine
                                                                className="fs-4"
                                                                style={{ cursor: 'pointer' }}
                                                            />
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    );
                                })()
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default EditDispatchPage;
// main
