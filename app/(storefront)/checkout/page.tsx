import { Metadata } from 'next'
import { CheckoutFlow } from './CheckoutFlow'

export const metadata: Metadata = { title: 'Checkout — Arca' }

export default function CheckoutPage() {
  return <CheckoutFlow />
}
