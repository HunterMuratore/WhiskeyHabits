import { createContext, useContext, useState, useEffect } from 'react'

const StoreContext = createContext()

export function useStore() {
    return useContext(StoreContext)
}

export function StoreProvider({ children }) {
    const [state, setState] = useState(() => {
        const storedUser = localStorage.getItem('user')
        return {
            user: storedUser ? JSON.parse(storedUser) : null
        }
    })

    useEffect(() => {
        // Update localStorage when user state changes
        if (state.user) {
            localStorage.setItem('user', JSON.stringify(state.user))
        } else {
            localStorage.removeItem('user')
        }
    }, [state.user])

    return (
        <StoreContext.Provider value={{ ...state, setState }}>
            {children}
        </StoreContext.Provider>
    )
}
