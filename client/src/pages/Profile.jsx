import { useStore } from "../store"

import { useNavigate } from "react-router-dom"


function Profile() {
    const { user } = useStore()

    return (
        <section className="profile mt-10">
            {user && (
                <h1 className="font-bold mt-4 mb-4 text-center">{user.username}'s Profile</h1>
            )}
        </section>
    )
}

export default Profile