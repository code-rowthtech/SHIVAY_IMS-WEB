import { useEffect, useMemo, useCallback, useState, useRef } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { CgCloseO } from 'react-icons/cg';
import {
    getWarehouseListActions,
    listingSupplierActions,
    listingUsersActions,
    searchProductActions,
    updateStockInActions,
    deleteStockInProductActions,
    getStockInByIdActions,
    createStockInProductActions,
    updateStockInProductActions,
    deleteStockInActions,
    getStockInByIdActionsReset,
} from '../../../../redux/actions';
import { HiOutlineFolderDownload } from 'react-icons/hi';
import { IoIosAdd, IoMdArrowBack } from 'react-icons/io';
import { MdDelete, MdDeleteOutline, MdSave } from 'react-icons/md';
import { CartLoading, Loading } from '../../../../helpers/loader/Loading';
import { useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { RiDeleteBinLine } from 'react-icons/ri';

function EditStockin() {
    // Router hooks
    const location = useLocation();
    const editData = location.state?.editData;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Form handling
    const { handleSubmit, register, setValue, reset, resetField } = useForm();

    // State management
    const [today, setToday] = useState(new Date().toISOString().split('T')[0]);
    const [rows, setRows] = useState([
        { searchType: 'modelName', selectedProduct: null, quantity: '', searchTerm: '' },
    ]);
    const [editedQuantity, setEditedQuantity] = useState('');
    const [productId, setProductId] = useState('');
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [attachmentType, setAttachmentType] = useState('');
    const [stateDelete, setStateDelete] = useState(false);
    const [stockToDelete, setStockToDelete] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);

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
    } = useSelector((state) => state);

    const UsersList = store?.listingUsersReducer?.listingUsers?.response;
    const SupplierList = store?.listingSupplierReducer?.listingSupplier?.response;
    const stockInData = store?.stockInByIdReducer?.stockInById?.response;
    const stockInLoading = store?.stockInByIdReducer.loading;
    console.log(store?.stockInByIdReducer.loading, 'stockInDatas');
    const CreateProductResponse = store?.createStockInProductReducer?.createStockInProduct?.status;
    const DeleteProductResponse = store?.deleteStockInProductReducer?.deleteStockInProduct?.status;
    const UpdateProductResponse = store?.updateStockInProductReducer?.updateStockInProduct?.status;
    const UpdateResponse = store?.updateStockInReducer?.updateStockIn?.status;

    // Refs
    const fileInputRef = useRef();

    // Memoized options
    const warehouseOptions = useMemo(
        () => Warehouse?.map(({ _id, name }) => ({ value: _id, label: name })),
        [Warehouse]
    );

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

    const usersOptions = UsersList?.map((users) => ({
        value: users._id,
        label: users.name
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' '),
    }));

    const supplierOptions = SupplierList?.map((users) => ({
        value: users._id,
        label: users.name,
    }));

    // Effect hooks
    useEffect(() => {
        if (UpdateResponse === 200) {
            reset();
            setRows([{ searchType: 'modelName', selectedProduct: null, quantity: '', searchTerm: '' }]);
        }
    }, [UpdateResponse]);

    useEffect(() => {
        dispatch(getWarehouseListActions());
        dispatch(listingSupplierActions());
    }, [dispatch]);

    useEffect(() => {
        if (productError) toast.error(productError.message || 'Failed to search products');
        if (warehouseError) toast.error(warehouseError.message || 'Failed to load warehouses');
    }, [productError, warehouseError]);

    useEffect(() => {
        if (selectedWarehouse?.value) {
            dispatch(listingUsersActions({ warehouseId: selectedWarehouse.value }));
        }
    }, [dispatch, selectedWarehouse]);

    useEffect(() => {
        if (CreateProductResponse === 200 || DeleteProductResponse === 200 || UpdateProductResponse === 200) {
            dispatch(getStockInByIdActions(editData._id));
        }
    }, [CreateProductResponse, DeleteProductResponse, UpdateProductResponse]);

    // useEffect(() => {
    //     if (editData) {
    //         dispatch(getStockInByIdActions(editData._id));
    //     }
    // }, [editData]);

    useEffect(() => {
        if (editData) {
            const initialRows =
                editData?.stockInProducts?.map((item) => {
                    const product = item?.productData || {};
                    const modelName = product.modelData?.[0]?.name || '';
                    const code = product?.code || '';
                    const name = product?.name || '';

                    return {
                        _id: item._id,
                        searchType: 'modelName',
                        selectedProduct: {
                            value: item.productId,
                            label: modelName || name,
                            code,
                            name,
                            data: item,
                        },
                        quantity: item.quantity,
                        searchTerm: modelName || name,
                    };
                }) || [];

            setRows(initialRows);
            setToday(editData?.createdAt ? new Date(editData?.createdAt).toISOString().split('T')[0] : '');

            const updateWarehouses = editData?.warehouseData
                ? {
                      value: editData.warehouseId,
                      label: editData.warehouseData?.find((ele) => ele?._id === editData?.warehouseId)?.name,
                  }
                : {};
            setSelectedWarehouse(updateWarehouses);

            const updatedUser = editData?.receivedByData
                ? {
                      value: editData?.receivedBy,
                      label: editData.receivedByData?.find((ele) => ele?._id === editData?.receivedBy)?.name,
                  }
                : {};
            setSelectedUser(updatedUser);

            const updatedSupplier = editData?.supplierId
                ? {
                      value: editData?.supplierId,
                      label: editData.supplierData?.find((ele) => ele?._id === editData?.supplierId)?.name,
                  }
                : {};
            setSelectedSupplier(updatedSupplier);

            setValue('invoiceNumber', editData?.invoiceNumber || '');
            setValue('description', editData?.description || '');
            setValue('invoiceValue', editData?.fright || '');
            setValue('invoiceAttachment', editData?.invoiceAttachment || '');
            setAttachmentType(editData?.invoiceAttachmentType || '');
            setEditedQuantity(editData?.stockInProducts?.quantity || '');
            setProductId(editData?.productData?._id);
        }
    }, [setValue, editData]);

    // Callback functions
    const handleSearch = useCallback(
        (term, type) => {
            if (!term || term.length < 1) return;
            dispatch(searchProductActions(type === 'modelName' ? { modelName: term } : { code: term }));
        },
        [dispatch]
    );

    const handleAddRow = useCallback(() => {
        setRows((prev) => [...prev, { searchType: 'modelName', selectedProduct: null, quantity: '', searchTerm: '' }]);
    }, []);

    const handleProductChange = useCallback((selected, index) => {
        setRows((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], selectedProduct: selected, searchTerm: selected?.label || '' };
            return updated;
        });
    }, []);

    const handleQuantityChange = useCallback((e, index) => {
        const value = e.target.value === '' ? '' : parseInt(e.target.value);
        setRows((prev) => {
            const updated = [...prev];
            updated[index].quantity = value;
            updated[index].quantityError = '';
            return updated;
        });
    }, []);

    const validateQuantity = useCallback((e, index) => {
        const value = e.target.value;
        if (value === '') {
            setRows((prev) => {
                const updated = [...prev];
                updated[index].quantity = 1;
                updated[index].quantityError = '';
                return updated;
            });
            return;
        }

        const numValue = parseInt(value);
        if (isNaN(numValue) || numValue <= 0) {
            setRows((prev) => {
                const updated = [...prev];
                updated[index].quantityError = 'Quantity must be greater than 0';
                return updated;
            });
        } else {
            setRows((prev) => {
                const updated = [...prev];
                updated[index].quantity = numValue;
                updated[index].quantityError = '';
                return updated;
            });
        }
    }, []);

    const handleDelete = () => {
        dispatch(deleteStockInActions({ stockInId: stockToDelete }));
        setShowConfirm(false);
    };

    const handleWarehouseChange = (selectedOption) => {
        setSelectedWarehouse(selectedOption);
    };

    const handleUserChange = (selectedUser) => {
        setSelectedUser(selectedUser);
    };

    const handleSupplierChange = (selectedSupplier) => {
        setSelectedSupplier(selectedSupplier);
    };

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

    // Form submission handlers
    const onSubmit = (data) => {
        const formData = new FormData();

        if (data?.invoiceAttachment?.[0] instanceof File) {
            formData.append('invoiceAttachment', data.invoiceAttachment?.[0]);
        }
        formData.append('warehouseId', selectedWarehouse?.value);
        formData.append('receivedBy', selectedUser?.value);
        formData.append('supplierId', selectedSupplier?.value);
        formData.append('description', data?.description);
        formData.append('invoiceNumber', data?.invoiceNumber);
        formData.append('fright', data?.invoiceValue);
        formData.append('invoiceAttachmentType', attachmentType);
        formData.append('newProductArr', JSON.stringify([]));
        formData.append('productDetailsArr', JSON.stringify([]));
        formData.append('stockInId', editData._id);

        dispatch(updateStockInActions(formData));
    };

    const handleSaveRow = async (row, rowId) => {
        const quantity = row?.quantity;
        console.log(quantity, 'quantity');
        const selectedWarehouseId = selectedWarehouse?.value;

        if (rowId) {
            const updateData = {
                stockInProductId: row?._id,
                quantity: quantity,
            };
            const res = await dispatch(updateStockInProductActions(updateData));
            if (res?.payload?.status === 200) {
                dispatch(getStockInByIdActions(editData._id));
            }
        } else {
            const createData = {
                stockInId: editData._id,
                productId: row?.selectedProduct?.data?._id,
                quantity: quantity,
                warehouseId: selectedWarehouseId,
            };
            dispatch(createStockInProductActions(createData));
        }
    };

    useEffect(() => {
        dispatch(getStockInByIdActionsReset());
    }, [dispatch]);

    return (
        <div className="container-fluid ">
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
                <div className="col-4 text-end">
                    <Button variant="close" aria-label="Close" />
                </div>
            </div>

            {/* Main Form */}
            <Form onSubmit={handleSubmit(onSubmit)} className="  rounded-3  ">
                {/* Basic Information Row */}
                <div className="border p-3 " style={{ borderRadius: '6px' }}>
                    <Row className="mb-3">
                        <Col sm={3}>
                            <Form.Group>
                                <Form.Label className="mb-1 fw-semibold">
                                    Warehouse <span className="text-danger">*</span>
                                </Form.Label>
                                <Select
                                    value={selectedWarehouse}
                                    onChange={handleWarehouseChange}
                                    options={warehouseOptions}
                                    placeholder="Select Warehouse"
                                    isClearable
                                    required
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={3}>
                            <Form.Group>
                                <Form.Label className="mb-1 fw-semibold">
                                    Received By <span className="text-danger">*</span>
                                </Form.Label>
                                <Select
                                    value={selectedUser}
                                    onChange={handleUserChange}
                                    className="text-capitalize"
                                    options={usersOptions}
                                    placeholder="Select User"
                                    isClearable
                                    required
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={3}>
                            <Form.Group>
                                <Form.Label className="mb-1 fw-semibold">
                                    Supplier <span className="text-danger">*</span>
                                </Form.Label>
                                <Select
                                    value={selectedSupplier}
                                    onChange={handleSupplierChange}
                                    options={supplierOptions}
                                    className="text-capitalize"
                                    placeholder="Select Supplier"
                                    isClearable
                                    required
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={3}>
                            <Form.Group>
                                <Form.Label className="mb-1 fw-semibold">Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={today}
                                    {...register('date')}
                                    className="form-control-sm"
                                    style={{ padding: '0.47rem' }}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Invoice Information Row */}
                    <Row className="mb-3">
                        <Col sm={3}>
                            <Form.Group>
                                <Form.Label className="mb-1 fw-semibold">
                                    Invoice Number <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Invoice Number"
                                    {...register('invoiceNumber', { required: true })}
                                    required
                                    className="form-control-sm"
                                    style={{ padding: '0.47rem' }}
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={3}>
                            <Form.Group>
                                <Form.Label className="mb-1 fw-semibold">
                                    Attachment
                                    {attachmentType && <span className="text-capitalize"> ({attachmentType})</span>}
                                    {editData?.invoiceAttachment && (
                                        <a
                                            href={editData?.invoiceAttachment}
                                            target="_blank"
                                            title="Download Attachment"
                                            rel="noopener noreferrer"
                                            className="ms-1">
                                            <HiOutlineFolderDownload className="fs-5 text-primary" />
                                        </a>
                                    )}
                                    <span className="text-danger"> *</span>
                                </Form.Label>

                                {!attachmentType ? (
                                    <Form.Select
                                        value={attachmentType}
                                        onChange={handleAttachmentTypeChange}
                                        required
                                        className="form-select-sm"
                                        style={{ padding: '0.47rem' }}>
                                        <option value="">Select Attachment Type</option>
                                        <option value="Invoice">Invoice</option>
                                        <option value="Delivery Challan">Delivery Challan</option>
                                    </Form.Select>
                                ) : (
                                    <div className="d-flex align-items-center gap-2">
                                        <Form.Control
                                            type="file"
                                            accept=".pdf,.docx,.jpg,.jpeg,.png"
                                            placeholder="Upload file"
                                            {...register('invoiceAttachment')}
                                            className="form-control-sm"
                                            style={{ lineHeight: '1.65rem' }}
                                            ref={fileInputRef}
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
                                {editData?.invoiceAttachment && (
                                    <small className="text-muted d-block mt-1">
                                        Current file:{' '}
                                        <a href={editData?.invoiceAttachment} target="_blank" rel="noopener noreferrer">
                                            {editData?.invoiceAttachment.split('/').pop()}
                                        </a>
                                    </small>
                                )}
                            </Form.Group>
                        </Col>
                        <Col sm={3}>
                            <Form.Group>
                                <Form.Label className="mb-1 fw-semibold">Invoice Value</Form.Label>
                                <Form.Control
                                    type="text"
                                    {...register('invoiceValue')}
                                    placeholder="Enter Invoice Value"
                                    className="form-control-sm"
                                    style={{ padding: '0.47rem' }}
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={3}>
                            <Form.Group>
                                <Form.Label className="mb-1 fw-semibold">Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={1}
                                    {...register('description')}
                                    placeholder="Enter Description"
                                    className="form-control-sm"
                                    style={{ padding: '0.47rem' }}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <div className="d-flex justify-content-end m-0">
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={store?.updateStockInReducer?.loading}
                            className="px-4 rounded-pill">
                            {store?.updateStockInReducer?.loading ? (
                                <span className="d-flex align-items-center">
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                        aria-hidden="true"></span>
                                    Updating...
                                </span>
                            ) : (
                                'Update'
                            )}
                        </Button>
                    </div>
                </div>
                <div className=" py-2 my-0">
                    {/* Form Actions */}

                    {/* Products List */}
                    <div className="">
                        {rows.map((row, index) => (
                            <div key={index} className="border rounded mb-2 p-2">
                                <Row className="align-items-center g-2">
                                    {/* Row Number */}
                                    <Col xs={1} className="text-center mt-3">
                                        <span className="fw-bold">{index + 1}.</span>
                                    </Col>

                                    {/* Search Type */}
                                    <Col sm={2}>
                                        <Form.Group className="mb-0">
                                            <Form.Label className="small mb-0">Search By</Form.Label>
                                            <Form.Select
                                                value={row?.searchType}
                                                onChange={(e) =>
                                                    setRows((prev) => {
                                                        const updated = [...prev];
                                                        updated[index] = {
                                                            ...updated[index],
                                                            searchType: e.target.value,
                                                            selectedProduct: null,
                                                            searchTerm: '',
                                                        };
                                                        return updated;
                                                    })
                                                }>
                                                <option value="modelName">Model Name</option>
                                                <option value="code">Product Code</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>

                                    {/* Dynamic Search Field */}
                                    <Col sm={2}>
                                        <Form.Group className="mb-0">
                                            <Form.Label className="small mb-0">
                                                {row.searchType === 'modelName' ? 'Model Name' : 'Product Code'}
                                            </Form.Label>
                                            {row.searchType === 'modelName' ? (
                                                <Select
                                                    value={row?.selectedProduct}
                                                    onChange={(selected) => handleProductChange(selected, index)}
                                                    onInputChange={(inputValue) => {
                                                        setRows((prev) => {
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
                                                />
                                            ) : (
                                                <Select
                                                    value={row?.selectedProduct}
                                                    onChange={(selected) => handleProductChange(selected, index)}
                                                    onInputChange={(inputValue) => {
                                                        setRows((prev) => {
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
                                            )}
                                        </Form.Group>
                                    </Col>

                                    {/* Complementary Info */}
                                    <Col sm={2}>
                                        <Form.Group>
                                            <Form.Label className="small mb-0">
                                                {row.searchType === 'modelName' ? 'Code' : 'Model'}
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={
                                                    row.searchType === 'modelName'
                                                        ? row.selectedProduct?.code
                                                        : row.selectedProduct?.data?.modelId?.name || ''
                                                }
                                                readOnly
                                                className="form-control-sm bg-light"
                                                style={{ padding: '0.47rem' }}
                                            />
                                        </Form.Group>
                                    </Col>

                                    {/* Product Name */}
                                    <Col sm={2}>
                                        <Form.Group>
                                            <Form.Label className="small mb-0">Product Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={row.selectedProduct?.name || ''}
                                                readOnly
                                                className="form-control-sm bg-light"
                                                style={{ padding: '0.47rem' }}
                                            />
                                        </Form.Group>
                                    </Col>

                                    {/* Quantity */}
                                    <Col xs={2}>
                                        <Form.Group>
                                            <Form.Label className="small mb-0">Qty</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={row.quantity}
                                                onChange={(e) => handleQuantityChange(e, index)}
                                                onBlur={(e) => validateQuantity(e, index)}
                                                required
                                                isInvalid={!!row.quantityError}
                                                className="form-control-sm"
                                                style={{ padding: '0.47rem' }}
                                            />
                                            {row.quantityError && (
                                                <Form.Control.Feedback type="invalid" className="d-block">
                                                    {row.quantityError}
                                                </Form.Control.Feedback>
                                            )}
                                        </Form.Group>
                                    </Col>

                                    {/* Action Buttons */}
                                    <Col xs={1} className="text-center" style={{ paddingTop: '16px' }}>
                                        <div className="d-flex justify-content-center gap-1">
                                            <Button
                                                variant="outline-success"
                                                size="sm"
                                                title="Save"
                                                onClick={() => handleSaveRow(row, row._id)}
                                                disabled={!row.selectedProduct || !row.quantity}>
                                                <MdSave />
                                            </Button>

                                            {/* <Button
                                                variant="outline-danger"
                                                size="sm"
                                                title="Delete"
                                                onClick={() => {
                                                    setRows((prev) => {
                                                        const updated = [...prev];
                                                        updated[index] = {
                                                            ...updated[index],
                                                            searchType: 'modelName', // or your default
                                                            selectedProduct: null,
                                                            searchTerm: '',
                                                            quantity: '',
                                                            quantityError: '',
                                                        };
                                                        return updated;
                                                    });

                                                    // ✅ Still call delete API for the backend
                                                    dispatch(
                                                        deleteStockInProductActions({
                                                            stockInProductId: row?._id,
                                                            action: 'delete',
                                                        })
                                                    );
                                                }}>
                                                <MdDelete />
                                            </Button> */}

                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                title="Delete"
                                                onClick={() => {
                                                    setRows((prev) => {
                                                        if (prev.length === 1) {
                                                            // ✅ Only one row left: clear it
                                                            const clearedRow = {
                                                                ...prev[0],
                                                                searchType: 'modelName', // or your default
                                                                selectedProduct: null,
                                                                searchTerm: '',
                                                                quantity: '',
                                                                quantityError: '',
                                                            };
                                                            // ✅ Navigate back
                                                            navigate(-1);
                                                            return [clearedRow];
                                                        } else {
                                                            // ✅ More than one row: remove this row
                                                            return prev.filter((_, i) => i !== index);
                                                        }
                                                    });

                                                    // ✅ Always call backend delete
                                                    dispatch(
                                                        deleteStockInProductActions({
                                                            stockInProductId: row?._id,
                                                            action: 'delete',
                                                        })
                                                    );
                                                }}>
                                                <MdDelete />
                                            </Button>

                                            {/* <Button
                                                variant="outline-danger"
                                                size="sm"
                                                title="Delete"
                                                onClick={() => {
                                                    // ✅ Remove from local state immediately
                                                    setRows((prev) => prev.filter((_, i) => i !== index));

                                                    dispatch(
                                                        deleteStockInProductActions({
                                                            stockInProductId: row?._id,
                                                            action: 'delete',
                                                        })
                                                    );
                                                }}>
                                                <MdDelete />
                                            </Button> */}
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        ))}
                        <div className="d-flex justify-content-end mb-2">
                            <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={handleAddRow}
                                className="d-flex align-items-center">
                                <IoIosAdd className="me-1" /> Add Product
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Products Table Section */}
            </Form>
            {stockInLoading === true ? (
                <>
                    <CartLoading />
                </>
            ) : (
                <>
                    <div className="table-responsive">
                        <table className="table table-striped bg-white mb-0">
                            <thead>
                                <tr className="table_header">
                                    <th scope="col">#</th>
                                    <th scope="col">Products Name</th>
                                    <th scope="col">Model Name</th>
                                    <th scope="col">Code</th>
                                    <th scope="col">Quantity</th>
                                    <th scope="col">CreatedAt</th>
                                    {/* <th scope="col">Action</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {store?.stockInByIdReducer?.loading ? (
                                    <tr>
                                        <td className="text-center" colSpan={8}>
                                            <Loading />
                                        </td>
                                    </tr>
                                ) : stockInData?.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="text-center">
                                            <p className="my-5 py-5">No data found in Stock In.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    stockInData?.map((data, stockInIndex) =>
                                        data.stockInProducts?.map((product, productIndex) => (
                                            <tr key={product._id} className="text-dark text-nowrap highlight-row">
                                                <td className="font_work">
                                                    {(pageIndex - 1) * pageSize + stockInIndex + 1}-{productIndex + 1}
                                                </td>
                                                <td className="font_work">{product?.productData?.name || '-'}</td>
                                                <td className="font_work">
                                                    {product?.productData?.modelData?.[0]?.name
                                                        ? product?.productData?.modelData?.[0]?.name.slice(0, 25) +
                                                          (product?.productData?.modelData?.[0]?.name.length > 25
                                                              ? '...'
                                                              : '')
                                                        : '-'}
                                                </td>
                                                <td className="font_work">{product?.productData?.code || '-'}</td>
                                                <td className="font_work">{product?.quantity ?? '-'}</td>
                                                <td className="font_work">{product?.productData?.createdAt || '-'}</td>
                                                {/* <td>
                                                    <span
                                                        className="icon-wrapper"
                                                        title="Edit"
                                                        onClick={() => {
                                                            navigate('editStockin', {
                                                                state: { editData: data }, // pass whole object
                                                            });
                                                        }}>
                                                        <AiOutlineEdit className="fs-4" style={{ cursor: 'pointer' }} />{' '}
                                                    </span>
                                                    <span
                                                        className="icon-wrapper"
                                                        title="Delete"
                                                        onClick={() => {
                                                            setStockToDelete(data?._id);
                                                            setShowConfirm(true);
                                                        }}>
                                                        <RiDeleteBinLine
                                                            className="fs-4"
                                                            style={{ cursor: 'pointer' }}
                                                        />
                                                    </span>
                                                </td> */}
                                            </tr>
                                        ))
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Body className="text-center">
                    <h4 className="text-black">Confirm Deletion</h4>
                    <p className="mt-2 mb-3"> Are you sure you want to delete this Stock?</p>
                    <span className="bg-light rounded-circle p-3 ">
                        <MdDeleteOutline className="fs-1  text-danger" />
                    </span>
                    <div className="d-flex justify-content-center mt-3 gap-2">
                        <Button className="cancel-button" onClick={() => setShowConfirm(false)}>
                            Cancel
                        </Button>
                        <Button className="custom-button" onClick={handleDelete}>
                            Delete
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default EditStockin;
