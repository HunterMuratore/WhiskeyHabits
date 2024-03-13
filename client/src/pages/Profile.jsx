import { useStore } from "../store"

import UserCollection from "../components/UserCollection"
import LoadingSpinner from "../components/LoadingSpinner"

function Profile() {
    const { user } = useStore()

    return (
        <section className="profile mt-10">
            <h1 className="font-bold my-4 text-center">{user.username}'s Profile</h1>

            <h2 className="font-bold text-lg my-4 text-center">{user.username}'s Whiskey Collection</h2>

            <UserCollection 
                user={user}
            />
        </section>
    )
}

export default Profile