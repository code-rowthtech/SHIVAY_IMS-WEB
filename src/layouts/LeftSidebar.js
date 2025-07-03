// @flow
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import classNames from 'classnames';

import { getMenuItems } from '../helpers/menu';

// components
import AppMenu from './Menu';

// images
import { Logo, Shivay_Logo } from '../helpers/image';
import LogoutModal from '../pages/account/LogoutModal';

type SideBarContentProps = {
    hideUserProfile: boolean,
};

/* sidebar content */
const SideBarContent = ({ hideUserProfile }: SideBarContentProps) => {
    return (
        <>
            {!hideUserProfile && (
                <div className="leftbar-user">
                    <Link to="/">
                        {/* <img src={} alt="" height="42" className="rounded-circle shadow-sm" /> */}
                        <span className="leftbar-user-name">Dominic Keller</span>
                    </Link>
                </div>
            )}
            <AppMenu menuItems={getMenuItems()} />

            <div className="clearfix" />
        </>
    );
};

type LeftSidebarProps = {
    hideLogo: boolean,
    hideUserProfile: boolean,
    isLight: boolean,
    isCondensed: boolean,
};

const LeftSidebar = ({ isCondensed, isLight, hideLogo, hideUserProfile }: LeftSidebarProps): React$Element<any> => {
    const menuNodeRef: any = useRef(null);

    const navigate = useNavigate();
    /**
     * Handle the click anywhere in doc
     */
    const handleOtherClick = (e: any) => {
        if (menuNodeRef && menuNodeRef.current && menuNodeRef.current.contains(e.target)) return;
        // else hide the menubar
        if (document.body) {
            document.body.classList.remove('sidebar-enable');
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOtherClick, false);

        return () => {
            document.removeEventListener('mousedown', handleOtherClick, false);
        };
    }, []);

    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [expandedItems, setExpandedItems] = useState({});

    const MENU_ITEMS_END = [
        {
            label: 'Help & Support',
            icon: 'mdi-help-circle-outline',
            isExpandable: true,
            contactInfo: {
                email: 'support@rowthtech.com',
                phone: '9876897645',
            },
        },
        {
            label: 'Privacy Policy',
            icon: 'mdi-shield-lock-outline',
            url: 'https://www.avepl.com/privacy-policy/',
            onClick: () => window.open('https://www.avepl.com/privacy-policy/', '_blank'),
        },
        {
            label: 'Terms & Conditions',
            icon: 'mdi-file-document-edit-outline',
            redirectTo: '#',
        },
        {
            key: 'logout',
            label: 'Logout',
            icon: 'mdi-logout',
        },
    ];

    const handleCheckLogout = (data) => {
        if (data === 'Logout') {
            setShowLogoutModal(true);
        }
    };

    const handleLogoutConfirm = () => {
        setShowLogoutModal(false);
        navigate('/account/logout');
    };

    const handleLogoutCancel = () => {
        setShowLogoutModal(false);
    };

    const toggleExpand = (label) => {
        setExpandedItems((prev) => ({
            ...prev,
            [label]: !prev[label],
        }));
    };

    return (
        <>
            <div className="leftside-menu" ref={menuNodeRef}>
                {!hideLogo && (
                    <>
                        <Link to="/" className="logo text-center logo-light">
                            <span className="logo-lg">
                                <img src={isLight ? Shivay_Logo : Shivay_Logo} alt="logo" height="60" />
                            </span>
                            <span className="logo-sm">
                                <img src={isLight ? Shivay_Logo : Shivay_Logo} alt="logo" height="50" />
                            </span>
                        </Link>

                        <Link to="/" className="logo text-center logo-dark">
                            <span className="logo-lg">
                                <img src={isLight ? Shivay_Logo : Shivay_Logo} alt="logo" height="60" />
                            </span>
                            <span className="logo-sm">
                                <img src={isLight ? Shivay_Logo : Shivay_Logo} alt="logo" height="50" />
                            </span>
                        </Link>
                    </>
                )}

                <div className="d-flex flex-column h-100">
                    {/* Sidebar content (main scrollable area) */}
                    <div className="flex-grow-1 overflow-hidden">
                        {!isCondensed ? (
                            <SimpleBar style={{ maxHeight: '100%' }} timeout={500} scrollbarMaxSize={320}>
                                <SideBarContent
                                    menuClickHandler={() => {}}
                                    isLight={isLight}
                                    hideUserProfile={hideUserProfile}
                                />
                            </SimpleBar>
                        ) : (
                            <SideBarContent isLight={isLight} hideUserProfile={hideUserProfile} />
                        )}
                    </div>

                    {/* Bottom fixed content */}
                    <div className="pt-2 border-top">
                        {MENU_ITEMS_END.map((ele, index) => {
                            const isLogout = ele.label === 'Logout';
                            const isExpanded = expandedItems[ele.label];

                            return (
                                <div key={index} className="">
                                    <div className="info-color px-2 py-1 align-items-center">
                                        <button
                                            onClick={() => {
                                                if (isLogout) {
                                                    handleCheckLogout(ele.label);
                                                } else if (ele.onClick) {
                                                    ele.onClick();
                                                } else if (ele.isExpandable) {
                                                    toggleExpand(ele.label);
                                                } else {
                                                    navigate(ele.redirectTo || '#');
                                                }
                                            }}
                                            className="px-2 textLeftSidebar bg-transparent border-0 w-100 text-start">
                                            <span className={`mdi ${ele.icon} mdi-18px px-1 iconsLeftSidebar`}></span>
                                            <span className="px-2 sidebar_listItems notranslate">{ele.label}</span>
                                            {ele.isExpandable && (
                                                <span className="float-end" style={{ marginTop: '5px' }}>
                                                    <i className={`mdi mdi-chevron-${isExpanded ? 'up' : 'down'}`}></i>
                                                </span>
                                            )}
                                        </button>
                                    </div>

                                    {ele.isExpandable && isExpanded && (
                                        <div className="px-4 py-2 bg-light">
                                            <div className="d-flex align-items-center mb-1">
                                                <i
                                                    className="mdi mdi-email-outline me-2"
                                                    style={{ fontSize: '14px' }}></i>
                                                <a
                                                    style={{ fontSize: '14px' }}
                                                    href={`mailto:${ele.contactInfo.email}`}>
                                                    {ele.contactInfo.email}
                                                </a>
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <i
                                                    className="mdi mdi-phone-outline me-2"
                                                    style={{ fontSize: '14px' }}></i>
                                                <a
                                                    style={{ fontSize: '14px' }}
                                                    href={`tel:${ele.contactInfo.phone.replace(/\D/g, '')}`}>
                                                    {ele.contactInfo.phone}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <LogoutModal show={showLogoutModal} onConfirm={handleLogoutConfirm} onCancel={handleLogoutCancel} />
            </div>
        </>
    );
};

LeftSidebar.defaultProps = {
    hideLogo: false,
    hideUserProfile: false,
    isLight: false,
    isCondensed: false,
};

export default LeftSidebar;
