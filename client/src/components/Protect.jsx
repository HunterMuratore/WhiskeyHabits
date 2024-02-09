import {useNavigate} from 'react-router-dom'

function Protect ({user, children}) {
    const navigate = useNavigate()

    if (!user) return navigate('/login')

    return children
}

export default Protect