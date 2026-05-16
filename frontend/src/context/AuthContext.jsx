
import { createContext, useContext, useState } from 'react'
import api from '../utils/api'

const Ctx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sw_user')) } catch { return null }
  })

  const save = (token, user) => {
    localStorage.setItem('sw_token', token)
    localStorage.setItem('sw_user', JSON.stringify(user))
    setUser(user)
  }

  const login = async (email, password, role) => {
    const { data } = await api.post('/auth/login', { email, password, role })
    save(data.token, data.user)
    return data.user
  }

  const register = async (form) => {
    const { data } = await api.post('/auth/register', form)
    save(data.token, data.user)
    return data.user
  }

  const logout = () => {
    localStorage.removeItem('sw_token')
    localStorage.removeItem('sw_user')
    setUser(null)
  }

  return <Ctx.Provider value={{ user, login, register, logout }}>{children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx)
