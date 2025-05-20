import { useEffect, useState } from "react";
import { Row, Col, Card, OverlayTrigger, Tooltip, Button, Table } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import PageTitle from "../../../helpers/PageTitle";
import { Loading } from "../../../helpers/loader/Loading";
import { getNotificationActions } from "../../../redux/actions";
import Pagination from "../../../helpers/Pagination";
import NotificationModal from "./notificationModal/NotificationModal";
const Notification = () => {
  const dispatch = useDispatch();
  const { getNotificationDataReducer } = useSelector((state) => state);

  const NotificationData = getNotificationDataReducer?.notificationData?.data || [];
  const TotalRecords = getNotificationDataReducer?.notificationData?.totalRecords || 0;
  const NotificationLoading = getNotificationDataReducer?.loading;

  const [search, setSearch] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [nofificationModal, setNotificationModal] = useState({
    type: "",
    data: null,
    isVisible: false,
  });

  useEffect(() => {
    setTotalPages(Math.ceil(TotalRecords / pageSize));
  }, [TotalRecords, pageSize]);

  useEffect(() => {
    dispatch(getNotificationActions({ search, limit: pageSize, page: pageIndex }));
  }, [dispatch, search, pageIndex, pageSize]);

  const handleNotificationModal = (type, data = null) => {
    setNotificationModal({ type, data, isVisible: true });
  };

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: "Notification", path: "/bmg/notification" },
          { label: "Notification", path: "/bmg/notification", active: true },
        ]}
        title="Notification Management"
      />

      <Row>
        <Col xs={12}>
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="px-3 py-1 bg-dark text-light rounded">
                  Total Notification's: {TotalRecords || 0}
                </span>
                <div className="d-flex">
                  <input
                    type="text"
                    className="form-control w-auto me-2"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <i
                      className="mdi mdi-backspace-outline text-danger fs-3 me-2"
                      onClick={() => setSearch("")}
                      style={{ cursor: "pointer" }}
                    ></i>
                  )}
                  <Button variant="success" onClick={() => handleNotificationModal("Add")}>
                    <i className="mdi mdi-plus-circle"></i> Add
                  </Button>
                </div>
              </div>

              {NotificationLoading ? (
                <Loading />
              ) : NotificationData.length > 0 ? (
                <div className="table-responsive">
                  <Table bordered hover className="bg-white text-center">
                    <thead>
                      <tr className="text-nowrap text-secondary">
                        <th><i className="mdi mdi-merge"></i></th>
                        <th>Message</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {NotificationData.map((data, index) => (
                        <tr key={data._id || index}>
                          <td>{index + 1}</td>
                          {/* <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id={`tooltip-${index}`}>
                                <div dangerouslySetInnerHTML={{ __html: data?.message || "N/A" }} />
                                </Tooltip>
                            }
                          > */}
                          <td className="p-1 m-0"> <span
                            dangerouslySetInnerHTML={{
                              __html: data?.message || "N/A",
                            }}
                          /></td>
                          {/* </OverlayTrigger> */}

                          <td>
                            <span
                              className={`badge ${data?.type === "buyer"
                                ? "bg-info"
                                : data?.type === "seller"
                                  ? "bg-danger"
                                  : data?.type === "both"
                                    ? "bg-success"
                                    : "bg-secondary"
                                } px-2 py-1`}
                            >
                              {data?.type === "buyer"
                                ? "Buyer"
                                : data?.type === "seller"
                                  ? "Seller"
                                  : data?.type === "both"
                                    ? "Both"
                                    : "Unknown"}
                            </span>
                          </td>

                          <td>
                            <span
                              className={`badge ${data?.status ? "bg-success" : "bg-danger"
                                } px-2 py-1`}
                            >
                              {data?.status ? "✅ Active" : "❌ Inactive"}
                            </span>
                          </td>

                          <td>
                            <i
                              className="mdi mdi-square-edit-outline fs-4 text-primary"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleNotificationModal("Edit", data)}
                            ></i>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <code className="fs-5 text-muted">No Notification's found. Add some to display.</code>
                </div>
              )}
              {TotalRecords > 10 &&
                <Pagination
                  pageIndex={pageIndex}
                  pageSize={pageSize}
                  totalPages={totalPages}
                  setPageIndex={setPageIndex}
                  onChangePageSize={setPageSize}
                />
              }
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <NotificationModal
        show={nofificationModal.isVisible}
        hide={() => setNotificationModal({ ...nofificationModal, isVisible: false })}
        notificationData={nofificationModal}
      />
    </>
  );
};

export default Notification;
