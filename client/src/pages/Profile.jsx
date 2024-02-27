import { useStore } from "../store"
import { useEffect, useState } from 'react'

import { useNavigate } from "react-router-dom"

import LoadingSpinner from "../components/LoadingSpinner"

function Profile() {
    const { user } = useStore()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    return (
        <section className="profile mt-10">
            {user && (
                <h1 className="font-bold mt-4 mb-4 text-center">{user.username}'s Profile</h1>
            )}
        </section>
    )
}

export default Profile