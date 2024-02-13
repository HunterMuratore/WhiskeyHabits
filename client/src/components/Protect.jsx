import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Protect ({ user, children }) {
    const navigate = useNavigate()

    useEffect(() => {
        if (!user) {
            navigate('/login')
        }
    }, [user, navigate])

    return children
}

export default Protect
