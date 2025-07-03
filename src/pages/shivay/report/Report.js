import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import Select from 'react-select';
import PageTitle from '../../../helpers/PageTitle';
import { useDispatch, useSelector } from 'react-redux';
import { getReportActions, getWarehouseListActions } from '../../../redux/actions';
import ToastContainer from '../../../helpers/toast/ToastContainer';
import Pagination from '../../../helpers/Pagination';

const Report = () => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const Warehouse = store?.getWarehouseListReducer?.searchWarehouse?.response;
    const totalRecords = '0';
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalPages, setTotalPages] = useState(Math.ceil(totalRecords / pageSize));

    const warehouseOptions = Warehouse?.map((warehouse) => ({
        value: warehouse._id,
        label: warehouse.name,
    }));

    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [ReportData, setReportData] = useState([]);
    const [stockType, setStockType] = useState('');

    const handleWarehouseChange = (selectedOption) => {
        setSelectedWarehouse(selectedOption);
    };

    useEffect(() => {
        setTotalPages(Math.ceil(totalRecords / pageSize));
    }, [totalRecords, pageSize]);

    useEffect(() => {
        dispatch(getWarehouseListActions());
    }, [dispatch]);

    useEffect(() => {
        if (selectedWarehouse?.value && ReportData?.length > 0) {
            const payload = {
                warehouseId: selectedWarehouse?.value,
                search: '',
                page: pageIndex,
                limit: pageSize,
                type: '',
                stockFilter: stockType,
            };
            dispatch(getReportActions(payload));
        }
    }, [pageIndex, pageSize, stockType]);

    const resp = store?.reportReducer?.report?.status;
    useEffect(() => {
        if (resp === 200 && selectedWarehouse !== null) {
            setReportData(store?.reportReducer?.report?.response);
        }
    });

    const handleProductsSearch = () => {
        const payload = {
            warehouseId: selectedWarehouse?.value,
            search: '',
            page: pageIndex,
            limit: pageSize,
            type: '',
            stockFilter: stockType,
        };
        dispatch(getReportActions(payload));
    };

    const [toast, setToast] = useState(false);
    const handleSendMail = () => {
        const payload = {
            warehouseId: selectedWarehouse?.value,
            search: '',
            page: pageIndex,
            limit: pageSize,
            type: 'sendMail',
            stockFilter: stockType,
        };
        setToast(true);
        dispatch(getReportActions(payload));
    };

    useEffect(() => {
        if (resp === 200 && toast) {
            setToast(false);
            ToastContainer('Email sent successfully', 'success');
        } else if (resp && resp !== 200) {
            setToast(false);
            ToastContainer('Email not sent ', 'danger');
        }
    }, [resp, toast]);

    return (
        <div>
            <PageTitle
                breadCrumbItems={[
                    { label: 'SHIVAY Report List', path: '/shivay/report' },
                    { label: 'Report List', path: '/shivay/report', active: true },
                ]}
                title={'Report List'}
            />
            <Row className="mt-3">
                <Col sm={3}>
                    <Form.Group className="mb-1">
                        <Form.Label className="mb-0">
                            Warehouse <span className="text-danger">*</span>
                        </Form.Label>
                        <Select
                            value={selectedWarehouse}
                            onChange={handleWarehouseChange}
                            options={warehouseOptions}
                            placeholder="Select a Warehouse"
                            noOptionsMessage={() => 'No warehouse found...'}
                            required
                        />
                    </Form.Group>
                </Col>
                <Col sm={3}>
                    <Form.Group className="mb-1">
                        <Form.Label className="mb-0">Stock Type</Form.Label>
                        <Form.Select onChange={(e) => setStockType(e.target.value)}>
                            <option value="">Select Stock Type</option>
                            <option value="In Stock">In Stock</option>
                            <option value="Low on Stock">Low on Stock</option>
                            <option value="Out of Stock">Out of Stock</option>
                        </Form.Select>
                    </Form.Group>
                </Col>

                <Col sm={6} className="d-flex justify-content-end gap-2" style={{ marginTop: '10px' }}>
                    <OverlayTrigger
                        placement="left"
                        overlay={<Tooltip>Please search report data to send mail...</Tooltip>}
                        show={ReportData?.length === 0 ? undefined : false}>
                        <div>
                            <Button
                                onClick={handleSendMail}
                                disabled={ReportData?.length === 0}
                                className="mt-2 fw-bold custom-button">
                                Send Mail
                            </Button>
                        </div>
                    </OverlayTrigger>

                    <OverlayTrigger
                        placement="left"
                        overlay={<Tooltip>Please select a warehouse first...</Tooltip>}
                        show={!selectedWarehouse ? undefined : false}>
                        <div className="">
                            <Button
                                className="mt-2 fw-bold custom-button"
                                onClick={handleProductsSearch}
                                disabled={!selectedWarehouse}>
                                Search
                            </Button>
                        </div>
                    </OverlayTrigger>
                </Col>
            </Row>

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
                                        <th scope="col">
                                            <i className="mdi mdi-merge"></i>
                                        </th>
                                        <th scope="col">Product Name</th>
                                        <th scope="col">Model</th>
                                        <th scope="col">Code</th>
                                        <th scope="col">Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ReportData && ReportData.length > 0 ? (
                                        ReportData?.map((data, index) => (
                                            <tr key={index} className="text-dark  text-nowrap highlight-row">
                                                <td scope="row" className="font_work">
                                                    {index + 1}
                                                </td>
                                                <td className="text-uppercase font_work">
                                                    {data?.productName || <span className="text-black">-</span>}
                                                </td>
                                                <td className="font_work">
                                                    {data?.modelName || <span className="text-black">-</span>}
                                                </td>
                                                <td className="font_work">
                                                    {data?.code || <span className="text-black">-</span>}
                                                </td>
                                                <td className="font_work">{data?.quantity || <span>0</span>}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center text-danger py-3">
                                                Note : Please select a warehouse and search to view report data.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <Pagination
                            pageIndex={pageIndex}
                            pageSize={pageSize}
                            totalPages={useSelector((state) => state?.reportReducer?.report?.totalPages)}
                            setPageIndex={setPageIndex}
                            onChangePageSize={setPageSize}
                        />
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};

export default Report;
