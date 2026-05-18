import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json({ error: 'Payments not configured' }, { status: 503 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const body = await req.json()
  const { amountInPaise, items } = body as {
    amountInPaise: number
    items: Array<{ id: string; name: string; quantity: number }>
  }

  if (!amountInPaise || amountInPaise < 100) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInPaise,
    currency: 'inr',
    automatic_payment_methods: { enabled: true },
    metadata: {
      userId: user?.id ?? 'guest',
      itemCount: String(items?.length ?? 0),
    },
  })

  return NextResponse.json({ clientSecret: paymentIntent.client_secret })
}
