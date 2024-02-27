import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from './LoadingSpinner'

function Protect({ user, children }) {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkAuthentication = async () => {
            // Simulate an asynchronous authentication check
            await new Promise((resolve) => setTimeout(resolve, 500))

            if (!user) {
                navigate('/login')
            } else {
                setLoading(false)
            }
        }

        checkAuthentication()
    }, [user, navigate])

    if (loading) {
        return <LoadingSpinner />
    }

    return children
}

export default Protect

