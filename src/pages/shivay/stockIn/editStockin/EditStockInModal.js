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
} from '../../../../redux/actions';
import { HiOutlineFolderDownload } from 'react-icons/hi';
import { IoIosAdd } from 'react-icons/io';
import { MdDelete, MdSave } from 'react-icons/md';
import { Loading } from '../../../../helpers/loader/Loading';

function EditStockinModal({ show, onHide, stockId }) {
    const dispatch = useDispatch();
    const { handleSubmit, register, setValue, reset, resetField } = useForm();
    const store = useSelector((state) => state);
    const [today, setToday] = useState(new Date().toISOString().split('T')[0]);
    const [rows, setRows] = useState([
        { searchType: 'modelName', selectedProduct: null, quantity: '', searchTerm: '' },
    ]);
    const [editedQuantity, setEditedQuantity] = useState('');
    const [productId, setProductId] = useState('');

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
    const CreateProductResponse = store?.createStockInProductReducer?.createStockInProduct?.status;
    const DeleteProductResponse = store?.deleteStockInProductReducer?.deleteStockInProduct?.status;
    const UpdateProductResponse = store?.updateStockInProductReducer?.updateStockInProduct?.status;
    const UpdateResponse = store?.updateStockInReducer?.updateStockIn?.status;
    const detailsLoading = store?.stockInByIdReducer?.loading;

    useEffect(() => {
        if (UpdateResponse === 200) {
            onHide();
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
        formData.append('stockInId', stockId);

        dispatch(updateStockInActions(formData));
    };

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

    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [attachmentType, setAttachmentType] = useState('');
    const [stateDelete, setStateDelete] = useState(false);

    const handleWarehouseChange = (selectedOption) => {
        setSelectedWarehouse(selectedOption);
    };

    const handleUserChange = (selectedUser) => {
        setSelectedUser(selectedUser);
    };

    const handleSupplierChange = (selectedSupplier) => {
        setSelectedSupplier(selectedSupplier);
    };

    const fileInputRef = useRef();

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

    useEffect(() => {
        if (selectedWarehouse?.value) {
            dispatch(listingUsersActions({ warehouseId: selectedWarehouse.value }));
        }
    }, [dispatch, selectedWarehouse]);

    useEffect(() => {
        if (CreateProductResponse === 200 || DeleteProductResponse === 200 || UpdateProductResponse === 200) {
            dispatch(getStockInByIdActions(stockId));
        }
    }, [CreateProductResponse, DeleteProductResponse, UpdateProductResponse]);

    useEffect(() => {
        if (stockId && show) {
            dispatch(getStockInByIdActions(stockId));
        }
    }, [show, stockId]);

    useEffect(() => {
        if (stockId && stockInData) {
            const initialRows =
                stockInData?.[0]?.stockInProducts?.map((item) => {
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

            setToday(
                stockInData?.[0]?.createdAt ? new Date(stockInData?.[0]?.createdAt).toISOString().split('T')[0] : ''
            );
            const updateWarehouses = stockInData?.[0]?.warehouseData
                ? {
                      value: stockInData?.[0].warehouseId,
                      label: stockInData?.[0].warehouseData?.find((ele) => ele?._id === stockInData?.[0]?.warehouseId)
                          ?.name,
                  }
                : {};
            setSelectedWarehouse(updateWarehouses);

            const updatedUser = stockInData?.[0]?.receivedByData
                ? {
                      value: stockInData?.[0]?.receivedBy,
                      label: stockInData?.[0].receivedByData?.find((ele) => ele?._id === stockInData?.[0]?.receivedBy)
                          ?.name,
                  }
                : {};
            setSelectedUser(updatedUser);

            const updatedSupplier = stockInData?.[0]?.supplierId
                ? {
                      value: stockInData?.[0]?.supplierId,
                      label: stockInData?.[0].supplierData?.find((ele) => ele?._id === stockInData?.[0]?.supplierId)
                          ?.name,
                  }
                : {};
            setSelectedSupplier(updatedSupplier);

            setValue('invoiceNumber', stockInData?.[0]?.invoiceNumber || '');
            setValue('description', stockInData?.[0]?.description || '');
            setValue('invoiceValue', stockInData?.[0]?.fright || '');
            setValue('invoiceAttachment', stockInData?.[0]?.invoiceAttachment || '');
            setAttachmentType(stockInData?.[0]?.invoiceAttachmentType || '');
            setEditedQuantity(stockInData?.[0]?.stockInProducts?.quantity || '');
            setProductId(stockInData?.[0]?.productData?._id);
        }
    }, [setValue, stockId, stockInData]);

    const handleSaveRow = (row, rowId) => {
        const quantity = row?.quantity;
        const selectedWarehouseId = selectedWarehouse?.value;

        if (rowId) {
            const updateData = {
                stockInProductId: row?._id,
                quantity: quantity,
            };
            dispatch(updateStockInProductActions(updateData));
        } else {
            const createData = {
                stockInId: stockId,
                productId: row?.selectedProduct?.data?._id,
                quantity: quantity,
                warehouseId: selectedWarehouseId,
            };
            dispatch(createStockInProductActions(createData));
        }
    };

    if (detailsLoading && !stateDelete) {
        return (
            <Modal show={show} onHide={onHide} size="xl" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Stock</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <Loading />
                </Modal.Body>
            </Modal>
        );
    }
    return (
        <Modal show={show} onHide={onHide} size="xl" backdrop="static" centered>
            <Modal.Header className="py-2">
                <div className="d-flex w-100 justify-content-between align-items-center">
                    <div className="col-4 text-start flex-grow-1">
                        <h4>Edit Stock in</h4>
                    </div>
                    <div className="col-4 text-center flex-grow-1">
                        <span className="border border-1 rounded-2 px-2 text-black" title="Control Number">
                            {stockInData?.[0]?.controlNumber}
                        </span>
                    </div>
                    <div className="col-4 text-end">
                        <Button variant="close" aria-label="Close" onClick={onHide} />
                    </div>
                </div>
            </Modal.Header>

            <Modal.Body className="pt-1">
                <Form onSubmit={handleSubmit(onSubmit)}>
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
                                    Received By <span className="text-danger">*</span>
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
                                <Form.Label className="mb-0">
                                    Supplier <span className="text-danger">*</span>
                                </Form.Label>
                                <Select
                                    value={selectedSupplier}
                                    onChange={handleSupplierChange}
                                    options={supplierOptions}
                                    className="text-capitalize"
                                    placeholder="Select a Supplier"
                                    isClearable
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={3}>
                            <Form.Group className="mb-1">
                                <Form.Label className="mb-0">Date</Form.Label>
                                <Form.Control type="date" value={today} {...register('date')} />
                            </Form.Group>
                        </Col>
                        <Col sm={3}>
                            <Form.Group className="mb-1">
                                <Form.Label className="mb-0">
                                    Invoice Number <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Invoice Number"
                                    {...register('invoiceNumber', { required: true })}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={3}>
                            <Form.Group className="mb-1">
                                <Form.Label className="mb-0">
                                    Attachment
                                    {attachmentType && <span className="text-capitalize"> ({attachmentType})</span>}
                                    {stockInData?.[0]?.invoiceAttachment && (
                                        <a
                                            href={stockInData?.[0]?.invoiceAttachment}
                                            target="_blank"
                                            title="Download Attachment"
                                            rel="noopener noreferrer">
                                            <HiOutlineFolderDownload className="ms-1 fs-4" />
                                        </a>
                                    )}
                                    <span className="text-danger"> *</span>
                                </Form.Label>

                                {!attachmentType ? (
                                    <Form.Select
                                        className="mb-0"
                                        value={attachmentType}
                                        onChange={handleAttachmentTypeChange}
                                        required>
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
                                {stockInData?.[0]?.invoiceAttachment && (
                                    <small className="text-muted d-block mb-0 d-flex position-absolute gap-1">
                                        Current file:{' '}
                                        <a
                                            href={stockInData?.[0]?.invoiceAttachment}
                                            target="_blank"
                                            rel="noopener noreferrer">
                                            {stockInData?.[0]?.invoiceAttachment.split('/').pop()}
                                        </a>
                                    </small>
                                )}
                            </Form.Group>
                        </Col>
                        <Col sm={3}>
                            <Form.Group className="mb-1">
                                <Form.Label className="mb-0">Invoice Value</Form.Label>
                                <Form.Control
                                    type="text"
                                    {...register('invoiceValue')}
                                    placeholder="Enter Invoice Value"
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={3}>
                            <Form.Group className="mb-1">
                                <Form.Label className="mb-0">Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={1}
                                    {...register('description')}
                                    placeholder="Enter Description"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <hr className="mt-2 mb-1" />
                    <div
                        style={{
                            maxHeight: rows?.length >= 3 ? '51vh' : 'auto',
                            overflowY: rows?.length >= 3 ? 'auto' : 'visible',
                            padding: '15px',
                        }}>
                        {rows?.map((row, index) => (
                            <div
                                className="mb-1 rounded-1 ps-1"
                                style={{ border: '1px solid rgba(218, 224, 225, 0.97)' }}
                                key={index}>
                                <Row className="align-items-center mb-2 g-2">
                                    {/* Search By */}
                                    <Col sm={2} className="d-flex">
                                        <span className="fw-semibold d-flex align-items-center me-1 mt-2 pt-1">
                                            {index + 1}.
                                        </span>
                                        <div>
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
                                        </div>
                                    </Col>

                                    {/* Dynamic Search Field */}
                                    <Col sm={3}>
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
                                        <Form.Group className="mb-0">
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
                                                placeholder={row.searchType === 'modelName' ? 'Code' : 'Model'}
                                                readOnly
                                            />
                                        </Form.Group>
                                    </Col>

                                    {/* Product Name */}
                                    <Col sm={2}>
                                        <Form.Group className="mb-0">
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
                                        <Form.Group className="mb-0">
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

                                    {/* Action Buttons */}
                                    <Col sm={1} className="d-flex justify-content-center mt-2 pt-1">
                                        <div className="d-flex">
                                            <Button
                                                variant="outline-success"
                                                title="Update"
                                                onClick={() => handleSaveRow(row, row._id)}
                                                className="p-1 me-1 mt-2">
                                                <MdSave className="fs-6" />
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                title="Delete"
                                                onClick={() => {
                                                    setStateDelete(true);
                                                    dispatch(
                                                        deleteStockInProductActions({
                                                            stockInProductId: row?._id,
                                                            action: 'delete',
                                                        })
                                                    );
                                                }}
                                                className="p-1 mt-2">
                                                <MdDelete className="fs-6" />
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        ))}
                    </div>

                    <div className="d-flex justify-content-between mt-3">
                        <Button className="outline-custom-button" onClick={handleAddRow}>
                            <IoIosAdd className="me-1" /> Add Row
                        </Button>

                        <div>
                            <Button onClick={onHide} className="cancel-button me-2">
                                Cancel
                            </Button>
                            <Button
                                className="custom-button"
                                type="submit"
                                disabled={store?.updateStockInReducer?.loading}>
                                {store?.updateStockInReducer?.loading ? 'Updating...' : 'Update'}
                            </Button>
                        </div>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default EditStockinModal;
