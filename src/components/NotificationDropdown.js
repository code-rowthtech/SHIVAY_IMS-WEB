// @flow
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Dropdown } from 'react-bootstrap';
import SimpleBar from 'simplebar-react';
import classNames from 'classnames';
import { getNotificationActions } from '../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';

const styles = {
    hidden: { maxHeight: '300px', display: 'none' },
    visible: { maxHeight: '300px', overflowY: 'auto' },
    fullView: { maxHeight: '600px', overflowY: 'auto' },
};

const NotificationDropdown = () => {
    const dispatch = useDispatch();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notifStyle, setNotifStyle] = useState(styles.hidden);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [viewAll, setViewAll] = useState(false);
    const [limit, setLimit] = useState(10); // Initial limit of 10 notifications
    const [page, setPage] = useState(1);

    const { notificationData } = useSelector((state) => state.getNotificationDataReducer || {});
    const NotificationData = notificationData?.response || [];
    const totalNotifications = notificationData?.count || 0;

    useEffect(() => {
        dispatch(getNotificationActions({
            userId: '67c69cd2b073fa62663dced3',
            limit: viewAll ? '' : limit, // Show all if viewAll is true
            page: viewAll ? '' : page,
        }));
    }, [dispatch, limit, page, viewAll]);

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
        if (!dropdownOpen) {
            setNotifStyle(viewAll ? styles.fullView : styles.visible);
        } else {
            setNotifStyle(styles.hidden);
        }
    };

    const groupedData = NotificationData.reduce((acc, item) => {
        const date = moment(item.createdAt);
        const day = date.isSame(moment(), 'day')
            ? 'Today'
            : date.isSame(moment().subtract(1, 'days'), 'day')
                ? 'Yesterday'
                : date.format('YYYY-MM-DD');

        const msg = {
            message: item.message,
            time: date.format('hh:mm A'),
            subText: item.type || '',
            isRead: item.isRead,
            icon: 'mdi mdi-bell-outline',
            variant: item.isRead ? 'light' : 'primary',
        };

        const group = acc.find((g) => g.day === day);
        if (group) group.messages.push(msg);
        else acc.push({ day, messages: [msg] });

        return acc;
    }, []);

    const handleToggleExpand = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const handleViewAll = (e) => {
        e.stopPropagation();
        setViewAll((prev) => !prev);
        setNotifStyle((prev) => (prev === styles.visible ? styles.fullView : styles.visible));

        // Reset to first page when toggling view all
        if (!viewAll) {
            setLimit(''); // Show all notifications
            setPage('');
        } else {
            setLimit(10); // Show only 10 notifications
            setPage(1);
        }
    };

    return (
        <Dropdown show={dropdownOpen} onToggle={toggleDropdown}>
            <Dropdown.Toggle
                variant="link"
                id="dropdown-notification"
                as={Link}
                to="#"
                onClick={toggleDropdown}
                className="nav-link dropdown-toggle arrow-none"
            >
                <i className="dripicons-bell noti-icon"></i>
                <span className="noti-icon-badge"></span>
            </Dropdown.Toggle>

            <Dropdown.Menu align="end" className="dropdown-menu-animated dropdown-lg">
                <div>
                    <div className="dropdown-item noti-title px-3">
                        <h5 className="m-0">Notification</h5>
                    </div>

                    <SimpleBar className="px-3" style={notifStyle}>
                        {groupedData.length > 0 ? groupedData.map((item, i) => (
                            <React.Fragment key={i}>
                                <h5 className="text-muted font-13 fw-normal mt-0">{item.day}</h5>
                                {item.messages.map((message, index) => {
                                    const globalIndex = `${i}-${index}`;
                                    const isExpanded = expandedIndex === globalIndex;
                                    return (
                                        <Dropdown.Item
                                            key={globalIndex + '-noti'}
                                            className={classNames(
                                                'p-0 notify-item card shadow-none mb-2',
                                                message.isRead ? 'read-noti' : 'unread-noti'
                                            )}
                                            onClick={() => handleToggleExpand(globalIndex)}
                                        >
                                            <Card.Body className="p-2">
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-shrink-0">
                                                        <div className="notify-icon" style={{ backgroundColor: '#00A0E3' }}>
                                                            <i className={message.icon}></i>
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow-1 ms-2">
                                                        <h5 className="noti-item-title fw-semibold mb-1">
                                                            {message.message}
                                                        </h5>
                                                        <p className="noti-item-subtitle text-muted mb-1 font-12">
                                                            {message.time}
                                                        </p>
                                                        <small className="text-muted d-block">{message.subText}</small>
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Dropdown.Item>
                                    );
                                })}
                                {!viewAll && totalNotifications > limit && (
                                    <div className="text-center mt-2 mb-2">
                                        <Button
                                            variant="link"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setLimit(prev => prev + 10); // Load 10 more notifications
                                            }}
                                            style={{ color: '#00A0E3' }}
                                        >
                                            Load More
                                        </Button>
                                    </div>
                                )}
                            </React.Fragment>
                        )) : (
                            <div className="text-center text-muted py-3">No notifications available</div>
                        )}
                    </SimpleBar>

                    <Dropdown.Item
                        className="text-center notify-item border-top border-light py-2 fw-bold"
                        style={{ color: '#00A0E3' }}
                        onClick={handleViewAll}
                    >
                        {/* {viewAll ? 'Show Less' : 'View All'} */}
                        {viewAll ? <HiChevronUp className='fs-2' /> : <HiChevronDown className='fs-2'/>}
                    </Dropdown.Item>
                </div>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default NotificationDropdown;
