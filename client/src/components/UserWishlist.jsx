import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { NavLink } from "react-router-dom"
import { useMediaQuery } from 'react-responsive'

import { GET_USER_WISHLIST_WHISKEYS } from '../utils/queries'
import { REMOVE_FROM_WISHLIST } from '../utils/mutations'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp, faX, faArrowUpRightFromSquare, faTag } from '@fortawesome/free-solid-svg-icons'

import LoadingSpinner from './LoadingSpinner'
import Tooltip from './Tooltip'
import Pagination from './Pagination'
import PerPage from './PerPage'

function UserWishlist({ user }) {
    const [openIndex, setOpenIndex] = useState(null)
    const [wishlistWhiskeys, setWishlistWhiskeys] = useState([])
    const [perPage, setPerPage] = useState(5)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState('')
    const [filteredWhiskeys, setFilteredWhiskeys] = useState([])
    const isSmallScreen = useMediaQuery({ maxWidth: 410 })

    // Query to fetch user's wishlist of whiskeys
    const { loading: wishlistLoading, error: wishlistError, data: wishlistData, refetch: refetchWishlist } = useQuery(GET_USER_WISHLIST_WHISKEYS, {
        variables: { userId: user._id },
    })

    const [removeFromWishlist] = useMutation(REMOVE_FROM_WISHLIST, {
        refetchQueries: [{ query: GET_USER_WISHLIST_WHISKEYS, variables: { userId: user._id } }],
    })

    useEffect(() => {
        // Fetch the user's wishlist every time the component mounts
        refetchWishlist()
    }, [refetchWishlist])

    useEffect(() => {
        if (!wishlistLoading && wishlistData) {
            setWishlistWhiskeys(wishlistData.getUserWishlistWhiskeys)
        }
    }, [wishlistLoading, wishlistData])

    useEffect(() => {
        // Perform filtering when searchTerm changes
        if (searchTerm) {
            const filteredWhiskeys = wishlistWhiskeys.filter(whiskey =>
                whiskey.whiskey.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            setFilteredWhiskeys(filteredWhiskeys)
        } else {
            // If searchTerm is empty, set filteredWhiskeys to the entire collection
            setFilteredWhiskeys(wishlistWhiskeys)
        }
    }, [searchTerm, wishlistWhiskeys])

    if (wishlistLoading) return <LoadingSpinner />

    // Pagination logic
    const indexOfFirstWhiskey = (currentPage - 1) * perPage
    const indexOfLastWhiskey = Math.min(indexOfFirstWhiskey + perPage, filteredWhiskeys.length)
    const currentWhiskeys = filteredWhiskeys.slice(indexOfFirstWhiskey, indexOfLastWhiskey)

    const toggleDropdown = (index) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    const handleRemoveFromWishlist = async (whiskeyId) => {
        try {
            await removeFromWishlist({ variables: { userId: user._id, whiskeyId } })
        } catch (error) {
            console.error('Error removing whiskey from wishlist:', error.message)
        }
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
        <section className="user-wishlist flex flex-col justify-center">
            <div className="w-full grid grid-cols-1">
                {wishlistWhiskeys.length === 0 && (
                    <div className="text-center">
                        <p>You have no whiskeys in your wishlist yet!</p>
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

                <div className="flex flex-nowrap items-center justify-between mb-2">
                    {/* Search bar */}
                    <div className='flex flex-nowrap items-center'>
                        <input
                            type="text"
                            placeholder="Search Whiskey..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="border border-gray-300 rounded-md px-2 py-1"
                            style={isSmallScreen ? { width: '150px' } : { width: '200px' }}
                        />
                        <Tooltip content="Clear">
                            <button className="mx-2" onClick={handleClearSearch}>
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
                                <img src={whiskey.whiskey.image} alt={whiskey.whiskey.name} className="w-24 h-24 mx-2" />
                                <div>
                                    <h3 className="sm:text-lg text-sm font-bold">{whiskey.whiskey.name}</h3>
                                    <div className='flex items-center'>
                                        <Tooltip content="Whiskey Details">
                                            <NavLink to={`/whiskeys/${whiskey.whiskey._id}`}>
                                                <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                                            </NavLink>
                                        </Tooltip>
                                        <Tooltip content="Google Shop">
                                            <span className="sm:text-lg text-sm font-bold ml-2">
                                                <a href={`https://www.google.com/search?q=${encodeURIComponent(whiskey.whiskey.name)}&tbm=shop`} target="_blank" rel="noopener noreferrer">
                                                    <FontAwesomeIcon icon={faTag} />
                                                </a>
                                            </span>
                                        </Tooltip>
                                    </div>

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
                                        <p className="font-semibold">Rating:</p>
                                        <p className="text-center">{whiskey.whiskey.rating}</p>
                                    </div>
                                </div>
                                {/* Display user's whiskey details */}
                                <div className='flex justify-between items-center'>
                                    <h4 className="text-md font-semibold mt-4 mb-2"><a href={whiskey.whiskey.link} target="_blank" rel="noopener noreferrer" className="whiskey-raiders">WhiskeyRaiders</a> Review</h4>
                                    <div>
                                        <button onClick={() => handleRemoveFromWishlist(whiskey.whiskey._id)}>
                                            <FontAwesomeIcon icon={faX} className="text-gray-500" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex gap-3 text-xs sm:text-sm justify-between flex-col">
                                    <div className="note-box ">
                                        <p className="font-semibold">Nose:</p>
                                        <p className="ml-1">{whiskey.whiskey.houseReviews.nose.map((item, index) => <span key={index}>{item} </span>)}</p>
                                    </div>
                                    <div className="note-box ">
                                        <p className="font-semibold">Taste:</p>
                                        <p className="ml-1">{whiskey.whiskey.houseReviews.taste.map((item, index) => <span key={index}>{item} </span>)}</p>
                                    </div>
                                    <div className="note-box ">
                                        <p className="font-semibold">Finish:</p>
                                        <p className="ml-1">{whiskey.whiskey.houseReviews.finish.map((item, index) => <span key={index}>{item} </span>)}</p>
                                    </div>
                                    <div className="note-box ">
                                        <p className="font-semibold">Overall:</p>
                                        <p className="ml-1">{whiskey.whiskey.houseReviews.overall}</p>
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

export default UserWishlist