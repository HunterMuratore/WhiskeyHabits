import { useStore } from "../store"

import UserCollection from "../components/UserCollection"
import UserWishlist from "../components/UserWishlist"
import LoadingSpinner from "../components/LoadingSpinner"

function Profile() {
    const { user } = useStore()

    return (
        <section className="profile mt-10">
            <h1 className="font-bold my-4 text-center">{user.username}'s Profile</h1>

            <UserCollection
                user={user}
            />

            <UserWishlist
                user={user}
            />
        </section>
    )
}

export default Profile