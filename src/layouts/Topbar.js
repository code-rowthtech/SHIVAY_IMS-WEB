// @flow
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import { Logo, Shivay_Logo } from '../helpers/image'
import { CgProfile } from "react-icons/cg";

// actions
import { changeSidebarType } from '../redux/actions';

// components
import ProfileDropdown from '../components/ProfileDropdown';
import NotificationDropdown from '../components/NotificationDropdown';

//constants
import * as layoutConstants from '../constants/layout';
import { Dropdown } from 'react-bootstrap';
const Notifications = []
// get the profilemenu
const ProfileMenus = [
    // {
    //     label: 'My Account',
    //     icon: 'mdi mdi-account-circle',
    //     redirectTo: '#',
    // },
    // {
    //     label: 'Settings',
    //     icon: 'mdi mdi-account-edit',
    //     redirectTo: '#',
    // },
    // {
    //     label: 'Support',
    //     icon: 'mdi mdi-lifebuoy',
    //     redirectTo: '#',
    // },
    // {
    //     label: 'Lock Screen',
    //     icon: 'mdi mdi-lock-outline',
    //     redirectTo: '/account/lock-screen',
    // },
    {
        label: 'Logout',
        icon: 'mdi mdi-logout',
        redirectTo: '/account/logout',
    },
];

type TopbarProps = {
    hideLogo?: boolean,
    navCssClasses?: string,
    openLeftMenuCallBack?: () => void,
    topbarDark?: boolean,
};

const Topbar = ({ hideLogo, navCssClasses, openLeftMenuCallBack, topbarDark }: TopbarProps): React$Element<any> => {

    const location = useLocation(); // Get the current location object
    const { pathname, search } = location;
    // Define a mapping of paths to titles
    const pathToTitleMap = {
        '/shivay/dashboard': 'Dashboard',
        '/shivay/inventory': 'Product',
        '/shivay/report': 'Report',
        '/shivay/user': 'User',
        '/shivay/warehouse': 'Warehouse',
        '/shivay/openingStock': 'Opening Stock',
        '/shivay/stockIn': 'Stock In',
        '/shivay/dispatch': 'Dispatch',
        '/shivay/customer': 'Customer',
        '/shivay/supplier': 'Supplier',
        '/shivay/addStockIn': 'Add Stock In',
        '/shivay/addDispatch': 'Add Dispatch',
        '/shivay/ViewProduct': 'View Product'

    };

    const getPageTitle = (pathToTitleMap, pathname, search) => {
        const queryParams = new URLSearchParams(search);

        if (pathname === '/apps/doctors/new-doctor' && queryParams.has('id')) {
            return 'Update Doctors';
        }
        if (pathname === '/apps/Practice/updateSubClinic' && queryParams.has('id')) {
            return 'Update Sub Practice';
        }

        for (const [key, value] of Object.entries(pathToTitleMap)) {
            if (pathname.startsWith(key)) {
                return value;
            }
        }

        return 'Page Not Found';
    };

    const pageTitle = getPageTitle(pathToTitleMap, pathname, search);





    const dispatch = useDispatch();

    const [isopen, setIsopen] = useState(false);
    const navigate = useNavigate()
    const navbarCssClasses = navCssClasses || '';
    const containerCssClasses = !hideLogo ? 'container-fluid' : '';

    const { layoutType, leftSideBarType } = useSelector((state) => ({
        layoutType: state.Layout.layoutType,
        leftSideBarType: state.Layout.leftSideBarType,
    }));

    /**
     * Toggle the leftmenu when having mobile screen
     */
    const handleLeftMenuCallBack = () => {
        setIsopen((prevState) => !prevState);
        if (openLeftMenuCallBack) openLeftMenuCallBack();

        switch (layoutType) {
            case layoutConstants.LAYOUT_VERTICAL:
                // condition added
                if (window.innerWidth >= 768) {
                    if (leftSideBarType === 'fixed' || leftSideBarType === 'scrollable')
                        dispatch(changeSidebarType(layoutConstants.LEFT_SIDEBAR_TYPE_CONDENSED));
                    if (leftSideBarType === 'condensed')
                        dispatch(changeSidebarType(layoutConstants.LEFT_SIDEBAR_TYPE_FIXED));
                }
                break;

            case layoutConstants.LAYOUT_FULL:
                if (document.body) {
                    document.body.classList.toggle('hide-menu');
                }
                break;
            default:
                break;
        }
    };

    /**
     * Toggles the right sidebar
     */


    return (
        <>
           <div className={classNames('navbar-custom', navbarCssClasses, 'mb-3')}>

                <div className={containerCssClasses}>
                    {!hideLogo && (
                        <Link to="/" className="topnav-logo">
                            <span className="topnav-logo-lg">
                                <img src={Logo} alt="logo" height="70" />
                            </span>
                            <span className="topnav-logo-sm">
                                <img src={topbarDark ? Logo : Logo} alt="logo" height="50" />
                            </span>
                        </Link>
                    )}

                    <ul className="list-unstyled topbar-menu float-end mb-0">
                        {/* <li className="dropdown notification-list topbar-dropdown d-none d-lg-block">
                            <LanguageDropdown />
                        </li> */}

                        <li className="dropdown notification-list" title="Notifications" >
                            <NotificationDropdown notifications={Notifications} />
                        </li>
                        {/* <li className="dropdown notification-list d-none d-sm-inline-block">
                            <AppsDropdown />
                        </li> */}
                        {/* <li className="notification-list">
                            <button
                                className="nav-link dropdown-toggle end-bar-toggle arrow-none btn btn-link shadow-none"
                                onClick={handleRightSideBar}>
                                <i className="dripicons-gear noti-icon"></i>
                            </button>
                        </li> */}

                        {/* <li className=" ps-1 " >
                            <Dropdown align="end">
                                <Dropdown.Toggle
                                    className="d-flex align-items-center justify-content-center p-2 pe-0 bg-transparent border-0"
                                    style={{ listStyle: 'none', cursor: 'pointer' }}
                                >
                                    <CgProfile className="fs-3 mt-2 text-secondary" />
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item className="d-flex align-items-center justify-content-start gap-2 border-bottom pb-2">
                                        <CgProfile className="fs-4" /> Profile
                                    </Dropdown.Item>
                                    <Dropdown.Item className='d-flex align-items-center justify-content-start gap-2' onClick={() => navigate('/account/logout')}> <i className='mdi mdi-logout fs-4 cursor'></i> Logout</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </li> */}
                    </ul>
                    <div className="d-flex justify-content-start align-items-center">
                        {/* toggle for vertical layout */}
                        {(layoutType === layoutConstants.LAYOUT_VERTICAL || layoutType === layoutConstants.LAYOUT_FULL) && (
                            <button className="button-menu-mobile open-left" onClick={handleLeftMenuCallBack}>
                                <i className="mdi mdi-menu" />
                            </button>
                        )}

                        {/* Page Title */}
                        <div className="">
                            <h4>{pageTitle}</h4>
                        </div>
                    </div>



                    {/* toggle for horizontal layout */}
                    {layoutType === layoutConstants.LAYOUT_HORIZONTAL && (
                        <Link
                            to="#"
                            className={classNames('navbar-toggle', { open: isopen })}
                            onClick={handleLeftMenuCallBack}>
                            <div className="lines">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </Link>
                    )}

                    {/* toggle for detached layout */}
                    {layoutType === layoutConstants.LAYOUT_DETACHED && (
                        <Link to="#" className="button-menu-mobile disable-btn" onClick={handleLeftMenuCallBack}>
                            <div className="lines">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </Link>
                    )}


                </div>


            </div>

        </>
    );
};

export default Topbar;
