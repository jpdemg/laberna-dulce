import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

export function useProfile() {
  const { user, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (authLoading) return
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }
    setLoading(true)
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    setProfile(data)
    setLoading(false)
  }, [user, authLoading])

  useEffect(() => {
    refresh()
  }, [refresh])

  const saveProfile = async (fields) => {
    if (!user) return { error: new Error('Sem usuário autenticado') }
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, updated_at: new Date().toISOString(), ...fields })
      .select()
      .single()

    if (!error) setProfile(data)
    return { data, error }
  }

  return { profile, loading, saveProfile, refresh }
}
