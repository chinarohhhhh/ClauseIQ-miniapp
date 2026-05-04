'use client'
import { useEffect, useState } from 'react'

export type TelegramUser = {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
}

export type TelegramWebApp = {
  ready: () => void
  close: () => void
  expand: () => void
  showAlert: (message: string) => void
  showConfirm: (message: string, callback: (ok: boolean) => void) => void
  MainButton: {
    text: string
    show: () => void
    hide: () => void
    onClick: (fn: () => void) => void
  }
  BackButton: {
    show: () => void
    hide: () => void
    onClick: (fn: () => void) => void
  }
  initDataUnsafe: {
    user?: TelegramUser
  }
  colorScheme: 'light' | 'dark'
  themeParams: {
    bg_color?: string
    text_color?: string
    hint_color?: string
    button_color?: string
  }
}

export function useTelegram() {
  const [tg, setTg] = useState<TelegramWebApp | null>(null)
  const [user, setUser] = useState<TelegramUser | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const telegram = (window as any).Telegram?.WebApp as TelegramWebApp

    if (telegram) {
      telegram.ready()
      telegram.expand()
      setTg(telegram)
      setUser(telegram.initDataUnsafe?.user || null)
      setIsReady(true)
    } else {
      // Dev mode fallback — mock user for local testing
      setUser({
        id: 6139234885,
        first_name: 'Dev',
        username: 'devuser',
      })
      setIsReady(true)
    }
  }, [])

  return { tg, user, isReady }
}
