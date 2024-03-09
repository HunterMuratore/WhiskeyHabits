import { useQuery } from "@apollo/client"
import { useStore } from "../store"

import UserCollection from "../components/UserCollection"
import LoadingSpinner from "../components/LoadingSpinner"

import { GET_USER_BY_ID } from "../utils/queries"

function Profile() {
    const { user } = useStore()

    const { loading, error, data } = useQuery(GET_USER_BY_ID, {
        variables: { userId: user._id }, 
    })

    if (loading) return <LoadingSpinner />

    const userProfile = data.getUserById

    return (
        <section className="profile mt-10">
            <h1 className="font-bold my-4 text-center">{userProfile.username}'s Profile</h1>

            <h2 className="font-bold text-lg my-4 text-center">{userProfile.username}'s Whiskey Collection</h2>

            <UserCollection 
                userProfile={userProfile}
            />
        </section>
    )
}

export default Profile