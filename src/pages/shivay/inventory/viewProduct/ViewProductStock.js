import React, { useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { viewProductStockActions } from '../../../../redux/actions';
import { Loading } from '../../../../helpers/loader/Loading';

const ViewProductStock = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const productId = searchParams.get('id')
    const store = useSelector((state) => state)
    const ProductDataa = store?.viewProductStockReducer?.viewProductStock?.productDetail
    console.log(ProductDataa, 'ProductDataa')
    const WarehouseData = store?.viewProductStockReducer?.viewProductStock?.response
    console.log(WarehouseData, 'WarehouseData')


    const ProductData = {
        product: {
            name: "Premium Laptop"
        },
        totalStock: 150,
        totalStockIn: 200,
        totalStockOut: 50,
        response: [
            { date: "2023-05-01", stock: 100, totalStockIn: 50, totalStockOut: 20, balance: 130 },
            { date: "2023-05-02", stock: 130, totalStockIn: 30, totalStockOut: 10, balance: 150 },
            { date: "2023-05-03", stock: 150, totalStockIn: 40, totalStockOut: 25, balance: 165 },
            { date: "2023-05-04", stock: 165, totalStockIn: 35, totalStockOut: 30, balance: 170 },
            { date: "2023-05-05", stock: 170, totalStockIn: 45, totalStockOut: 15, balance: 200 },
        ]
    };

    useEffect(() => {
        if (productId) {
            dispatch(viewProductStockActions({ productId: productId }));
        }
    }, [dispatch, productId]);

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div>
            <div className='mt-3'>
                <Card className="p-3"
                    style={{
                        boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset',
                        height: '75vh'
                    }}
                >
                    <div className='d-flex justify-content-between'>
                        <div className='d-flex'>
                            <div
                                className='mt-1'
                                onClick={handleGoBack}
                                style={{ cursor: 'pointer' }}
                            >
                                <MdOutlineKeyboardBackspace
                                    className='fs-3 text-black bg-secondary rounded-circle p-1'
                                    title='Back'
                                />
                            </div>
                            <h5 className="text-black ms-2">Product: <span className="fw-normal ms-1">{ProductDataa?.[0]?.name}</span></h5>
                        </div>
                    </div>

                    <div className="mt-3">
                        <div className="row mb-2">
                            <div className="col-md-4 d-flex justify-content-center">
                                <div><strong className='text-black'>Code:</strong> <span className='ms-1 fw-semibold'>{ProductDataa?.[0]?.code}</span></div>
                            </div>
                            <div className="col-md-4 d-flex justify-content-center">
                                <div><strong className='text-black'>Model:</strong> <span className='ms-1 fw-semibold'>{ProductDataa?.[0]?.modelData?.name}</span></div>
                            </div>
                            <div className="col-md-4 d-flex justify-content-center">
                                <div><strong className='text-black'>Quantity:</strong> <span className='ms-1 fw-semibold'>{ProductDataa?.[0]?.quantity}</span></div>
                            </div>
                        </div>

                        <hr className='mb-0' />

                        <div className="row px-2 table-responsive ">
                            <table className="table table-striped bg-white mb-0">
                                <thead>
                                    <tr className="table_header">
                                        <th scope="col"><i className="mdi mdi-merge"></i></th>
                                        <th scope="col">Warehouse</th>
                                        <th scope="col">Address</th>
                                        <th scope="col">Stock</th>
                                    </tr>
                                </thead>
                                {store?.viewProductStockReducer?.loading ? (
                                    <tr>
                                        <td className='text-center' colSpan={4}>
                                            <Loading />
                                        </td>
                                    </tr>
                                ) : (
                                    <tbody>
                                        {WarehouseData?.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className='text-center'>
                                                    <p className='my-4 py-5 text-danger'>No stock data to show.</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            WarehouseData?.map((item, index) => (
                                                <tr key={index} className="text-dark font_work text-nowrap highlight-row">
                                                    <td className='font_work'>{index + 1}</td>
                                                    <td className="text-capitalize font_work" title={item.warehouseData?.[0]?.name ?? '-'}>
                                                        {(item.warehouseData?.[0]?.name ?? '-').slice(0, 30)}{(item.warehouseData?.[0]?.name?.length > 30) ? '...' : ''}
                                                    </td>

                                                    <td className="text-capitalize font_work" title={item.warehouseData?.[0]?.address ?? '-'}>
                                                        {(item.warehouseData?.[0]?.address ?? '-').slice(0, 30)}{(item.warehouseData?.[0]?.address?.length > 30) ? '...' : ''}
                                                    </td>
                                                    <td className="font_work">{item.stock ?? '-'}</td>
                                                </tr>
                                            )))}
                                    </tbody>
                                )}
                            </table>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ViewProductStock;