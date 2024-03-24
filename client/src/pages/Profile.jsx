import { useState } from 'react'

import { useStore } from '../store'

import UserCollection from '../components/UserCollection'
import UserWishlist from '../components/UserWishlist'
import UserWhiskeys from '../components/UserWhiskeys'
import UserWhiskeyEntry from '../components/UserWhiskeyEntry'
import SuccessMessage from '../components/SuccessMessage'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'

function Profile() {
    const { user } = useStore()
    const [showCollection, setShowCollection] = useState(false)
    const [showWishlist, setShowWishlist] = useState(false)
    const [showUserWhiskeys, setShowUserWhiskeys] = useState(false)
    const [showUserWhiskeyEntry, setShowUserWhiskeyEntry] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [successMessage, setSuccessMessage] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)

    const toggleCollection = () => {
        setShowCollection(!showCollection)
    }

    const toggleWishlist = () => {
        setShowWishlist(!showWishlist)
    }

    const toggleUserWhiskeys = () => {
        setShowUserWhiskeys(!showUserWhiskeys)
    }

    const openUserWhiskeyEntry = () => {
        setShowUserWhiskeyEntry(true)
    }

    const handleSuccess = () => {
        setShowSuccess(true)
    }

    return (
        <section className="profile mt-10">
            <h1 className="font-bold my-4 text-center">{user.username}'s Profile</h1>

            <div className="text-center mb-4">
                <h2>Can't find your favorite whiskey in our database? You can create a custom whiskey entry below and add it to your collection!</h2>
            </div>

            <div className="button-container flex justify-center items-center my-5">
                <button className='my-btn' onClick={openUserWhiskeyEntry}>Create Custom Whiskey</button>
            </div>

            {/* Success message for updating a whiskey */}
            {showSuccess && <SuccessMessage
                message="Whiskey successfully created"
                showSuccess={showSuccess}
                setShowSuccess={setShowSuccess}
            />}

            {/* UserWhiskeyEntry component */}
            {showUserWhiskeyEntry && (
                <UserWhiskeyEntry
                    showModal={showUserWhiskeyEntry}
                    onClose={() => setShowUserWhiskeyEntry(false)}
                    user={user}
                    onSuccess={handleSuccess}
                    isUpdate={false}
                    setSuccessMessage={setSuccessMessage}
                    setErrorMessage={setErrorMessage}
                />
            )}

            <div className='collection-wishlist flex gap-4 lg:flex-row flex-col my-5'>
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

                {/* User Whiskeys Box */}
                <div className='user-whiskeys-box my-2 w-full rounded-md'>
                    <div className="wishlist-header flex items-center cursor-pointer my-2 bg-gray-200 w-full border border-gray-300 p-2 rounded-md" onClick={toggleUserWhiskeys}>
                        <h2 className='text-center mx-auto font-bold text-md sm:text-lg'>{user.username}'s Custom Whiskeys</h2>
                        <FontAwesomeIcon icon={showUserWhiskeys ? faCaretUp : faCaretDown} className="text-gray-500" />
                    </div>
                    {showUserWhiskeys && (
                        <div className="whiskey-details mt-4">
                            <UserWhiskeys user={user} />
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