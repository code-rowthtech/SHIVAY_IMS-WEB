import React, { useEffect, useRef, useState } from 'react'
import PageTitle from '../../../../helpers/PageTitle'
import { Button, Card, Col, Form, Modal, Row } from 'react-bootstrap'
import Select from 'react-select';
import { IoIosAdd } from 'react-icons/io';
import { AiOutlineEdit } from 'react-icons/ai';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { createDispatchActions, deleteDispatchProductActions, getDispatchByIdActions, getWarehouseListActions, listingCustomerActions, listingUsersActions, updateDispatchActions } from '../../../../redux/actions';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CgCloseO } from "react-icons/cg";
import { HiOutlineFolderDownload } from "react-icons/hi";
import { ButtonLoading } from '../../../../helpers/loader/Loading';
import AddProductModal from './AddProductModal';
import { MdDeleteOutline } from 'react-icons/md';

const AddDispatch = () => {
    const [searchParams] = useSearchParams();
    const stockId = searchParams.get('id')
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { handleSubmit, register, setValue, resetField } = useForm()
    const [showModal, setShowModal] = useState(false);
    const store = useSelector((state) => state)
    const [today, setToday] = useState(new Date().toISOString().split('T')[0]);
    const [attachmentType, setAttachmentType] = useState("");
    const fileInputRef = useRef();
    const [openingProducts, setOpeningProducts] = useState([])
    console.log(openingProducts, 'openingProducts')
    const DispatchData = store?.getDispatchDataReducer?.dispatchList?.response;
    console.log(DispatchData, 'DispatchData')
    const Warehouse = store?.getWarehouseListReducer?.searchWarehouse?.response;
    const UsersList = store?.listingUsersReducer?.listingUsers?.response;
    const CustomerList = store?.listingCustomerReducer?.listingCustomer?.response;
    const warehouseOptions = Warehouse?.map((warehouse) => ({
        value: warehouse._id,
        label: warehouse.name,
    }));

    const usersOptions = UsersList?.map((users) => ({
        value: users._id,
        label: users.name,
    }));

    const customerOptions = CustomerList?.map((customer) => ({
        value: customer._id,
        label: customer.name,
    }));

    // State to handle selected warehouse
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    console.log(selectedWarehouse, 'selectedWarehouse')
    const [selectedUser, setSelectedUser] = useState({
        value: null,
        label: null
    });
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    const [selectedStock, setSelectedStock] = useState(null);
    const [productToDelete, setProductToDelete] = useState(null);
    const [modalType, setModalType] = useState(null)
    const [productData, setProductData] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [editedQuantity, setEditedQuantity] = useState('');
    const inputRef = useRef(null);
    const createResponse = store?.createDispatchReducer?.createDispatch?.status;
    const DispatchProductData = store?.dispatchByIdReducer?.dispatchById?.response;
    const CreateProductResponse = store?.createDispatchProductReducer?.createDispatchProduct?.status;
    const DeleteProductResponse = store?.deleteDispatchProductReducer?.deleteStockProduct?.status;
    const UpdateProductResponse = store?.updateDispatchProductReducer?.updateStockProduct?.status;

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

    const handleQuantityChange = (e) => {
        setEditedQuantity(e.target.value);
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSave();
        }
    };
    // console.log(selectedStock, 'selectedStock34534r')

    useEffect(() => {
        if (createResponse === 200) {
            navigate("/shivay/dispatch");
        }
    }, [createResponse]);

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

    useEffect(() => {
        if (stockId && DispatchData?.length > 0) {
            const foundStock = DispatchData?.find(item => item._id === stockId);
            setSelectedStock(foundStock);
        }
    }, [stockId, DispatchData]);

    useEffect(() => {
        if (stockId && DispatchProductData) {
            setToday(DispatchProductData?.[0]?.createdAt ? new Date(DispatchProductData?.[0]?.createdAt).toISOString().split('T')[0] : '')
            const updateWarehouses = DispatchProductData?.[0]?.warehouseData
                ? { value: DispatchProductData?.[0].warehouseId, label: DispatchProductData?.[0].warehouseData?.find((ele) => ele?._id === DispatchProductData?.[0]?.warehouseId)?.name }
                : {};
            setSelectedWarehouse(updateWarehouses)

            const updatedUser = DispatchProductData?.[0]?.customerData ? { value: DispatchProductData?.[0]?.customerId, label: DispatchProductData?.[0].customerData?.find((ele) => ele?._id === DispatchProductData?.[0]?.customerId)?.name }
                : {}
            setSelectedCustomer(updatedUser)

            setSelectedUser({ ...selectedUser, value: DispatchProductData?.[0]?.dispatchBy, label: DispatchProductData?.[0].dispatchByData?.[0]?.name })

            setValue('invoiceNumber', DispatchProductData?.[0]?.invoiceNumber || '');
            setValue('description', DispatchProductData?.[0]?.description || '');
            setValue('invoiceValue', DispatchProductData?.[0]?.fright || '');
            setValue('attachmentGRfile', DispatchProductData?.[0]?.attachmentGRfile || '');
            setValue('invoiceAttachment', DispatchProductData?.[0]?.invoiceAttachment || '');
            setValue('grNumber', DispatchProductData?.[0]?.grNumber || '');
            setEditedQuantity(DispatchProductData?.[0]?.productData?.[0]?.stockOutQty || '');
            setAttachmentType(DispatchProductData?.[0]?.invoiceAttachmentType || '')
        }

    }, [stockId, DispatchProductData])

    const handleAccordionToggle = () => {
        setIsAccordionOpen(prevState => !prevState);
    };
    const handleWarehouseChange = (selectedOption) => {
        setSelectedWarehouse(selectedOption);
    };

    const handleUserChange = (selectedUser) => {
        setSelectedUser(selectedUser);
    };

    const handleCustomerChange = (selectedCustomer) => {
        setSelectedCustomer(selectedCustomer);
    };

    useEffect(() => {
        dispatch(getWarehouseListActions());
    }, [dispatch]);

    useEffect(() => {
        dispatch(listingUsersActions());
    }, [dispatch]);

    useEffect(() => {
        dispatch(listingCustomerActions());
    }, [dispatch]);

    useEffect(() => {
        if (stockId) {
            dispatch(getDispatchByIdActions(stockId));
        }
    }, [dispatch, stockId]);

    useEffect(() => {
        if (CreateProductResponse === 200 || DeleteProductResponse === 200 || UpdateProductResponse === 200) {
            dispatch(getDispatchByIdActions(stockId));
        }
    }, [CreateProductResponse, DeleteProductResponse, UpdateProductResponse]);

    const onSubmit = (data) => {

        const cleanedProducts = openingProducts.map(({ product, ...rest }) => rest);

        const formData = new FormData();
        if (data?.attachmentGRfile?.[0] instanceof File) {
            formData.append('attachmentGRfile', data.attachmentGRfile[0] || DispatchProductData?.[0]?.attachmentGRfile);
        }
        if (data?.invoiceAttachment?.[0] instanceof File) {
            formData.append('invoiceAttachment', data.invoiceAttachment?.[0] || DispatchProductData?.[0]?.invoiceAttachment);
        }

        formData.append('warehouseId', selectedWarehouse?.value)
        formData.append('dispatchBy', selectedUser?.value);
        formData.append('customerId', selectedCustomer?.value);
        formData.append('description', data?.description);
        formData.append('date', data?.date);
        formData.append('grNumber', data?.grNumber);
        formData.append('invoiceAttachmentType', attachmentType);
        formData.append('productDispatchQty', stockId ? JSON.stringify([]) : JSON.stringify(cleanedProducts));

        if (stockId) {
            formData.append('newProductArr', JSON.stringify([]));
            formData.append('dispatchId', stockId);

        }
        // if (stockId) {
        //     formData.append('_id', stockId);
        //     formData.append('productId', selectedStock?.productData?.[0]?._id)
        // }
        if (stockId) {
            dispatch(updateDispatchActions(formData))
        } else {
            dispatch(createDispatchActions(formData));
        }
        // console.log(formData, 'formData');
    };

    const handleDelete = () => {
        dispatch(deleteDispatchProductActions({ dispatchProductId: productToDelete }));
        setShowConfirm(false);
    };

    return (
        <div>
            <PageTitle
                breadCrumbItems={[
                    { label: "SHIVAY Dispatch List", path: "/shivay/dispatch" },
                    { label: stockId ? "Edit Dispatch" : "Add Dispatch", path: "/shivay/dispatch", active: true },
                ]}
                title={stockId ? "Edit Dispatch" : "Add Dispatch"}
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
                                onClick={handleAccordionToggle}
                            >
                                <div className="flex-grow-1 text-black fw-bold"> {stockId ? "Edit" : "Add"} Dispatch Details</div>

                                <div className="d-flex">
                                    <Button
                                        className="fw-bold custom-button me-2"
                                        onClick={handleShow}
                                        disabled={!selectedWarehouse}
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
                                <Form>
                                    <Row>
                                        <Col sm={3}>
                                            <Form.Group className="mb-1">
                                                <Form.Label className='mb-0'>Warehouse {!stockId && <span className='text-danger'>*</span>}</Form.Label>
                                                <Select
                                                    value={selectedWarehouse}
                                                    onChange={handleWarehouseChange}
                                                    options={warehouseOptions}
                                                    placeholder="Select a warehouse"
                                                    isClearable
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col sm={3}>
                                            <Form.Group className="mb-1">
                                                <Form.Label className="mb-0">Customer {!stockId && <span className='text-danger'>*</span>}</Form.Label>
                                                <Select
                                                    value={selectedCustomer}
                                                    onChange={handleCustomerChange}
                                                    options={customerOptions}
                                                    placeholder="Select a Customer"
                                                    isClearable
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col sm={3}>
                                            <Form.Group className="mb-1">
                                                <Form.Label className="mb-0">Dispatch By {!stockId && <span className='text-danger'>*</span>}</Form.Label>
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
                                                <Form.Label className='mb-0'>Date Range</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    defaultValue={today}
                                                    {...register('date')}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col sm={3}>
                                            <Form.Group className="mb-1">
                                                <Form.Label className="mb-0">GR Number</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter Invoice Number"
                                                    {...register('grNumber')}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col sm={3}>
                                            <Form.Group className="mb-1">
                                                <Form.Label className="mb-0">Attach GR File {!stockId && <span className='text-danger'>*</span>}
                                                    {DispatchProductData?.[0]?.attachmentGRfile && (
                                                        <a
                                                            href={DispatchProductData?.[0]?.attachmentGRfile}
                                                            target="_blank"
                                                            title='Download GR File'
                                                            rel="noopener noreferrer"
                                                        >
                                                            <HiOutlineFolderDownload className='ms-1 fs-4' />
                                                        </a>
                                                    )}
                                                </Form.Label>
                                                <Form.Control
                                                    type="file"
                                                    placeholder="Upload file"
                                                    {...register('attachmentGRfile', {
                                                        required: !DispatchProductData?.[0]?.attachmentGRfile, // only require if no existing
                                                    })}
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
                                                    {DispatchProductData?.[0]?.invoiceAttachment && (
                                                        <a
                                                            href={DispatchProductData?.[0]?.invoiceAttachment}
                                                            target="_blank"
                                                            title='Download Attachment'
                                                            rel="noopener noreferrer"
                                                        // style={{position:'absolute', top:'20px'}}
                                                        >
                                                            <HiOutlineFolderDownload className='ms-1 fs-4' />
                                                        </a>
                                                    )}
                                                    {!stockId && <span className="text-danger"> *</span>}
                                                </Form.Label>

                                                {!attachmentType ? (
                                                    <Form.Select
                                                        className="mb-0"
                                                        // defaultValue=""
                                                        value={attachmentType}
                                                        onChange={handleAttachmentTypeChange}

                                                    >
                                                        <option value="">Select Attachment Type</option>
                                                        <option value="Invoice">Invoice</option>
                                                        <option value="Delivery Challan">Delivery Challan</option>
                                                    </Form.Select>
                                                ) : (
                                                    <div className="d-flex align-items-center gap-2">
                                                        <Form.Control
                                                            type="file"
                                                            placeholder="Upload file"
                                                            // required={!stockId}
                                                            {...register("invoiceAttachment")}
                                                        // ref={fileInputRef}
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
                                                <Form.Label className="mb-0">Description</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={1}
                                                    placeholder="Enter Description"
                                                    {...register('description')}
                                                />
                                            </Form.Group>
                                        </Col>

                                    </Row>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>

                {stockId &&
                    <div className="text-end">
                        {/* <Button
                                className="fw-bold cancel-button me-2"
                                onClick={() => navigate("/shivay/dispatch")}
                            >
                                Cancel
                            </Button> */}
                        <Button
                            type="submit"
                            className="custom-button fw-bold"
                            disabled={store?.updateDispatchReducer?.loading}
                            style={{ width: '100px' }}
                        >
                            {store?.updateDispatchReducer?.loading ? (
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
                                {!stockId &&
                                    <tbody>
                                        {openingProducts && openingProducts.length > 0 ? (
                                            openingProducts.map((data, index) => (
                                                <tr key={index} className="text-dark fw-bold text-nowrap highlight-row">
                                                    <th scope="row">{index + 1}</th>
                                                    <td className="text-uppercase fw-bold">
                                                        {data?.product?.name || <span className="text-danger">N/A</span>}
                                                    </td>
                                                    <td className="fw-bold">
                                                        {data?.product?.modelId?.name || <span className="text-danger">N/A</span>}
                                                    </td>
                                                    <td className="fw-bold">
                                                        {data?.product?.code || <span className="text-danger">N/A</span>}
                                                    </td>
                                                    <td className="fw-bold">
                                                        {data?.quantity || <span className="text-danger">N/A</span>}
                                                    </td>
                                                    <td></td>
                                                    {/* <td></td> */}
                                                    <div className="icon-container d-flex pb-0">
                                                        {/* <span className="icon-wrapper" title="Edit">
                                                            <AiOutlineEdit className="fs-4 text-black" style={{ cursor: 'pointer' }} />
                                                        </span> */}
                                                        <span className="icon-wrapper" title="Delete">
                                                            <RiDeleteBinLine className="fs-4 text-black" style={{ cursor: 'pointer' }} />
                                                        </span>
                                                    </div>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center text-danger py-3">
                                                    Note : No products added yet. Please select a warehouse and add products to add dispatch.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                }
                                {stockId &&
                                    <tbody>
                                        {DispatchProductData?.[0]?.dispatchProducts?.map((data, index) => (
                                            <tr key={index} className="text-dark fw-bold text-nowrap highlight-row">
                                                <td>{index + 1}</td>
                                                <td>{data?.productData?.name}</td>
                                                <td>{data?.productData?.modelData?.[0]?.name || '-'}</td>
                                                <td>{data?.productData?.code || '-'}</td>
                                                <td className="fw-bold">
                                                    {data?.quantity || <span className="text-black">-</span>}
                                                </td>
                                                {/* <td>{data?.stockOutQty}</td> */}
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
                                        ))}
                                    </tbody>
                                }
                            </table>

                        </Card.Body>
                    </Card>
                    {!stockId &&
                        <div className="text-end">
                            <Button
                                className="fw-bold cancel-button me-2"
                                onClick={() => navigate("/shivay/dispatch")}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="custom-button fw-bold"
                                disabled={store?.createDispatchReducer?.loading}
                                style={{ width: '100px' }}
                            >
                                {store?.createDispatchReducer?.loading ? (
                                    <ButtonLoading color="white" />
                                ) : 'Submit'}
                            </Button>
                        </div>
                    }
                </div>
            </Form>

            <AddProductModal
                selectedWarehouse={selectedWarehouse}
                openingProducts={openingProducts}
                setOpeningProducts={setOpeningProducts}
                showModal={showModal}
                handleClose={handleClose}
                productData={productData}
                stockId={stockId}
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
        </div>
    )
}

export default AddDispatch