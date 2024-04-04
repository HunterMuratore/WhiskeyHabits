import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'

import { GET_USER_BY_ID } from '../utils/queries'
import { UPDATE_USER_WHISKEY, REMOVE_USER_WHISKEY } from '../utils/mutations'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp, faX, faPencil, faTag } from '@fortawesome/free-solid-svg-icons'

import UserWhiskeyEntry from './UserWhiskeyEntry'
import LoadingSpinner from './LoadingSpinner'
import SuccessMessage from './SuccessMessage'
import ConfirmationModal from './ConfirmationModal'
import Tooltip from './Tooltip'
import Pagination from './Pagination'
import PerPage from './PerPage'

import emptyBottle from '../assets/images/empty_bottle.jpg'

function UserWhiskeys({ user }) {
    const [userWhiskeys, setUserWhiskeys] = useState([])
    const [openIndex, setOpenIndex] = useState(null)
    const [showUserWhiskeyEntry, setShowUserWhiskeyEntry] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [successMessage, setSuccessMessage] = useState(false)
    const [showConfirmationModal, setShowConfirmationModal] = useState(false)
    const [whiskeyToDelete, setWhiskeyToDelete] = useState(null)
    const [perPage, setPerPage] = useState(5)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState('')
    const [filteredWhiskeys, setFilteredWhiskeys] = useState([])

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

    useEffect(() => {
        // Perform filtering when searchTerm changes
        if (searchTerm) {
            const filteredWhiskeys = userWhiskeys.filter(whiskey =>
                whiskey.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            setFilteredWhiskeys(filteredWhiskeys)
        } else {
            // If searchTerm is empty, set filteredWhiskeys to the entire collection
            setFilteredWhiskeys(userWhiskeys)
        }
    }, [searchTerm, userWhiskeys])

    if (loading) return <LoadingSpinner />

    // Pagination logic
    const indexOfFirstWhiskey = (currentPage - 1) * perPage
    const indexOfLastWhiskey = Math.min(indexOfFirstWhiskey + perPage, filteredWhiskeys.length)
    const currentWhiskeys = filteredWhiskeys.slice(indexOfFirstWhiskey, indexOfLastWhiskey)

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

    const handleRemoveUserWhiskey = (whiskeyId) => {
        setWhiskeyToDelete(whiskeyId)
        setShowConfirmationModal(true)
    }

    const handleConfirmDelete = async () => {
        try {
            await removeUserWhiskey({ variables: { userId: user._id, whiskeyId: whiskeyToDelete } })
            setWhiskeyToDelete(null)
            setShowSuccess(true)
            setShowConfirmationModal(false)
        } catch (error) {
            console.error('Error removing whiskey from collection:', error.message)
        }
    }

    const handleCancelDelete = () => {
        setWhiskeyToDelete(null)
        setShowConfirmationModal(false)
    }

    const handlePerPageChange = (value) => {
        setPerPage(value)
        setCurrentPage(1)
    }

    const handleSearchChange = (e) => {
        const { value } = e.target
        setSearchTerm(value)
    }

    const handleClearSearch = () => {
        setSearchTerm("")
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
                {showConfirmationModal && (
                    <ConfirmationModal
                        showModal={showConfirmationModal}
                        onClose={() => setShowConfirmationModal(false)}
                        message="Are you sure you want to delete this whiskey?"
                        onConfirm={handleConfirmDelete}
                        onCancel={handleCancelDelete}
                    />
                )}

                <div className="flex justify-between mb-2">
                    {/* Search bar */}
                    <div>
                        <input
                            type="text"
                            placeholder="Search Whiskey..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="border border-gray-300 rounded-md px-2 py-1"
                            style={{ width: '200px' }}
                        />
                        <Tooltip content="Clear">
                            <button className="ml-2" onClick={handleClearSearch}>
                                <FontAwesomeIcon icon={faX} />
                            </button>
                        </Tooltip>
                    </div>
                    {/* Per page dropdown */}
                    <PerPage perPage={perPage} handlePerPageChange={handlePerPageChange} page1={5} page2={10} page3={20} />
                </div>

                {currentWhiskeys.slice(0, perPage).map((whiskey, index) => (
                    <div key={index} className="whiskey-box my-2 bg-gray-100 w-full border border-gray-300 p-4 rounded-md">
                        <div className="whiskey-header flex items-center cursor-pointer justify-between" onClick={() => toggleDropdown(index)}>
                            <div className='flex items-center gap-2'>
                                {whiskey.image !== "sameFile" ? (
                                    <img
                                        src={whiskey.image}
                                        alt={whiskey.name}
                                        className="w-24 h-24 mx-2"
                                    />
                                ) : (
                                    <img
                                        src={emptyBottle}
                                        alt={whiskey.name}
                                        className="w-24 h-24 mx-2"
                                    />
                                )}
                                <div>
                                    <h3 className="sm:text-lg text-sm font-bold mr-6">{whiskey.name}</h3>
                                    <Tooltip content="Google Shop">
                                        <span className="sm:text-lg text-sm font-bold">
                                            <a href={`https://www.google.com/search?q=${encodeURIComponent(whiskey.name)}&tbm=shop`} target="_blank" rel="noopener noreferrer">
                                                <FontAwesomeIcon icon={faTag} />
                                            </a>
                                        </span>
                                    </Tooltip>
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
                                        <p className="sm:ml-1">{whiskey.abv && `${whiskey.abv}%`}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Your Rating:</p>
                                        <p className="text-center">{whiskey.rating ? whiskey.rating : "N/A"}</p>
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
                {/* Pagination */}
                {filteredWhiskeys.length > perPage && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(filteredWhiskeys.length / perPage)}
                        onPageChange={setCurrentPage}
                    />
                )}
            </div>
        </section>
    )
}

export default UserWhiskeys