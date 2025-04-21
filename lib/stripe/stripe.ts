// lib/stripe/stripe.ts
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  // Only use officially supported versions here
 apiVersion: '2025-03-31.basil',
})

export { stripe }
