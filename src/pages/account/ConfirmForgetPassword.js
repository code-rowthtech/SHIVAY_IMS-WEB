import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { forgotPasswordChange } from '../../redux/auth/actions';
import { useNavigate, useParams } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function ConfirmForgetPassword() {
    const dispatch = useDispatch();
    const { token } = useParams();
    const navigate = useNavigate();

    const passwordChange = useSelector((state) => state?.Auth?.passwordChange);
    const error = useSelector((state) => state?.Auth?.error); // optional if you're storing errors
    console.log(passwordChange, 'passwordChange');
    const kjhg = useSelector((state) => state?.Auth);
    console.log(kjhg, 'kjhg');

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = (data) => {
        const finalData = {
            token,
            newPassword: data.newPassword,
        };

        dispatch(forgotPasswordChange(finalData));
    };

    useEffect(() => {
        if (passwordChange === true) {
            toast.success('Password changed successfully!');
            reset();
            setTimeout(() => navigate('/account/login'), 500);
        } else if (error) {
            toast.error('Failed to change password!');
        }
    }, [passwordChange, error, navigate, reset]);

    return (
        <Row className="justify-content-center mt-5">
            <Col md={5}>
                <Card>
                    <Card.Body>
                        <h4 className="text-center mb-4">Set New Password</h4>

                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Form.Group className="mb-3">
                                <Form.Label>New Password</Form.Label>
                                <div className="position-relative">
                                    <Form.Control
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your new password"
                                        {...register('newPassword', {
                                            required: 'Password is required',
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
                                        onClick={() => setShowPassword((prev) => !prev)}>
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.newPassword?.message}
                                    </Form.Control.Feedback>
                                </div>
                            </Form.Group>

                            <div className="d-grid">
                                <Button type="submit" variant="primary">
                                    Submit
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>

            <ToastContainer position="top-right" autoClose={3000} />
        </Row>
    );
}
