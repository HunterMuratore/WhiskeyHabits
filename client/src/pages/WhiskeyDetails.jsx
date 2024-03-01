import { useParams } from "react-router-dom"
import { useQuery } from "@apollo/client"
import { GET_SINGLE_WHISKEY } from "../utils/queries"
import LoadingSpinner from "../components/LoadingSpinner"

function WhiskeyDetails() {
    const { whiskeyId } = useParams()
    const { loading, error, data } = useQuery(GET_SINGLE_WHISKEY, {
        variables: { whiskeyId },
    })

    if (loading) return <LoadingSpinner />
    if (error) return <p>Error: {error.message}</p>

    const { getWhiskeyById: whiskey } = data

    console.log(whiskey)

    return (
        <section className="whiskey-details">
            <h2 className="text-center font-bold text-xl sm:text-3xl my-6">{whiskey.name}</h2>
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

            <h3 className="text-xl sm:text-3xl font-bold"><a href={whiskey.link} target="_blank" className="whiskey-raiders">WhiskeyRaiders</a> House Review:</h3>
            <div className="my-4 text-sm sm:text-xl">
                <p className="font-semibold">Intro:</p>
                <p>{whiskey.houseReviews.intro}</p>
            </div>
            <div className="my-4 text-sm sm:text-xl">
                <p className="font-semibold">Nose:</p>
                <p>{whiskey.houseReviews.nose.map((item, index) => <span key={index}>{item} </span>)}</p>
            </div>
            <div className="my-4 text-sm sm:text-xl">
                <p className="font-semibold">Taste:</p>
                <p>{whiskey.houseReviews.taste.map((item, index) => <span key={index}>{item} </span>)}</p>
            </div>
            <div className="my-4 text-sm sm:text-xl">
                <p className="font-semibold">Finish:</p>
                <p>{whiskey.houseReviews.finish.map((item, index) => <span key={index}>{item} </span>)}</p>
            </div>
            <div className="my-4 text-sm sm:text-xl">
                <p className="font-semibold">Overall:</p>
                <p>{whiskey.houseReviews.overall}</p>
            </div>
            <div className="my-4 text-sm sm:text-xl">
                <p className="font-semibold">Score: <span className="font-normal">{whiskey.houseReviews.score}</span></p>
            </div>

        </section>
    )
}

export default WhiskeyDetails