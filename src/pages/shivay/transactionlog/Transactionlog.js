import React, { useEffect, useState } from 'react';
import PageTitle from '../../../helpers/PageTitle';
import { Card, Col, Form, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { logListActions } from '../../../redux/transactionlog/action';
import Pagination from '../../../helpers/Pagination';
import { Loading } from '../../../helpers/loader/Loading';

const Transactionlog = () => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const store = useSelector((state) => state);
    const { data: logList, loading, error } = store?.logListReducer || {};
    const SupplierData2 = store?.logListReducer?.supplierList?.response || [];
    const totalPages = store?.logListReducer?.supplierList?.totalPages || 0;

    useEffect(() => {
        dispatch(
            logListActions({
                limit: pageSize,
                page: pageIndex,
                search: search,
            })
        );
    }, [dispatch, search, pageSize, pageIndex]);

    return (
        <div>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Transaction Log', path: '/transaction-log' },
                    { label: 'Transaction Log List', path: '/transaction-log', active: true },
                ]}
                title={'Transaction Log List'}
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
                        </div>
                    </Col>

                    <div className="mt-2">
                        <Card
                            style={{
                                boxShadow:
                                    'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset',
                            }}>
                            <Card.Body className="py-1">
                                <div className="table-responsive">
                                    <table className="table table-striped bg-white mb-0">
                                        <thead>
                                            <tr className="table_header">
                                                <th>#</th>
                                                <th>Activity</th>
                                                <th>Control No.</th>
                                                <th>User Name</th>
                                                <th>User Email</th>
                                                <th>Warehouse</th>
                                                <th>Role</th>
                                                <th>Time</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loading ? (
                                                <tr>
                                                    <td className="text-center" colSpan={8}>
                                                        <Loading />
                                                    </td>
                                                </tr>
                                            ) : error ? (
                                                <tr>
                                                    <td colSpan={8} className="text-center text-danger">
                                                        Error loading transaction logs: {error.message}
                                                    </td>
                                                </tr>
                                            ) : SupplierData2?.length === 0 ? (
                                                <tr>
                                                    <td colSpan={8} className="text-center">
                                                        <p className="my-5 py-5">No transaction logs found.</p>
                                                    </td>
                                                </tr>
                                            ) : (
                                                SupplierData2?.map((log, index) => (
                                                    <tr key={log._id} className="text-dark text-nowrap highlight-row">
                                                        <td>{(pageIndex - 1) * pageSize + index + 1}</td>
                                                        <td>{log.logsActivity || '-'}</td>
                                                        <td>{log.controlNumber || '-'}</td>
                                                        <td>{log?.userId?.name || '-'}</td>
                                                        <td>{log?.userId?.email || '-'}</td>
                                                        <td>{log?.warehouseId?.name || '-'}</td>
                                                        <td className="text-capitalize">{log.role || '-'}</td>
                                                        <td>{new Date(log.time).toLocaleString() || '-'}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {!loading && (
                                    <Pagination
                                        pageIndex={pageIndex}
                                        pageSize={pageSize}
                                        totalPages={totalPages}
                                        setPageIndex={setPageIndex}
                                        onChangePageSize={setPageSize}
                                    />
                                )}
                            </Card.Body>
                        </Card>
                    </div>
                </Row>
            </Form>
        </div>
    );
};

export default Transactionlog;
