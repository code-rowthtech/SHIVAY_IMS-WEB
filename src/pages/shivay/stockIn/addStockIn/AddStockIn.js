import React, { useEffect, useRef, useState } from 'react'
import PageTitle from '../../../../helpers/PageTitle'
import { Button, Card, Col, Form, Modal, Row } from 'react-bootstrap'
import Select from 'react-select';
import { IoIosAdd } from 'react-icons/io';
import { AiOutlineEdit } from 'react-icons/ai';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { createStockInActions, deleteStockInProductActions, getStockInByIdActions, getWarehouseListActions, listingSupplierActions, listingUsersActions, updateStockInActions } from '../../../../redux/actions';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CgCloseO } from "react-icons/cg";
import { HiOutlineFolderDownload } from "react-icons/hi";
import { ButtonLoading } from '../../../../helpers/loader/Loading';
import AddProductModal from './AddProductModal';
import { MdDeleteOutline } from 'react-icons/md';

const AddStockIn = () => {
    const [searchParams] = useSearchParams();
    const stockId = searchParams.get('id')
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { handleSubmit, register, setValue, resetField, watch } = useForm()
    const [showModal, setShowModal] = useState(false);
    const store = useSelector((state) => state)
    const [today, setToday] = useState(null);
    const [openingProducts, setOpeningProducts] = useState([])
    // const StockInData = store?.stockInListReducer?.stockInList?.response;
    // const [selectedStock, setSelectedStock] = useState(null);
    const Warehouse = store?.getWarehouseListReducer?.searchWarehouse?.response;
    const UsersList = store?.listingUsersReducer?.listingUsers?.response;
    const SupplierList = store?.listingSupplierReducer?.listingSupplier?.response;
    const [isEditing, setIsEditing] = useState(false);
    const [editedQuantity, setEditedQuantity] = useState('');
    const [productId, setProductId] = useState('');
    const [productData, setProductData] = useState(null);
    const [productToDelete, setProductToDelete] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [modalType, setModalType] = useState(null)
    const inputRef = useRef(null);
    const xyz = watch('invoiceAttachment');
    // console.log(selectedStock, "selectedStock")

    const createResponse = store?.createStockInReducer?.createStockIn?.status;
    const CreateProductResponse = store?.createStockInProductReducer?.createStockInProduct?.status;
    const DeleteProductResponse = store?.deleteStockInProductReducer?.deleteStockInProduct?.status;
    const UpdateProductResponse = store?.updateStockInProductReducer?.updateStockInProduct?.status;
    const stockInData = store?.stockInByIdReducer?.stockInById?.response;
    console.log(stockInData, 'stockInData')
    const [attachmentType, setAttachmentType] = useState("");
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

    const fileInputRef = useRef();

    const handleAttachmentTypeChange = (e) => {
        const type = e.target.value;
        setAttachmentType(type);
        setValue("invoiceAttachmentType", type);
    };

    const resetAttachmentType = () => {
        setAttachmentType("");
        setValue("invoiceAttachmentType", "");
        resetField("invoiceAttachment");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleQuantityChange = (e) => {
        const value = Number(e.target.value);
        if (value >= 0) {
            setEditedQuantity(value);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSave();
        }
    };

    useEffect(() => {
        if (createResponse === 200) {
            navigate("/shivay/stockIn");
        }
    }, [createResponse]);

    // Handle save (when clicking outside or pressing Enter)
    const handleSave = () => {
        setIsEditing(false);
        // Here you would typically also call an API to update the quantity in your backend
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };
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

    // useEffect(() => {
    //     if (stockId && StockInData?.length > 0) {
    //         const foundStock = StockInData?.find(item => item._id === stockId);
    //         setSelectedStock(foundStock);
    //         console.log(foundStock, 'foundStock')
    //     }
    // }, [stockId, StockInData]);

    const warehouseOptions = Warehouse?.map((warehouse) => ({
        value: warehouse._id,
        label: warehouse.name,
    }));

    const usersOptions = UsersList?.map((users) => ({
        value: users._id,
        label: users.name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' '),
    }));


    const supplierOptions = SupplierList?.map((users) => ({
        value: users._id,
        label: users.name,
    }));

    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    console.log(selectedWarehouse, 'selectedWarehouse')

    useEffect(() => {
        if (CreateProductResponse === 200 || DeleteProductResponse === 200 || UpdateProductResponse === 200) {
            dispatch(getStockInByIdActions(stockId));
        }
    }, [CreateProductResponse, DeleteProductResponse, UpdateProductResponse]);

    useEffect(() => {
        if (stockId) {
            dispatch(getStockInByIdActions(stockId));
        }
    }, [dispatch, stockId]);


    useEffect(() => {
        if (stockId && stockInData) {
            console.log(stockInData, '2345432')
            setToday(stockInData?.[0]?.createdAt ? new Date(stockInData?.[0]?.createdAt).toISOString().split('T')[0] : '')
            const updateWarehouses = stockInData?.[0]?.warehouseData
                ? { value: stockInData?.[0].warehouseId, label: stockInData?.[0].warehouseData?.find((ele) => ele?._id === stockInData?.[0]?.warehouseId)?.name }
                : {};
            setSelectedWarehouse(updateWarehouses)

            const updatedUser = stockInData?.[0]?.receivedByData ? { value: stockInData?.[0]?.receivedBy, label: stockInData?.[0].receivedByData?.find((ele) => ele?._id === stockInData?.[0]?.receivedBy)?.name }
                : {}
            setSelectedUser(updatedUser)

            const updatedSupplier = stockInData?.[0]?.supplierId ? { value: stockInData?.[0]?.supplierId, label: stockInData?.[0].supplierData?.find((ele) => ele?._id === stockInData?.[0]?.supplierId)?.name }
                : {}
            setSelectedSupplier(updatedSupplier)

            setValue('invoiceNumber', stockInData?.[0]?.invoiceNumber || '');
            setValue('description', stockInData?.[0]?.description || '');
            setValue('invoiceValue', stockInData?.[0]?.fright || '');
            setValue('invoiceAttachment', stockInData?.[0]?.invoiceAttachment || '');
            setAttachmentType(stockInData?.[0]?.invoiceAttachmentType || '');
            setEditedQuantity(stockInData?.[0]?.stockInProducts?.quantity || '');
            setProductId(stockInData?.[0]?.productData?._id)
        }

    }, [stockId, stockInData])

    console.log(selectedWarehouse, 'selectedWarehouse')

    const handleAccordionToggle = () => {
        setIsAccordionOpen(prevState => !prevState);
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

    useEffect(() => {
        dispatch(getWarehouseListActions());
    }, [dispatch]);

    useEffect(() => {
        dispatch(listingUsersActions());
    }, [dispatch]);

    useEffect(() => {
        dispatch(listingSupplierActions());
    }, [dispatch]);

    const handleDeleteProduct = (indexToRemove) => {
        const updatedProducts = openingProducts.filter((_, index) => index !== indexToRemove);
        setOpeningProducts(updatedProducts);
    };

    const onSubmit = (data) => {
        console.log(data, 'ouiyuttdfghjk', fileInputRef)
        const cleanedProducts = openingProducts.map(({ product, ...rest }) => rest);
        const formData = new FormData();
        if (data?.invoiceAttachment?.[0] instanceof File) {
            formData.append('invoiceAttachment', data.invoiceAttachment?.[0]);
        }

        formData.append('warehouseId', selectedWarehouse?.value)
        formData.append('receivedBy', selectedUser?.value);
        formData.append('supplierId', selectedSupplier?.value);
        formData.append('description', data?.description);
        formData.append('invoiceNumber', data?.invoiceNumber);
        formData.append('fright', data?.invoiceValue);
        formData.append('invoiceAttachmentType', attachmentType);

        if (!stockId) {
            formData.append('date', data?.date);
        }

        if (stockId) {
            formData.append('stockInId', stockId);
        }

        if (stockId) {
            formData.append('productDetailsArr', JSON.stringify([]));
        }

        if (stockId) {
            formData.append('newProductArr', JSON.stringify([]));
        }

        if (!stockId) {
            formData.append('stockInQty', stockId ? parseInt(editedQuantity) : JSON.stringify(cleanedProducts));
        }
        if (stockId) {
            dispatch(updateStockInActions(formData))
        } else {
            dispatch(createStockInActions(formData));
            // console.log(formData, 'formData');
        }
    };

    const handleDelete = () => {
        dispatch(deleteStockInProductActions({ stockInProductId: productToDelete }));
        setShowConfirm(false);
    };

    console.log(stockInData?.[0]?.stockInProducts, '0987')
    return (
        <div>
            <PageTitle
                breadCrumbItems={[
                    { label: "SHIVAY Stock In List", path: "/shivay/stockIn" },
                    { label: stockId ? "Edit Stock In" : "Add Stock In", path: "/shivay/stockIn", active: true },
                ]}
                title={stockId ? "Edit Stock In" : "Add Stock In"}
            />
            <Form onSubmit={handleSubmit(onSubmit)}>

                <div className="accordion mb-2" id="accordionExample">
                    <div className="accordion-item" style={{ border: '2px solid #6655D9' }}>
                        <h2 className="accordion-header mt-0">
                            <button
                                className="accordion-button py-1 d-flex justify-content-between align-items-center w-100"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseOne"
                                aria-expanded={isAccordionOpen ? "true" : "false"}
                                aria-controls="collapseOne"
                                onClick={handleAccordionToggle}  // Toggle the accordion open state
                            >
                                <div className="flex-grow-1 text-black fw-bold"> {stockId ? "Edit" : "Add"} Stock In Details</div>

                                {/* Right-aligned buttons */}
                                <div className="d-flex">
                                    <Button
                                        className="fw-bold custom-button me-2"
                                        onClick={handleShow}
                                    // disabled={!isAccordionOpen}
                                    >
                                        <IoIosAdd className="fs-3" />&nbsp;Product
                                    </Button>
                                </div>
                            </button>
                        </h2>

                        <div
                            id="collapseOne"
                            className={`accordion-collapse collapse ${isAccordionOpen ? "" : "show"}`}
                            data-bs-parent="#accordionExample"
                        >
                            <div className="accordion-body py-1">
                                <Row>
                                    <Col sm={3}>
                                        <Form.Group className="mb-1">
                                            <Form.Label className='mb-0'>Warehouse <span className='text-danger'>*</span></Form.Label>
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
                                            <Form.Label className="mb-0">Received By <span className='text-danger'>*</span></Form.Label>
                                            <Select
                                                value={selectedUser}
                                                onChange={handleUserChange}
                                                options={usersOptions}
                                                placeholder="Select a User"
                                                isClearable
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={3}>
                                        <Form.Group className="mb-1">
                                            <Form.Label className="mb-0">Supplier <span className='text-danger'>*</span></Form.Label>
                                            <Select
                                                value={selectedSupplier}
                                                onChange={handleSupplierChange}
                                                options={supplierOptions}
                                                placeholder="Select a Supplier"
                                                isClearable
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={3}>
                                        <Form.Group className="mb-1">
                                            <Form.Label className='mb-0'>Date Range</Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={today}
                                                {...register('date')}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={3}>
                                        <Form.Group className="mb-1">
                                            <Form.Label className="mb-0">Invoice Number <span className='text-danger'>*</span></Form.Label>
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
                                                {attachmentType && (
                                                    <span className="text-capitalize"> ({attachmentType})</span>
                                                )}
                                                {stockInData?.[0]?.invoiceAttachment && (
                                                    <a
                                                        href={stockInData?.[0]?.invoiceAttachment}
                                                        target="_blank"
                                                        title='Download Attachment'
                                                        rel="noopener noreferrer"
                                                    // style={{position:'absolute', top:'20px'}}
                                                    >
                                                        <HiOutlineFolderDownload className='ms-1 fs-4' />
                                                    </a>
                                                )}
                                                <span className="text-danger"> *</span>
                                            </Form.Label>

                                            {!attachmentType ? (
                                                <Form.Select
                                                    className="mb-0"
                                                    // defaultValue=""
                                                    value={attachmentType}
                                                    onChange={handleAttachmentTypeChange}
                                                    required
                                                >
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
                                                        {...register("invoiceAttachment")}
                                                    />

                                                    <CgCloseO
                                                        size={20}
                                                        className='text-danger'
                                                        style={{ cursor: "pointer" }}
                                                        onClick={resetAttachmentType}
                                                        title="Change attachment type"
                                                    />
                                                </div>
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
                            </div>
                        </div>
                    </div>
                </div>

                {stockId &&
                    <div className="text-end">
                        {/* <Button
                            className="fw-bold cancel-button me-2"
                            onClick={() => navigate("/shivay/stockIn")}
                        >
                            Cancel
                        </Button> */}

                        {/* <Button className="fw-bold custom-button" type='submit'>{stockId ? 'Update' : "Submit"}</Button> */}
                        <Button
                            type="submit"
                            className="custom-button fw-bold"
                            disabled={store?.updateStockInReducer?.loading}
                            style={{ width: '100px' }}
                        >
                            {store?.updateStockInReducer?.loading ? (
                                <ButtonLoading color="white" />
                            ) : 'Update'}
                        </Button>
                    </div>
                }
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
                                        <th scope="col">Model Name</th>
                                        <th scope="col">Code</th>
                                        <th scope="col">Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {!stockId ? (
                                        openingProducts && openingProducts.length > 0 ? (
                                            openingProducts.map((data, index) => (
                                                <tr key={index} className="text-dark fw-bold text-nowrap highlight-row">
                                                    <th scope="row">{index + 1}</th>
                                                    <td className="text-uppercase fw-bold">
                                                        {data?.product?.name || <span className="text-black">-</span>}
                                                    </td>
                                                    <td className="fw-bold">
                                                        {data?.product?.modelId?.name || <span className="text-black">-</span>}
                                                    </td>
                                                    <td className="fw-bold">
                                                        {data?.product?.code || <span className="text-black">-</span>}
                                                    </td>
                                                    <td className="fw-bold">
                                                        {data?.quantity || <span className="text-black">-</span>}
                                                    </td>
                                                    <td></td>
                                                    <div className="icon-container d-flex pb-0">
                                                        <span className="icon-wrapper me-4" title="Delete" onClick={() => handleDeleteProduct(index)}>
                                                            <RiDeleteBinLine className="fs-4 text-black" style={{ cursor: 'pointer' }} />
                                                        </span>
                                                    </div>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center text-danger py-3">
                                                    Note :  No products added yet. Please add products to proceed with stock-in.
                                                </td>
                                            </tr>
                                        )
                                    ) : (
                                        stockInData?.[0]?.stockInProducts?.map((data, index) => (
                                            <tr key={index} className='text-dark fw-bold text-nowrap highlight-row'>
                                                <th scope="row">{index + 1}</th>
                                                <td className="text-uppercase fw-bold">
                                                    {data?.productData?.name || <span className="text-black">-</span>}
                                                </td>
                                                <td className="fw-bold">
                                                    {data?.productData?.modelData?.[0]?.name || <span className="text-black">-</span>}
                                                </td>
                                                <td className="fw-bold">
                                                    {data?.productData?.code || <span className="text-black">-</span>}
                                                </td>
                                                <td className="fw-bold">
                                                    {data?.quantity || <span className="text-black">-</span>}
                                                </td>
                                                <td></td>
                                                <div className="icon-container d-flex  pb-0" >
                                                    <span
                                                        className="icon-wrapper"
                                                        onClick={() => { handleEditShow(data, data?.productData?.name) }}
                                                        title="Edit"
                                                    >
                                                        <AiOutlineEdit className="fs-4 text-black" style={{ cursor: 'pointer' }} />
                                                    </span>
                                                    <span className="icon-wrapper" title="Delete" onClick={() => { setProductToDelete(data?._id); setShowConfirm(true); }}>
                                                        <RiDeleteBinLine className="fs-4 text-black" style={{ cursor: 'pointer' }} />
                                                    </span>
                                                </div>
                                            </tr>
                                        ))
                                    )}

                                </tbody>

                            </table>

                        </Card.Body>
                    </Card>
                    {!stockId &&
                        <div className="text-end">
                            <Button
                                className="fw-bold cancel-button me-2"
                                onClick={() => navigate("/shivay/stockIn")}
                            >
                                Cancel
                            </Button>

                            {/* <Button className="fw-bold custom-button" type='submit'>{stockId ? 'Update' : "Submit"}</Button> */}
                            <Button
                                type="submit"
                                className="custom-button fw-bold"
                                disabled={store?.createStockInReducer?.loading}
                                style={{ width: '100px' }}
                            >
                                {store?.createStockInReducer?.loading ? (
                                    <ButtonLoading color="white" />
                                ) : 'Submit'}
                            </Button>
                        </div>
                    }
                </div>
            </Form>
            <AddProductModal
                openingProducts={openingProducts}
                setOpeningProducts={setOpeningProducts}
                showModal={showModal}
                handleClose={handleClose}
                productData={productData}
                stockId={stockId}
                selectedWarehouse={selectedWarehouse?.value}
                Type={modalType}
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
                        <Button className='custom-button' onClick={handleDelete}>
                            Delete
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div >
    )
}

export default AddStockIn