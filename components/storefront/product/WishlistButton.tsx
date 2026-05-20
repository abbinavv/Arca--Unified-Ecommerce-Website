'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Heart } from 'lucide-react'
import Link from 'next/link'

export function WishlistButton({ productId }: { productId: string }) {
  const [saved, setSaved] = useState(false)
  const [wishlistId, setWishlistId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [toast, setToast] = useState<'saved' | 'removed' | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      setUserId(user.id)
      supabase
        .from('wishlist_items')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .maybeSingle()
        .then(({ data }) => {
          if (data) { setSaved(true); setWishlistId(data.id) }
        })
    })
  }, [productId])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
  }, [toast])

  async function toggle() {
    if (!userId) { window.location.href = '/auth/login'; return }
    setLoading(true)
    const supabase = createClient()
    if (saved && wishlistId) {
      await supabase.from('wishlist_items').delete().eq('id', wishlistId)
      setSaved(false)
      setWishlistId(null)
      setToast('removed')
    } else {
      const { data } = await supabase
        .from('wishlist_items')
        .insert({ user_id: userId, product_id: productId })
        .select('id')
        .single()
      if (data) { setSaved(true); setWishlistId(data.id) }
      setToast('saved')
    }
    setLoading(false)
  }

  return (
    <div className="relative">
      <button
        onClick={toggle}
        disabled={loading}
        aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
        className={`flex-shrink-0 w-14 flex items-center justify-center border transition-colors disabled:opacity-50 ${
          saved
            ? 'border-arca-ink bg-arca-ink text-arca-ivory'
            : 'border-arca-sand text-arca-stone hover:border-arca-ink hover:text-arca-ink'
        }`}
      >
        <Heart
          size={16}
          strokeWidth={1.5}
          className={saved ? 'fill-arca-ivory' : ''}
        />
      </button>

      {/* Toast */}
      {toast && (
        <div className="absolute bottom-full right-0 mb-2 z-20 pointer-events-none animate-in fade-in slide-in-from-bottom-1 duration-200">
          <div className="bg-arca-ink text-arca-ivory text-[11px] whitespace-nowrap px-3 py-2 flex items-center gap-2">
            {toast === 'saved' ? (
              <>
                <Heart size={10} className="fill-arca-ivory text-arca-ivory flex-shrink-0" />
                <span>Saved —{' '}</span>
                <Link href="/account/wishlist" className="underline underline-offset-2 pointer-events-auto hover:text-arca-gold transition-colors">
                  View wishlist
                </Link>
              </>
            ) : (
              <span>Removed from wishlist</span>
            )}
          </div>
          {/* Arrow */}
          <div className="flex justify-end pr-5">
            <div className="w-2 h-2 bg-arca-ink rotate-45 -mt-1" />
          </div>
        </div>
      )}
    </div>
  )
}
