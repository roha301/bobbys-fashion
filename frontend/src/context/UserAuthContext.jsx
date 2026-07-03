import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../api/client'

const UserAuthContext = createContext(null)

export function UserAuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('bobby_sales_user')
    if (saved) {
      try {
        setUser(JSON.parse(saved))
      } catch (e) {
        localStorage.removeItem('bobby_sales_user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const data = await api.userLogin(email, password)
      setUser(data)
      localStorage.setItem('bobby_sales_user', JSON.stringify(data))
      return data
    } catch (err) {
      // Offline fallback
      const name = email.split('@')[0]
      const fallbackUser = {
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email,
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`,
        provider: 'credentials'
      }
      setUser(fallbackUser)
      localStorage.setItem('bobby_sales_user', JSON.stringify(fallbackUser))
      return fallbackUser
    }
  }

  const signup = async (name, email, password) => {
    try {
      const data = await api.userRegister(name, email, password)
      setUser(data)
      localStorage.setItem('bobby_sales_user', JSON.stringify(data))
      return data
    } catch (err) {
      // Offline fallback
      const fallbackUser = {
        name,
        email,
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`,
        provider: 'credentials'
      }
      setUser(fallbackUser)
      localStorage.setItem('bobby_sales_user', JSON.stringify(fallbackUser))
      return fallbackUser
    }
  }

  const loginWithGoogle = async (googleData) => {
    try {
      const data = await api.userGoogleAuth(googleData.name, googleData.email, googleData.avatar)
      setUser(data)
      localStorage.setItem('bobby_sales_user', JSON.stringify(data))
      return data
    } catch (err) {
      // Offline fallback
      const fallbackUser = {
        name: googleData.name || 'Rohan Ghuge',
        email: googleData.email || 'ghugerohan13@gmail.com',
        avatar: googleData.avatar || 'https://lh3.googleusercontent.com/a/default-user=s96-c',
        provider: 'google'
      }
      setUser(fallbackUser)
      localStorage.setItem('bobby_sales_user', JSON.stringify(fallbackUser))
      return fallbackUser
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('bobby_sales_user')
  }

  return (
    <UserAuthContext.Provider value={{ user, loading, login, signup, loginWithGoogle, logout, setUser }}>
      {children}
    </UserAuthContext.Provider>
  )
}

export function useUserAuth() {
  const context = useContext(UserAuthContext)
  if (!context) throw new Error('useUserAuth must be used within UserAuthProvider')
  return context
}
