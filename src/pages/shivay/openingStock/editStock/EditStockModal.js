import { useEffect, useMemo, useCallback, useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import { searchProductActions, updateStockActions, deleteStockProductActions, updateStockProductActions, getStockByIdActions, createStockProductActions } from '../../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { IoIosAdd } from 'react-icons/io';
import { MdDelete, MdSave } from 'react-icons/md';
import { toast } from 'react-toastify';
import { ButtonLoading, Loading } from '../../../../helpers/loader/Loading';

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
                        data: item
                    },
                    quantity: Qty,
                    searchTerm: modelName || name
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
            setSelectedWarehouse(updateWarehouses)
        }
    }, [stockDetails, setValue, DeleteProductResponse]);

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

    const productOptionsCode = useMemo(() => (
        ProductSearch?.map(product => ({
            value: product._id,
            label: product.code,
            code: product.code,
            name: product.name,
            data: product
        })) || []
    ), [ProductSearch]);

    useEffect(() => {
        if (productError) {
            toast.error(productError.message || 'Failed to search products');
        }
        if (warehouseError) {
            toast.error(warehouseError.message || 'Failed to load warehouses');
        }
    }, [productError, warehouseError]);

    const handleSearch = useCallback((searchTerm, searchType, index) => {
        if (!searchTerm || searchTerm?.length < 1) return;

        const searchParams = {};
        if (searchType === 'modelName') {
            searchParams.modelName = searchTerm;
        } else if (searchType === 'code') {
            searchParams.code = searchTerm;
        }

        dispatch(searchProductActions(searchParams));
    }, [dispatch]);

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
        <Modal show={show} onHide={onHide} size='xl' backdrop='static' centered>
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
                                />
                                {errors.warehouseId && <small className="text-danger">Warehouse is required</small>}
                            </Form.Group>
                        </Col>

                        <Col sm={4}>
                            <Form.Group className="mb-1">
                                <Form.Label>Date <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="date"
                                    required
                                    max={new Date().toISOString().split("T")[0]}
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
                            padding: '10px',
                        }}
                    >
                        {rows?.map((row, index) => (
                            <div className='mb-1 rounded-1 ps-1' style={{ border: '1px solid rgba(218, 224, 225, 0.97)' }} key={index}>
                                <Row className="align-items-center mb-2 g-2">
                                    <Col xs={2} className='d-flex'>
                                        <span className="fw-semibold d-flex align-items-center me-1 mt-2 pt-1">{index + 1}.</span>
                                        <div>
                                            <Form.Group className='mb-0'>
                                                <Form.Label className="small mb-0">Search By</Form.Label>
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
                                        </div>
                                    </Col>

                                    <Col xs={3}>
                                        <Form.Group className='mb-0'>
                                            <Form.Label className="small mb-0">
                                                {row.searchType === 'modelName' ? 'Model Name' : 'Product Code'}
                                            </Form.Label>
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

                                    <Col xs={2}>
                                        <Form.Group className='mb-0'>
                                            <Form.Label className="small mb-0">
                                                {row.searchType === 'modelName' ? 'Code' : 'Model'}
                                            </Form.Label>
                                            <Form.Control
                                                type='text'
                                                readOnly
                                                value={row.searchType === 'modelName' ? row?.selectedProduct?.code : row?.selectedProduct?.data?.modelId?.name}
                                                placeholder={row.searchType === 'modelName' ? 'Code' : 'Model'}
                                            />
                                        </Form.Group>
                                    </Col>

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
                                        <div className='d-flex justify-content-end'>
                                            <Button
                                                variant="outline-success"
                                                title='Update'
                                                onClick={() => handleSaveRow(row, row._id)}
                                                className="p-1 me-1 mt-2"
                                            >
                                                <MdSave className="fs-6" />
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
                                                }}
                                                className="p-1 mt-2 me-2"
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

                        <div>
                            <Button onClick={onHide} className="me-2 cancel-button">
                                Cancel
                            </Button>
                            <Button
                                className='custom-button'
                                type="submit"
                                disabled={store?.updateStockReducer?.loading}
                            >
                                {store?.updateStockReducer?.loading ? (
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

export default EditStockModal;