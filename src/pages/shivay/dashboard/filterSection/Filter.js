import React, { useEffect, useState } from 'react';
import { Badge, Button, Col, Form, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { TiArrowRight } from 'react-icons/ti';
import PerformanceChart from '../chart/PerformanceChart';
import { useDispatch, useSelector } from 'react-redux';
import {
    getLowStockActions,
    getRecentTransactionActions,
    getStockReportActions,
    getWarehouseListActions,
} from '../../../../redux/actions';
import Select from 'react-select';
import DatePicker from 'react-datepicker';

const Filter = () => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [transactionType, setTransactionType] = useState('');
    const [productSearch, setProductSearch] = useState('');

    const StockReport = store?.stockReportReducer?.stockReport;
    const ChartData = store?.stockReportReducer?.stockReport?.chartData;
    const TopSelling = store?.recentTransactionReducer?.recentTransaction?.getTopSellingProduct;
    const RecentTransaction = store?.recentTransactionReducer?.recentTransaction?.recentTransaction;
    const TodaysDispatch = store?.lowStockReducer?.lowStock;
    const LowStock = store?.lowStockReducer?.lowStock?.response;
    const Warehouse = store?.getWarehouseListReducer?.searchWarehouse?.response;

    const warehouseOptions = Warehouse?.map((warehouse) => ({
        value: warehouse._id,
        label: warehouse.name,
    }));

    useEffect(() => {
        dispatch(getWarehouseListActions());
    }, [dispatch]);

    const handleWarehouseChange = (selectedOption) => {
        setSelectedWarehouse(selectedOption);
    };

    const formatDateToDDMMYYYY = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const handleProductsSearch = () => {
        const payload = {
            warehouseId: selectedWarehouse?.value,
            search: productSearch,
            page: 1,
            limit: 10,
            startDate: formatDateToDDMMYYYY(startDate),
            endDate: formatDateToDDMMYYYY(endDate),
            stockFilter: transactionType,
        };
        dispatch(getLowStockActions(payload));
        dispatch(getStockReportActions(payload));
        dispatch(getRecentTransactionActions(payload));
    };

    const handleSelectChange = (e) => {
        setTransactionType(e.target.value);
    };

    return (
        <div>
            <Form>
                <Row>
                    <Col sm={6}>
                        <Form.Group className="mb-1">
                            <Form.Label className="mb-0">
                                Warehouse <span className="text-danger">*</span>
                            </Form.Label>
                            <Select
                                value={selectedWarehouse}
                                onChange={handleWarehouseChange}
                                options={warehouseOptions}
                                placeholder="Select a Warehouse"
                                isClearable
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-1">
                            <Form.Label className="mb-0">Date Range</Form.Label>
                            <DatePicker
                                selected={startDate}
                                onChange={(update) => setDateRange(update)}
                                startDate={startDate}
                                endDate={endDate}
                                selectsRange
                                className="form-control"
                                placeholderText="Select date range"
                                dateFormat="yyyy-MM-dd"
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-1">
                            <Form.Label className="mb-0">Product</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Product Name"
                                name="productSearch"
                                value={productSearch}
                                onChange={(e) => setProductSearch(e.target.value)}
                            />
                        </Form.Group>
                    </Col>

                    <Col sm={6}>
                        <Form.Group className="mb-1">
                            <Form.Label className="mb-0">Transaction Type</Form.Label>
                            <Form.Select name="transactionType" value={transactionType} onChange={handleSelectChange}>
                                <option value="">Select a transaction type</option>
                                <option value="All">All</option>
                                <option value="In Stock">In Stock</option>
                                <option value="Low on Stock">Low on Stock</option>
                                <option value="Out of Stock">Out of Stock</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <div className="d-flex justify-content-end mb-2">
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
                    </div>
                    <Col sm={6} className="mb-2">
                        <div
                            className="d-flex justify-content-between align-items-center px-3 py-2 rounded-2"
                            style={{
                                boxShadow: 'rgba(0, 0, 0, 0.05) 0px 4px 10px, rgba(0, 0, 0, 0.03) 0px 2px 5px',
                            }}>
                            <h3 className="text-success">{StockReport?.totalStockIn || '-'}</h3>
                            <p className="mb-0">Total Stock In</p>
                            <TiArrowRight className="fs-4" />
                        </div>
                    </Col>
                    <Col sm={6} className="mb-2">
                        <div
                            className="d-flex justify-content-between align-items-center px-3 py-2 rounded-2"
                            style={{
                                boxShadow: 'rgba(0, 0, 0, 0.05) 0px 4px 10px, rgba(0, 0, 0, 0.03) 0px 2px 5px',
                            }}>
                            <h3 className="text-danger">{StockReport?.totalStockOut || '-'}</h3>
                            <p className="mb-0">Total Dispatch today</p>
                            <TiArrowRight className="fs-4" />
                        </div>
                    </Col>
                    <div className="d-flex flex-wrap">
                        <Col sm={6} className="mb-2 d-flex pe-2">
                            <div
                                className="px-1 py-0 rounded-2 w-100"
                                style={{
                                    boxShadow: 'rgba(0, 0, 0, 0.05) 0px 4px 10px, rgba(0, 0, 0, 0.03) 0px 2px 5px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}>
                                <h5>Total Stock Summary</h5>
                                <div>
                                    <PerformanceChart chartData={ChartData} />
                                </div>
                            </div>
                        </Col>

                        {/* Top Selling Products Table */}
                        <Col sm={6} className="mb-2 d-flex ps-2">
                            <div
                                className="px-1 py-0 rounded-2 w-100"
                                style={{
                                    boxShadow: 'rgba(0, 0, 0, 0.05) 0px 4px 10px, rgba(0, 0, 0, 0.03) 0px 2px 5px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                    // maxHeight: '32vh',
                                    // overflow:'auto'
                                }}>
                                <div>
                                    <div className="d-flex justify-content-between">
                                        <h5>Top Selling Products</h5>
                                        {/* <p className="mb-0 mt-1 text-primary fs-6">View All</p> */}
                                    </div>
                                    <div
                                        className="table-responsive mb-0 flex-grow-1"
                                        style={{ overflow: 'auto', maxHeight: '26vh' }}>
                                        <table className="table table-striped bg-white mb-0">
                                            <thead>
                                                <tr style={{ color: '#703133' }}>
                                                    <th scope="col">
                                                        <i className="mdi mdi-merge"></i>
                                                    </th>
                                                    <th scope="col">Name</th>
                                                    <th scope="col">Units</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {TopSelling && TopSelling.length > 0 ? (
                                                    TopSelling.map((data, index) => (
                                                        <tr key={index} className="text-dark fw-bold text-nowrap">
                                                            <th scope="row" className="fs-6">
                                                                {index + 1}
                                                            </th>
                                                            <td className="text-uppercase fw-bold fs-6 text-primary">
                                                                {data?.name || <span className="text-black">-</span>}
                                                            </td>
                                                            <td className="text-uppercase fw-bold fs-6 text-success">
                                                                {data?.unitsSold || (
                                                                    <span className="text-black">-</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={3} className="text-center text-danger fw-bold">
                                                            No product found
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        {/* Recent Transaction Table */}
                        <Col sm={6} className="d-flex pe-2">
                            <div
                                className="px-1 py-0 rounded-2 w-100"
                                style={{
                                    boxShadow: 'rgba(0, 0, 0, 0.05) 0px 4px 10px, rgba(0, 0, 0, 0.03) 0px 2px 5px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                }}>
                                <div>
                                    <div className="d-flex justify-content-between">
                                        <h5>Recent Transaction</h5>
                                        {/* <p className="mb-0 mt-1 text-primary fs-6">View All</p> */}
                                    </div>
                                    <div className="table-responsive mb-0 flex-grow-1">
                                        <table className="table table-striped bg-white mb-0">
                                            <thead>
                                                <tr style={{ color: '#703133' }}>
                                                    <th scope="col">Date</th>
                                                    <th scope="col">Invoice</th>
                                                    <th scope="col">Location</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {RecentTransaction?.length > 0 ? (
                                                    RecentTransaction.slice(0, 4).map((data, index) => (
                                                        <tr key={index} className="text-dark fw-bold text-nowrap">
                                                            <td className="text-uppercase text-success fs-6">
                                                                {data?.date || <span className="text-danger">-</span>}
                                                            </td>
                                                            {/* <td
                                                                className="text-primary fs-6"
                                                                title={data?.invoiceAttachment}>
                                                                {data?.invoiceAttachment ? (
                                                                    `${data.invoiceAttachment.slice(0, 20)}${
                                                                        data.invoiceAttachment.length > 20 ? '...' : ''
                                                                    }`
                                                                ) : (
                                                                    <span className="text-danger">-</span>
                                                                )}
                                                            </td> */}
                                                            <td
                                                                className="text-primary fs-6"
                                                                title={data?.invoiceAttachment}>
                                                                {data?.invoiceAttachment ? (
                                                                    <a
                                                                        href={data.invoiceAttachment}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-primary text-decoration-none">
                                                                        {`${data.invoiceAttachment.slice(0, 20)}${
                                                                            data.invoiceAttachment.length > 20
                                                                                ? '...'
                                                                                : ''
                                                                        }`}
                                                                    </a>
                                                                ) : (
                                                                    <span className="text-danger">-</span>
                                                                )}
                                                            </td>

                                                            <td className="text-uppercase fw-bold text-primary fs-6">
                                                                {data?.location || (
                                                                    <span className="text-danger">-</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="3" className="text-center text-danger fw-bold">
                                                            No transaction found
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        {/* Low Stock Alert Table */}
                        <Col sm={6} className=" d-flex ps-2">
                            <div
                                className="px-1 py-0 rounded-2 w-100"
                                style={{
                                    boxShadow: 'rgba(0, 0, 0, 0.05) 0px 4px 10px, rgba(0, 0, 0, 0.03) 0px 2px 5px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                }}>
                                <div>
                                    <div className="d-flex justify-content-between">
                                        <h5>Low Stock Alert</h5>
                                        {/* <p className="mb-0 mt-1 text-primary fs-6">View All</p> */}
                                    </div>
                                    <div className="table-responsive mb-0 flex-grow-1">
                                        <table className="table table-striped bg-white mb-0">
                                            <thead>
                                                <tr style={{ color: '#703133' }}>
                                                    <th scope="col">
                                                        <i className="mdi mdi-merge"></i>
                                                    </th>
                                                    <th scope="col">Name</th>
                                                    <th scope="col">Quantity</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {LowStock?.length > 0 ? (
                                                    LowStock.slice(0, 4).map((data, index) => (
                                                        <tr key={index} className="text-dark fw-bold text-nowrap">
                                                            <th scope="row" className="fs-6">
                                                                {index + 1}
                                                            </th>
                                                            <td className="text-uppercase fw-bold text-primary fs-6">
                                                                {data?.name || <span className="text-black">-</span>}
                                                            </td>
                                                            <td className="text-uppercase fw-bold text-success fs-5">
                                                                <Badge
                                                                    className="bg-danger text-white"
                                                                    style={{ width: '2rem' }}>
                                                                    {data?.quantity !== undefined ? (
                                                                        data.quantity
                                                                    ) : (
                                                                        <span className="text-white">-</span>
                                                                    )}
                                                                </Badge>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="3" className="text-center text-danger fw-bold">
                                                            No stock found
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col sm={12} className="mt-3 mb-2">
                            <div
                                className="text-center px-3 py-2 rounded-2"
                                style={{
                                    boxShadow: 'rgba(0, 0, 0, 0.05) 0px 4px 10px, rgba(0, 0, 0, 0.03) 0px 2px 5px',
                                }}>
                                <h5 className="text-secondary mb-0">Today’s Dispatch</h5>
                                <p className="mb-0 fs-6">{TodaysDispatch?.todayDispatch} Orders Dispatch Today.</p>
                            </div>
                        </Col>
                    </div>
                </Row>
            </Form>
        </div>
    );
};

export default Filter;
