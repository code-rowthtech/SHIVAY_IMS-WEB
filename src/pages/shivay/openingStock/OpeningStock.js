import React, { useEffect, useState } from 'react'
import PageTitle from '../../../helpers/PageTitle'
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { AiOutlineEdit } from 'react-icons/ai';
import { IoIosAdd } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getStockListActions } from '../../../redux/actions';
import Pagination from '../../../helpers/Pagination';
import { Loading } from '../../../helpers/loader/Loading';
import { useForm } from 'react-hook-form';
import AddStockModal from './addStock/AddStockModal';
import EditStockModal from './editStock/EditStockModal';

const OpeningStock = () => {

  const navigate = useNavigate();
  const { reset } = useForm()
  const dispatch = useDispatch();
  const [search, setSearch] = useState('')
  const totalRecords = '0';
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(Math.ceil(totalRecords / pageSize));
  const store = useSelector((state) => state);
  const OpeningStockData = store?.stockListReducer?.stockList?.response
  const NoStockData = store?.stockListReducer?.stockList;
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  console.log(OpeningStockData, 'OpeningStockData')
  const [editData, setEditData] = useState(null)
  const createResponse = store?.createStockReducer?.createStock?.status;
  const UpdateResponse = store?.updateStockReducer?.updateStock?.status;
  const DeleteProductResponse = store?.deleteStockProductReducer?.deleteStockProduct?.status;
  const CreateProductResponse = store?.createStockProductReducer?.createStockProduct?.status;
  const UpdateProductResponse = store?.updateStockProductReducer?.updateStockProduct?.status;

  useEffect(() => {
    dispatch(getStockListActions({
      limit: pageSize,
      page: pageIndex,
      search: search,
    }));
  }, [dispatch, search, pageSize, pageIndex]);

  useEffect(() => {
    if (DeleteProductResponse === 200 || createResponse === 200 || UpdateResponse === 200 || CreateProductResponse === 200 || UpdateProductResponse === 200) {
      dispatch(getStockListActions({
        limit: pageSize,
        page: pageIndex,
        search: search,
      }));
    }
  }, [DeleteProductResponse, createResponse, UpdateResponse, CreateProductResponse, UpdateProductResponse]);

  useEffect(() => {
    setTotalPages(Math.ceil(totalRecords / pageSize));
  },
    [totalRecords, pageSize]);

  return (
    <div>
      <PageTitle
        breadCrumbItems={[
          { label: "SHIVAY Opening Stock List", path: "/shivay/openingStock" },
          { label: "Opening Stock List", path: "/shivay/openingStock", active: true },
        ]}
        title={"Opening Stock List"}
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
              <Button
                className="mt-2 fw-bold custom-button me-2"
                onClick={() => setShowAddModal(true)}
              >
                <IoIosAdd className="fs-3" />&nbsp;Add
              </Button>
              {/* <Button className="mt-2 fw-bold custom-button"
                onClick={() => {
                  navigate('/shivay/addOpeningStock');
                  reset();
                }}
              >
                <IoIosAdd className="fs-3" />&nbsp;Opening Stock
              </Button> */}
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
                      <th scope="col"><i className="mdi mdi-merge"></i></th>
                      <th scope="col">Warehouse</th>
                      {/* <th scope="col">Code</th> */}
                      <th scope="col">Date</th>
                      <th scope="col">Description</th>
                      <th scope="col">No. of Products</th>
                    </tr>
                  </thead>
                  {store?.stockListReducer?.loading ? (
                    <tr>
                      <td className='text-center' colSpan={6}>
                        <Loading />
                      </td>
                    </tr>
                  ) : (
                    <tbody>
                      {OpeningStockData && OpeningStockData.length > 0 ? (
                        OpeningStockData.map((data, index) => (
                          <tr key={index} className="text-dark  text-nowrap highlight-row">
                            <td scope="row" className='fs-5'>{index + 1}</td>
                            <td className="text-uppercase fs-5">
                              {data?.warehouseData?.name || <span className="text-black">-</span>}
                            </td>
                            {/* <td className="fs-5">
                              {data?.productData?.code || <span className="text-black">-</span>}
                            </td> */}
                            <td className="fs-5">
                              {data?.date ? new Date(data.date).toLocaleDateString('en-GB') : <span className="text-black">-</span>}
                            </td>

                            <td className="fs-5">
                              {data?.description || <span className="text-black">-</span>}
                            </td>
                            <td className="fs-5">
                              {data?.totalStockProductCount || <span className="text-black">-</span>}
                            </td>
                            <td></td>
                            <td></td>
                            <div className="icon-container d-flex  pb-0" >
                              <span className="icon-wrapper me-4" title="Edit">
                                <AiOutlineEdit
                                  className="fs-4 text-black"
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => {
                                    setShowEditModal(true)
                                    setEditData(data?._id)
                                    // navigate(`/shivay/addOpeningStock?Id=${data?._id}`);
                                  }}
                                />
                              </span>

                            </div>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-5 text-center">
                            No stock records found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  )}
                </table>
                <Pagination
                  pageIndex={pageIndex}
                  pageSize={pageSize}
                  totalPages={useSelector((state) => state?.stockListReducer?.stockList?.totalPages)}
                  setPageIndex={setPageIndex}
                  onChangePageSize={setPageSize}
                />
              </Card.Body>
            </Card>
          </div>
        </Row>
      </Form>
      <AddStockModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
      // stockId={OpeningStockData?._id}
      />
      <EditStockModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        stockId={editData}
      />
    </div>
  )
}

export default OpeningStock