import { useState } from 'react'

import { useMutation, gql } from '@apollo/client'
import { NavLink, useNavigate } from 'react-router-dom'
import { useStore } from '../store'

const LOGOUT_USER = gql`
    mutation {
        logout
    }
`

function Header() {
    const [logoutUser] = useMutation(LOGOUT_USER)
    const { user, setState } = useStore()
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    const logout = async (e) => {
        e.preventDefault()

        await logoutUser()

        setState((oldState) => ({
            ...oldState,
            user: null,
        }))

        navigate('/')
    }

    return (
        <header>
            <nav className="flex items-center justify-between pl-3 pr-3">
                <NavLink to="/" className='inactive'>WhiskeyHabits</NavLink>

                {/* Hamburger menu icon for medium screens and below */}
                <div className="lg:hidden py-3">
                    <button onClick={toggleMenu}>
                        {isOpen ? (
                            <svg
                                className="w-6 h-6 transition-transform duration-500 transform rotate-90"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                ></path>
                            </svg>
                        ) : (
                            <svg
                                className="w-6 h-6 transition-transform duration-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16m-7 6h7"
                                ></path>
                            </svg>
                        )}
                    </button>
                </div>

                {/* Navigation links for large screens and above */}
                <div className="hidden lg:flex lg:items-center font-semibold my-4 text-sm sm:text-md lg:text-lg">
                    {user ? (
                        <>
                            <NavLink to="/">Home</NavLink>
                            <NavLink to="/whiskey">Whiskeys</NavLink>
                            <NavLink to="/profile">Profile</NavLink>
                            <NavLink to="/" onClick={logout} className="inactive">Logout</NavLink>
                        </>
                    ) : (
                        <>
                            <NavLink to="/">Home</NavLink>
                            <NavLink to="/whiskey">Whiskeys</NavLink>
                            <NavLink to="/register">Register</NavLink>
                            <NavLink to="/login">Login</NavLink>
                        </>
                    )}
                </div>
            </nav>

            {/* Navigation links dropdown menu for medium screens and below */}
            <nav className={`${isOpen ? 'flex flex-col' : 'hidden'} font-semibold dropdown lg:hidden p-3`}>
                {user ? (
                    <>
                        <NavLink to="/">Home</NavLink>
                        <NavLink to="/whiskey">Whiskeys</NavLink>
                        <NavLink to="/profile">Profile</NavLink>
                        <NavLink to="/" onClick={logout} className="inactive">Logout</NavLink>
                    </>
                ) : (
                    <>
                        <NavLink to="/">Home</NavLink>
                        <NavLink to="/whiskey">Whiskeys</NavLink>
                        <NavLink to="/register">Register</NavLink>
                        <NavLink to="/login">Login</NavLink>
                    </>
                )}
            </nav>
        </header>
    )
}

export default Header
