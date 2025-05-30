import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Modal, Row } from 'react-bootstrap';
import { IoIosAdd } from "react-icons/io";
import PageTitle from '../../../helpers/PageTitle';
import { AiOutlineEdit } from "react-icons/ai";
import { RiDeleteBinLine } from "react-icons/ri";
import AddWarehouseModal from './modal/AddWarehouseModal';
import { getWarehouseActions, deleteWarehouseActions } from '../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { MdDeleteOutline } from "react-icons/md";
import Pagination from '../../../helpers/Pagination';
import { Loading } from '../../../helpers/loader/Loading';

const Warehouse = () => {
    const dispatch = useDispatch();
    const [showConfirm, setShowConfirm] = useState(false);
    const [warehouseToDelete, setWarehouseToDelete] = useState(null);
    const [search, setSearch] = useState('')
    const totalRecords = '0';
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(Math.ceil(totalRecords / pageSize));
    const store = useSelector((state) => state);
    const createResponse = store?.createWarehouseReducer?.warehouseData?.status;
    const updateResponse = store?.updateWarehouseReducer?.warehouseUpdate?.status;
    const deleteResponse = store?.deleteWarehouseReducer?.warehouseDelete?.status;

    useEffect(() => {
        if (createResponse === 200 || updateResponse === 200 || deleteResponse === 200) {
            dispatch(getWarehouseActions({
                limit: pageSize,
                page: pageIndex,
                search: search,
                stockFilter: true
            }));
        }
    }, [createResponse, updateResponse, deleteResponse]);


    const [showWarehouseModal, setShowWarehouseModal] = useState({
        data: null,
        type: null,
        status: false
    })

    useEffect(() => {
        setTotalPages(Math.ceil(totalRecords / pageSize));
    },
        [totalRecords, pageSize]);

    const handleWarehouseModal = (warehouseDetails, modalType, modalStatus) => {
        setShowWarehouseModal({ ...showWarehouseModal, data: warehouseDetails, type: modalType, status: modalStatus })
    }

    const handleClose = () => setShowWarehouseModal({ ...showWarehouseModal, data: null, status: false });

    const handleDelete = () => {
        dispatch(deleteWarehouseActions({ warehouseId: warehouseToDelete }));
        setShowConfirm(false);
    };

    const { warehouseList } = useSelector((state) => state?.getWarehouseReducer);
    const warehouseData = warehouseList?.response || [];
    useEffect(() => {
        dispatch(getWarehouseActions({
            limit: pageSize,
            page: pageIndex,
            search: search,
            stockFilter: true
        }));
    }, [dispatch, search, pageSize, pageIndex]);

    return (
        <div>
            <PageTitle
                breadCrumbItems={[
                    { label: "SHIVAY Warehouse List", path: "/shivay/warehouse" },
                    { label: "Warehouse List", path: "/shivay/warehouse", active: true },
                ]}
                title={"Warehouse List"}
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
                                onChange={(e) => setSearch(e.target.value.trim())}
                            />
                            <Button className="mt-2 fw-bold custom-button" onClick={() => handleWarehouseModal(null, 'Add', true)}>
                                <IoIosAdd className="fs-3" />&nbsp;Warehouse
                            </Button>
                        </div>
                    </Col>

                    <div className='mt-2'>
                        <Card
                            style={{ boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset' }}
                        >
                            <Card.Body className=" py-1">
                                <div className='table-responsive'>
                                    <table className="table table-striped bg-white mb-0">
                                        <thead>
                                            <tr className="table_header">
                                                <th scope="col">#</th>
                                                <th scope="col">Warehouse Name</th>
                                                <th scope="col">Location</th>
                                                <th scope="col">Address</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                        </thead>
                                        {store?.getWarehouseReducer?.loading ? (
                                            <tr>
                                                <td className='text-center' colSpan={6}>
                                                    <Loading />
                                                </td>
                                            </tr>
                                        ) : (
                                            <tbody>
                                                {warehouseData?.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={6} className='text-center'>
                                                            <p className='my-5 py-5 '>No Warehouse Added Yet.</p>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    warehouseData?.map((data, index) => (
                                                        <tr key={index} className="text-dark  text-nowrap highlight-row">
                                                            <td className='font_work'>{(pageIndex - 1) * pageSize + index + 1}</td>
                                                            <td className="text-capitalize font_work ">
                                                                {data?.name || <span className="text-danger">-</span>}
                                                            </td>
                                                            <td className="text-capitalize font_work">
                                                                {data?.locationId?.name || <span className="text-danger">-</span>}
                                                            </td>
                                                            <td className="text-capitalize font_work" title={data.address}>
                                                                {data?.address
                                                                    ? `${data.address.slice(0, 25)}${data.address.length > 25 ? '...' : ''}`
                                                                    : <span className="text-danger">-</span>}
                                                            </td>
                                                            <td>
                                                                <span
                                                                    className="icon-wrapper"
                                                                    title="Edit"
                                                                    onClick={() => handleWarehouseModal(data, 'Edit', true)}
                                                                >
                                                                    <AiOutlineEdit className="fs-4"
                                                                        style={{ cursor: 'pointer' }}
                                                                    />
                                                                </span>
                                                                <span className="icon-wrapper" title="Delete" onClick={() => { setWarehouseToDelete(data?._id); setShowConfirm(true); }}>
                                                                    <RiDeleteBinLine className="fs-4" style={{ cursor: 'pointer' }} />
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    )))}
                                            </tbody>
                                        )}
                                    </table>
                                </div>
                                <Pagination
                                    pageIndex={pageIndex}
                                    pageSize={pageSize}
                                    totalPages={useSelector((state) => state?.getWarehouseReducer?.warehouseList?.totalPages)}
                                    setPageIndex={setPageIndex}
                                    onChangePageSize={setPageSize}
                                />
                            </Card.Body>
                        </Card>
                    </div>
                </Row>
            </Form>

            <AddWarehouseModal showModal={showWarehouseModal?.status} handleClose={handleClose} warehouseData={showWarehouseModal} />

            {/* delete modal */}
            <Modal show={showConfirm} onHide={() => setShowConfirm(false)} >
                <Modal.Body className='text-center'>
                    <h4 className='text-black'>Confirm Deletion</h4>
                    <p className='mt-2 mb-3'> Are you sure you want to delete this warehouse?</p>
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
    );
};

export default Warehouse;
