import { Button, Modal } from 'flowbite-react'
import { useState, useEffect } from 'react'

function WhiskeyEntry({ showModal, onClose, onAddToCollection }) {
  const [openModal, setOpenModal] = useState(false)
  const [rating, setRating] = useState('')
  const [nose, setNose] = useState('')
  const [taste, setTaste] = useState('')
  const [finish, setFinish] = useState('')

  // Update the openModal state when the showModal prop changes
  useEffect(() => {
    setOpenModal(showModal)
  }, [showModal])

  const handleAddToCollection = () => {
    // Execute the mutation to add the whiskey to the user's collection
    onAddToCollection({
      variables: {
          userId: user.id,
          whiskeyId: whiskeyId,
      },
  })
      .then(() => {
          setShowSuccess(true)
      })
      .catch((error) => {
          setErrorMessage(error.message)
      })

    // Reset input fields after adding to collection
    setRating('')
    setNose('')
    setTaste('')
    setFinish('')
    setOpenModal(false)
  }

  const handleCloseModal = () => {
    // Reset input fields
    setRating('')
    setNose('')
    setTaste('')
    setFinish('')
    onClose()
    setOpenModal(false)
  }

  return (
    <>
      <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Add Whiskey to Collection</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <label>
              Rating:
              <input type="number" value={rating} onChange={(e) => setRating(e.target.value)} />
            </label>
            <label>
              Nose:
              <textarea value={nose} onChange={(e) => setNose(e.target.value)} />
            </label>
            <label>
              Taste:
              <textarea value={taste} onChange={(e) => setTaste(e.target.value)} />
            </label>
            <label>
              Finish:
              <textarea value={finish} onChange={(e) => setFinish(e.target.value)} />
            </label>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="my-btn" onClick={handleAddToCollection}>Add to Collection</Button>
          <Button color="gray" onClick={handleCloseModal}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default WhiskeyEntry
