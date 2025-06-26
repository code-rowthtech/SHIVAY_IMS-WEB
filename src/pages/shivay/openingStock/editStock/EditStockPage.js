import { useEffect, useMemo, useCallback, useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import {
    searchProductActions,
    updateStockActions,
    deleteStockProductActions,
    updateStockProductActions,
    getStockByIdActions,
    createStockProductActions,
} from '../../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { IoIosAdd, IoMdArrowBack } from 'react-icons/io';
import { MdDelete, MdSave } from 'react-icons/md';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { CartLoading, Loading } from '../../../../helpers/loader/Loading';
import { RiDeleteBinLine } from 'react-icons/ri';
import { AiOutlineEdit } from 'react-icons/ai';

function EditStockPage() {
    const dispatch = useDispatch();
    const location = useLocation();
    const editData = location.state?.editData;
    console.log('editData', editData);
    const {
        handleSubmit,
        register,
        setValue,
        formState: { errors },
    } = useForm();
    const [rows, setRows] = useState([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const {
        searchProductReducer: {
            searchProduct: { response: ProductSearch = [], loading: productLoading },
            error: productError,
        },
    } = useSelector((state) => state);
    const store = useSelector((state) => state);

    const stockDetails = store?.stockByIdReducer?.stockById?.response;
    console.log('stockDetails', stockDetails);
    const detailsLoading = store?.stockByIdReducer?.loading;
    const warehouseError = store?.getWarehouseListReducer?.error;
    const DeleteProductResponse = store?.deleteStockProductReducer?.deleteStockProduct?.status;
    const createStockProductReducer = store?.createStockProductReducer?.createStockProduct?.status;
    console.log(createStockProductReducer, 'createStockProductReducer');
    const UpdateResponse = store?.updateStockReducer?.updateStock?.status;
    console.log(UpdateResponse, 'jhg');

    const updateStockProductReducer = store?.updateStockProductReducer?.updateStockProduct?.status;
    console.log(updateStockProductReducer, 'updateStockProductReducer');

    const [stateDelete, setStateDelete] = useState(false);
    const [editCase, setEditCase] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null);

    useEffect(() => {
        if (createStockProductReducer === 200 || updateStockProductReducer === 200) {
            dispatch(getStockByIdActions(editData._id));
        }
    }, [createStockProductReducer, updateStockProductReducer]);

    useEffect(() => {
        if (editData) {
            dispatch(getStockByIdActions(editData._id));
        }
    }, [editData, dispatch]);

    useEffect(() => {
        if (DeleteProductResponse === 200) {
            dispatch(getStockByIdActions(editData._id));
        }
    }, [DeleteProductResponse]);

    useEffect(() => {
        if (UpdateResponse === 200) {
            dispatch(getStockByIdActions(editData._id));
        }
    }, [UpdateResponse]);

    useEffect(() => {
        if (stockDetails) {
            const initialRows =
                stockDetails?.[0]?.stockProducts?.map((item) => {
                    const product = item?.product || {};
                    const modelName = product.model?.name || '';
                    const Qty = item?.quantity;
                    const code = product.code || '';
                    const name = product.name || '';
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
                        quantity: Qty,
                        searchTerm: modelName || name,
                    };
                }) || [];
            setRows(initialRows);

            setValue(
                'date',
                stockDetails?.[0]?.date ? new Date(stockDetails?.[0]?.date).toISOString().split('T')[0] : ''
            );
            setValue('warehouseId', stockDetails?.warehouseData?.name);
            setValue('description', stockDetails?.[0]?.description);

            const updateWarehouses = stockDetails?.[0]?.warehouseData
                ? [{ value: stockDetails?.[0].warehouseId, label: stockDetails?.[0].warehouseData.name }]
                : [];
            setSelectedWarehouse(updateWarehouses);
        }
    }, [stockDetails, setValue, DeleteProductResponse]);

    useEffect(() => {
        dispatch(getStockByIdActions(editData._id));
    }, []);

    const Warehouse = store?.getWarehouseListReducer?.searchWarehouse?.response;

    const warehouseOptions = Warehouse?.map((warehouse) => ({
        value: warehouse._id,
        label: warehouse.name,
    }));

    const productOptions = useMemo(() => {
        if (!ProductSearch) return [];

        return ProductSearch?.map((product) => ({
            value: product?._id,
            label: product?.modelId?.name,
            code: product?.code,
            name: product?.name,
            data: product,
        }));
    }, [ProductSearch]);

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

    useEffect(() => {
        if (productError) {
            toast.error(productError.message || 'Failed to search products');
        }
        if (warehouseError) {
            toast.error(warehouseError.message || 'Failed to load warehouses');
        }
    }, [productError, warehouseError]);

    const handleSearch = useCallback(
        (searchTerm, searchType, index) => {
            if (!searchTerm || searchTerm?.length < 1) return;

            const searchParams = {};
            if (searchType === 'modelName') {
                searchParams.modelName = searchTerm;
            } else if (searchType === 'code') {
                searchParams.code = searchTerm;
            }

            dispatch(searchProductActions(searchParams));
        },
        [dispatch]
    );

    const handleAddRow = useCallback(() => {
        setRows((prev) => [
            ...(Array.isArray(prev) ? prev : []),
            {
                searchType: 'modelName',
                selectedProduct: null,
                quantity: '',
                searchTerm: '',
            },
        ]);
    }, []);

    const handleSaveRow = () => {
        const quantity = productFormData?.quantity;
        const selectedWarehouseId = selectedWarehouse?.[0]?.value;

        if (!productFormData?.selectedProduct?.data?._id && !editingProductId) {
            toast.error('Please select a product');
            return;
        }

        if (!quantity) {
            toast.error('Please enter quantity');
            return;
        }

        if (editingProductId) {
            // Update case
            const updateData = {
                stockProductId: editingProductId,
                quantity,
            };
            dispatch(updateStockProductActions(updateData));
        } else {
            // Create case
            const createData = {
                stockId: editData._id, // Use editData._id instead of undefined stockId
                productId: productFormData?.selectedProduct?.data?._id,
                quantity,
                warehouseId: selectedWarehouseId,
            };
            dispatch(createStockProductActions(createData));
        }
    };

    const handleProductChange = useCallback((selectedOption) => {
        setProductFormData((prev) => ({
            ...prev,
            selectedProduct: selectedOption,
            searchTerm: selectedOption?.label || '',
            modalName: prev.searchType === 'modelName' ? selectedOption : prev.modalName,
            productCode: prev.searchType === 'code' ? selectedOption : prev.productCode,
        }));
    }, []);

    const handleQuantityChange = useCallback((e) => {
        const value = e.target.value === '' ? '' : parseInt(e.target.value);
        setProductFormData((prev) => ({
            ...prev,
            quantity: value,
            quantityError: '',
        }));
    }, []);

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

    const onSubmit = (data) => {
        const payload = {
            warehouseId: selectedWarehouse?.[0]?.value,
            description: data?.description,
            date: data?.date,
            stockId: editData,
        };

        dispatch(updateStockActions({ ...payload, editData: editData }));
    };

    const handleDelete = (data) => {
        console.log(data, 'jsahd');
        dispatch(deleteStockProductActions({ stockProductId: data?._id }));
        dispatch(getStockByIdActions(editData._id));
    };

    const handleEdit = (product) => {
        setEditCase(true);
        setEditingProductId(product._id);

        const productData = product.product || {};
        const modelName = productData.model?.name || productData.name;
        const productCode = productData.code || '';

        setProductFormData({
            _id: product._id,
            searchType: 'modelName',
            selectedProduct: {
                value: product.productId,
                label: modelName,
                code: productCode,
                name: productData.name,
                data: product,
            },
            quantity: product.quantity,
            searchTerm: modelName,
            modalName: {
                label: modelName,
                value: product.productId,
            },
            productCode: {
                label: productCode,
                value: product.productId,
            },
        });
    };

    const [productFormData, setProductFormData] = useState({
        searchType: 'modelName',
        selectedProduct: null,
        searchTerm: '',
        quantity: '',
        quantityError: '',
        modalName: null,
        productCode: null,
    });

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
        setEditingProductId(null);
    };

    return (
        <div>
            {/* heading */}
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
            </div>
            <div>
                <Form onSubmit={handleSubmit(onSubmit)} className="  rounded-3 p-3  border">
                    <Row className="mb-1">
                        <Col sm={4}>
                            <Form.Group className="mb-1">
                                <Form.Label>
                                    Warehouse <span className="text-danger">*</span>
                                </Form.Label>
                                <Select
                                    options={warehouseOptions}
                                    placeholder="Select Warehouse"
                                    noOptionsMessage={() => 'No warehouse found'}
                                    value={selectedWarehouse}
                                    onChange={(selected) => setValue('warehouseId', selected?.value)}
                                    isClearable
                                    isLoading={!warehouseOptions?.length}
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
                                    required
                                    max={new Date().toISOString().split('T')[0]}
                                    {...register('date', { required: true })}
                                />
                            </Form.Group>
                        </Col>

                        <Col sm={4}>
                            <Form.Group className="mb-1">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={1}
                                    {...register('description')}
                                    placeholder="Enter description"
                                />
                            </Form.Group>
                        </Col>
                        <div className="text-end mt-2">
                            <Button
                                className="custom-button rounded-pill"
                                type="submit"
                                disabled={store?.updateStockReducer?.loading}>
                                {store?.updateStockReducer?.loading ? 'Updating...' : 'Update'}
                            </Button>
                        </div>
                    </Row>
                </Form>
                <div
                    style={{
                        maxHeight: rows?.length >= 3 ? '51vh' : 'auto',
                        overflowY: rows?.length >= 3 ? 'auto' : 'visible',
                    }}>
                    {/* form two */}
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
                                                setProductFormData({
                                                    ...productFormData,
                                                    searchType: e.target.value,
                                                    selectedProduct: null,
                                                    searchTerm: '',
                                                    modalName: null,
                                                    productCode: null,
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
                                            {productFormData?.searchType === 'modelName'
                                                ? 'Model Name'
                                                : 'Product Code'}
                                        </Form.Label>
                                        {productFormData?.searchType === 'modelName' ? (
                                            <Select
                                                value={productFormData?.modalName}
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
                                                isLoading={productLoading}
                                                filterOption={() => true}
                                            />
                                        ) : (
                                            <Select
                                                value={productFormData?.productCode}
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
                                                productFormData.searchType === 'modelName'
                                                    ? productFormData?.selectedProduct?.code ||
                                                      productFormData?.productCode?.label ||
                                                      ''
                                                    : productFormData?.selectedProduct?.data?.modelId?.name ||
                                                      productFormData?.modalName?.label ||
                                                      ''
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
                                            onClick={handleSaveRow}
                                            // disabled={!productFormData?.selectedProduct || !productFormData?.quantity}
                                        >
                                            <MdSave />
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            className="border-0 fs-3"
                                            size="sm"
                                            title="Delete"
                                            onClick={handleDeleteRow}
                                            // disabled={!editCase}
                                        >
                                            <MdDelete />
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            {detailsLoading ? (
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
                            {store?.stockByIdReducer?.loading ? (
                                <tr>
                                    <td className="text-center" colSpan={7}>
                                        <Loading />
                                    </td>
                                </tr>
                            ) : stockDetails?.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center">
                                        <p className="my-5 py-5">No stock data found.</p>
                                    </td>
                                </tr>
                            ) : (
                                stockDetails?.[0]?.stockProducts?.map((product, index) => (
                                    <tr key={product._id} className="text-dark text-nowrap highlight-row">
                                        <td className="font_work">{(pageIndex - 1) * pageSize + index + 1}</td>
                                        <td className="font_work">{product?.product?.name || '-'}</td>
                                        <td className="font_work">
                                            {product?.product?.model?.name
                                                ? product?.product?.model?.name.slice(0, 25) +
                                                  (product?.product?.model?.name.length > 25 ? '...' : '')
                                                : '-'}
                                        </td>
                                        <td className="font_work">{product?.product?.code || '-'}</td>
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
                                                <AiOutlineEdit className="fs-4" style={{ cursor: 'pointer' }} />
                                            </span>
                                            <span
                                                className="icon-wrapper"
                                                title="Delete"
                                                onClick={() => handleDelete(product)}>
                                                <RiDeleteBinLine className="fs-4" style={{ cursor: 'pointer' }} />
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default EditStockPage;
