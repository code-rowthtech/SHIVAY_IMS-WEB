import React, { useEffect, useState } from 'react';
import PageTitle from '../../../helpers/PageTitle';
import { AiOutlineEdit } from 'react-icons/ai';
import { RiDeleteBinLine } from 'react-icons/ri';
import { Button, Card, Col, Form, Modal, Row } from 'react-bootstrap';
import { IoIosAdd } from 'react-icons/io';
import AddSupplierModal from './modal/AddSupplierModal';
import { deleteSupplierActions, getSupplierListActions } from '../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { MdDeleteOutline } from 'react-icons/md';
import Pagination from '../../../helpers/Pagination';
import { Loading } from '../../../helpers/loader/Loading';

const Supplier = () => {
    const dispatch = useDispatch();
    const [supplierToDelete, setSupplierToDelete] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [search, setSearch] = useState('');
    const totalRecords = '0';
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalPages, setTotalPages] = useState(Math.ceil(totalRecords / pageSize));
    const store = useSelector((state) => state);

    const SupplierData = store?.supplierListReducer?.supplierList?.data;
    const createResponse = store?.createSupplierReducer?.createSupplier?.status;
    const updateResponse = store?.updateSupplierReducer?.updateSupplier?.status;
    const deleteResponse = store?.deleteSupplierReducer?.deleteSupplier?.status;

    useEffect(() => {
        dispatch(
            getSupplierListActions({
                limit: pageSize,
                page: pageIndex,
                search: search,
            })
        );
    }, [dispatch, search, pageSize, pageIndex]);

    useEffect(() => {
        if (createResponse === 200 || updateResponse === 200 || deleteResponse === 200) {
            dispatch(
                getSupplierListActions({
                    limit: pageSize,
                    page: pageIndex,
                    search: search,
                })
            );
        }
    }, [createResponse, updateResponse, deleteResponse]);

    const handleDelete = () => {
        dispatch(deleteSupplierActions({ supplierId: supplierToDelete }));
        setShowConfirm(false);
    };

    const [showSupplierModal, setShowSupplierModal] = useState({
        data: null,
        type: null,
        status: false,
    });

    useEffect(() => {
        setTotalPages(Math.ceil(totalRecords / pageSize));
    }, [totalRecords, pageSize]);

    const handleSupplierModal = (supplierDetails, modalType, modalStatus) => {
        setShowSupplierModal({ ...showSupplierModal, data: supplierDetails, type: modalType, status: modalStatus });
    };
    const handleClose = () => {
        setShowSupplierModal({ ...showSupplierModal, data: null, status: false });
    };

    return (
        <div>
            <PageTitle
                breadCrumbItems={[
                    { label: 'SHIVAY Supplier List', path: '/shivay/supplier' },
                    { label: 'Supplier List', path: '/shivay/supplier', active: true },
                ]}
                title={'Supplier List'}
            />

            <Form>
                <Row>
                    <Col sm={12}>
                        <div className="d-flex justify-content-end mt-1">
                            <input
                                type="text"
                                className="form-control w-auto me-2"
                                style={{ height: '42px', marginTop: '10px' }}
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button
                                className="mt-2 fw-bold custom-button"
                                onClick={() => handleSupplierModal(null, 'Add', true)}>
                                <IoIosAdd className="fs-3" />
                                &nbsp;Supplier
                            </Button>
                        </div>
                    </Col>

                    <div className="mt-2">
                        <Card
                            style={{
                                boxShadow:
                                    'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset',
                            }}>
                            <Card.Body className=" py-1">
                                <div className="table-responsive">
                                    <table className="table table-striped bg-white mb-0">
                                        <thead>
                                            <tr className="table_header">
                                                <th scope="col">#</th>
                                                <th scope="col">Supplier Name</th>
                                                <th scope="col">Location</th>
                                                <th scope="col">Address</th>
                                                <th scope="col">Phone no.</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                        </thead>
                                        {store?.supplierListReducer?.loading ? (
                                            <tr>
                                                <td className="text-center" colSpan={6}>
                                                    <Loading />
                                                </td>
                                            </tr>
                                        ) : (
                                            <tbody>
                                                {SupplierData?.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={6} className="text-center">
                                                            <p className="my-5 py-5 ">No supplier found.</p>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    SupplierData?.map((data, index) => (
                                                        <tr
                                                            key={index}
                                                            className="text-dark  text-nowrap highlight-row">
                                                            <td className="font_work">
                                                                {(pageIndex - 1) * pageSize + index + 1}
                                                            </td>
                                                            <td className="text-capitalize font_work ">
                                                                {data?.name || <span className="text-black">-</span>}
                                                            </td>
                                                            <td className="text-capitalize">
                                                                {data?.location || (
                                                                    <span className="text-black">-</span>
                                                                )}
                                                            </td>
                                                            <td
                                                                className="text-capitalize font_work"
                                                                title={data?.address}>
                                                                {data?.address ? (
                                                                    `${data.address.slice(0, 30)}${
                                                                        data.address.length > 30 ? '...' : ''
                                                                    }`
                                                                ) : (
                                                                    <span className="text-black">-</span>
                                                                )}
                                                            </td>
                                                            <td className=" font_work ">
                                                                {data?.phoneNumber || (
                                                                    <span className="text-black">-</span>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <span className="icon-wrapper" title="Edit">
                                                                    <AiOutlineEdit
                                                                        className="fs-4"
                                                                        style={{ cursor: 'pointer' }}
                                                                        onClick={() =>
                                                                            handleSupplierModal(data, 'Edit', true)
                                                                        }
                                                                    />
                                                                </span>
                                                                <span
                                                                    className="icon-wrapper"
                                                                    title="Delete"
                                                                    onClick={() => {
                                                                        setSupplierToDelete(data?._id);
                                                                        setShowConfirm(true);
                                                                    }}>
                                                                    <RiDeleteBinLine
                                                                        className="fs-4"
                                                                        style={{ cursor: 'pointer' }}
                                                                    />
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        )}
                                    </table>
                                </div>
                                <Pagination
                                    pageIndex={pageIndex}
                                    pageSize={pageSize}
                                    totalPages={useSelector(
                                        (state) => state?.supplierListReducer?.supplierList?.totalPages
                                    )}
                                    setPageIndex={setPageIndex}
                                    onChangePageSize={setPageSize}
                                />
                            </Card.Body>
                        </Card>
                    </div>
                </Row>
            </Form>
            <AddSupplierModal
                showModal={showSupplierModal?.status}
                handleClose={handleClose}
                SupplierData={showSupplierModal}
            />

            {/* delete modal */}
            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Body className="text-center">
                    <h4 className="text-black">Confirm Deletion</h4>
                    <p className="mt-2 mb-3"> Are you sure you want to delete this Supplier?</p>
                    <span className="bg-light rounded-circle p-3 ">
                        <MdDeleteOutline className="fs-1  text-danger" />
                    </span>
                    <div className="d-flex justify-content-center mt-3 gap-2">
                        <Button className="cancel-button" onClick={() => setShowConfirm(false)}>
                            Cancel
                        </Button>
                        <Button className="custom-button" onClick={handleDelete}>
                            Delete
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Supplier;
