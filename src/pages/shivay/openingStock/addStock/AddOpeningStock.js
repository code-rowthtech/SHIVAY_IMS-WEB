import React, { useEffect, useRef, useState } from 'react'
import PageTitle from '../../../../helpers/PageTitle'
import { Button, Card, Col, Form, Modal, Row } from 'react-bootstrap'
import Select from 'react-select';
import { IoIosAdd } from 'react-icons/io';
import { AiOutlineEdit } from 'react-icons/ai';
import { RiDeleteBinLine } from 'react-icons/ri';
import AddProductModal from './AddProductModal';
import { useDispatch, useSelector } from 'react-redux';
import { createStockActions, deleteStockProductActions, getStockByIdActions, getStockListActions, getWarehouseListActions, updateStockActions } from '../../../../redux/actions';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ButtonLoading } from '../../../../helpers/loader/Loading';
import { MdDeleteOutline } from 'react-icons/md';

const AddOpeningStock = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { handleSubmit, register, setValue } = useForm()
    const [showModal, setShowModal] = useState(false);
    const store = useSelector((state) => state)
    const [today, setToday] = useState(new Date().toISOString().split('T')[0]);
    const [searchParams] = useSearchParams();
    const stockId = searchParams.get('Id');
    const isEditMode = Boolean(stockId);
    const StockInData = store?.stockListReducer?.stockList?.response;
    console.log(StockInData, '1232232')
    const Warehouse = store?.getWarehouseListReducer?.searchWarehouse?.response;
    const warehouseOptions = Warehouse?.map((warehouse) => ({
        value: warehouse._id,
        label: warehouse.name,
    }));

    const [openingProducts, setOpeningProducts] = useState([])
    const [selectedStock, setSelectedStock] = useState(null);
    console.log(openingProducts, 'openingProducts')
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [productData, setProductData] = useState(null);
    const [productToDelete, setProductToDelete] = useState(null);
    console.log(productToDelete, 'hfghgjkl')
    const [modalType, setModalType] = useState(null)
    const [showConfirm, setShowConfirm] = useState(false);

    const [editedQuantity, setEditedQuantity] = useState(selectedStock?.quantity || '');
    const inputRef = useRef(null);

    const stockData = store?.stockByIdReducer?.stockById?.response;
    const createResponse = store?.createStockReducer?.createStock?.status;
    const CreateProductResponse = store?.createStockProductReducer?.createStockProduct?.status;
    const DeleteProductResponse = store?.deleteStockProductReducer?.deleteStockProduct?.status;
    const UpdateProductResponse = store?.updateStockProductReducer?.updateStockProduct?.status;

    console.log(stockData, 'stockData123')

    const handleShow = () => {
        setShowModal(true)
        const renderType = stockId ? 'Update' : "Add"
        setModalType(renderType)
    };

    const handleEditShow = (data) => {
        setShowModal(true);
        setProductData(data);
        setModalType('Edit')
    };

    const handleClose = () => {
        setShowModal(false)
        setProductData(null)
        setModalType(null)

    };

    useEffect(() => {
        if (createResponse === 200) {
            navigate("/shivay/openingStock");
        }
    }, [createResponse]);

    const handleWarehouseChange = (selectedOption) => {
        setSelectedWarehouse(selectedOption);
    };

    useEffect(() => {
        dispatch(getWarehouseListActions());
    }, [dispatch]);

    useEffect(() => {

        dispatch(getStockListActions({
            limit: '',
            page: '',
            search: '',
        }));
    }, [dispatch]);

    // useEffect(() => {
    //     if (stockId && StockInData?.length > 0) {
    //         const foundStock = StockInData?.find(item => item._id === stockId);
    //         setSelectedStock(foundStock);
    //     }
    // }, [stockId, StockInData]);

    // console.log(StockInData, 'StockInData')

    useEffect(() => {
        if (stockId) {
            dispatch(getStockByIdActions(stockId));
        }
    }, [dispatch, stockId]);

    useEffect(() => {
        if (CreateProductResponse === 200 || DeleteProductResponse === 200 || UpdateProductResponse === 200) {
            dispatch(getStockByIdActions(stockId));
        }
    }, [CreateProductResponse, DeleteProductResponse, UpdateProductResponse]);

    const onSubmit = (data) => {
        const cleanedProducts = openingProducts.map(({ product, ...rest }) => rest);

        const payload = {
            warehouseId: selectedWarehouse?.value,
            ...(!stockId && { productStock: cleanedProducts }),
            description: data?.description,
            date: data?.date
        };
        if (stockId) {
            dispatch(updateStockActions({ ...payload, _id: stockId }));
        } else {
            dispatch(createStockActions(payload));
        }
    };

    const handleDeleteProduct = (indexToRemove) => {
        const updatedProducts = openingProducts.filter((_, index) => index !== indexToRemove);
        setOpeningProducts(updatedProducts);
    };

    useEffect(() => {

        if (stockData) {
            setEditedQuantity(stockData?.[0]?.quantity || '');
            const updateWarehouses = stockData?.[0]?.warehouseData
                ? [{ value: stockData?.[0].warehouseId, label: stockData?.[0].warehouseData.name }]
                : [];

            setSelectedWarehouse(updateWarehouses)
            setToday(stockData?.[0]?.date ? new Date(stockData?.[0]?.date).toISOString().split('T')[0] : '')


            setValue('description', stockData?.[0]?.description)
        }
    }, [stockData]);
    console.log(stockData, 'stockData')

    const handleEditClick = () => {
        setIsEditing(true);
    };

    // Handle input change
    const handleQuantityChange = (e) => {
        setEditedQuantity(e.target.value);
    };

    // Handle save (when clicking outside or pressing Enter)
    const handleSave = () => {
        setIsEditing(false);
        // Here you would typically also call an API to update the quantity in your backend
    };

    // Handle key press (for Enter key)
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSave();
        }
    };

    // Close the input when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (inputRef.current && !inputRef.current.contains(e.target)) {
                handleSave();
            }
        };

        if (isEditing) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isEditing]);

    return (
        <div>
            <PageTitle
                breadCrumbItems={[
                    { label: "SHIVAY Opening Stock List", path: "/shivay/openingStock" },
                    { label: isEditMode ? "Edit Opening Stock" : "Add Opening Stock", path: "/shivay/openingStock", active: true },
                ]}
                title={isEditMode ? "Edit Opening Stock" : "Add Opening Stock"}
            />


            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <Col sm={3}>
                        <Form.Group className="mb-1">
                            <Form.Label className='mb-0'>Warehouse <span className='text-danger'>*</span></Form.Label>
                            <Select
                                value={selectedWarehouse}
                                onChange={handleWarehouseChange}
                                options={warehouseOptions}
                                placeholder="Select a warehouse"
                                noOptionsMessage={() => "No warehouse found..."}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group className="mb-1">
                            <Form.Label className='mb-0'>Date Range <span className='text-danger'>*</span></Form.Label>
                            <Form.Control
                                type="date"
                                value={today}
                                {...register('date', { required: true })}
                                onChange={(e) => setToday(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Col>

                    <Col sm={3}>
                        <Form.Group className="mb-1">
                            <Form.Label className='mb-0'>Description</Form.Label>
                            <Form.Control
                                as='textarea'
                                rows={1}
                                {...register('description')}
                                placeholder='Enter Description'
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={3} className='text-end mt-1'>
                        <Button className="mt-2 fw-bold custom-button"
                            onClick={handleShow}
                        >
                            <IoIosAdd className="fs-3" />&nbsp;Product
                        </Button>
                    </Col>
                </Row>

                <div className='mt-2'>
                    <Card
                        style={{ boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset' }}
                    >
                        <Card.Body className="text-center py-1">
                            <table className="table table-striped bg-white">
                                <thead>
                                    <tr className="table_header">
                                        <th scope="col"><i className="mdi mdi-merge"></i></th>
                                        <th scope="col">Product Name</th>
                                        <th scope="col">Code</th>
                                        <th scope="col">Quantity</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {stockId ?
                                        <>{stockData?.[0]?.stockProducts && stockData?.[0]?.stockProducts?.length > 0 ? (
                                            stockData?.[0]?.stockProducts?.map((data, index) => (
                                                <tr key={index} className="text-dark fw-bold text-nowrap highlight-row">
                                                    <th scope="row">{index + 1}</th>
                                                    <td className="text-uppercase fw-bold">
                                                        {data?.product?.name || <span className="text-black">-</span>}
                                                    </td>
                                                    <td className="fw-bold">
                                                        {data?.product?.code || <span className="text-black">-</span>}
                                                    </td>
                                                    <td className="fw-bold">
                                                        {data?.quantity || <span className="text-black">0</span>}
                                                    </td>

                                                    <div className="icon-container d-flex  pb-0" >
                                                        <span
                                                            className="icon-wrapper"
                                                            onClick={() => {
                                                                handleEditShow(data)
                                                            }}
                                                            title="Edit"
                                                        >
                                                            <AiOutlineEdit className="fs-4 text-black" style={{ cursor: 'pointer' }} />
                                                        </span>
                                                        <span
                                                            className="icon-wrapper"
                                                            title="Delete"
                                                            onClick={() => {
                                                                setProductToDelete(data?._id);
                                                                setShowConfirm(true);
                                                            }}
                                                        >
                                                            <RiDeleteBinLine className="fs-4 text-black" style={{ cursor: 'pointer' }} />
                                                        </span>
                                                    </div>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center text-muted py-3">
                                                    No products added yet. Please add products to add opening stock.
                                                </td>
                                            </tr>
                                        )}</>
                                        : <>
                                            {openingProducts && openingProducts.length > 0 ? (
                                                openingProducts?.map((data, index) => (
                                                    <tr key={index} className="text-dark fw-bold text-nowrap highlight-row">
                                                        <th scope="row">{index + 1}</th>
                                                        <td className="text-uppercase fw-bold">
                                                            {data?.product?.name || <span className="text-black">-</span>}
                                                        </td>
                                                        <td className="fw-bold">
                                                            {data?.product?.code || <span className="text-black">-</span>}
                                                        </td>
                                                        <td className="fw-bold">
                                                            {data?.quantity || <span className="text-black">-</span>}
                                                        </td>

                                                        <div className="icon-container d-flex pb-0">
                                                            {/* <span className="icon-wrapper" title="Edit">
                                                                <AiOutlineEdit className="fs-4 text-black" style={{ cursor: 'pointer' }} />
                                                            </span> */}
                                                            <span className="icon-wrapper me-4" title="Delete" onClick={() => handleDeleteProduct(index)}>
                                                                <RiDeleteBinLine className="fs-4 text-black" style={{ cursor: 'pointer' }} />
                                                            </span>
                                                        </div>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="text-center text-danger py-3">
                                                        Note : No products added yet. Please add products to add opening stock.
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    }
                                </tbody>
                            </table>

                        </Card.Body>
                    </Card>
                    <div className="text-end">
                        <Button
                            className="fw-bold cancel-button me-2"
                            onClick={() => navigate("/shivay/openingStock")}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="custom-button fw-bold"
                            disabled={store?.createStockReducer?.loading}
                            style={{ width: '100px' }}
                        >
                            {store?.createStockReducer?.loading ? (
                                <ButtonLoading color="white" />
                            ) : isEditMode ? (
                                'Update'
                            ) : (
                                'Submit'
                            )}
                        </Button>
                    </div>
                </div>
            </Form>

            <AddProductModal
                openingProducts={openingProducts}
                setOpeningProducts={setOpeningProducts}
                showModal={showModal}
                handleClose={handleClose}
                Type={modalType}
                productData={productData}
                selectedWarehouse={selectedWarehouse}
                stockId={stockId}
            />

            {/* delete modal */}
            <Modal show={showConfirm} onHide={() => setShowConfirm(false)} >
                <Modal.Body className='text-center'>
                    <h4 className='text-black'>Confirm Deletion</h4>
                    <p className='mt-2 mb-3'> Are you sure you want to delete this Product?</p>
                    <span className='bg-light rounded-circle p-3 '>
                        <MdDeleteOutline className='fs-1  text-danger' />
                    </span>
                    <div className='d-flex justify-content-center mt-3 gap-2'>
                        <Button className='cancel-button' onClick={() => setShowConfirm(false)}>
                            Cancel
                        </Button>
                        <Button className='custom-button' onClick={() => {
                            dispatch(deleteStockProductActions({ stockProductId: productToDelete }));
                            setShowConfirm(false);
                        }}>
                            Delete
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>

        </div>
    )
}

export default AddOpeningStock