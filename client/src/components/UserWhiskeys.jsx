import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'

import { GET_USER_BY_ID } from '../utils/queries'
import { UPDATE_USER_WHISKEY, REMOVE_USER_WHISKEY } from '../utils/mutations'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp, faX, faPencil } from '@fortawesome/free-solid-svg-icons'

import UserWhiskeyEntry from './UserWhiskeyEntry'
import LoadingSpinner from './LoadingSpinner'
import SuccessMessage from './SuccessMessage'

import emptyBottle from '../assets/images/empty_bottle.jpg'

function UserWhiskeys({ user }) {
    const [userWhiskeys, setUserWhiskeys] = useState([])
    const [openIndex, setOpenIndex] = useState(null)
    const [showUserWhiskeyEntry, setShowUserWhiskeyEntry] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [successMessage, setSuccessMessage] = useState(false)

    // Query to fetch user by id
    const { loading, error, data, refetch } = useQuery(GET_USER_BY_ID, {
        variables: { userId: user._id },
    })

    const [updateUserWhiskey] = useMutation(UPDATE_USER_WHISKEY, {
        refetchQueries: [{ query: GET_USER_BY_ID, variables: { userId: user._id } }],
    })

    const [removeUserWhiskey] = useMutation(REMOVE_USER_WHISKEY, {
        refetchQueries: [{ query: GET_USER_BY_ID, variables: { userId: user._id } }],
    })

    useEffect(() => {
        refetch()
    }, [refetch])

    useEffect(() => {
        if (!loading && data) {
            setUserWhiskeys(data.getUserById.userWhiskeys)
        }
    }, [loading, data])

    if (loading) return <LoadingSpinner />

    const toggleDropdown = (index) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    const handleShowUserWhiskeyEntry = () => {
        setShowUserWhiskeyEntry(true)
    }

    const handleCloseUserWhiskeyEntry = () => {
        setShowUserWhiskeyEntry(false)
    }

    const handleSuccess = () => {
        setShowSuccess(true)
    }

    const handleRemoveUserWhiskey = async (whiskeyId) => {
        try {
            await removeUserWhiskey({ variables: { userId: user._id, whiskeyId } })
        } catch (error) {
            console.error('Error removing whiskey from collection:', error.message)
        }
    }

    return (
        <section className="user-whiskeys flex flex-col justify-center">
            <div className="w-full grid grid-cols-1">
                {/* Success message for updating a whiskey */}
                {showSuccess && <SuccessMessage
                    message="Whiskey successfully updated"
                    showSuccess={showSuccess}
                    setShowSuccess={setShowSuccess}
                />}

                {userWhiskeys.map((whiskey, index) => (
                    <div key={index} className="whiskey-box my-2 bg-gray-100 w-full border border-gray-300 p-4 rounded-md">
                        <div className="whiskey-header flex items-center cursor-pointer justify-between" onClick={() => toggleDropdown(index)}>
                            <div className='flex items-center gap-2'>
                                <img
                                    src={whiskey.image || emptyBottle}
                                    alt={whiskey.name}
                                    className="w-24 h-24 mx-2"
                                />
                                <div>
                                    <h3 className="sm:text-lg text-sm font-bold mr-6">{whiskey.name}</h3>
                                </div>
                            </div>
                            <FontAwesomeIcon icon={openIndex === index ? faCaretUp : faCaretDown} className="text-gray-500" />
                        </div>
                        {openIndex === index && (
                            <div className="whiskey-details mt-4">
                                <div className='flex gap-3 text-xs sm:text-sm justify-around'>
                                    <div>
                                        <p className="font-semibold">Type:</p>
                                        <p className="sm:ml-1">{whiskey.type}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Distiller:</p>
                                        <p className="sm:ml-1">{whiskey.distiller}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">ABV:</p>
                                        <p className="sm:ml-1">{whiskey.abv}%</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Your Rating:</p>
                                        <p className="text-center">{whiskey.rating}</p>
                                    </div>
                                </div>
                                {/* Display user's whiskey details */}
                                <div className='flex justify-between items-center'>
                                    <h4 className="text-md font-semibold mt-4 mb-2">{user.username}'s Review</h4>
                                    <div>
                                        <button className='mr-3' onClick={handleShowUserWhiskeyEntry}>
                                            <FontAwesomeIcon icon={faPencil} className="text-gray-500" />
                                        </button>
                                        <button onClick={() => handleRemoveUserWhiskey(whiskey._id)}>
                                            <FontAwesomeIcon icon={faX} className="text-gray-500" />
                                        </button>
                                    </div>
                                    {showUserWhiskeyEntry && (
                                        <UserWhiskeyEntry
                                            showModal={showUserWhiskeyEntry}
                                            onClose={handleCloseUserWhiskeyEntry}
                                            onSuccess={handleSuccess}
                                            onUpdateUserWhiskey={updateUserWhiskey}
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
                                        <p className="ml-1">{whiskey.review.nose}</p>
                                    </div>
                                    <div className="note-box ">
                                        <p className="font-semibold">Taste:</p>
                                        <p className="ml-1">{whiskey.review.taste}</p>
                                    </div>
                                    <div className="note-box ">
                                        <p className="font-semibold">Finish:</p>
                                        <p className="ml-1">{whiskey.review.finish}</p>
                                    </div>
                                    <div className="note-box ">
                                        <p className="font-semibold">Overall:</p>
                                        <p className="ml-1">{whiskey.review.overall}</p>
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

export default UserWhiskeys