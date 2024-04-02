import { Button, Modal } from 'flowbite-react'
import { useState, useEffect } from 'react'
import ErrorMessage from './ErrorMessage'

function WhiskeyEntry({ showModal, onClose, onAddToCollection, onUpdateReview, onSuccess, onError, user, whiskey, isUpdate, setSuccessMessage }) {
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

  // Populate the input fields with existing review data when updating
  useEffect(() => {
    if (isUpdate && whiskey) {
      setRating(whiskey.userRating)
      setNose(whiskey.userNotes.nose)
      setTaste(whiskey.userNotes.taste)
      setFinish(whiskey.userNotes.finish)
      setOverall(whiskey.userNotes.overall)
    }
  }, [isUpdate, whiskey.whiskey])

  const handleCollectionMutation = async () => {
    try {
      // Convert the rating from string to int
      const ratingInt = parseInt(rating)

      // Check if the rating is a valid number
      if (isNaN(ratingInt)) {
        setErrorMessage("Rating must be a number between 0 and 100")
        return
      }

      // Execute the appropriate mutation based on whether it's an update or add
      const response = isUpdate
        ? await onUpdateReview({
          variables: {
            userId: user._id,
            whiskeyId: whiskey.whiskey._id,
            userRating: ratingInt,
            userNotes: {
              nose: nose,
              taste: taste,
              finish: finish,
              overall: overall
            }
          }
        })
        : await onAddToCollection({
          variables: {
            userId: user._id,
            whiskeyId: whiskey._id,
            userRating: ratingInt,
            userNotes: {
              nose: nose,
              taste: taste,
              finish: finish,
              overall: overall
            }
          }
        })

      // Check if the request was successful
      if (response && response.data) {
        setSuccessMessage("Whiskey successfully added to your collection!")
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
    <Modal className='modal' dismissible show={openModal} onClose={handleCloseModal}>
      <Modal.Header>
        <div className='flex flex-col text-center'>
          <h1>{isUpdate ? "Update Review" : "Add Whiskey to Collection"}</h1>
          <p className='text-sm px-4'>Enter your review of this whiskey here, you can come back and update this at anytime! The only required entry is the rating.</p>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="modal-content sm:text-md text-sm my-3">
          <div className='flex sm:flex-row flex-col gap-2 justify-around'>
            <label className="flex flex-col">
              Nose:
              <textarea className="rounded" value={nose} onChange={(e) => setNose(e.target.value)} />
            </label>
            <label className="flex flex-col">
              Taste:
              <textarea className="rounded" value={taste} onChange={(e) => setTaste(e.target.value)} />
            </label>
            <label className="flex flex-col">
              Finish:
              <textarea className="rounded" value={finish} onChange={(e) => setFinish(e.target.value)} />
            </label>
          </div>
          <div className='flex flex-col gap-2 justify-center align-center mt-5'>
            <label>
              Overall:
            </label>
            <textarea className="rounded w-full" value={overall} onChange={(e) => setOverall(e.target.value)} />
            <div className='mt-5'>
              <label>
                Rating &#40;0-100&#41;:
                <input
                  className="rounded ml-2"
                  type="number"
                  value={rating}
                  onChange={(e) => {
                    // Limit the input value to be between 0 and 100
                    const inputValue = Math.min(Math.max(e.target.value, 0), 100);
                    setRating(inputValue);
                  }}
                  min="0"
                  max="100"
                  required
                />
              </label>
            </div>
          </div>
        </div>
        {errorMessage && <ErrorMessage message={errorMessage} setErrorMessage={setErrorMessage} />}
      </Modal.Body>
      <Modal.Footer className='justify-end'>
        <Button className="my-btn" onClick={handleCollectionMutation}>{isUpdate ? "Update Review" : "Add to Collection"}</Button>
        <Button color="gray" onClick={handleCloseModal}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default WhiskeyEntry
