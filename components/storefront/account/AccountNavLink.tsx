'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Props = {
  href: string
  label: string
}

export function AccountNavLink({ href, label }: Props) {
  const pathname = usePathname()
  const active = href === '/account' ? pathname === href : pathname.startsWith(href)

  return (
    <Link
      href={href}
      className={`block py-2 text-sm transition-colors hover:text-arca-ink ${
        active ? 'text-arca-ink font-medium' : 'text-arca-charcoal'
      }`}
    >
      {label}
    </Link>
  )
}
