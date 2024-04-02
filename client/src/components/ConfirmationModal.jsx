import { Button, Modal } from 'flowbite-react'
import { useState, useEffect } from 'react'

function ConfirmationModal({ showModal, onClose, message, onConfirm, onCancel }) {
    const [openModal, setOpenModal] = useState(false)

    // Update the openModal state when the showModal prop changes
    useEffect(() => {
        setOpenModal(showModal)
    }, [showModal])

    return (
        <Modal className='modal' dismissible show={openModal} onClose={onClose}>
            <Modal.Header>
                <div className='flex flex-col justify-center text-center'>
                    <p>{message}</p>
                </div>
            </Modal.Header>
            <Modal.Footer className='justify-center'>
                <Button className="my-btn" onClick={onConfirm}>Remove Whiskey</Button>
                <Button color="gray" onClick={onCancel}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ConfirmationModal