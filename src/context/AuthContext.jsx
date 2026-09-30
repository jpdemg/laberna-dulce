import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const signUp = ({ email, password, firstName, lastName, phone, phoneCountry, address, captchaToken }) =>
    supabase.auth.signUp({
      email,
      password,
      options: {
        captchaToken,
        emailRedirectTo: `${window.location.origin}/laberna-dulce/`,
        data: {
          first_name: firstName,
          last_name: lastName,
          name: `${firstName} ${lastName}`.trim(),
          phone,
          phone_country: phoneCountry,
          address,
        },
      },
    })

  const signIn = ({ email, password, captchaToken }) =>
    supabase.auth.signInWithPassword({ email, password, options: { captchaToken } })

  const requestPasswordReset = ({ email, captchaToken }) =>
    supabase.auth.resetPasswordForEmail(email, {
      captchaToken,
      redirectTo: `${window.location.origin}/laberna-dulce/redefinir-senha`,
    })

  const updatePassword = (password) => supabase.auth.updateUser({ password })

  const signOut = () => supabase.auth.signOut()

  const value = {
    session,
    user: session?.user ?? null,
    loading,
    signUp,
    signIn,
    requestPasswordReset,
    updatePassword,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
