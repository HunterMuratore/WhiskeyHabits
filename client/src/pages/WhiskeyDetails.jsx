import { useState, useEffect } from "react"
import { useParams, NavLink } from "react-router-dom"
import { useQuery, useMutation } from "@apollo/client"
import { useStore } from '../store'
import { useNavigate } from "react-router-dom"

import { GET_SINGLE_WHISKEY, GET_USER_COLLECTION_WHISKEYS, GET_USER_WISHLIST_WHISKEYS } from "../utils/queries"
import { ADD_TO_COLLECTION, ADD_TO_WISHLIST } from "../utils/mutations"

import LoadingSpinner from "../components/LoadingSpinner"
import SuccessMessage from "../components/SuccessMessage"
import ErrorMessage from "../components/ErrorMessage"
import WhiskeyEntry from "../components/WhiskeyEntry"
import Tooltip from "../components/Tooltip"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTag, faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons'

function WhiskeyDetails() {
    const { whiskeyId } = useParams()
    const { user } = useStore()
    const [addToCollection] = useMutation(ADD_TO_COLLECTION)
    const [addToWishlist] = useMutation(ADD_TO_WISHLIST)
    const navigate = useNavigate()
    const [showSuccess, setShowSuccess] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null)
    const [showWhiskeyEntry, setShowWhiskeyEntry] = useState(false)
    const [whiskeyInCollection, setWhiskeyInCollection] = useState(false)
    const [whiskeyInWishlist, setWhiskeyInWishlist] = useState(false)

    // Query to get details of the whiskey
    const { loading: whiskeyLoading, error: whiskeyError, data: whiskeyData } = useQuery(GET_SINGLE_WHISKEY, {
        variables: { whiskeyId },
    })

    // Query to get user's collection of whiskeys
    const { loading: userCollectionLoading, error: userCollectionError, data: userCollectionData } = useQuery(GET_USER_COLLECTION_WHISKEYS, {
        variables: { userId: user ? user._id : null },
        skip: !user,
    })

    // Query to get user's collection of whiskeys
    const { loading: userWishlistLoading, error: userWishlistError, data: userWishlistData } = useQuery(GET_USER_WISHLIST_WHISKEYS, {
        variables: { userId: user ? user._id : null },
        skip: !user,
    })

    // Check to see if whiskey is in user's collection or wishlist
    useEffect(() => {
        if (!userCollectionLoading && userCollectionData && !userWishlistLoading && userWishlistData) {
            const userCollectionWhiskeys = userCollectionData.getUserCollectionWhiskeys || []
            const userWishlistWhiskeys = userWishlistData.getUserWishlistWhiskeys || []

            // Extract _id values from userCollectionWhiskeys and userWishlistWhiskeys arrays
            const userCollectionIds = userCollectionWhiskeys.map(entry => entry.whiskey._id)
            const userWishlistIds = userWishlistWhiskeys.map(entry => entry.whiskey._id)

            // Check if whiskeyId exists in the arrays above
            const isInCollection = userCollectionIds.includes(whiskeyId)
            const isInWishlist = userWishlistIds.includes(whiskeyId)

            setWhiskeyInCollection(isInCollection)
            setWhiskeyInWishlist(isInWishlist)
        }
    }, [userCollectionLoading, userCollectionData, userWishlistLoading, userWishlistData])

    if (whiskeyLoading || userCollectionLoading || userWishlistLoading) return <LoadingSpinner />
    if (whiskeyError) return <ErrorMessage message={whiskeyError.message} />

    const { getWhiskeyById: whiskey } = whiskeyData

    const googleShopSearchURL = `https://www.google.com/search?q=${encodeURIComponent(whiskey.name)}&tbm=shop`

    // Check if there is an active user
    const checkUser = () => {
        if (!user) {
            // Store the current URL before redirecting to login
            localStorage.setItem('redirectUrl', window.location.pathname)
            navigate("/login")
            return
        }
    }

    const handleShowWhiskeyEntry = () => {
        checkUser()
        setShowWhiskeyEntry(true)
    }

    const handleCloseWhiskeyEntry = () => {
        setShowWhiskeyEntry(false)
    }

    const handleSuccess = () => {
        setShowSuccess(true)
    }

    const handleError = (error) => {
        setErrorMessage(error)
    }

    const handleAddToWishlist = async () => {
        try {
            checkUser()

            const response = await addToWishlist({
                variables: {
                    userId: user._id,
                    whiskeyId: whiskey._id,
                }
            })

            // Check if the request was successful
            if (response && response.data) {
                setSuccessMessage("Whiskey successfully added to your wishlist!")
                handleSuccess()
            } else {
                setErrorMessage('Failed to add whiskey to collection')
                throw new Error('Failed to add whiskey to collection')
            }
        } catch (error) {
            setErrorMessage(error.message)
            onError(error.message)
        }
    }

    return (
        <section className="flex flex-col whiskey-details">
            <button className="mr-auto mt-6">
                <Tooltip content="Whiskeys">
                    <NavLink to="/whiskeys" className="text-lg sm:text-xl">
                        <FontAwesomeIcon icon={faCircleArrowLeft} size="lg" />
                    </NavLink>
                </Tooltip>
            </button>
            <h2 className="text-center font-bold text-xl sm:text-3xl mt-3 mb-6">{whiskey.name}
                <Tooltip content="Google Shop">
                    <span className="shop-icon font-normal ml-2 text-sm sm:text-xl">
                        <a href={googleShopSearchURL} target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faTag} />
                        </a>
                    </span>
                </Tooltip>
            </h2>

            <div className="flex items-center justify-center gap-3 mx-auto text-center mb-4">
                {whiskeyInCollection ? (
                    <h2 className="accent-text text-center text-lg mb-4 mb-4">Whiskey already in collection!</h2>
                ) : (
                    <div className="mx-auto text-center">
                        {whiskeyInWishlist ? (
                            <div className="flex flex-col justify-center items-center gap-3 mb-3">
                                <button className="my-btn" onClick={handleShowWhiskeyEntry}>Add to Collection</button>
                                <h4 className="accent-text text-center text-lg">Whiskey already in wishlist!</h4>
                            </div>
                        ) : (
                            <div className="flex flex-wrap justify-center items-center gap-3 mb-3">
                                <button className="my-btn" onClick={handleShowWhiskeyEntry}>Add to Collection</button>
                                <button className="my-btn" onClick={handleAddToWishlist}>Add to Wishlist</button>
                            </div>
                        )}
                        <WhiskeyEntry
                            showModal={showWhiskeyEntry}
                            onClose={handleCloseWhiskeyEntry}
                            onAddToCollection={addToCollection}
                            onSuccess={handleSuccess}
                            onError={handleError}
                            user={user}
                            whiskey={whiskey}
                            isUpdate={false}
                            setSuccessMessage={setSuccessMessage}
                        />
                        {showSuccess && <SuccessMessage
                            message={successMessage}
                            showSuccess={showSuccess}
                            setShowSuccess={setShowSuccess}
                        />}
                        {errorMessage && <ErrorMessage message={errorMessage} setErrorMessage={setErrorMessage} />}
                    </div>
                )}
            </div>

            <div className="flex justify-center">
                <img src={whiskey.image} alt={whiskey.name} />
            </div>
            <div className="flex justify-center">
                <div className="grid grid-cols-3 lg:grid-cols-6 text-center text-sm sm:text-lg gap-6 sm:gap-10 mt-6 mb-14">
                    <div>
                        <p className="font-semibold">Type:</p>
                        <p>{whiskey.type}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Rating:</p>
                        <p>{whiskey.rating}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Distiller:</p>
                        <p>{whiskey.stats.distiller}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Bottler:</p>
                        <p>{whiskey.stats.bottler}</p>
                    </div>
                    <div>
                        <p className="font-semibold">ABV:</p>
                        <p>{whiskey.stats.abv}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Age:</p>
                        <p>{whiskey.stats.age}</p>
                    </div>
                </div>
            </div>

            <h3 className="text-xl sm:text-3xl font-bold">
                <Tooltip content="whiskeyraiders.com">
                    <a href={whiskey.link} target="_blank" rel="noopener noreferrer" className="whiskey-raiders mr-2">WhiskeyRaiders</a>
                </Tooltip>
                House Review:</h3>
            <div className="my-4 text-sm sm:text-xl">
                <p className="font-semibold">Intro:</p>
                <p className="ml-2">{whiskey.houseReviews.intro}</p>
            </div>
            <div className="my-4 text-sm sm:text-xl">
                <p className="font-semibold">Nose:</p>
                <p className="ml-2">{whiskey.houseReviews.nose.map((item, index) => <span key={index}>{item} </span>)}</p>
            </div>
            <div className="my-4 text-sm sm:text-xl">
                <p className="font-semibold">Taste:</p>
                <p className="ml-2">{whiskey.houseReviews.taste.map((item, index) => <span key={index}>{item} </span>)}</p>
            </div>
            <div className="my-4 text-sm sm:text-xl">
                <p className="font-semibold">Finish:</p>
                <p className="ml-2">{whiskey.houseReviews.finish.map((item, index) => <span key={index}>{item} </span>)}</p>
            </div>
            <div className="my-4 text-sm sm:text-xl">
                <p className="font-semibold">Overall:</p>
                <p className="ml-2">{whiskey.houseReviews.overall}</p>
            </div>
            <div className="my-4 text-sm sm:text-xl">
                <p className="font-semibold">Score: <span className="font-normal">{whiskey.houseReviews.score}</span></p>
            </div>

        </section>
    )
}

export default WhiskeyDetails