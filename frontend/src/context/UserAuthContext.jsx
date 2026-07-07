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
        let parsed = JSON.parse(saved)
        // Normalize nested Google auth response if stored in localStorage from previous login
        if (parsed && parsed.user && !parsed.name) {
          parsed = parsed.user
          localStorage.setItem('bobby_sales_user', JSON.stringify(parsed))
        }
        setUser(parsed)
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
      throw err
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
      throw err
    }
  }

  const loginWithGoogle = async (googleData) => {
    try {
      const data = await api.userGoogleAuth(googleData.credential)
      const userObj = data.user || data
      setUser(userObj)
      localStorage.setItem('bobby_sales_user', JSON.stringify(userObj))
      return userObj
    } catch (err) {
      // Decode the credential locally if offline or if backend fails and we need a fallback,
      // or if it's mock/demo login.
      let decoded = {}
      if (googleData.credential) {
        try {
          const base64Url = googleData.credential.split('.')[1]
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
          const jsonPayload = decodeURIComponent(
            window.atob(base64)
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          )
          decoded = JSON.parse(jsonPayload)
        } catch (e) {
          console.error('Failed to decode google credential locally', e)
        }
      }

      // Offline fallback
      const fallbackUser = {
        name: googleData.name || decoded.name || 'Rohan Ghuge',
        email: googleData.email || decoded.email || 'ghugerohan13@gmail.com',
        avatar: googleData.avatar || decoded.picture || 'https://lh3.googleusercontent.com/a/default-user=s96-c',
        provider: 'google'
      }
      setUser(fallbackUser)
      localStorage.setItem('bobby_sales_user', JSON.stringify(fallbackUser))
      throw err
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
