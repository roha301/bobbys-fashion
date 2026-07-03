import { createContext, useContext, useState } from 'react'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem('bobby_admin_token'))

  const login = (t) => {
    sessionStorage.setItem('bobby_admin_token', t)
    setToken(t)
  }

  const logout = () => {
    sessionStorage.removeItem('bobby_admin_token')
    setToken(null)
  }

  return (
    <AdminAuthContext.Provider value={{ token, isAuthed: !!token, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}
