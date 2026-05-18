'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Notification = {
  id: string
  message: string
  is_read: boolean
  created_at: string
}

export function NotificationBell({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)
  const [supported, setSupported] = useState(true)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const supabase = createClient()

    async function fetchNotifications() {
      const { data, error } = await supabase
        .from('notifications')
        .select('id, message, is_read, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) {
        // Table likely doesn't exist — hide the bell silently
        setSupported(false)
        return
      }
      const rows = data ?? []
      setNotifications(rows)
      setUnreadCount(rows.filter(n => !n.is_read).length)
    }

    fetchNotifications()

    // Realtime subscription for new notifications
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newNotif = payload.new as Notification
          setNotifications(prev => [newNotif, ...prev].slice(0, 5))
          setUnreadCount(prev => prev + 1)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  // Close panel on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  async function markAsRead(id: string) {
    const supabase = createClient()
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)

    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  if (!supported) return null

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <button
        onClick={() => setOpen(v => !v)}
        className="relative flex items-center justify-center w-8 h-8 hover:text-arca-gold transition-colors"
        aria-label="Notifications"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-arca-gold text-white text-[10px] font-medium rounded-full flex items-center justify-center leading-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-arca-ivory border border-arca-sand shadow-lg z-50">
          <div className="px-4 py-3 border-b border-arca-sand">
            <p className="text-[10px] tracking-arca uppercase text-arca-stone">Notifications</p>
          </div>

          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-xs text-arca-stone">No notifications yet</p>
            </div>
          ) : (
            <ul>
              {notifications.map(n => (
                <li
                  key={n.id}
                  onClick={() => !n.is_read && markAsRead(n.id)}
                  className={`px-4 py-3 border-b border-arca-sand/50 last:border-0 cursor-pointer hover:bg-arca-cream transition-colors ${
                    n.is_read ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {!n.is_read && (
                      <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-arca-gold" />
                    )}
                    <div className={!n.is_read ? '' : 'pl-3.5'}>
                      <p className="text-xs text-arca-ink leading-relaxed">{n.message}</p>
                      <p className="text-[10px] text-arca-stone mt-1">
                        {new Date(n.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
