import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { createNotificationActions, getNotificationActions, updateNotificationActions } from "../../../../redux/actions";
import { ButtonLoading } from "../../../../helpers/loader/Loading";
// import ToastContainer from "../../../../helpers/toast/ToastContainer";

const NotificationModal = ({ show, hide, notificationData }) => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);

    const loading = store?.createNotificationDataReducer?.loading || store?.updateNotificationDataReducer?.loading
    const createStatus = store?.createNotificationDataReducer?.notificationData?.status
    const updateStatus = store?.updateNotificationDataReducer?.notificationData?.status
    const [notification, setNotification] = useState({
        type: "",
        message: "",
        status: false,
    });
    const closeModal=()=>{
        setNotification({
            type: "",
            message: "",
    })
        hide();
    }
    // Handle changes in form fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNotification((prev) => ({ ...prev, [name]: value }));
    };

    // Handle ReactQuill editor changes
    const handleQuillChange = (value) => {
        setNotification((prev) => ({ ...prev, message: value }));
    };

    useEffect(() => {
        if (notificationData?.data) {
            setNotification({
                type: notificationData?.data?.type || "",
                message: notificationData?.data?.message || "",
                status: notificationData?.data?.status ?? false,
            });
        }
    }, [notificationData?.data]);


    // Handle form submission
    const handleSubmit = () => {
        if (!notification.type || !notification.message.trim()) {
            // ToastContainer("Please fill in all fields as they are required !.",'info');
            return;
        }
        const data = {
            _id: notificationData?.data?._id,
            type: notification?.type,
            message: notification?.message,
            status: notification?.status
        }
        if (notificationData?.data?._id) {
            dispatch(updateNotificationActions(data));
        } else {
            dispatch(createNotificationActions(notification));
        }

    };
    useEffect(() => {
        if (!loading && (createStatus === 200 || updateStatus === 200)) {
            dispatch(getNotificationActions({ search: '', limit: '', page: '' }));
            closeModal()
        }
    }, [createStatus, updateStatus, loading, dispatch]);


    const requiredStar=<span className="text-danger fs-4">*</span>

    return (
        <Modal show={show} onHide={closeModal} centered size="lg" backdrop='static'>
            <Modal.Header className="px-2 py-1 text-light" style={{ backgroundColor: '#008003' }}>
                <Modal.Title>{notificationData?.type} Notification</Modal.Title>
                <i className="mdi mdi-close fs-3" onClick={closeModal} style={{ cursor: 'pointer' }}></i>
            </Modal.Header>
            <Modal.Body >
                <Form>
                <Form.Group className="mb-3">
                            <Form.Label>Type {requiredStar}</Form.Label>
                            <Form.Select name="type" value={notification.type} onChange={(e)=>setNotification({...notification,type:e.target.value})}>
                                <option value="" selected disabled>Select</option>
                                <option value="buyer">Buyer</option>
                                <option value="seller">Seller</option>
                                <option value="both">Both</option>
                            </Form.Select>
                        </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Message {requiredStar}</Form.Label>
                        <ReactQuill
                            value={notification.message}
                            onChange={handleQuillChange}
                            theme="snow"
                            placeholder="Enter message..."
                        />
                    </Form.Group>
                    {notificationData?.data && (
                        <Form.Group className="mb-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Select name="status" value={notificationData?.data?.status} onChange={handleChange}>
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </Form.Select>
                        </Form.Group>
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer className="px-2 py-1">
                <Button variant="danger" onClick={closeModal}>
                    Cancel
                </Button>
                <Button style={{ backgroundColor: '#008003' }} onClick={handleSubmit} disabled={loading}>
                    {loading ? <ButtonLoading /> : <>{notificationData?.type === 'Edit' ? 'Update' : "Add"} Notification</>}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default NotificationModal;
