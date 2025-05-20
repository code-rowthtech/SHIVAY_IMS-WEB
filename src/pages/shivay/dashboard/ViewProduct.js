import React, { useEffect, useState } from 'react'
import PageTitle from '../../../helpers/PageTitle'
import { Card, Form } from 'react-bootstrap'
import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { viewProductActions } from '../../../redux/actions';
import { Loading } from '../../../helpers/loader/Loading';
import { MdOutlineKeyboardBackspace } from "react-icons/md";

const ViewProduct = () => {

    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const store = useSelector((state) => state)
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const productId = searchParams.get('id')
    // console.log(productId, 'productId')
    const warehouseId = searchParams.get('warehouseId')
    // console.log(warehouseId, 'warehouseId')

    const ProductData = store?.viewProductReducer?.viewProduct;
    console.log(ProductData, 'ProductData')

    useEffect(() => {
        const formatDate = (date) => {
            if (!date) return undefined;
            return date.toISOString().split('T')[0]; // Gets YYYY-MM-DD
        };

        dispatch(viewProductActions({
            warehouseId: warehouseId,
            productId: productId,

            startDate: formatDate(startDate) || '',
            endDate: formatDate(endDate) || '',

        }));
    }, [dispatch, warehouseId, productId, startDate, endDate]);

    const handleGoBack = () => {
        navigate(-1); // This will go back to the previous page in history
    };

    return (
        <div>
            <PageTitle
                breadCrumbItems={[
                    { label: "SHIVAY Dashboard", path: "/shivay/dashboard" },
                    { label: "View Product", path: "/shivay/ViewProduct", active: true },
                ]}
                title={"View Product"}
            />

            <div className='mt-3'>

                <Card className="p-3"
                    style={{
                        boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset',
                        height: '75vh'
                    }}
                >
                    <div className='d-flex justify-content-between '>
                        <div className='d-flex'>
                            <div
                                className='mt-1'
                                onClick={handleGoBack}
                                style={{ cursor: 'pointer' }} // Add pointer cursor to indicate clickable
                            >
                                <MdOutlineKeyboardBackspace
                                    className='fs-3 text-black bg-secondary rounded-circle p-1'
                                    title='Back'
                                />
                            </div>
                            <h5 className="text-black ms-2">Warehouse: <span className="fw-normal ms-1">{ProductData?.product?.warehouseName}</span></h5>
                        </div>

                        <Form.Group className="mb-3 w-100" style={{ maxWidth: 250 }}>
                            {/* <Form.Label className="mb-1">Date Range</Form.Label> */}
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
                    </div>

                    <div className="mt-1">
                        <div className="row mb-2">
                            <div className="col-md-3 d-flex justify-content-center">
                                <div><strong className='text-black'>Product Name:</strong> <span className='ms-1 text-capitalize fw-semibold'>{ProductData?.product?.name}</span></div>
                            </div>
                            <div className="col-md-3 d-flex justify-content-center">
                                <div><strong className='text-black'>Available Stock:</strong> <span className='ms-1 fw-semibold'>{ProductData?.totalStock}</span></div>
                            </div>
                            <div className="col-md-3 d-flex justify-content-center">
                                <div><strong className='text-black'>Total In:</strong> <span className='ms-1 fw-semibold'>{ProductData?.totalStockIn}</span></div>
                            </div>
                            <div className="col-md-3 d-flex justify-content-center">
                                <div><strong className='text-black'>Total Out:</strong> <span className='ms-1 fw-semibold'>{ProductData?.totalStockOut}</span></div>
                            </div>
                        </div>

                        <hr className='mb-0' />

                        <div className="row px-2 text-center">
                            <table className="table table-striped bg-white mb-0">
                                <thead>
                                    <tr className="table_header">
                                        <th scope="col"><i className="mdi mdi-merge"></i></th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Opening Stock</th>
                                        <th scope="col">Stock In</th>
                                        <th scope="col">Dispatch</th>
                                        <th scope="col">Balance</th>
                                    </tr>
                                </thead>
                                {store?.viewProductReducer?.loading ? (
                                    <tr>
                                        <td className='text-center' colSpan={6}>
                                            <Loading />
                                        </td>
                                    </tr>
                                ) : (
                                    <tbody>
                                        {ProductData?.response?.map((item, index) => (
                                            <tr key={index} className="text-dark fw-bold text-nowrap highlight-row">
                                                <th scope="row">{index + 1}</th>
                                                <td className="text-uppercase fw-bold">{item.date ?? '-'}</td>
                                                <td className="text-uppercase fw-bold">{item.stock ?? '-'}</td>
                                                <td className="text-uppercase fw-bold">{item.totalStockIn ?? '-'}</td>
                                                <td className="text-uppercase fw-bold">{item.totalStockOut ?? '-'}</td>
                                                <td className="text-uppercase fw-bold">{item.balance !== null ? item.balance : '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                )}
                            </table>
                        </div>
                    </div>

                </Card>
            </div>

        </div>
    )
}

export default ViewProduct