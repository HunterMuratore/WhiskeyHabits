import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { NavLink } from "react-router-dom"

import { GET_USER_COLLECTION_WHISKEYS } from '../utils/queries'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'

import LoadingSpinner from './LoadingSpinner'

function UserCollection({ userProfile }) {
    const [openIndex, setOpenIndex] = useState(null)

    const { loading, error, data, refetch } = useQuery(GET_USER_COLLECTION_WHISKEYS, {
        variables: { userId: userProfile._id },
    })

    useEffect(() => {
        refetch()
    }, [userProfile, refetch])

    if (loading) return <LoadingSpinner />

    const whiskeys = data.getUserCollectionWhiskeys

    // Sort whiskeys based on the order of whiskeyIds in userProfile.userCollection
    const whiskeysSorted = userProfile.userCollection.map(({ whiskeyId }) =>
        whiskeys.find((whiskey) => whiskey._id === whiskeyId)
    )

    const toggleDropdown = (index) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    return (
        <section className="userCollection flex justify-center">
            <div className="w-full grid grid-cols-1">
                {whiskeys.length === 0 && (
                    <div className="text-center">
                        <p>You have no whiskeys in your collection yet!</p>
                        <div className="text-center my-8">
                            <NavLink
                                to="/whiskey"
                                className="my-btn"
                            >
                                Explore Whiskeys!
                            </NavLink>
                        </div>
                    </div>
                )}
                {whiskeysSorted.map((whiskey, index) => (
                    <div key={index} className="whiskey-box my-2 bg-gray-100 w-full border border-gray-300 p-4 rounded-md">
                        <div className="whiskey-header flex items-center cursor-pointer justify-between" onClick={() => toggleDropdown(index)}>
                            <div className='flex items-center gap-2'>
                                <img src={whiskey.image} alt={whiskey.name} className="w-24 h-24 mx-2" />
                                <h3 className="text-lg font-bold mr-6">{whiskey.name}</h3>
                            </div>
                            <FontAwesomeIcon icon={openIndex === index ? faCaretUp : faCaretDown} className="text-gray-500" />
                        </div>
                        {openIndex === index && (
                            <div className="whiskey-details mt-4">
                                <div className='flex gap-2 justify-around'>
                                    <div>
                                        <p className="text-sm font-semibold">Type:</p>
                                        <p className="text-sm ml-1">{whiskey.type}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">Distiller:</p>
                                        <p className="text-sm ml-1">{whiskey.stats.distiller}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">ABV:</p>
                                        <p className="text-sm ml-1">{whiskey.stats.abv}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">{userProfile.username}'s Rating:</p>
                                        <p className="text-sm text-center">{userProfile.userCollection[index].userRating}</p>
                                    </div>
                                </div>
                                {/* Display user's whiskey details */}
                                <h4 className="text-md font-semibold mt-4 mb-2">{userProfile.username}'s Reviews</h4>
                                <div className="flex gap-3 justify-between flex-wrap">
                                    <div className="note-box flex-1">
                                        <p className="text-sm font-semibold">Nose:</p>
                                        <p className="text-sm ml-1">{userProfile.userCollection[index].userNotes.nose}</p>
                                    </div>
                                    <div className="note-box flex-1">
                                        <p className="text-sm font-semibold">Taste:</p>
                                        <p className="text-sm ml-1">{userProfile.userCollection[index].userNotes.taste}</p>
                                    </div>
                                    <div className="note-box flex-1">
                                        <p className="text-sm font-semibold">Finish:</p>
                                        <p className="text-sm ml-1">{userProfile.userCollection[index].userNotes.finish}</p>
                                    </div>
                                    <div className="note-box flex-1">
                                        <p className="text-sm font-semibold">Overall:</p>
                                        <p className="text-sm ml-1">{userProfile.userCollection[index].userNotes.overall}</p>
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

