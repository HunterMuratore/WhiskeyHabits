import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { NavLink } from "react-router-dom"

import { GET_USER_COLLECTION_WHISKEYS } from '../utils/queries'
import { REMOVE_FROM_COLLECTION, UPDATE_REVIEW } from '../utils/mutations'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp, faX, faPencil, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'

import LoadingSpinner from './LoadingSpinner'
import WhiskeyEntry from './WhiskeyEntry'
import SuccessMessage from './SuccessMessage'

function UserCollection({ user }) {
    const [openIndex, setOpenIndex] = useState(null)
    const [collectionWhiskeys, setCollectionWhiskeys] = useState([])
    const [showWhiskeyEntry, setShowWhiskeyEntry] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [successMessage, setSuccessMessage] = useState(false)

    // Query to fetch user's collection of whiskeys
    const { loading: collectionLoading, error: collectionError, data: collectionData, refetch: refetchCollection } = useQuery(GET_USER_COLLECTION_WHISKEYS, {
        variables: { userId: user._id },
    })

    const [removeFromCollection] = useMutation(REMOVE_FROM_COLLECTION, {
        refetchQueries: [{ query: GET_USER_COLLECTION_WHISKEYS, variables: { userId: user._id } }],
    })

    const [updateReview] = useMutation(UPDATE_REVIEW, {
        refetchQueries: [{ query: GET_USER_COLLECTION_WHISKEYS, variables: { userId: user._id } }],
    })

    useEffect(() => {
        // Fetch the user's collection every time the component mounts
        refetchCollection()
    }, [refetchCollection])

    useEffect(() => {
        if (!collectionLoading && collectionData) {
            setCollectionWhiskeys(collectionData.getUserCollectionWhiskeys)
        }
    }, [collectionLoading, collectionData])

    if (collectionLoading) return <LoadingSpinner />

    const toggleDropdown = (index) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    const handleShowWhiskeyEntry = () => {
        setShowWhiskeyEntry(true)
    }

    const handleCloseWhiskeyEntry = () => {
        setShowWhiskeyEntry(false)
    }

    const handleSuccess = () => {
        setShowSuccess(true)
    }

    const handleRemoveFromCollection = async (whiskeyId) => {
        try {
            await removeFromCollection({ variables: { userId: user._id, whiskeyId } })
        } catch (error) {
            console.error('Error removing whiskey from collection:', error.message)
        }
    }

    return (
        <section className="user-collection flex flex-col justify-center">
            <div className="w-full grid grid-cols-1">
                {collectionWhiskeys.length === 0 && (
                    <div className="text-center">
                        <p>You have no whiskeys in your collection yet!</p>
                        <div className="text-center my-8">
                            <NavLink
                                to="/whiskeys"
                                className="my-btn"
                            >
                                Explore Whiskeys!
                            </NavLink>
                        </div>
                    </div>
                )}

                {/* Success message for updating a whiskey */}
                {showSuccess && <SuccessMessage
                    message="Whiskey successfully updated"
                    showSuccess={showSuccess}
                    setShowSuccess={setShowSuccess}
                />}

                {collectionWhiskeys.map((whiskey, index) => (
                    <div key={index} className="whiskey-box my-2 bg-gray-100 w-full border border-gray-300 p-4 rounded-md">
                        <div className="whiskey-header flex items-center cursor-pointer justify-between" onClick={() => toggleDropdown(index)}>
                            <div className='flex items-center gap-2'>
                                <img src={whiskey.whiskey.image} alt={whiskey.whiskey.name} className="w-24 h-24 mx-2" />
                                <div>
                                    <h3 className="sm:text-lg text-sm font-bold mr-6">{whiskey.whiskey.name}</h3>
                                    <NavLink to={`/whiskeys/${whiskey.whiskey._id}`}>
                                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} className='text-sm' />
                                    </NavLink>
                                </div>
                            </div>
                            <FontAwesomeIcon icon={openIndex === index ? faCaretUp : faCaretDown} className="text-gray-500" />
                        </div>
                        {openIndex === index && (
                            <div className="whiskey-details mt-4">
                                <div className='flex gap-3 text-xs sm:text-sm justify-around'>
                                    <div>
                                        <p className="font-semibold">Type:</p>
                                        <p className="sm:ml-1">{whiskey.whiskey.type}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Distiller:</p>
                                        <p className="sm:ml-1">{whiskey.whiskey.stats.distiller}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">ABV:</p>
                                        <p className="sm:ml-1">{whiskey.whiskey.stats.abv}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Your Rating:</p>
                                        <p className="text-center">{whiskey.userRating}</p>
                                    </div>
                                </div>
                                {/* Display user's whiskey details */}
                                <div className='flex justify-between items-center'>
                                    <h4 className="text-md font-semibold mt-4 mb-2">{user.username}'s Review</h4>
                                    <div>
                                        <button className='mr-3' onClick={handleShowWhiskeyEntry}>
                                            <FontAwesomeIcon icon={faPencil} className="text-gray-500" />
                                        </button>
                                        <button onClick={() => handleRemoveFromCollection(whiskey.whiskey._id)}>
                                            <FontAwesomeIcon icon={faX} className="text-gray-500" />
                                        </button>
                                    </div>
                                    {showWhiskeyEntry && (
                                        <WhiskeyEntry
                                            showModal={showWhiskeyEntry}
                                            onClose={handleCloseWhiskeyEntry}
                                            onSuccess={handleSuccess}
                                            onUpdateReview={updateReview}
                                            user={user}
                                            whiskey={whiskey}
                                            isUpdate={true}
                                            setSuccessMessage={setSuccessMessage}
                                        />
                                    )}
                                </div>
                                <div className="flex gap-3 text-xs sm:text-sm justify-between flex-col">
                                    <div className="note-box ">
                                        <p className="font-semibold">Nose:</p>
                                        <p className="ml-1">{whiskey.userNotes.nose}</p>
                                    </div>
                                    <div className="note-box ">
                                        <p className="font-semibold">Taste:</p>
                                        <p className="ml-1">{whiskey.userNotes.taste}</p>
                                    </div>
                                    <div className="note-box ">
                                        <p className="font-semibold">Finish:</p>
                                        <p className="ml-1">{whiskey.userNotes.finish}</p>
                                    </div>
                                    <div className="note-box ">
                                        <p className="font-semibold">Overall:</p>
                                        <p className="ml-1">{whiskey.userNotes.overall}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    )
}

export default UserCollection