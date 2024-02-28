import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { GET_SINGLE_WHISKEY } from '../utils/queries'
import LoadingSpinner from '../components/LoadingSpinner'

function WhiskeyDetails() {
    const { whiskeyId } = useParams()
    const { loading, error, data } = useQuery(GET_SINGLE_WHISKEY, {
        variables: { whiskeyId },
    })

    if (loading) return <LoadingSpinner />
    if (error) return <p>Error: {error.message}</p>

    const { getWhiskeyById: whiskey } = data

    return (
        <div>
            <h2>{whiskey.name}</h2>
            <img src={whiskey.image} alt={whiskey.name} />
            <p>Type: {whiskey.type}</p>
            <p>Rating: {whiskey.rating}</p>
            <p>Distiller: {whiskey.stats.distiller}</p>
            <p>Bottler: {whiskey.stats.bottler}</p>
            <p>ABV: {whiskey.stats.abv}</p>
            <p>Age: {whiskey.stats.age}</p>
            <p>Price: {whiskey.stats.price}</p>
            <h3>House Reviews</h3>
            <p>Intro: {whiskey.houseReviews.intro}</p>
            <p>Nose: {whiskey.houseReviews.nose}</p>
            <p>Taste: {whiskey.houseReviews.taste}</p>
            <p>Finish: {whiskey.houseReviews.finish}</p>
            <p>Overall: {whiskey.houseReviews.overall}</p>
            <p>Score: {whiskey.houseReviews.score}</p>
        </div>
    )
}

export default WhiskeyDetails