import { useState, useEffect } from "react"
import { useParams, NavLink } from "react-router-dom"
import { useQuery, useMutation } from "@apollo/client"
import { useStore } from '../store'
import { useNavigate } from "react-router-dom"

import { GET_SINGLE_WHISKEY, GET_USER_COLLECTION_WHISKEYS } from "../utils/queries"
import { ADD_TO_COLLECTION } from "../utils/mutations"

import LoadingSpinner from "../components/LoadingSpinner"
import SuccessMessage from "../components/SuccessMessage"
import ErrorMessage from "../components/ErrorMessage"
import WhiskeyEntry from "../components/WhiskeyEntry"

function WhiskeyDetails() {
    const { whiskeyId } = useParams()
    const { user } = useStore()
    const [addToCollection] = useMutation(ADD_TO_COLLECTION)
    const navigate = useNavigate()
    const [showSuccess, setShowSuccess] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [showWhiskeyEntry, setShowWhiskeyEntry] = useState(false)
    const [whiskeyInCollection, setWhiskeyInCollection] = useState(false)

    // Query to get details of the whiskey
    const { loading: whiskeyLoading, error: whiskeyError, data: whiskeyData } = useQuery(GET_SINGLE_WHISKEY, {
        variables: { whiskeyId },
    })

    // Query to get user's collection of whiskeys
    const { loading: userCollectionLoading, error: userCollectionError, data: userCollectionData } = useQuery(GET_USER_COLLECTION_WHISKEYS, {
        variables: { userId: user ? user._id : null },
        skip: !user,
    })

    useEffect(() => {
        if (!userCollectionLoading && userCollectionData) {
            const userCollectionWhiskeys = userCollectionData.getUserCollectionWhiskeys || []

            // Extract _id values from userCollectionWhiskeys array
            const userCollectionIds = userCollectionWhiskeys.map(entry => entry.whiskey._id)

            // Check if whiskeyId exists in the array of user collection _ids
            const isInCollection = userCollectionIds.includes(whiskeyId)

            setWhiskeyInCollection(isInCollection)
        }
    }, [userCollectionLoading, userCollectionData])

    if (whiskeyLoading || userCollectionLoading) return <LoadingSpinner />
    if (whiskeyError) return <ErrorMessage message={whiskeyError.message} />

    const { getWhiskeyById: whiskey } = whiskeyData

    const handleShowWhiskeyEntry = () => {
        // Check if there is an active user
        if (!user) {
            navigate("/login")
            return
        }

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

    return (
        <section className="flex flex-col whiskey-details">
            <button className="mr-auto mt-6">
                <NavLink to="/whiskeys" className="flex text-xs sm:text-sm items-center">
                    <span className="mr-2">&larr;</span> Back to Whiskeys
                </NavLink>
            </button>
            <h2 className="text-center font-bold text-xl sm:text-3xl mt-6 mb-6">{whiskey.name}</h2>
            <div className="mx-auto text-center mb-4">
                {whiskeyInCollection ? (
                    <h2 className="accent-text text-center text-lg mb-4 mb-4">Whiskey already in collection!</h2>
                ) : (
                    <div className="mx-auto text-center mb-1">
                        <button className="my-btn mb-3" onClick={handleShowWhiskeyEntry}>Add to Collection</button>
                        <WhiskeyEntry
                            showModal={showWhiskeyEntry}
                            onClose={handleCloseWhiskeyEntry}
                            onAddToCollection={addToCollection}
                            onSuccess={handleSuccess}
                            onError={handleError}
                            user={user}
                            whiskey={whiskey}
                            isUpdate={false}
                        />
                        {showSuccess && <SuccessMessage
                            message="Whiskey successfully added to collection"
                            showSuccess={showSuccess}
                            setShowSuccess={setShowSuccess}
                        />}
                        {errorMessage && <ErrorMessage message={errorMessage} />}
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

            <h3 className="text-xl sm:text-3xl font-bold"><a href={whiskey.link} target="_blank" rel="noopener noreferrer" className="whiskey-raiders">WhiskeyRaiders</a> House Review:</h3>
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