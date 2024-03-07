import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'

import { GET_USER_COLLECTION_WHISKEYS } from '../utils/queries'
import LoadingSpinner from './LoadingSpinner'

function UserCollection({ userProfile }) {
    console.log(userProfile)

    const { loading, error, data, refetch } = useQuery(GET_USER_COLLECTION_WHISKEYS, {
        variables: { userId: userProfile._id },
    })

    console.log(userProfile.userCollection.length)

    if (loading) return <LoadingSpinner />

    const whiskeys = data.getUserCollectionWhiskeys

    return (
        <section className="userCollection flex flex-col">
            {whiskeys.map((whiskey, index) => (
                <div key={index} className="whiskey">
                    <h3>{whiskey.name}</h3>
                    <p>Type: {whiskey.type}</p>
                    <p>Rating: {whiskey.rating}</p>
                    <p>Price: {whiskey.stats.price}</p>
                    <p>ABV: {whiskey.stats.abv}</p>
                    {/* Display other whiskey details */}
                    <h4>{userProfile.username}'s Reviews</h4>
                    <p>Nose: {userProfile.userCollection[index].userNotes.nose}</p>
                    <p>Taste: {userProfile.userCollection[index].userNotes.taste}</p>
                    <p>Finish: {userProfile.userCollection[index].userNotes.finish}</p>
                    <p>Overall: {userProfile.userCollection[index].userNotes.overall}</p>
                    <p>Rating: {userProfile.userCollection[index].userRating}</p>
                </div>
            ))}
        </section>
    )
}

export default UserCollection
