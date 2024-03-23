import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { NavLink } from "react-router-dom"

import { GET_USER_WISHLIST_WHISKEYS } from '../utils/queries'
import { REMOVE_FROM_WISHLIST } from '../utils/mutations'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp, faX, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'

import LoadingSpinner from './LoadingSpinner'

function UserWishlist({ user }) {
    const [openIndex, setOpenIndex] = useState(null)
    const [wishlistWhiskeys, setWishlistWhiskeys] = useState([])

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

    if (wishlistLoading) return <LoadingSpinner />

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

                {wishlistWhiskeys.map((whiskey, index) => (
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
                                        <p className="font-semibold">Score:</p>
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
            </div>
        </section>
    )
}

export default UserWishlist