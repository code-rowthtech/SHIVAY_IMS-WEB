import { Store } from 'react-notifications-component';

const ToastContainer = (message, type) => {
    Store.addNotification({
        message: message,
        type: type,
        insert: 'bottom',
        container: 'top-right',
        animationIn: ['animate__animated', 'animate__fadeIn'],
        animationOut: ['animate__animated', 'animate__fadeOut'],
        dismiss: {
            duration: 5000,
            onScreen: true,
        },
    });
};

export default ToastContainer;
