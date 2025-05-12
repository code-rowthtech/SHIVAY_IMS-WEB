import React, { useEffect, useState } from 'react'
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';
import Select from 'react-select'; // Import React Select
import { createStockCheckActions, createStockInProductActions, searchProductActions, updateStockInProductActions } from '../../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import ToastContainer from '../../../../helpers/toast/ToastContainer';
import { useLocation } from 'react-router-dom';

const AddProductModal = ({ showModal, handleClose, openingProducts, setOpeningProducts, selectedWarehouse, productData, stockId, Type }) => {
    console.log({ Type }, 'Type')
    const dispatch = useDispatch();
    const { handleSubmit, register, reset } = useForm()
    const store = useSelector((state) => state)
    const ProductSearch = store?.searchProductReducer?.searchProduct?.response;
    const StockCheck = store?.createStockCheckReducer?.createStockCheck;
    const productId = productData?.productId;
    const Product = productData?.productData
    const [searchTerm, setSearchTerm] = useState('');
    const [productName, setProductName] = useState('');
    const [quantity, setQuantity] = useState()
    const location = useLocation()
    console.log(productData, 'productData')
    const CreateResponse = store?.createStockInProductReducer?.createStockInProduct?.status;
    console.log(CreateResponse, 'CreateResponse')
    // console.log(selectedWarehouse, 'selectedWarehouse')
    const [searchType, setSearchType] = useState('modelName'); // default search type

    useEffect(() => {
        if (location.pathname === '/shivay/addDispatch' && quantity) {
            dispatch(createStockCheckActions({
                warehouseId: selectedWarehouse?.value, qty: quantity, productId: ProductSearch?.[0]?._id
            }))
        }
    }, [location, quantity])

    useEffect(() => {
        if (CreateResponse === 200) {
            handleClose();
        }
    }, [CreateResponse]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm) {
                if (searchType === 'modelName') {
                    dispatch(searchProductActions({ modelName: searchTerm }));
                } else if (searchType === 'code') {
                    dispatch(searchProductActions({ code: searchTerm }));
                }
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, dispatch, searchType]);

    const modalOptions = ProductSearch?.map((data) => ({
        value: data?._id,
        label: data?.modelId?.name,
        data: data
    })) || [];

    const codeOptions = ProductSearch?.map((data) => ({
        value: data?._id,
        label: data?.code,
        data: data
    })) || []

    // State to handle selected options
    const [selectedModal, setSelectedModal] = useState(null);
    console.log(selectedModal, 'selectedModalselectedModal')
    const [selectedCode, setSelectedCode] = useState(null);
    console.log(selectedCode, 'selectedCode')

    // Handle changes in modal selection
    const handleModalChange = (selectedOption) => {
        setSelectedModal(selectedOption);
        setSelectedCode({
            value: selectedOption?.data?._id,
            label: selectedOption?.data?.code,
            data: selectedOption?.data

        });
        setProductName(selectedOption?.data?.name);
    };

    const handleCodeChange = (selectedOption) => {
        setSelectedCode(selectedOption);
        setSelectedModal({
            value: selectedOption?.data?._id,
            label: selectedOption?.data?.modelId?.name,
            data: selectedOption?.data
        });
        setProductName(selectedOption?.data?.name);
    };

    useEffect(() => {
        dispatch(searchProductActions());
    }, [dispatch]);

    const loadModalOptions = async (inputValue) => {
        if (!inputValue) return [];

        console.log(inputValue, 'inputValue')
        dispatch(searchProductActions({ modelName: inputValue }))
    };

    const AddProduct = () => {
        const data = {
            stockInId: stockId,
            productId: selectedModal?.value,
            quantity: quantity,
            warehouseId: selectedWarehouse,
        }
        dispatch(createStockInProductActions(data));
    }

    const UpdateProduct = () => {
        const data = {
            stockInProductId: productData?._id,
            quantity: quantity,
        }
        dispatch(updateStockInProductActions(data));
    }

    const onSubmit = (data) => {
        if (openingProducts?.some((data) => data?.productId === selectedModal?.value)) {
            ToastContainer('Product Already Exist', 'danger')
        } else {
            const productsData = {
                productId: selectedModal?.value,
                quantity: quantity,
                product: selectedModal?.data
            }
            console.log(productsData, 'productsData')

            setOpeningProducts(prev => [...prev, productsData]);
            handleClose();
            reset();
            setSelectedCode('');
            setSelectedModal('');
            setQuantity('');
        }
    }
    console.log(productData, 'ProductSearch')
    console.log(Product, '0987')

    useEffect(() => {
        setQuantity(productData?.quantity);
        setProductName(Product?.name)
    }, [Product?._id]);


    return (
        <div>
            <Modal show={showModal} centered size='lg' onHide={handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title className='text-black'>{Type === 'Edit' ? 'Edit' : 'Add'} Product</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit((data) => {
                    if (Type === 'Add') {
                        onSubmit(data);
                    } else if (Type === 'Edit') {
                        UpdateProduct(data);
                    } else if (Type === 'Update') {
                        AddProduct(data);
                    }
                })}>

                    <Modal.Body>
                        {/* Your form or content here */}
                        <Row>
                            {Type === "Edit" ? <>
                                <Col sm={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="mb-0" >Model Name</Form.Label>
                                        <Form.Control type='text' placeholder="Modal Name" value={Product?.modelData?.[0]?.name} readOnly />
                                    </Form.Group>
                                </Col>
                                <Col sm={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="mb-0" >Code</Form.Label>
                                        <Form.Control type='text' placeholder="Code" value={Product?.code} readOnly />
                                    </Form.Group>
                                </Col>
                            </> :
                                <>
                                    <Col sm={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="mb-0">Search By</Form.Label>
                                            <Form.Select
                                                value={searchType}
                                                onChange={(e) => {
                                                    setSearchType(e.target.value);
                                                    setSearchTerm(''); // clear input
                                                    setSelectedModal(null);
                                                    setSelectedCode(null);
                                                    setProductName('');
                                                }}
                                            >
                                                <option value="modelName">Model</option>
                                                <option value="code">Code</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    {searchType === 'modelName' ? (
                                        <>
                                            <Col sm={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label className="mb-0">Model Name</Form.Label>
                                                    <Select
                                                        value={selectedModal}
                                                        onChange={handleModalChange}
                                                        onInputChange={(inputValue) => setSearchTerm(inputValue)}
                                                        options={modalOptions}
                                                        placeholder="Search Modal"
                                                        isClearable
                                                        isSearchable
                                                        isLoading={store?.searchProductReducer?.loading}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col sm={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label className="mb-0" >Code</Form.Label>
                                                    <Form.Control type='text' placeholder="Code" value={selectedCode?.label} />
                                                </Form.Group>
                                            </Col>
                                        </>
                                    ) : (
                                        <>
                                            <Col sm={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label className="mb-0">Code</Form.Label>
                                                    <Select
                                                        value={selectedCode}
                                                        onChange={handleCodeChange}
                                                        onInputChange={(inputValue) => setSearchTerm(inputValue)}
                                                        options={codeOptions}
                                                        placeholder="Search Code"
                                                        isClearable
                                                        isSearchable
                                                        isLoading={store?.searchProductReducer?.loading}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col sm={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label className="mb-0" >Model Name</Form.Label>
                                                    <Form.Control type='text' placeholder="Modal Name" value={selectedModal?.label} />
                                                </Form.Group>
                                            </Col>
                                        </>
                                    )}
                                </>
                            }


                            {(selectedModal || selectedCode || Product?._id) && (
                                <Col sm={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="mb-0">Product Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            disabled={Type === "Edit"}
                                            value={productName}
                                            placeholder="Enter Product Name"
                                            onChange={(e) => setProductName(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            )}

                            <Col sm={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="mb-0">Quantity</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter Number"
                                        value={quantity}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            setQuantity(val > 0 ? val : '');
                                        }}
                                        required
                                        min={1}
                                    />
                                </Form.Group>
                            </Col>

                        </Row>
                        {StockCheck?.status == 400 && location.pathname === '/shivay/addDispatch' && (
                            <Row className="px-2">
                                <div className="py-1 text-center border border-primary rounded bg-light text-primary">
                                    {StockCheck?.error || JSON.stringify(StockCheck)}
                                </div>
                            </Row>
                        )}

                    </Modal.Body>
                    <Modal.Footer>
                        <Button className='cancel-button' onClick={handleClose}>
                            Close
                        </Button>
                        <Button type='submit' className='custom-button' >
                            {Type === 'Edit' ? 'Update' : 'Save'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    )
}

export default AddProductModal