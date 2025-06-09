import { useEffect, useState } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardActions, getDispatchActions, getStockinActions } from "../../../redux/actions";
import { FaLayerGroup, FaUsers, } from "react-icons/fa";
import { MdOutlineSell } from "react-icons/md";
import { MdOutlineStoreMallDirectory } from "react-icons/md";
import { DashboardLoading } from "../../../helpers/loader/Loading";
import { MdFilterList } from "react-icons/md";
import Tab from "./tabs/Tab";
import { PiEye } from "react-icons/pi";
import Offcanvas from 'react-bootstrap/Offcanvas';
import { TiArrowLeft } from "react-icons/ti";
import Filter from "./filterSection/Filter";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "../../../helpers/Pagination";
import { useForm } from "react-hook-form";
import { getUserFromSession } from "../../../helpers/api/apiCore";
import { AiOutlineFileDone } from "react-icons/ai";
import { BsTruck } from "react-icons/bs";

const Dashboard = () => {

  const dispatch = useDispatch();
  const { reset } = useForm();
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0);
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    reset();
  };
  const handleShow = () => setShow(true);
  const [search, setSearch] = useState('')
  const totalRecords = '0';
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(Math.ceil(totalRecords / pageSize));
  const [dispatchSearch, setDispatchSearch] = useState('')
  const dispatchTotalRecords = '0';
  const [dispatchPageIndex, setDispatchPageIndex] = useState(1);
  const [dispatchPageSize, setDispatchPageSize] = useState(10);
  const [dispatchTotalPages, setDispatchTotalPages] = useState(Math.ceil(dispatchTotalRecords / dispatchPageSize));
  const store = useSelector((state) => state)
  const Role = getUserFromSession()?.user?.role?.name;
  const StockinData = store?.stockinTransListReducer?.stockinList?.data;
  const DispatchData = store?.dispatchListReducer?.dispatchList?.data;
  const DashboardCount = store?.dashboardDataReducer?.dashboardData?.response;

  useEffect(() => {
    dispatch(getDashboardActions());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getStockinActions({
      limit: pageSize,
      page: pageIndex,
      search: search,
    }));
  }, [dispatch, search, pageSize, pageIndex]);

  useEffect(() => {
    dispatch(getDispatchActions({
      limit: dispatchPageSize,
      page: dispatchPageIndex,
      search: dispatchSearch,
    }));
  }, [dispatch, dispatchSearch, dispatchPageSize, dispatchPageIndex]);

  useEffect(() => {
    setTotalPages(Math.ceil(totalRecords / pageSize));
  },
    [totalRecords, pageSize]);

  useEffect(() => {
    setDispatchTotalPages(Math.ceil(dispatchTotalRecords / dispatchPageSize));
  },
    [dispatchTotalRecords, dispatchPageSize]);

  const dashboardItems = [
    {
      title: "Total Warehouse",
      value: DashboardCount?.totalWarehouse,
      icon: <MdOutlineStoreMallDirectory />,
      background: "#00A0E3",
      link: "/shivay/warehouse"
    },
    {
      title: "Total Products",
      value: DashboardCount?.productCount,
      icon: <FaLayerGroup />,
      background: "#00A0E3",
      link: "/shivay/inventory"
    },
    {
      title: "Total User",
      value: DashboardCount?.userCount,
      icon: <FaUsers />,
      background: "#00A0E3",
      link: "/shivay/user"
    },
    {
      title: "Total Dispatch",
      value: DashboardCount?.dispatchCount,
      icon: <MdOutlineSell />,
      background: "#00A0E3",
      link: "/shivay/dispatch"
    }
  ];

  const dashboardItemsUsers = [
    {
      title: "Dispatch",
      icon: <MdOutlineSell />,
      background: "#00A0E3",
      link: "/shivay/dispatch"
    },
    {
      title: "Stock In",
      icon: <AiOutlineFileDone />,
      background: "#00A0E3",
      link: "/shivay/stockIn"
    },
    {
      title: "Customer",
      icon: <FaUsers />,
      background: "#00A0E3",
      link: "/shivay/customer"
    },
    {
      title: "Supplier",
      icon: <BsTruck />,
      background: "#00A0E3",
      link: "/shivay/supplier"
    }
  ];


  const connectTab = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  return (
    <>
      {/* card section */}
      <Row className="g-4 mt-2">
        {Role === 'admin' ? (
          <div className="m-0 ">
            <Row className="d-flex align-items-center">
              {dashboardItems?.map((item, index) => (
                <Col key={index} md={6} lg={3} className="pt-3">
                  <Link to={item.link} className="text-decoration-none ">

                    <Card
                      className="border-0 text-white card-hover-effect cursor mt-0"
                      style={
                        item.background.startsWith("#")
                          ? { backgroundColor: item.background }
                          : {
                            backgroundImage: `url('${item.background}')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }
                      }
                    >
                      <Card.Body className="d-flex align-items-center justify-content-between card-body-zoom">
                        <div>
                          <h6 className="fw-bold">{item.title}</h6>
                          <h2 className="fw-bold">{item.value}</h2>
                        </div>
                        <div className="fs-1">{item.icon}</div>
                      </Card.Body>
                    </Card>
                  </Link>

                </Col>
              ))}
            </Row>
          </div>
        ) : (
          <div className="m-0">
            <Row className="d-flex align-items-center">
              {dashboardItemsUsers?.map((item, index) => (
                <Col key={index} md={6} lg={3} className="pt-3">
                  <Link to={item.link} className="text-decoration-none">

                    <Card
                      className="border-0 text-white card-hover-effect cursor mt-0"
                      style={
                        item.background.startsWith("#")
                          ? { backgroundColor: item.background }
                          : {
                            backgroundImage: `url('${item.background}')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }
                      }
                    >
                      <Card.Body className="d-flex align-items-center justify-content-between card-body-zoom">
                        <div>
                          <h4 className="fw-bold">{item.title}</h4>
                        </div>
                        <div className="fs-1">{item.icon}</div>
                      </Card.Body>
                    </Card>
                  </Link>

                </Col>
              ))}
            </Row>
          </div>
        )}

        <div className="mt-0">

          {/* List section */}
          <h4 className="text-black">Transaction List</h4>

          <div className="d-flex justify-content-between align-items-start">
            <Tab connectTab={connectTab} />

            {/* Search input aligned to the end */}
            <div className="d-flex align-items-center">
              {activeTab === 0 &&
                <input
                  type="text"
                  className="form-control w-auto me-2"
                  style={{ height: '42px', marginTop: '10px' }}
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              }
              {activeTab === 1 &&
                <input
                  type="text"
                  className="form-control w-auto me-2"
                  style={{ height: '42px', marginTop: '10px' }}
                  placeholder="Search..."
                  value={dispatchSearch}
                  onChange={(e) => setDispatchSearch(e.target.value)}
                />
              }

              <Button className="mt-2 custom-button" title="Filter" onClick={handleShow}>
                <MdFilterList className="fs-3" />
              </Button>

            </div>
          </div>

          <div>
            <Card
              style={{
                boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset',
              }}
            >
              <Card.Body className=" py-1">

                {activeTab === 0 &&
                  <div className="table-responsive">
                    <table className="table table-striped bg-white mb-0">
                      <thead>
                        <tr className="table_header">
                          <th scope="col">#</th>
                          <th scope="col">Product Name</th>
                          <th scope="col">Supplier Name</th>
                          <th scope="col">Received by</th>
                          <th scope="col">Code</th>
                          <th scope="col">Stock In</th>
                          <th scope="col">Stock</th>
                          <th scope="col">Date</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      {store?.stockinTransListReducer?.loading ? (
                        <tr>
                          <td className='text-center' colSpan={9}>
                            <DashboardLoading />
                          </td>
                        </tr>
                      ) : (
                        <tbody>
                          {StockinData?.length === 0 ? (
                            <tr>
                              <td colSpan={9} className='text-center'>
                                <p className='my-4 py-5'>No stock-in data to show.</p>
                              </td>
                            </tr>
                          ) : (
                            StockinData?.map((data, index) => (
                              <tr key={index} className="text-dark  text-nowrap highlight-row">
                                <td className='font_work'>{(pageIndex - 1) * pageSize + index + 1}</td>
                                <td className=" font_work ">
                                  {data?.productName || <span className="text-black">-</span>}
                                </td>
                                <td
                                  className="text-capitalize font_work"
                                  title={data?.supplierName}
                                >
                                  {data?.supplierName
                                    ? `${data.supplierName.slice(0, 25)}${data.supplierName.length > 25 ? '...' : ''}`
                                    : <span className="text-black">-</span>}
                                </td>

                                <td className="text-capitalize font_work ">
                                  {data?.receivedBy || <span className="text-black">-</span>}
                                </td>
                                <td className=" font_work ">
                                  {data?.code || <span className="text-black">-</span>}
                                </td>
                                <td className=" font_work ">
                                  {data?.stockIn || <span className="text-black">-</span>}
                                </td>
                                <td className=" font_work">
                                  {data?.stock !== null && data?.stock !== undefined ? data.stock : <span className="text-black">-</span>}
                                </td>
                                <td className=" font_work ">
                                  {data?.date
                                    ? new Date(data.date).toLocaleDateString('en-GB')
                                    : <span className="text-black">-</span>}
                                </td>
                                <td>
                                  <span
                                    className="icon-wrapper me-4"
                                    title="View"
                                    onClick={() => navigate(`/shivay/ViewProduct?id=${data?.productId}&warehouseId=${data?.warehouseId}`)}
                                  >
                                    <PiEye
                                      className="fs-4"
                                      style={{ cursor: 'pointer' }}
                                    />
                                  </span>
                                </td>
                              </tr>
                            )))}
                        </tbody>
                      )}
                    </table>
                    <Pagination
                      pageIndex={pageIndex}
                      pageSize={pageSize}
                      totalPages={store?.stockinTransListReducer?.stockinList?.totalPages}
                      setPageIndex={setPageIndex}
                      onChangePageSize={setPageSize}
                    />
                  </div>
                }
                {activeTab === 1 &&
                  <div>
                    <div className="table-responsive">
                      <table responsive className="table table-striped bg-white mb-0">
                        <thead>
                          <tr className="table_header">
                            <th scope="col"><i className="mdi mdi-merge"></i></th>
                            <th scope="col" className="test"> Product Name</th>
                            <th scope="col">Customer</th>
                            <th scope="col">Dispatch by</th>
                            <th scope="col">Code</th>
                            <th scope="col">Dispatch</th>
                            <th scope="col">Stock</th>
                            <th scope="col">Date</th>
                            <th scope="col">Action</th>

                          </tr>
                        </thead>
                        {store?.dispatchListReducer?.loading ? (
                          <tr>
                            <td className='text-center' colSpan={8}>
                              <DashboardLoading />
                            </td>
                          </tr>
                        ) : (
                          <tbody>
                            {DispatchData?.length === 0 ? (
                              <tr>
                                <td colSpan={8} className='text-center'>
                                  <p className='my-4 py-5'>No dispatch data to show.</p>
                                </td>
                              </tr>
                            ) : (
                              DispatchData?.map((data, index) => (
                                <tr key={index} className="text-dark text-nowrap highlight-row">
                                  <td className='font_work'>{(dispatchPageIndex - 1) * dispatchPageSize + index + 1}</td>
                                  <td className=" font_work ">
                                    {data?.productName || <span className="text-black">-</span>}
                                  </td>
                                  <td className="font_work ">
                                    {data?.customerName || <span className="text-black">-</span>}
                                  </td>
                                   <td className="font_work ">
                                    {data?.dispatchBy || <span className="text-black">-</span>}
                                  </td>
                                  <td className="font_work ">
                                    {data?.code || <span className="text-black">-</span>}
                                  </td>
                                  <td className=" font_work ">
                                    {data?.stockOut !== undefined ? data.stockOut : <span className="text-black">-</span>}
                                  </td>
                                  <td className=" font_work">
                                    {data?.stock !== null && data?.stock !== undefined && data.stock !== ""
                                      ? data.stock
                                      : <span className="text-black">-</span>}
                                  </td>
                                  <td className=" font_work ">
                                    {data?.date
                                      ? new Date(data.date).toLocaleDateString('en-GB') 
                                      : <span className="text-black">-</span>}

                                  </td>
                                  <td >
                                    <span
                                      className="icon-wrapper me-4"
                                      title="View"
                                      onClick={() => navigate(`/shivay/ViewProduct?id=${data?.productId}&warehouseId=${data?.warehouseId}`)}
                                    >
                                      <PiEye className="fs-4"
                                        style={{ cursor: 'pointer' }} />
                                    </span>
                                  </td>
                                </tr>
                              )))}
                          </tbody>
                        )}
                      </table>
                      <Pagination
                        pageIndex={dispatchPageIndex}
                        pageSize={dispatchPageSize}
                        totalPages={store?.dispatchListReducer?.dispatchList?.totalPages}
                        setPageIndex={setDispatchPageIndex}
                        onChangePageSize={setDispatchPageSize}
                      />
                    </div>
                  </div>
                }
              </Card.Body>
            </Card>
          </div>
        </div>
      </Row>
      {/* } */}
      {/* Off Canvas */}
      <Offcanvas show={show} onHide={handleClose} placement="end" style={{ width: '60rem' }}>
        {/* backdrop="static" */}
        <Offcanvas.Header className="pb-0" closeButton>
          <Offcanvas.Title><TiArrowLeft className="fw-bold fs-3" style={{ cursor: 'pointer' }} onClick={handleClose} />&nbsp;Filter</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="pt-0">
          <div>
            <Filter />
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Dashboard;
