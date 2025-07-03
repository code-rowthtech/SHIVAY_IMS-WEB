import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import PageTitle from '../../../helpers/PageTitle';
import { useSelector, useDispatch } from 'react-redux';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { ChangeProfilePasswordAction } from '../../../redux/setting/action';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SettingPage = () => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);

    const getUserId = store?.Auth?.user?.user?._id;
    const updatePasswordResponse = store?.changeProfilePasswordReducer?.data;
    console.log(updatePasswordResponse, 'API Response');

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm();

    // Set userId into form data
    useEffect(() => {
        if (getUserId) {
            setValue('userId', getUserId);
        }
    }, [getUserId, setValue]);

    const onSubmit = (data) => {
        dispatch(ChangeProfilePasswordAction(data));
    };

    // Handle toast messages based on API response
    useEffect(() => {
        if (updatePasswordResponse) {
            const isSuccess = updatePasswordResponse?.status === 200;
            const successMessage = updatePasswordResponse?.data?.message;
            const errorMessage =
                typeof updatePasswordResponse?.data === 'string'
                    ? updatePasswordResponse.data
                    : 'Failed to update password!';

            if (isSuccess) {
                toast.success(successMessage || 'Password updated successfully!');
                reset(); // Clear form on success
            } else {
                toast.error(errorMessage);
            }
        }
    }, [updatePasswordResponse, reset]);

    return (
        <div>
            <PageTitle
                breadCrumbItems={[
                    { label: 'SHIVAY Setting', path: '/shivay/settingPage' },
                    { label: 'Setting', path: '/shivay/settingPage', active: true },
                ]}
                title={'Setting'}
            />

            <Row className="justify-content-center mt-4">
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <h4 className="mb-3 text-center">Change Password</h4>

                            <Form onSubmit={handleSubmit(onSubmit)}>
                                {/* Hidden User ID */}
                                <input type="hidden" {...register('userId')} value={getUserId || ''} />

                                {/* Old Password */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Old Password</Form.Label>
                                    <div className="position-relative">
                                        <Form.Control
                                            type={showOldPassword ? 'text' : 'password'}
                                            placeholder="Enter your old password"
                                            {...register('oldPassword', {
                                                required: 'Old password is required',
                                                minLength: {
                                                    value: 6,
                                                    message: 'Password must be at least 6 characters',
                                                },
                                            })}
                                            isInvalid={!!errors.oldPassword}
                                        />
                                        <span
                                            className="position-absolute top-50 end-0 translate-middle-y pe-3"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => setShowOldPassword((prev) => !prev)}>
                                            {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                                        </span>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.oldPassword?.message}
                                        </Form.Control.Feedback>
                                    </div>
                                </Form.Group>

                                {/* New Password */}
                                <Form.Group className="mb-3">
                                    <Form.Label>New Password</Form.Label>
                                    <div className="position-relative">
                                        <Form.Control
                                            type={showNewPassword ? 'text' : 'password'}
                                            placeholder="Enter your new password"
                                            {...register('newPassword', {
                                                required: 'New password is required',
                                                minLength: {
                                                    value: 6,
                                                    message: 'Password must be at least 6 characters',
                                                },
                                            })}
                                            isInvalid={!!errors.newPassword}
                                        />
                                        <span
                                            className="position-absolute top-50 end-0 translate-middle-y pe-3"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => setShowNewPassword((prev) => !prev)}>
                                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                        </span>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.newPassword?.message}
                                        </Form.Control.Feedback>
                                    </div>
                                </Form.Group>

                                <div className="d-grid">
                                    <Button variant="primary" type="submit">
                                        Change Password
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Toast notifications */}
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default SettingPage;
