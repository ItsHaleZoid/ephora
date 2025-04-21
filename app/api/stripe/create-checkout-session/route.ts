import { stripe } from '@/lib/stripe/stripe'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { userId, email } = await req.json()

  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID!,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/account?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/account?canceled=true`,
    metadata: { userId },
  })

  return NextResponse.json({ url: session.url })
}
