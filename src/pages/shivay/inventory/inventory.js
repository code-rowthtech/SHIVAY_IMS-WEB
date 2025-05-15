import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Modal, Row } from 'react-bootstrap'
import { IoIosAdd } from "react-icons/io";
import PageTitle from '../../../helpers/PageTitle';
import { AiOutlineEdit } from "react-icons/ai";
import AddProductModal from './modal/AddProductModal';
import { deleteProductActions, getProductListActions } from '../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RiDeleteBinLine } from 'react-icons/ri';
import { MdDeleteOutline } from 'react-icons/md';
import Pagination from '../../../helpers/Pagination';
import { Loading } from '../../../helpers/loader/Loading';

const Inventory = () => {

    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const totalRecords = '0';
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(Math.ceil(totalRecords / pageSize));
    const [search, setSearch] = useState('')
    const handleShow = () => setShowModal(true);
    const store = useSelector((state) => state)
    const ProductData = store?.productListReducer?.productList?.response;
    console.log(ProductData, 'ProductData')
    const createResponse = store?.createProductReducer?.createProduct?.status;
    const updateResponse = store?.updateProductReducer?.updateProduct?.status;
    const deleteResponse = store?.deleteProductReducer?.deleteProduct?.status;

    useEffect(() => {
        dispatch(getProductListActions({
            limit: pageSize,
            page: pageIndex,
            search: search,
            stockFilter: true,
        }));
    }, [dispatch, search, pageSize, pageIndex]);

    useEffect(() => {
        if (createResponse === 200 || updateResponse === 200 || deleteResponse === 200) {
            dispatch(getProductListActions({
                limit: pageSize,
                page: pageIndex,
                search: search,
                stockFilter: true,
            }));
        }
    }, [createResponse, updateResponse, deleteResponse]);

    const handleDelete = () => {
        dispatch(deleteProductActions({ productId: productToDelete }));
        setShowConfirm(false);
    };

    const [showProductModal, setShowProductModal] = useState({
        data: null,
        type: null,
        status: false
    })

    useEffect(() => {
        setTotalPages(Math.ceil(totalRecords / pageSize));
    },
        [totalRecords, pageSize]);

    const handleUserModal = (productDetails, modalType, modalStatus) => {
        setShowProductModal({ ...showProductModal, data: productDetails, type: modalType, status: modalStatus })
    }
    const handleClose = () => {
        setShowProductModal({ ...showProductModal, data: null, status: false })
    }

    return (
        <div>
            <PageTitle
                breadCrumbItems={[
                    { label: "SHIVAY Product List", path: "/shivay/inventory" },
                    { label: "Product", path: "/shivay/inventory", active: true },
                ]}
                title={"Products List"}
            />
            <Form>
                <Row>
                    <Col sm={12}>
                        <div className='d-flex justify-content-end mt-1'>
                            <input
                                type="text"
                                className="form-control w-auto me-2"
                                style={{ height: '42px', marginTop: '10px' }}
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button className="mt-2 fw-bold custom-button" onClick={() => handleUserModal(null, 'Add', true)}>
                                <IoIosAdd className="fs-3" />&nbsp;Product
                            </Button>
                        </div>
                    </Col>

                    <div className='mt-2'>
                        <Card
                            style={{ boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset' }}
                        >
                            <Card.Body className=" py-1">
                                <table className="table table-striped bg-white mb-0">
                                    <thead>
                                        <tr className="table_header">
                                            <th scope="col">#</th>
                                            <th scope="col">Product Name</th>
                                            <th scope="col">Model</th>
                                            <th scope="col">Code</th>
                                            <th scope="col">Qty</th>
                                        </tr>
                                    </thead>
                                    {store?.productListReducer?.loading ? (
                                        <tr>
                                            <td className='text-center' colSpan={6}>
                                                <Loading />
                                            </td>
                                        </tr>
                                    ) : (
                                        <tbody>
                                            {ProductData?.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className='text-center'>
                                                        <p className='my-5 py-5 '>No Products to show.</p>
                                                    </td>
                                                </tr>
                                            ) : (
                                                ProductData?.map((data, index) => (
                                                    <tr key={index} className="text-dark  text-nowrap highlight-row">
                                                        <td scope="row" className='font_work'>{index + 1}</td>
                                                        <td className="text-uppercase font_work ">
                                                            {data?.name || <span className="text-black">-</span>}
                                                        </td>
                                                        <td className="text-uppercase font_work ">
                                                            {data?.modelData?.name || <span className="text-black">-</span>}
                                                        </td>
                                                        <td className="text-uppercase font_work ">
                                                            {data?.code || <span className="text-black">-</span>}
                                                        </td>
                                                        <td className="text-uppercase font_work ">
                                                            {data?.quantity !== undefined ? data?.quantity : <span className="text-black">-</span>}
                                                        </td>
                                                        <td ></td>
                                                        <div className="icon-container d-flex  pb-0" >
                                                            <span className="icon-wrapper" title="Edit">
                                                                <AiOutlineEdit
                                                                    className="fs-4 text-black"
                                                                    style={{ cursor: 'pointer' }}
                                                                    onClick={() => handleUserModal(data, 'Edit', true)}
                                                                />
                                                            </span>
                                                            <span className="icon-wrapper" title="Delete" onClick={() => { setProductToDelete(data?._id); setShowConfirm(true); }}>
                                                                <RiDeleteBinLine className="fs-4 text-black" style={{ cursor: 'pointer' }} />
                                                            </span>
                                                        </div>
                                                    </tr>
                                                )))}
                                        </tbody>
                                    )}
                                </table>
                                <Pagination
                                    pageIndex={pageIndex}
                                    pageSize={pageSize}
                                    totalPages={useSelector((state) => state?.productListReducer?.productList?.totalPages)}
                                    setPageIndex={setPageIndex}
                                    onChangePageSize={setPageSize}
                                />
                            </Card.Body>
                        </Card>
                    </div>
                </Row>
            </Form>

            <AddProductModal showModal={showProductModal?.status} handleClose={handleClose} ProductData={showProductModal} />

            {/* delete modal */}
            <Modal show={showConfirm} onHide={() => setShowConfirm(false)} >
                <Modal.Body className='text-center'>
                    <h4 className='text-black'>Confirm Deletion</h4>
                    <p className='mt-2 mb-3'> Are you sure you want to delete this User?</p>
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

export default Inventory