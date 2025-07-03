// // @flow
// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { useTranslation } from 'react-i18next';
// import { Row, Col, Spinner } from 'react-bootstrap';

// // actions
// import { logoutUser } from '../../redux/actions';

// // components
// import AccountLayout from './AccountLayout';

// // images
// import logoutIcon from '../../assets/images/logout-icon.svg';

// /* bottom link */
// const BottomLink = () => {
//     const { t } = useTranslation();

//     return (
//         <Row className="mt-3">
//             <Col className="text-center">
//                 <p className="text-muted">
//                     {t('Back to ')}{' '}
//                     <Link to={'/account/login'} className="text-muted ms-1">
//                         <b>{t('Log In')}</b>
//                     </Link>
//                 </p>
//             </Col>
//         </Row>
//     );
// };

// const Logout = (): React$Element<any> | React$Element<React$FragmentType> => {
//     const { t } = useTranslation();
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         let isMounted = true; // Flag to prevent state updates after unmount

//         const performLogout = async () => {
//             try {
//                 // Clear client-side tokens immediately
//                 localStorage.removeItem('authToken');
//                 sessionStorage.removeItem('authToken');

//                 // Dispatch logout action
//                 await dispatch(logoutUser());

//                 if (isMounted) {
//                     // Force redirect to login page with full page reload if needed
//                     if (window.location.pathname !== '/account/login') {
//                         window.location.href = '/account/login';
//                         return;
//                     }
//                 }
//             } catch (err) {
//                 if (isMounted) {
//                     setError(t('Logout failed. Please try again.'));
//                     console.error('Logout error:', err);
//                 }
//             } finally {
//                 if (isMounted) {
//                     setLoading(false);
//                 }
//             }
//         };

//         performLogout();

//         return () => {
//             isMounted = false; // Cleanup function
//         };
//     }, [dispatch, navigate, t]);

//     if (loading) {
//         return (
//             <AccountLayout>
//                 <div className="text-center w-75 m-auto">
//                     <Spinner animation="border" role="status">
//                         <span className="visually-hidden">{t('Logging out...')}</span>
//                     </Spinner>
//                     <p className="mt-2">{t('Logging out...')}</p>
//                 </div>
//             </AccountLayout>
//         );
//     }

//     if (error) {
//         return (
//             <AccountLayout>
//                 <div className="text-center w-75 m-auto">
//                     <div className="alert alert-danger">{error}</div>
//                     <button className="btn btn-primary" onClick={() => window.location.reload()}>
//                         {t('Try Again')}
//                     </button>
//                 </div>
//             </AccountLayout>
//         );
//     }

//     return (
//         <AccountLayout bottomLinks={<BottomLink />}>
//             <div className="text-center w-75 m-auto">
//                 <h4 className="text-dark-50 text-center mt-0 fw-bold">{t('See You Again !')}</h4>
//                 <p className="text-muted mb-4">{t('You are now successfully logged out.')}</p>

//                 <div className="logout-icon m-auto">
//                     <img src={logoutIcon} alt={t('Logged out')} />
//                 </div>
//             </div>
//         </AccountLayout>
//     );
// };

// export default Logout;

// @flow
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Row, Col } from 'react-bootstrap';

//actions
import { logoutUser } from '../../redux/actions';

// components
import AccountLayout from './AccountLayout';

// images
import logoutIcon from '../../assets/images/logout-icon.svg';

/* bottom link */
const BottomLink = () => {
    const { t } = useTranslation();
 
    return (
        <Row className="mt-3">
            <Col className="text-center">
                <p className="text-muted">
                    {t('Back to ')}{' '}
                    <Link to={'/account/login'} className="text-muted ms-1">
                        <b>{t('Log In')}</b>
                    </Link>
                </p>
            </Col>
        </Row>
    );
};

const Logout = (): React$Element<any> | React$Element<React$FragmentType> => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const performLogout = async () => {
            try {
                await dispatch(logoutUser());
                // Clear client-side storage
                localStorage.removeItem('authToken');
                sessionStorage.removeItem('authToken');
                // Force redirect to login
                window.location.href = '/account/login';
            } catch (error) {
                console.error('Logout error:', error);
                // Fallback to navigation if full reload fails
                navigate('/account/login');
            }
        };

        performLogout();
    }, [dispatch, navigate]);

    return (
        // <AccountLayout bottomLinks={<BottomLink />}>
        //     <div className="text-center w-75 m-auto">
        //         <h4 className="text-dark-50 text-center mt-0 fw-bold">{t('See You Again !')}</h4>
        //         <p className="text-muted mb-4">{t('You are now successfully logged out.')}</p>

        //         <div className="logout-icon m-auto">
        //             <img src={logoutIcon} alt="" />
        //         </div>
        //     </div>
        // </AccountLayout>

        <AccountLayout bottomLinks={<BottomLink />}>         <div className="text-center w-75 m-auto">
             <h4 className="text-dark-50 text-center mt-0 fw-bold">{t('See You Again !')}</h4>
             <p className="text-muted mb-4">{t('You are now successfully logged out.')}</p>

              <div className="logout-icon m-auto">
                   <img src={logoutIcon} alt={t('Logged out')} />
               </div>
           </div>
         </AccountLayout>
    );
};

export default Logout;
