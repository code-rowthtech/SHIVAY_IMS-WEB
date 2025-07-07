import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Modal, Row } from 'react-bootstrap';
import { IoIosAdd } from 'react-icons/io';
import { AiOutlineEdit } from 'react-icons/ai';
import { RiDeleteBinLine } from 'react-icons/ri';
import PageTitle from '../../../helpers/PageTitle';
import { useDispatch, useSelector } from 'react-redux';
import { deleteDispatchActions, getDispatchListActions } from '../../../redux/actions';
import { MdDeleteOutline } from 'react-icons/md';
import Pagination from '../../../helpers/Pagination';
import { Loading } from '../../../helpers/loader/Loading';
import AddDispatchModal from './addDispatch/AddDispatchModal';
import EditDispatchModal from './editDispatch/EditDispatchModal';
import { useNavigate } from 'react-router-dom';
import { getUserFromSession } from '../../../helpers/api/apiCore';

const Dispatch = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [dispatchToDelete, setDispatchToDelete] = useState(null);
    const totalRecords = '0';
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalPages, setTotalPages] = useState(Math.ceil(totalRecords / pageSize));
    const store = useSelector((state) => state);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState(null);

    const DispatchData = store?.getDispatchDataReducer?.dispatchList?.response;
    console.log(DispatchData, 'DispatchData');
    const deleteResponse = store?.deleteDispatchReducer?.deleteDispatch?.status;
    const UpdateResponse = store?.updateDispatchReducer?.updateDispatch?.status;
    const CreateResponse = store?.createDispatchReducer?.createDispatch?.status;
    const Role = getUserFromSession()?.user?.role?.name;

    console.log(Role, 'Role');

    useEffect(() => {
        dispatch(
            getDispatchListActions({
                limit: pageSize,
                page: pageIndex,
                search: search,
            })
        );
    }, [dispatch, search, pageSize, pageIndex]);

    const handleDelete = () => {
        dispatch(deleteDispatchActions({ _id: dispatchToDelete }));
        setShowConfirm(false);
    };

    useEffect(() => {
        if (deleteResponse === 200 || UpdateResponse === 200 || CreateResponse === 200) {
            dispatch(
                getDispatchListActions({
                    limit: pageSize,
                    page: pageIndex,
                    search: search,
                })
            );
        }
    }, [deleteResponse, UpdateResponse, CreateResponse]);

    useEffect(() => {
        setTotalPages(Math.ceil(totalRecords / pageSize));
    }, [totalRecords, pageSize]);

    return (
        <div>
            <PageTitle
                breadCrumbItems={[
                    { label: 'SHIVAY Dispatch List', path: '/shivay/dispatch' },
                    { label: 'Dispatch List', path: '/shivay/dispatch', active: true },
                ]}
                title={'Dispatch List'}
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
                            <Button className="mt-2 fw-bold custom-button" onClick={() => setShowAddModal(true)}>
                                <IoIosAdd className="fs-3" />
                                &nbsp;Add
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

                                                <th scope="col">Customer Name</th>
                                                <th scope="col">Dispatch by</th>
                                                <th scope="col">Control No.</th>
                                                <th scope="col">GR Number</th>
                                                <th scope="col">Warehouse</th>
                                                <th scope="col">Location</th>
                                                <th scope="col">Date</th>
                                                <th scope="col" style={{ whiteSpace: 'nowrap' }}>
                                                    No. of Products
                                                </th>
                                                {Role === 'admin' && (
                                                    <>
                                                        <th scope="col">Last Updated By </th>
                                                        <th scope="col">User Email</th>
                                                    </>
                                                )}
                                                <th scope="col">Action</th>
                                            </tr>
                                        </thead>

                                        {store?.getDispatchDataReducer?.loading ? (
                                            <tr>
                                                <td className="text-center" colSpan={10}>
                                                    <Loading />
                                                </td>
                                            </tr>
                                        ) : (
                                            <tbody>
                                                {DispatchData?.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={10} className="text-center">
                                                            <p className="my-5 py-5 ">No data found in dispatch.</p>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    DispatchData?.map((data, index) => (
                                                        <tr
                                                            key={index}
                                                            className="text-dark  text-nowrap highlight-row">
                                                            <td className="font_work">
                                                                {(pageIndex - 1) * pageSize + index + 1}
                                                            </td>

                                                            <td
                                                                className="text-capitalize font_work"
                                                                title={data?.customerData?.[0]?.name || ''}>
                                                                {data?.customerData?.[0]?.name ? (
                                                                    data.customerData[0].name.length > 25 ? (
                                                                        `${data.customerData[0].name.slice(0, 25)}...`
                                                                    ) : (
                                                                        data.customerData[0].name
                                                                    )
                                                                ) : (
                                                                    <span className="text-black">-</span>
                                                                )}
                                                            </td>
                                                            <td className="text-capitalize font_work ">
                                                                {data?.dispatchByData?.[0]?.name || (
                                                                    <span className="text-black">-</span>
                                                                )}
                                                            </td>
                                                            <td className=" font_work ">
                                                                {data?.controlNumber || (
                                                                    <span className="text-black">-</span>
                                                                )}
                                                            </td>
                                                            <td className="font_work ">
                                                                {data?.grNumber || (
                                                                    <span className="text-black">-</span>
                                                                )}
                                                            </td>
                                                            <td className="text-capitalize font_work ">
                                                                {data?.warehouseData?.[0]?.name || (
                                                                    <span className="text-black">-</span>
                                                                )}
                                                            </td>
                                                            <td className="text-capitalize font_work">
                                                                {data?.customerData?.[0]?.location || (
                                                                    <span className="text-black">-</span>
                                                                )}
                                                            </td>
                                                            <td className="font_work">
                                                                {data?.createdAt ? (
                                                                    new Date(data?.createdAt).toLocaleDateString(
                                                                        'en-GB'
                                                                    )
                                                                ) : (
                                                                    <span className="text-black">-</span>
                                                                )}
                                                            </td>
                                                            <td className="font_work">
                                                                {data?.totalDispatchProductCount || (
                                                                    <span className="text-black">-</span>
                                                                )}
                                                            </td>
                                                            {Role === 'admin' && (
                                                                <>
                                                                    <td className="text-capitalize font_work">
                                                                        {data?.userName}
                                                                    </td>
                                                                    <td className="text-capitalize font_work">
                                                                        {data?.userEmail}
                                                                    </td>
                                                                </>
                                                            )}
                                                            <td>
                                                                <span
                                                                    className="icon-wrapper "
                                                                    title="Edit"
                                                                    // onClick={() => {
                                                                    //     setShowEditModal(true);
                                                                    //     setEditData(data?._id);
                                                                    // }}
                                                                    //  >

                                                                    onClick={() => {
                                                                        navigate('editDispatchPage', {
                                                                            state: { editData: data }, // pass whole object
                                                                        });
                                                                    }}>
                                                                    {/* onClick={navigate(`/dispatches/edit/${stockId}`);} */}

                                                                    <AiOutlineEdit
                                                                        className="fs-4 "
                                                                        style={{ cursor: 'pointer' }}
                                                                    />
                                                                </span>
                                                                <span
                                                                    className="icon-wrapper"
                                                                    title="Delete"
                                                                    onClick={() => {
                                                                        setDispatchToDelete(data?._id);
                                                                        setShowConfirm(true);
                                                                    }}>
                                                                    <RiDeleteBinLine
                                                                        className="fs-4 "
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
                                        (state) => state?.getDispatchDataReducer?.dispatchList?.totalPages
                                    )}
                                    setPageIndex={setPageIndex}
                                    onChangePageSize={setPageSize}
                                />
                            </Card.Body>
                        </Card>
                    </div>
                </Row>
            </Form>

            {/* delete modal */}
            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Body className="text-center">
                    <h4 className="text-black">Confirm Deletion</h4>
                    <p className="mt-2 mb-3"> Are you sure you want to delete this Dispatch?</p>
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

            {/* Add Dispatch Modal */}

            <AddDispatchModal show={showAddModal} onHide={() => setShowAddModal(false)} />

            {/* Edit Dispatch modal */}
            <EditDispatchModal show={showEditModal} onHide={() => setShowEditModal(false)} stockId={editData} />
        </div>
    );
};

export default Dispatch;
