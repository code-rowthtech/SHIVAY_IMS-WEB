import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const DeleteModal = ({ isOpen, onCancel, onConfirm }) => {
    return (
        <Modal show={isOpen} onHide={onCancel} backdrop="static" centered style={{ background: '#3b39399c' }}>
            <Modal.Header closeButton className='py-0 bg-dark'>
                <Modal.Title className='p-0 m-0 text-danger'><h3>Confirmation!</h3></Modal.Title>
            </Modal.Header>
            <Modal.Body className='text-center'>
                <h3>Are you sure you want to delete?</h3>
                <code>Once deleted,cannot be restored!</code>
            </Modal.Body>
            <Modal.Footer className='m-0 p-0 bg-dark'>
                <Button variant="secondary" className='px-3' onClick={onCancel}>
                    No
                </Button>
                <Button variant="danger" className='px-3' onClick={onConfirm}>
                    Yes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteModal;
