import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import { useMutation } from '@apollo/client'

import { REGISTER, LOGIN } from '../utils/mutations'

const initialFormData = {
    email: '',
    username: '',
    identifier: '',
    password: ''
}

function Auth({ isLogin }) {
    const { user, setState } = useStore()
    const [formData, setFormData] = useState(initialFormData)
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate()
    const [authenticateUser] = useMutation(isLogin ? LOGIN : REGISTER, {
        variables: formData,
    })

    useEffect(() => {
        // If user is already logged in, redirect to profile page
        if (user) {
            navigate('/profile')
        }
    }, [user, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const resolverName = isLogin ? 'login' : 'register'

            const { data: userData } = await authenticateUser()

            setState((oldState) => ({
                ...oldState,
                user: userData[resolverName],
            }))

            setFormData(initialFormData)
            setErrorMessage('')

            navigate('/')
        } catch (err) {
            setErrorMessage(err.message)
        }
    }

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    return (
        <main className="auth flex items-center justify-center">
            <form className=" w-full p-8 border mt-36" onSubmit={handleSubmit}>
                <h2 className="text-center text-2xl font-bold mb-6">{isLogin ? 'Log In' : 'Register'}</h2>

                {errorMessage && <p className="text-center text-red-500 mb-4">{errorMessage}</p>}

                {isLogin ? (
                    <div className="mb-4">
                        <label htmlFor="identifier" className="text-sm font-medium">
                            Username or Email:
                        </label>
                        <input
                            type="text"
                            id="identifier"
                            name="identifier"
                            value={formData.identifier}
                            onChange={handleInputChange}
                            className="mt-1 p-2 w-full text-black border rounded-md"
                            placeholder="Enter username or email"
                        />
                    </div>
                ) : (
                    <>
                        <div className="mb-4">
                            <label htmlFor="username" className="text-sm font-medium">
                                Username:
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="mt-1 p-2 w-full text-black border rounded-md"
                                placeholder="Enter username"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="text-sm font-medium">
                                Email:
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="mt-1 p-2 w-full text-black border rounded-md"
                                placeholder="Enter email"
                            />
                        </div>
                    </>
                )}

                <div className="mb-4">
                    <label htmlFor="password" className="text-sm font-medium">
                        Password:
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="mt-1 p-2 w-full text-black border rounded-md"
                        placeholder="Password"
                    />
                </div>

                <div className="mb-4 text-sm">
                    {isLogin ? (
                        <>
                            <span className="me-1">Don't have an Account?</span>
                            <NavLink to="/register" className="text-blue-500 hover:underline">
                                Register
                            </NavLink>
                        </>
                    ) : (
                        <>
                            <span className="me-1">Already have an Account?</span>
                            <NavLink to="/login" className="text-blue-500 hover:underline">
                                Log In
                            </NavLink>
                        </>
                    )}
                </div>

                <button type="submit" className="w-full my-btn">
                    Submit
                </button>
            </form>
        </main>
    )
}

export default Auth