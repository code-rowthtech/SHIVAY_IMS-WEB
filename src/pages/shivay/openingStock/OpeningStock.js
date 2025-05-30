// src/pages/openingStock/OpeningStock.jsx

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { AiOutlineEdit } from 'react-icons/ai';
import { IoIosAdd } from 'react-icons/io';

import PageTitle from '../../../helpers/PageTitle';
import Pagination from '../../../helpers/Pagination';
import { Loading } from '../../../helpers/loader/Loading';
import { getStockListActions } from '../../../redux/actions';

import AddStockModal from './addStock/AddStockModal';
import EditStockModal from './editStock/EditStockModal';

const OpeningStock = () => {
  const dispatch = useDispatch();

  const [search, setSearch] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const store = useSelector(state => state);
  const {
    stockListReducer: { stockList, loading },
    createStockReducer,
    updateStockReducer,
    deleteStockProductReducer,
    createStockProductReducer,
    updateStockProductReducer
  } = store;

  const openingStockData = stockList?.response || [];
  const totalRecords = stockList?.totalCount || 0;

  const createResponse = createStockReducer?.createStock?.status;
  const updateResponse = updateStockReducer?.updateStock?.status;
  const deleteResponse = deleteStockProductReducer?.deleteStockProduct?.status;
  const createProductResponse = createStockProductReducer?.createStockProduct?.status;
  const updateProductResponse = updateStockProductReducer?.updateStockProduct?.status;

  useEffect(() => {
    dispatch(getStockListActions({ limit: pageSize, page: pageIndex, search }));
  }, [dispatch, search, pageSize, pageIndex]);

  useEffect(() => {
    if ([200].includes(deleteResponse || createResponse || updateResponse || createProductResponse || updateProductResponse)) {
      dispatch(getStockListActions({ limit: pageSize, page: pageIndex, search }));
    }
  }, [deleteResponse, createResponse, updateResponse, createProductResponse, updateProductResponse]);

  useEffect(() => {
    setTotalPages(Math.ceil(totalRecords / pageSize));
  }, [totalRecords, pageSize]);

  return (
    <div>
      <PageTitle
        breadCrumbItems={[
          { label: 'SHIVAY Opening Stock List', path: '/shivay/openingStock' },
          { label: 'Opening Stock List', path: '/shivay/openingStock', active: true },
        ]}
        title="Opening Stock List"
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
                onClick={() => setShowAddModal(true)}
              >
                <IoIosAdd className="fs-3" />&nbsp;Add
              </Button>
            </div>
          </Col>

          <div className="mt-2">
            <Card style={{ boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset' }}>
              <Card.Body className="py-1">
                <div className='table-responsive'>
                  <table className="table table-striped bg-white mb-0">
                    <thead>
                      <tr className="table_header">
                        <th>#</th>
                        <th>Warehouse</th>
                        <th>Date</th>
                        <th>Description</th>
                        <th>No. of Products</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={6} className="text-center">
                            <Loading />
                          </td>
                        </tr>
                      ) : (
                        openingStockData.length > 0 ? (
                          openingStockData.map((data, index) => (
                            <tr key={index} className="text-dark text-nowrap highlight-row">
                              <td className='font_work'>{(pageIndex - 1) * pageSize + index + 1}</td>
                              <td className="text-capitalize font_work">{data?.warehouseData?.name || '-'}</td>
                              <td className="font_work">{data?.date ? new Date(data.date).toLocaleDateString('en-GB') : '-'}</td>
                              <td className="font_work">{data?.description || '-'}</td>
                              <td className="font_work">{data?.totalStockProductCount || '-'}</td>
                              <td>
                                <span
                                  className="icon-wrapper me-4"
                                  title="Edit"
                                  onClick={() => {
                                    setShowEditModal(true);
                                    setEditData(data?._id);
                                  }}
                                >
                                  <AiOutlineEdit
                                    className="fs-4"
                                    style={{ cursor: 'pointer' }}
                                  />
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="py-5 text-center">
                              No stock records found.
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
                <Pagination
                  pageIndex={pageIndex}
                  pageSize={pageSize}
                  totalPages={stockList?.totalPages || totalPages}
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
      />

      <EditStockModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        stockId={editData}
      />
    </div>
  );
};

export default OpeningStock;
