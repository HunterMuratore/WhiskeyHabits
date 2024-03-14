import { Routes, Route } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { useEffect } from 'react'
import { useStore } from './store'

import Header from './components/Header'
import Footer from './components/Footer'
import Protect from './components/Protect'

import Home from './pages/Home'
import Auth from './pages/Auth'
import Profile from './pages/Profile'
import Contact from './pages/Contact'  
import Whiskeys from './pages/Whiskeys'
import WhiskeyDetails from './pages/WhiskeyDetails'

import { AUTHENTICATE } from './utils/queries'

function App() {
  const { data: userData } = useQuery(AUTHENTICATE)
  const { updateUser } = useStore()
  
  useEffect(() => {
    if (userData) {
      updateUser(userData.authenticate)
    }
  }, [userData])

  return (
    <>
      <Header />

      <main>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/contact' element={<Contact />}></Route>
          <Route path='/login' element={<Auth isLogin={true} />}></Route>
          <Route path='/register' element={<Auth isLogin={false} />}></Route>
          <Route path='/profile' element={<Protect user={userData}>
            <Profile userData={userData} />
          </Protect>}></Route>
          <Route path='/whiskeys' element={<Whiskeys />}></Route>
          <Route path='/whiskeys/:whiskeyId' element={<WhiskeyDetails />} />
        </Routes>
      </main>

      <Footer />
    </>
  )
}

export default App
