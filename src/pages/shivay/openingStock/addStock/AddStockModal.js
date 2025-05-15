import { useEffect, useMemo, useCallback, useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import { createStockActions, getWarehouseListActions, searchProductActions } from '../../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { IoIosAdd } from 'react-icons/io';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';

function AddStockModal({ show, onHide }) {
    const dispatch = useDispatch();
    const { handleSubmit, register, setValue, reset, formState: { errors } } = useForm();
    const [today] = useState(new Date().toISOString().split('T')[0]);
    const store = useSelector((state) => state)

    const [rows, setRows] = useState([{
        searchType: 'modelName',
        selectedProduct: null,
        quantity: '',
        searchTerm: ''
    }]);
    
    console.log(rows, 'sdhfsdhfjhgsdhfg')
    const createResponse = store?.createStockReducer?.createStock?.status;

    useEffect(() => {
        if (createResponse === 200) {
            onHide();
            reset();
        }
    }, [createResponse]);

    // Redux selectors
    const {
        searchProductReducer: {
            searchProduct: { response: ProductSearch = [], loading: productLoading },
            error: productError
        },
        getWarehouseListReducer: {
            searchWarehouse: { response: Warehouse = [] },
            error: warehouseError
        },
        createStockReducer: { loading: createLoading }
    } = useSelector((state) => state);
    console.log(ProductSearch, 'productSearch')

    // Memoized options to prevent unnecessary recalculations
    const warehouseOptions = useMemo(() => (
        Warehouse.map((warehouse) => ({
            value: warehouse._id,
            label: warehouse.name,
        }))
    ), [Warehouse]);

    const productOptions = useMemo(() => {
        if (!ProductSearch) return [];

        return ProductSearch.map((product) => ({
            value: product._id,
            label: product.modelId?.name,
            code: product.code,
            name: product.name,
            data: product
        }));
    }, [ProductSearch]);

    // API calls with error handling
    useEffect(() => {
        dispatch(getWarehouseListActions());
    }, [dispatch]);

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
        if (!searchTerm || searchTerm.length < 2) return;

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
        setRows(prev => [...prev, {
            searchType: 'modelName',
            selectedProduct: null,
            quantity: '',
            searchTerm: ''
        }]);
    }, []);

    const handleDeleteRow = useCallback((indexToDelete) => {
        if (rows.length <= 1) return;
        setRows(prev => prev.filter((_, i) => i !== indexToDelete));
    }, [rows.length]);

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

    // Form submission
    const onSubmit = useCallback((formData) => {
        if (!warehouseOptions.length) {
            toast.error('Please select a warehouse');
            return;
        }

        const productStock = rows.map(row => {
            if (!row.selectedProduct) {
                toast.error('Please select a product for all rows');
                return null;
            }
            if (!row.quantity) {
                toast.error('Please enter quantity for all products');
                return null;
            }

            return {
                productId: row.selectedProduct.value,
                quantity: row.quantity,
                code: row.selectedProduct.code,
                name: row.selectedProduct.name || row.selectedProduct.label
            };
        }).filter(Boolean);

        if (productStock.length !== rows.length) return;

        const payload = {
            warehouseId: formData.warehouseId,
            productStock,
            description: formData.description,
            date: formData.date || today
        };

        dispatch(createStockActions(payload))
    }, [rows, dispatch, onHide, today, warehouseOptions]);

    return (
        <Modal show={show} onHide={onHide} size='xl' centered>
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
                                <Form.Label>Date <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="date"
                                    defaultValue={today}
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
                            maxHeight: rows.length >= 3 ? '51vh' : 'auto',
                            overflowY: rows.length >= 3 ? 'auto' : 'visible',
                            // border: '1px solid #ccc',
                            padding: '15px',
                        }}
                    >
                        {rows.map((row, index) => (
                            <Row key={index} className=" align-items-end">
                                <Col sm={3}>
                                    <Form.Group className='mb-1'>
                                        <Form.Label className="mb-0">Search By</Form.Label>
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
                                        <Form.Label className="mb-0">
                                            {row.searchType === 'modelName' ? 'Model Name' : 'Product Code'}
                                        </Form.Label>
                                        <Select
                                            value={row?.selectedProduct}
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
                                            inputValue={row.searchTerm}
                                            filterOption={() => true} // Bypass client-side filtering
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
                                            value={row.searchType === 'modelName' ? row?.selectedProduct?.data?.code : row?.selectedProduct?.data?.modelId?.name}
                                            placeholder={row.searchType === 'modelName' ? 'Code' : 'Model '} />
                                    </Form.Group>
                                </Col>

                                <Col sm={3} className="d-flex">
                                    <Form.Group className="w-100 mb-1">
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
                                    <Form.Group className='mb-1'>
                                        <Form.Label className="mb-0">Quantity</Form.Label>
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
                                    {rows.length > 1 && (
                                        <Button
                                            variant="outline-danger"
                                            onClick={() => handleDeleteRow(index)}
                                            className="p-1 mb-1"
                                        >
                                            <MdDelete className="fs-5" />
                                        </Button>
                                    )}
                                </Col>
                                <hr className='mt-2 mb-1' />
                            </Row>
                        ))}
                    </div>

                    <div className="d-flex justify-content-between mt-3">
                        <Button variant="outline-primary" onClick={handleAddRow}>
                            <IoIosAdd className="me-1" /> Add Row
                        </Button>

                        <div>
                            <Button onClick={onHide} className="cancel-button me-2">
                                Cancel
                            </Button>
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

export default AddStockModal;