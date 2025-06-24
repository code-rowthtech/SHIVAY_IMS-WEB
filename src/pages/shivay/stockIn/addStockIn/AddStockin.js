import { useEffect, useMemo, useCallback, useState, useRef } from 'react';
import { Button, Form, Row, Col, Tooltip, OverlayTrigger, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { CgCloseO } from 'react-icons/cg';
import {
    createStockInActions,
    deleteStockInActions,
    getStockInListActions,
    getWarehouseListActions,
    listingSupplierActions,
    listingUsersActions,
    searchProductActions,
    searchProductResetActions,
} from '../../../../redux/actions';

import { IoIosAdd, IoMdArrowBack } from 'react-icons/io';
import { MdDelete, MdDeleteOutline } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { RiDeleteBinLine } from 'react-icons/ri';
import { AiOutlineEdit } from 'react-icons/ai';
import { Loading } from '../../../../helpers/loader/Loading';
import EditStockinModal from '../editStockin/EditStockInModal';
import AddStockinModal from './AddStockinModal';

function AddStockin() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {
        handleSubmit,
        register,
        setValue,
        reset,
        resetField,
        formState: { errors },
    } = useForm();
    const store = useSelector((state) => state);
    const [showConfirm, setShowConfirm] = useState(false);
    const [stockToDelete, setStockToDelete] = useState(null);
    const [editData, setEditData] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(1);

    const handleDelete = () => {
        dispatch(deleteStockInActions({ stockInId: stockToDelete }));
        setShowConfirm(false);
        window.location.reload();
    };

    const [today] = useState(new Date().toISOString().split('T')[0]);
    const [rows, setRows] = useState([
        { searchType: 'modelName', selectedProduct: null, quantity: '', searchTerm: '' },
    ]);

    const {
        searchProductReducer: {
            searchProduct: { response: ProductSearch = [], loading: productLoading },
            error: productError,
        },
        getWarehouseListReducer: {
            searchWarehouse: { response: Warehouse = [] },
            error: warehouseError,
        },
        createStockReducer: { createStockIn: { status: createResponse, loading: createLoading } = {} },
    } = useSelector((state) => state);

    const UsersList = store?.listingUsersReducer?.listingUsers?.response;
    const SupplierList = store?.listingSupplierReducer?.listingSupplier?.response;
    // const stockInData = store?.stockInByIdReducer?.stockInById?.response;
    const CreateResponse = store?.createStockInReducer?.createStockIn?.status;
    const StockInData = store?.stockInListReducer?.stockInList?.response;

    useEffect(() => {
        if (CreateResponse === 200) {
            reset();
            setRows([{ searchType: 'modelName', selectedProduct: null, quantity: '', searchTerm: '' }]);
            dispatch(searchProductResetActions());
            navigate(-1);
        }
    }, [CreateResponse, dispatch]);

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

    const handleDeleteRow = useCallback(
        (index) => {
            if (rows.length <= 1) return;
            setRows((prev) => prev.filter((_, i) => i !== index));
        },
        [rows.length]
    );

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
        const productStock = rows
            ?.map(({ selectedProduct, quantity }) => {
                if (!selectedProduct) return toast.error('Please select a product for all rows');
                if (!quantity) return toast.error('Please enter quantity for all products');
                return {
                    productId: selectedProduct.value,
                    quantity,
                    code: selectedProduct.code,
                    name: selectedProduct.name || selectedProduct.label,
                };
            })
            .filter(Boolean);

        if (productStock.length !== rows.length) return;
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
        formData.append('date', data?.date);
        formData.append('stockInQty', JSON.stringify(productStock));

        dispatch(createStockInActions(formData));
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

    return (
        <div className="" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <div className="  rounded-3 ">
                <Row className="align-items-center my-2">
                    <Col xs="auto">
                        <IoMdArrowBack
                            size={24}
                            style={{ cursor: 'pointer' }}
                            onClick={() => navigate(-1)}
                            className=""
                        />
                    </Col>
                    <Col className="p-0">
                        <h3 className="mb-0 mt-0 ">Add Stock In</h3>
                    </Col>
                </Row>

                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row className="g-3 p-2 m-2  border" style={{ borderRadius: '6px' }}>
                        <Col md={3} className="my-1 ">
                            <Form.Group className="mb-1">
                                <Form.Label className="mb-0 fw-semibold">
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
                        <Col md={3} className="my-1">
                            <Form.Group className="mb-1">
                                <Form.Label className="mb-0 fw-semibold">
                                    Received By <span className="text-danger">*</span>
                                </Form.Label>
                                <Select
                                    value={selectedUser}
                                    onChange={handleUserChange}
                                    className="text-capitalize react-select-container"
                                    classNamePrefix="react-select"
                                    options={usersOptions}
                                    placeholder="Select User"
                                    isClearable
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3} className="my-1">
                            <Form.Group className="mb-1">
                                <Form.Label className="mb-0 fw-semibold">
                                    Supplier <span className="text-danger">*</span>
                                </Form.Label>
                                <Select
                                    value={selectedSupplier}
                                    onChange={handleSupplierChange}
                                    options={supplierOptions}
                                    className="text-capitalize react-select-container"
                                    classNamePrefix="react-select"
                                    placeholder="Select Supplier"
                                    isClearable
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3} className="my-1">
                            <Form.Group className="mb-1">
                                <Form.Label className="mb-0 fw-semibold">Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    {...register('date', {
                                        value: new Date().toISOString().split('T')[0],
                                    })}
                                    max={new Date().toISOString().split('T')[0]}
                                    className=""
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3} className="my-1">
                            <Form.Group className="mb-1">
                                <Form.Label className="mb-0 fw-semibold">Invoice Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Invoice Number"
                                    {...register('invoiceNumber', {
                                        required: 'Invoice Number is required',
                                        validate: (value) => {
                                            const trimmed = value.trim();
                                            return /^0+$/.test(trimmed) ? 'Invoice Number cannot be all zeros' : true;
                                        },
                                    })}
                                    className=""
                                />
                                {errors.invoiceNumber && (
                                    <small className="text-danger">{errors.invoiceNumber.message}</small>
                                )}
                            </Form.Group>
                        </Col>
                        <Col md={3} className="my-1">
                            <Form.Group className="mb-1">
                                <Form.Label className="mb-0 fw-semibold">
                                    Attachment <span className="text-danger">*</span>
                                </Form.Label>

                                {!attachmentType ? (
                                    <Form.Select
                                        className="form-select-sm"
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
                                            required
                                            placeholder="Upload file"
                                            {...register('invoiceAttachment')}
                                            className="form-control-sm"
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
                            </Form.Group>
                        </Col>
                        <Col md={3} className="my-1">
                            <Form.Group className="mb-0">
                                <Form.Label className="mb-0 fw-semibold">Invoice Value</Form.Label>
                                <Form.Control
                                    type="text"
                                    {...register('invoiceValue')}
                                    placeholder="Enter Invoice Value"
                                    className=""
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3} className="my-1">
                            <Form.Group className="mb-1">
                                <Form.Label className="mb-0 fw-semibold">Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={1}
                                    {...register('description')}
                                    placeholder="Enter Description"
                                    className=""
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <hr className="my-2" />

                    <div className=" ">
                        <div
                            style={{
                                maxHeight: rows?.length >= 3 ? '51vh' : 'auto',
                                overflowY: rows?.length >= 3 ? 'auto' : 'visible',
                            }}>
                            {rows?.map((row, index) => (
                                <div className="  d-flex  p-3 m-2  border" style={{ borderRadius: '6px' }} key={index}>
                                    {/* <div>
                                        {' '}
                                        <span className="fw-semibold me-2">{index + 1}.</span>
                                    </div> */}
                                    <Row className="align-items-center g-2 w-100">
                                        <Col sm={3} className="d-flex align-items-center mt-1">
                                            <div className="flex-grow-1">
                                                <Form.Group className="mb-0">
                                                    <Form.Label className="mb-0 fw-semibold">Search By</Form.Label>
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
                                                        }
                                                        className="form-select-sm">
                                                        <option value="modelName">Model Name</option>
                                                        <option value="code">Product Code</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </div>
                                        </Col>

                                        {/* Dynamic Search Field */}
                                        <Col sm={3}>
                                            <Form.Group className="mb-0">
                                                <Form.Label className="mb-0 fw-semibold">
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
                                                        className="react-select-container"
                                                        classNamePrefix="react-select"
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
                                                        className="react-select-container"
                                                        classNamePrefix="react-select"
                                                    />
                                                )}
                                            </Form.Group>
                                        </Col>

                                        {/* Complementary Info */}
                                        <Col sm={3}>
                                            <Form.Group className="mb-0">
                                                <Form.Label className="mb-0 fw-semibold">
                                                    {row.searchType === 'modelName' ? 'Code' : 'Model'}
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={
                                                        row.searchType === 'modelName'
                                                            ? row.selectedProduct?.data?.code
                                                            : row.selectedProduct?.data?.modelId?.name || ''
                                                    }
                                                    placeholder={row.searchType === 'modelName' ? 'Code' : 'Model'}
                                                    readOnly
                                                    className="form-control-sm bg-light"
                                                />
                                            </Form.Group>
                                        </Col>

                                        {/* Product Name */}
                                        <Col sm={3}>
                                            <Form.Group className="mb-0">
                                                <Form.Label className="mb-0 fw-semibold">Product Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={row.selectedProduct?.name || ''}
                                                    readOnly
                                                    placeholder="Product name"
                                                    className="form-control-sm bg-light"
                                                />
                                            </Form.Group>
                                        </Col>

                                        {/* Quantity */}
                                        <Col sm={3}>
                                            <Form.Group className="mb-0">
                                                <Form.Label className="mb-0 fw-semibold">Qty</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    value={row.quantity}
                                                    onChange={(e) => handleQuantityChange(e, index)}
                                                    onBlur={(e) => validateQuantity(e, index)}
                                                    placeholder="Qty"
                                                    required
                                                    isInvalid={!!row.quantityError}
                                                    className="form-control-sm"
                                                />
                                                {row.quantityError && (
                                                    <Form.Control.Feedback type="invalid" className="d-block">
                                                        {row.quantityError}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>
                                        </Col>

                                        {/* Delete Button */}
                                        <div className="d-flex justify-content-end">
                                            {rows.length > 1 && (
                                                <Button
                                                    variant="outline-danger"
                                                    title="Delete"
                                                    onClick={() => handleDeleteRow(index)}
                                                    className="p-1 border-0"
                                                    size="sm">
                                                    <MdDelete className="fs-3" />
                                                </Button>
                                            )}
                                        </div>
                                    </Row>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="d-flex justify-content-between mt-3 mx-2">
                        <Button
                            variant="outline-primary"
                            onClick={handleAddRow}
                            className="d-flex align-items-center rounded-pill">
                            <IoIosAdd className="me-1" /> Add Row
                        </Button>

                        <div className="d-flex gap-2">
                            {rows?.some((data) => !data?.selectedProduct) ? (
                                <OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip>Please Fill required fields and select product...</Tooltip>}>
                                    <div>
                                        <Button variant="primary" type="submit" disabled className="rounded-pill">
                                            {createLoading ? 'Saving...' : 'Save'}
                                        </Button>
                                    </div>
                                </OverlayTrigger>
                            ) : (
                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={store?.createStockInReducer?.loading}
                                    className="px-4 rounded-pill">
                                    {store?.createStockInReducer?.loading ? 'Saving...' : 'Save'}
                                </Button>
                            )}
                        </div>
                    </div>
                </Form>
            </div>

            {/* <div className="table-responsive">
                <table className="table table-striped bg-white mb-0">
                    <thead>
                        <tr className="table_header">
                            <th scope="col">#</th>
                            <th scope="col">Supplier</th>
                            <th scope="col">Control No.</th>
                            <th scope="col">Warehouse</th>
                            <th scope="col">Date</th>
                            <th scope="col">No. of Products</th>
                            <th scope="col">Invoice Number</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    {store?.stockInListReducer?.loading ? (
                        <tr>
                            <td className="text-center" colSpan={8}>
                                <Loading />
                            </td>
                        </tr>
                    ) : (
                        <tbody>
                            {StockInData?.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center">
                                        <p className="my-5 py-5 ">No data found in Stock In.</p>
                                    </td>
                                </tr>
                            ) : (
                                StockInData?.map((data, index) => (
                                    <tr key={index} className="text-dark  text-nowrap highlight-row">
                                        <td className="font_work">{(pageIndex - 1) * pageSize + index + 1}</td>
                                        <td
                                            className="text-capitalize font_work"
                                            title={data?.supplierData?.[0]?.name || '-'}>
                                            {data?.supplierData?.[0]?.name ? (
                                                data.supplierData[0].name.slice(0, 25) +
                                                (data.supplierData[0].name.length > 25 ? '...' : '')
                                            ) : (
                                                <span className="text-black">-</span>
                                            )}
                                        </td>

                                        <td className="font_work">
                                            {data?.controlNumber || <span className="text-black">-</span>}
                                        </td>
                                        <td className="text-capitalize font_work">
                                            {data?.warehouseData?.[0]?.name || <span className="text-black">-</span>}
                                        </td>
                                        <td className="font_work">
                                            {data?.createdAt ? (
                                                new Date(data?.createdAt).toLocaleDateString('en-GB')
                                            ) : (
                                                <span className="text-black">-</span>
                                            )}
                                        </td>
                                        <td className="font_work">
                                            {data?.totalStockInProductCount || <span className="text-black">-</span>}
                                        </td>
                                        <td className="font_work">
                                            {data?.invoiceNumber || <span className="text-black">-</span>}
                                        </td>
                                        <td>
                                            <span
                                                className="icon-wrapper"
                                                title="Edit"
                                                onClick={() => {
                                                    setShowEditModal(true);
                                                    setEditData(data?._id);
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
                                                <RiDeleteBinLine className="fs-4" style={{ cursor: 'pointer' }} />
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                            <AddStockinModal show={showAddModal} onHide={() => setShowAddModal(false)} />

                            <EditStockinModal
                                show={showEditModal}
                                onHide={() => setShowEditModal(false)}
                                stockId={editData}
                            />

                            {/* delete modal */}
            {/* <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
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
                        </tbody>
                    )}
                </table> */}
            {/* </div> */}
        </div>
    );
}

export default AddStockin;
