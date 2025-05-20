import { useEffect, useMemo, useCallback, useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import { searchProductActions, updateStockActions, deleteStockProductActions, updateStockProductActions, getStockByIdActions, createStockProductActions } from '../../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { IoIosAdd } from 'react-icons/io';
import { MdDelete, MdSave } from 'react-icons/md';
import { toast } from 'react-toastify';
import { Loading } from '../../../../helpers/loader/Loading';

function EditStockModal({ show, onHide, stockId }) {
    const dispatch = useDispatch();
    const { handleSubmit, register, setValue, formState: { errors } } = useForm();
    const [rows, setRows] = useState([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);

    const {
        searchProductReducer: {
            searchProduct: { response: ProductSearch = [], loading: productLoading },
            error: productError
        },
    } = useSelector((state) => state);
    const store = useSelector((state) => state);

    const stockDetails = store?.stockByIdReducer?.stockById?.response
    const detailsLoading = store?.stockByIdReducer?.loading;
    const warehouseError = store?.getWarehouseListReducer?.error
    const DeleteProductResponse = store?.deleteStockProductReducer?.deleteStockProduct?.status;
    const UpdateResponse = store?.updateStockReducer?.updateStock?.status

    const [stateDelete, setStateDelete] = useState(false)
    
    useEffect(() => {
        if (show && stockId) {
            dispatch(getStockByIdActions(stockId));
        }
    }, [show, stockId, dispatch]);

    useEffect(() => {
        if (DeleteProductResponse === 200) {
            dispatch(getStockByIdActions(stockId));
        }
    }, [DeleteProductResponse]);

    useEffect(() => {
        if (UpdateResponse === 200) {
            onHide();
        }
    }, [UpdateResponse]);

    useEffect(() => {
        if (stockDetails) {
            const initialRows = stockDetails?.[0]?.stockProducts?.map(item => {
                const product = item?.product || {};
                const modelName = product.model?.name || '';
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
                        data: item
                    },
                    quantity: item.quantity,
                    searchTerm: modelName || name
                };
            }) || [];

            setRows(initialRows);
            // setIsInitialLoad(false);

            // Set form values
            setValue(
                'date',
                stockDetails?.[0]?.date ? new Date(stockDetails?.[0]?.date).toISOString().split('T')[0] : ''
            );
            setValue('warehouseId', stockDetails?.warehouseData?.name);
            setValue('description', stockDetails?.[0]?.description);

            const updateWarehouses = stockDetails?.[0]?.warehouseData
                ? [{ value: stockDetails?.[0].warehouseId, label: stockDetails?.[0].warehouseData.name }]
                : [];
            setSelectedWarehouse(updateWarehouses)
        }
    }, [stockDetails, setValue, DeleteProductResponse]);

    // Memoized options
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
            data: product
        }));
    }, [ProductSearch]);

    // API error handling
    useEffect(() => {
        if (productError) {
            toast.error(productError.message || 'Failed to search products');
        }
        if (warehouseError) {
            toast.error(warehouseError.message || 'Failed to load warehouses');
        }
    }, [productError, warehouseError]);

    // Debounced search function
    const handleSearch = useCallback((searchTerm, searchType, index) => {
        if (!searchTerm || searchTerm?.length < 2) return;

        const searchParams = {};
        if (searchType === 'modelName') {
            searchParams.modelName = searchTerm;
        } else if (searchType === 'code') {
            searchParams.code = searchTerm;
        }

        dispatch(searchProductActions(searchParams));
    }, [dispatch]);

    // Row handlers
    const handleAddRow = useCallback(() => {
        setRows(prev => [...(Array.isArray(prev) ? prev : []), {
            searchType: 'modelName',
            selectedProduct: null,
            quantity: '',
            searchTerm: ''
        }]);
    }, []);

    const handleSaveRow = (row, rowId) => {

        const quantity = row?.quantity;
        // const selectedProductId = selectedModal?.value;
        const selectedWarehouseId = selectedWarehouse?.[0]?.value;

        if (rowId) {
            const updateData = {
                stockProductId: row?._id,
                quantity: quantity
            };
            dispatch(updateStockProductActions(updateData));
        } else {
            const createData = {
                stockId: stockId,
                productId: row?.selectedProduct?.data?._id,
                quantity: quantity,
                warehouseId: selectedWarehouseId
            };
            dispatch(createStockProductActions(createData));
        }
    };


    const handleProductChange = useCallback((selectedOption, index) => {
        setRows(prev => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                selectedProduct: selectedOption,
                searchTerm: selectedOption?.label || ''
            };
            return updated;
        });
    }, []);

    const handleQuantityChange = useCallback((e, index) => {
        const value = Math.max(1, parseInt(e.target.value) || '');
        setRows(prev => {
            const updated = [...prev];
            updated[index].quantity = value;
            return updated;
        });
    }, []);

    const onSubmit = (data) => {

        const payload = {
            warehouseId: selectedWarehouse?.[0]?.value,
            description: data?.description,
            date: data?.date
        };

        dispatch(updateStockActions({ ...payload, stockId: stockId }));

    };

    if (detailsLoading && !stateDelete) {
        return (
            <Modal show={show} onHide={onHide} size='xl' centered>
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
        <Modal show={show} onHide={onHide} size='xl' centered>
            <Modal.Header className='py-1' closeButton>
                <Modal.Title>Edit Stock</Modal.Title>
            </Modal.Header>
            <Modal.Body className='pt-1'>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row className="mb-1">
                        <Col sm={4}>
                            <Form.Group className="mb-1">
                                <Form.Label>Warehouse <span className="text-danger">*</span></Form.Label>
                                <Select
                                    options={warehouseOptions}
                                    placeholder="Select Warehouse"
                                    noOptionsMessage={() => "No warehouse found"}
                                    value={selectedWarehouse}
                                    onChange={(selected) => setValue('warehouseId', selected?.value)}
                                    isClearable
                                    isLoading={!warehouseOptions?.length}
                                // defaultValue={warehouseOptions?.find(opt => opt.value === stockDetails?.warehouseId)}
                                />
                                {errors.warehouseId && <small className="text-danger">Warehouse is required</small>}
                            </Form.Group>
                        </Col>

                        <Col sm={4}>
                            <Form.Group className="mb-1">
                                <Form.Label>Date <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="date"
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
                    </Row>

                    <hr className='mt-2 mb-1' />

                    <div
                        style={{
                            maxHeight: rows?.length >= 3 ? '51vh' : 'auto',
                            overflowY: rows?.length >= 3 ? 'auto' : 'visible',
                            // border: '1px solid #ccc',
                            padding: '15px',
                        }}
                    >
                        {rows?.map((row, index) => (
                            <Row key={index} className="align-items-end">
                                <Col sm={3}>
                                    <Form.Group className='mb-1'>
                                        <Form.Label className='mb-0'>Search By</Form.Label>
                                        <Form.Select
                                            value={row.searchType}
                                            onChange={(e) => {
                                                setRows(prev => {
                                                    const updated = [...prev];
                                                    updated[index] = {
                                                        ...updated[index],
                                                        searchType: e.target.value,
                                                        selectedProduct: null,
                                                        searchTerm: ''
                                                    };
                                                    return updated;
                                                });
                                            }}
                                        >
                                            <option value="modelName">Model Name</option>
                                            <option value="code">Product Code</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                <Col sm={3}>
                                    <Form.Group className='mb-1'>
                                        <Form.Label className='mb-0'>
                                            {row.searchType === 'modelName' ? 'Model Name' : 'Product Code'}
                                        </Form.Label>
                                        <Select
                                            value={row.selectedProduct}
                                            onChange={(selected) => handleProductChange(selected, index)}
                                            onInputChange={(inputValue) => {
                                                setRows(prev => {
                                                    const updated = [...prev];
                                                    updated[index].searchTerm = inputValue;
                                                    return updated;
                                                });
                                                handleSearch(inputValue, row.searchType, index);
                                            }}
                                            options={productOptions}
                                            placeholder={`Search by ${row.searchType === 'modelName' ? 'model' : 'code'}`}
                                            isClearable
                                            isSearchable
                                            isLoading={productLoading}
                                            // inputValue={row.searchTerm}
                                            filterOption={() => true}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col sm={3}>
                                    <Form.Group className='mb-1'>
                                        <Form.Label className="mb-0">
                                            {row.searchType === 'modelName' ? 'Code' : 'Model '}
                                        </Form.Label>
                                        <Form.Control
                                            type='text'
                                            readOnly
                                            value={row.searchType === 'modelName' ? row?.selectedProduct?.code : row?.selectedProduct?.data?.modelId?.name}
                                            placeholder={row.searchType === 'modelName' ? 'Code' : 'Model '} />
                                    </Form.Group>
                                </Col>

                                <Col sm={3}>
                                    <Form.Group className='mb-1'>
                                        <Form.Label className='mb-0'>Product Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={row.selectedProduct?.name || ''}
                                            readOnly
                                            placeholder="Product name"
                                        />
                                    </Form.Group>
                                </Col>

                                <Col sm={3}>
                                    <Form.Group className='mb-1'>
                                        <Form.Label className='mb-0'>Quantity</Form.Label>
                                        <Form.Control
                                            type="number"
                                            min="1"
                                            value={row.quantity}
                                            onChange={(e) => handleQuantityChange(e, index)}
                                            placeholder="Enter quantity"
                                            required
                                        />
                                    </Form.Group>
                                </Col>

                                <Col sm={9} className="d-flex justify-content-end">
                                    <div className='mb-1'>
                                        <Button
                                            variant="outline-success"
                                            title='Update'
                                            onClick={() => handleSaveRow(row, row._id)}
                                            className="p-1 me-2"
                                        // disabled={updateLoading}
                                        >
                                            <MdSave className="fs-5" />
                                        </Button>

                                        <Button
                                            variant="outline-danger"
                                            title='Delete'
                                            onClick={() => {
                                                setStateDelete(true)
                                                dispatch(deleteStockProductActions({
                                                    stockProductId: row?._id,
                                                    action: 'delete'
                                                }));
                                                // handleDeleteRow(index, row._id)
                                            }}
                                            // disabled={rows?.length <= 1}
                                            className="p-1"
                                        >
                                            <MdDelete className="fs-5" />
                                        </Button>
                                    </div>
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
                            <Button onClick={onHide} className="me-2 cancel-button">
                                Cancel
                            </Button>
                            <Button type="submit" className='custom-button'>
                                Update
                            </Button>
                        </div>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default EditStockModal;