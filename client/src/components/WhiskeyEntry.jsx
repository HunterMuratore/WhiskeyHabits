import { Button, Modal } from 'flowbite-react'
import { useState, useEffect } from 'react'

import ErrorMessage from './ErrorMessage'

function WhiskeyEntry({ showModal, onClose, onAddToCollection, onSuccess, onError, user, whiskey }) {
  const [openModal, setOpenModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [rating, setRating] = useState('')
  const [nose, setNose] = useState('')
  const [taste, setTaste] = useState('')
  const [finish, setFinish] = useState('')
  const [overall, setOverall] = useState('')

  // Update the openModal state when the showModal prop changes
  useEffect(() => {
    setOpenModal(showModal)
  }, [showModal])

  const handleAddToCollection = async () => {
    try {
      // Convert the rating from string to float
      const ratingFloat = parseFloat(rating)

      // Check if the rating is a valid number
      if (isNaN(ratingFloat)) {
        setErrorMessage("Rating must be a number between 0 and 10")
        return
      }

      // Execute the mutation to add the whiskey to the user's collection
      const response = await onAddToCollection({
        variables: {
          userId: user._id,
          whiskeyId: whiskey._id,
          userRating: ratingFloat,
          userNotes: {
            nose: nose,
            taste: taste,
            finish: finish,
            overall: overall
          }
        },
      })

      // Check if the request was successful
      if (response && response.data && response.data.addToCollection) {
        onSuccess()
        handleCloseModal()
      } else {
        setErrorMessage('Failed to add whiskey to collection')
        throw new Error('Failed to add whiskey to collection')
      }
    } catch (error) {
      setErrorMessage(error.message)
      onError(error.message)
    }
  }

  const handleCloseModal = () => {
    // Reset input fields
    setRating('')
    setNose('')
    setTaste('')
    setFinish('')
    setOverall('')
    onClose()
    setOpenModal(false)
  }

  return (
    <>
      <Modal dismissible show={openModal} onClose={handleCloseModal}>
        <Modal.Header>Add Whiskey to Collection</Modal.Header>
        <Modal.Body>
          <div className="modal-content flex flex-wrap justify-around my-4">
            <div className='flex gap-2 align-center mb-2'>
              <label>
                Nose:
                <textarea className="rounded" value={nose} onChange={(e) => setNose(e.target.value)} />
              </label>
              <label>
                Taste:
                <textarea className="rounded" value={taste} onChange={(e) => setTaste(e.target.value)} />
              </label>
              <label>
                Finish:
                <textarea className="rounded" value={finish} onChange={(e) => setFinish(e.target.value)} />
              </label>
            </div>
            <div className='flex flex-col gap-2 justify-center align-center'>
              <label>
                Overall:
              </label>
              <textarea className="rounded" value={overall} onChange={(e) => setOverall(e.target.value)} />
              <label>
                Rating &#40;0-10&#41;:
                <input
                  className="rounded ml-2"
                  type="number"
                  value={rating}
                  onChange={(e) => {
                    // Limit the input value to be between 0 and 10
                    const inputValue = Math.min(Math.max(e.target.value, 0), 10);
                    setRating(inputValue);
                  }}
                  min="0"
                  max="10"
                />
              </label>
            </div>
          </div>
          {errorMessage && <ErrorMessage message={errorMessage} />}
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
