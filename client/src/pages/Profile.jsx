import { useState } from 'react'

import { useStore } from '../store'

import UserCollection from '../components/UserCollection'
import UserWishlist from '../components/UserWishlist'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'


function Profile() {
    const { user } = useStore()
    const [showCollection, setShowCollection] = useState(false)
    const [showWishlist, setShowWishlist] = useState(false)

    const toggleCollection = () => {
        setShowCollection(!showCollection)
    }

    const toggleWishlist = () => {
        setShowWishlist(!showWishlist)
    }

    return (
        <section className="profile mt-10">
            <h1 className="font-bold my-4 text-center">{user.username}'s Profile</h1>

            <div className='collection-wishlist flex gap-4 lg:flex-row flex-col my-10'>
                {/* User Collection Box */}
                <div className="collection-box my-2 w-full rounded-md">
                    <div className="collection-header flex items-center cursor-pointer my-2 bg-gray-200 w-full border border-gray-300 p-2 rounded-md" onClick={toggleCollection}>
                        <h2 className='text-center mx-auto font-bold text-md sm:text-lg'>{user.username}'s Whiskey Collection</h2>
                        <FontAwesomeIcon icon={showCollection ? faCaretUp : faCaretDown} className="text-gray-500" />
                    </div>
                    {showCollection && (
                        <div className="whiskey-details mt-4">
                            <UserCollection user={user} />
                        </div>
                    )}
                </div>

                {/* User Wishlist Box */}
                <div className='wishlist-box my-2 w-full rounded-md'>
                    <div className="wishlist-header flex items-center cursor-pointer my-2 bg-gray-200 w-full border border-gray-300 p-2 rounded-md" onClick={toggleWishlist}>
                        <h2 className='text-center mx-auto font-bold text-md sm:text-lg'>{user.username}'s Whiskey Wishlist</h2>
                        <FontAwesomeIcon icon={showWishlist ? faCaretUp : faCaretDown} className="text-gray-500" />
                    </div>
                    {showWishlist && (
                        <div className="whiskey-details mt-4">
                            <UserWishlist user={user} />
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default Profile