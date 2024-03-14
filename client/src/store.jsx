import { createContext, useContext, useState } from 'react'

const StoreContext = createContext()

export function useStore() {
    return useContext(StoreContext)
}

export function StoreProvider({ children }) {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user')
        return storedUser ? JSON.parse(storedUser) : null
    })

    const updateUser = newUser => {
        setUser(newUser)
        if (newUser) {
            localStorage.setItem('user', JSON.stringify(newUser))
        } else {
            localStorage.removeItem('user')
        }
    }

    return (
        <StoreContext.Provider value={{ user, updateUser }}>
            {children}
        </StoreContext.Provider>
    )
}
