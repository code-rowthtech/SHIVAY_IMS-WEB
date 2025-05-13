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
  console.log(OpeningStockData, 'OpeningStockData')

  useEffect(() => {
    dispatch(getStockListActions({
      limit: pageSize,
      page: pageIndex,
      search: search,
    }));
  }, [dispatch, search, pageSize, pageIndex]);

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
              <Button className="mt-2 fw-bold custom-button"
                onClick={() => {
                  navigate('/shivay/addOpeningStock');
                  reset();
                }}
              >
                <IoIosAdd className="fs-3" />&nbsp;Opening Stock
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
                      <th scope="col">Warehouse</th>
                      {/* <th scope="col">Code</th> */}
                      <th scope="col">Date</th>
                      <th scope="col">Description</th>
                      <th scope="col">Quantity</th>
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
                          <tr key={index} className="text-dark fw-bold text-nowrap highlight-row">
                            <th scope="row">{index + 1}</th>
                            <td className="text-uppercase fw-bold">
                              {data?.warehouseData?.name || <span className="text-black">-</span>}
                            </td>
                            {/* <td className="fw-bold">
                              {data?.productData?.code || <span className="text-black">-</span>}
                            </td> */}
                            <td className="fw-bold">
                              {data?.date ? new Date(data.date).toLocaleDateString('en-GB') : <span className="text-black">-</span>}
                            </td>

                            <td className="fw-bold">
                              {data?.description || <span className="text-black">-</span>}
                            </td>
                            <td className="fw-bold">
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
                                    navigate(`/shivay/addOpeningStock?Id=${data?._id}`);
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
    </div>
  )
}

export default OpeningStock