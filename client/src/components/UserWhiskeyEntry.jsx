import { useState, useEffect } from 'react'
import { Button, Modal } from 'flowbite-react'
import { useMutation } from '@apollo/client'

import ErrorMessage from './ErrorMessage'

import { ADD_USER_WHISKEY } from '../utils/mutations'

function UserWhiskeyEntry({ showModal, onClose, onUpdateUserWhiskey, onSuccess, onError, user, whiskey, isUpdate, setSuccessMessage }) {
    const [openModal, setOpenModal] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [whiskeyName, setWhiskeyName] = useState('')
    const [type, setType] = useState('')
    const [distiller, setDistiller] = useState('')
    const [abv, setAbv] = useState('')
    const [rating, setRating] = useState('')
    const [nose, setNose] = useState('')
    const [taste, setTaste] = useState('')
    const [finish, setFinish] = useState('')
    const [overall, setOverall] = useState('')
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)

    const [createUserWhiskey] = useMutation(ADD_USER_WHISKEY, {
        variables: { userId: user._id }
    })

    // Update the openModal state when the showModal prop changes
    useEffect(() => {
        setOpenModal(showModal)
    }, [showModal])

    // Populate the input fields with existing review data when updating
    useEffect(() => {
        if (isUpdate && whiskey) {
            setRating(whiskey.rating)
            setNose(whiskey.review.nose)
            setTaste(whiskey.review.taste)
            setFinish(whiskey.review.finish)
            setOverall(whiskey.review.overall)
            setType(whiskey.type)
            setWhiskeyName(whiskey.name)
            setDistiller(whiskey.distiller)
            setAbv(whiskey.abv)
            setImagePreview(whiskey.image ? `http://www.whiskeyhabits.com/${whiskey.image}` : null)
        }
    }, [isUpdate, whiskey])

    // Function to revoke the object URL when component unmounts
    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview)
            }
        }
    }, [imagePreview])

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        setImageFile(file)
        setImagePreview(URL.createObjectURL(file))
    }

    const handleUserWhiskeysMutation = async () => {
        try {
            // Convert the rating from string to float
            const ratingFloat = parseFloat(rating)

            // Check if the rating is a valid number
            if (isNaN(ratingFloat)) {
                setErrorMessage("Rating must be a number between 0 and 10")
                return
            }

            const whiskeyInput = {
                name: whiskeyName,
                image: imageFile,
                type: type,
                distiller: distiller,
                abv: abv,
                rating: ratingFloat,
                review: {
                    nose: nose,
                    taste: taste,
                    finish: finish,
                    overall: overall
                }
            }

            console.log('whiskeyInput', whiskeyInput)

            // Execute the appropriate mutation based on whether it's an update or add
            const response = isUpdate
                ? await onUpdateUserWhiskey({
                    variables: {
                        userId: user._id,
                        whiskeyId: whiskey._id,
                        whiskeyInput
                    }
                })
                : await createUserWhiskey({
                    variables: {
                        userId: user._id,
                        whiskeyInput
                    }
                })

            // Check if the request was successful
            if (response && response.data) {
                setSuccessMessage("Whiskey successfully created and added to your collection!")
                onSuccess()
                handleCloseModal()
            } else {
                setErrorMessage('Failed to create whiskey')
                throw new Error('Failed to create whiskey')
            }
        } catch (error) {
            setErrorMessage(error.message)
        }
    }

    const handleCloseModal = () => {
        // Reset input fields
        setRating('')
        setNose('')
        setTaste('')
        setFinish('')
        setOverall('')
        setType('')
        setWhiskeyName('')
        setDistiller('')
        setAbv('')
        setImageFile(null)
        setImagePreview(null)
        onClose()
        setOpenModal(false)
    }

    return (
        <Modal className='modal' dismissible show={openModal} onClose={handleCloseModal}>
            <Modal.Header>{isUpdate ? "Update Whiskey" : "Create Whiskey"}</Modal.Header>
            <Modal.Body>
                <div className="modal-content sm:text-md text-sm">
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm justify-center mt-3'>
                        <div className='flex flex-wrap gap-3 justify-center mx-auto'>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            {imagePreview && (
                                <div className='image-preview'>
                                    <img
                                        src={imagePreview}
                                        alt="User Whiskey"
                                        style={{ width: '75px', height: '75px' }}
                                    />
                                </div>
                            )}
                        </div>
                        <label className="flex flex-col">
                            <span>Name:</span>
                            <textarea className="rounded mt-1" value={whiskeyName} onChange={(e) => setWhiskeyName(e.target.value)} />
                        </label>
                        <label className="flex flex-col">
                            <span>Type:</span>
                            <textarea className="rounded mt-1" value={type} onChange={(e) => setType(e.target.value)} />
                        </label>
                        <label className="flex flex-col">
                            <span>Distiller:</span>
                            <textarea className="rounded mt-1" value={distiller} onChange={(e) => setDistiller(e.target.value)} />
                        </label>
                        <label className="flex flex-col">
                            <span>ABV:</span>
                            <input
                                className="rounded mt-1"
                                type="number"
                                value={abv}
                                onChange={(e) => setAbv(e.target.value)}
                                step="0.1"
                                min="0"
                                max="100"
                            />
                        </label>
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs sm:text-sm justify-center mt-3'>
                        <label className="flex flex-col">
                            <span>Nose:</span>
                            <textarea className="rounded mt-1" value={nose} onChange={(e) => setNose(e.target.value)} />
                        </label>
                        <label className="flex flex-col">
                            <span>Taste:</span>
                            <textarea className="rounded mt-1" value={taste} onChange={(e) => setTaste(e.target.value)} />
                        </label>
                        <label className="flex flex-col">
                            <span>Finish:</span>
                            <textarea className="rounded mt-1" value={finish} onChange={(e) => setFinish(e.target.value)} />
                        </label>
                    </div>
                    <div className='grid grid-cols-1 gap-3 text-xs sm:text-sm justify-center mt-3'>
                        <label className="flex flex-col">
                            <span>Overall:</span>
                            <textarea className="rounded mt-1" value={overall} onChange={(e) => setOverall(e.target.value)} />
                        </label>
                    </div>
                    <div className='grid grid-cols-3 gap-3 text-xs sm:text-sm justify-center mt-3'>
                        <label className="flex flex-col">
                            <span>Rating (0-10):</span>
                            <input
                                className="rounded mt-1"
                                type="number"
                                value={rating}
                                onChange={(e) => {
                                    const inputValue = Math.min(Math.max(e.target.value, 0), 10)
                                    setRating(inputValue)
                                }}
                                min="0"
                                max="10"
                            />
                        </label>
                    </div>
                </div>

                {errorMessage && <ErrorMessage message={errorMessage} setErrorMessage={setErrorMessage} />}

            </Modal.Body>
            <Modal.Footer className='justify-end'>
                <Button className="my-btn" onClick={handleUserWhiskeysMutation}>{isUpdate ? "Update Whiskey" : "Create Whiskey"}</Button>
                <Button color="gray" onClick={handleCloseModal}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default UserWhiskeyEntry
