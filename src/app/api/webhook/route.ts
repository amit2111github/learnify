import Stripe from 'stripe';
import { headers } from 'next/headers';

import { db } from '@/lib/db';
import { stripe } from '@/lib/strip';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('Stripe-Signature') as string;

  console.log('••••••••••••••••••••••••••••••');
  console.log('inside webhook route');

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new Response(`Webhook error: ${error.message}`, { status: 400 });
  }
  if (event.type !== 'checkout.session.completed') {
    return new Response('Webhook Error: Invalid event type', { status: 200 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session.metadata?.userId;
  const courseId = session.metadata?.courseId;
  if (!userId || !courseId) {
    return new Response('Webhook Error: Invalid metadata', { status: 400 });
  }

  await db.purchase.create({
    data: {
      userId,
      courseId,
    },
  });

  return new Response('Webhook received', { status: 200 });
}
