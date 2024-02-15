import { useStore } from "../store"
import { useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { AUTHENTICATE } from '../utils/queries'
import { useNavigate } from "react-router-dom"

function Profile() {
    const { user, setState } = useStore()
    const { loading, error, data } = useQuery(AUTHENTICATE)
    const navigate = useNavigate()

    useEffect(() => {
        // Redirect to login page if user is not logged in
        if (!user) {
            navigate('/login')
        }
    }, [user, navigate])

    return (
        <section className="profile mt-10">
            {user && (
                <h1 className="font-bold mt-4 mb-4 text-center">{user.username}'s Profile</h1>
            )}
        </section>
    )
}

export default Profile