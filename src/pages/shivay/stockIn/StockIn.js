import React, { useEffect, useState } from 'react'
import PageTitle from '../../../helpers/PageTitle'
import { Button, Card, Col, Form, Modal, Row } from 'react-bootstrap'
import { AiOutlineEdit } from 'react-icons/ai';
import { RiDeleteBinLine } from 'react-icons/ri';
import { IoIosAdd } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteStockInActions, getStockInListActions } from '../../../redux/actions';
import { MdDeleteOutline } from 'react-icons/md';
import Pagination from '../../../helpers/Pagination';
import { Loading } from '../../../helpers/loader/Loading';

const StockIn = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [search, setSearch] = useState('')
  const store = useSelector((state) => state);
  const [stockToDelete, setStockToDelete] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const totalRecords = '0';
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(Math.ceil(totalRecords / pageSize));

  const StockInData = store?.stockInListReducer?.stockInList?.response;
  const deleteResponse = store?.deleteStockInReducer?.deleteStockIn?.status;
  console.log(StockInData, 'StockInDataStockInDataStockInData')
  useEffect(() => {
    dispatch(getStockInListActions({
      limit: pageSize,
      page: pageIndex,
      search: search,
    }));
  }, [dispatch, search, pageSize, pageIndex]);

  useEffect(() => {
    if (deleteResponse === 200) {
      dispatch(getStockInListActions({
        limit: pageSize,
        page: pageIndex,
        search: search,
      }));
    }
  }, [deleteResponse]);

  useEffect(() => {
    setTotalPages(Math.ceil(totalRecords / pageSize));
  },
    [totalRecords, pageSize]);

  const handleDelete = () => {
    dispatch(deleteStockInActions({ stockInId: stockToDelete }));
    setShowConfirm(false);
  };

  return (
    <div>
      <PageTitle
        breadCrumbItems={[
          { label: "SHIVAY Stock In List", path: "/shivay/stockIn" },
          { label: "Stock In List", path: "/shivay/stockIn", active: true },
        ]}
        title={"Stock In List"}
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
              <Button className="mt-2 fw-bold custom-button"
                // onClick={handleShow}
                onClick={() => {
                  navigate('/shivay/addStockIn')
                }}
              >
                <IoIosAdd className="fs-3" />&nbsp;Stock In
              </Button>
            </div>
          </Col>

          <div className='mt-2'>
            <Card
              style={{ boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset' }}
            >
              <Card.Body className="text-center py-1">
                <table className="table table-striped bg-white mb-0">
                  <thead>
                    <tr className="table_header">
                      <th scope="col"><i className="mdi mdi-merge"></i></th>
                      <th scope="col">Supplier</th>
                      <th scope="col">Control No.</th>
                      <th scope="col">Warehouse</th>
                      <th scope="col">Date</th>
                      <th scope="col">No. of Products</th>
                      <th scope="col">Invoice Number</th>
                      {/* <th scope="col">Action</th> */}
                    </tr>
                  </thead>
                  {store?.stockInListReducer?.loading ? (
                    <tr>
                      <td className='text-center' colSpan={6}>
                        <Loading />
                      </td>
                    </tr>
                  ) : (
                    <tbody>
                      {StockInData?.length === 0 ? (
                        <tr>
                          <td colSpan={6} className='text-center'>
                            <p className='my-5 py-5 '>No data found in Stock In.</p>
                          </td>
                        </tr>
                      ) : (
                        StockInData?.map((data, index) => (
                          <tr key={index} className="text-dark fw-bold text-nowrap highlight-row">
                            <th scope="row">{index + 1}</th>
                            <td className="text-uppercase fw-bold ">
                              {data?.supplierData?.[0]?.name || <span className="text-black">-</span>}
                            </td>
                            <td className="fw-bold">
                              {data?.controlNumber || <span className="text-black">-</span>}
                            </td>
                            <td className="fw-bold">
                              {data?.warehouseData?.[0]?.name || <span className="text-black">-</span>}
                            </td>
                            <td className="fw-bold">
                              {data?.createdAt ? (
                                new Date(data?.createdAt).toLocaleDateString('en-GB')
                              ) : (
                                <span className="text-black">-</span>
                              )}
                            </td>
                            <td className="fw-bold">
                              {data?.totalStockInProductCount || <span className="text-black">-</span>}
                            </td>
                            <td className="fw-bold">
                              {data?.invoiceNumber || <span className="text-black">-</span>}
                            </td>
                            <td></td>
                            <td></td>
                            <div className="icon-container d-flex  pb-0" >
                              {/* <span className="icon-wrapper" title="View">
                            <PiEye className="fs-4 text-black" style={{ cursor: 'pointer' }} />
                          </span> */}
                              <span className="icon-wrapper" title="Edit">
                                <AiOutlineEdit onClick={() => navigate(`/shivay/addStockIn?id=${data?._id}`)} className="fs-4 text-black" style={{ cursor: 'pointer' }} />
                              </span>
                              <span className="icon-wrapper" title="Delete" onClick={() => { setStockToDelete(data?._id); setShowConfirm(true); }}>
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
                  totalPages={useSelector((state) => state?.stockInListReducer?.stockInList?.totalPages)}
                  setPageIndex={setPageIndex}
                  onChangePageSize={setPageSize}
                />
              </Card.Body>
            </Card>
          </div>
        </Row>
      </Form>

      {/* delete modal */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} >
        <Modal.Body className='text-center'>
          <h4 className='text-black'>Confirm Deletion</h4>
          <p className='mt-2 mb-3'> Are you sure you want to delete this Stock?</p>
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

export default StockIn