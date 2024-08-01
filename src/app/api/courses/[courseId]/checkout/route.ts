import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import Stripe from 'stripe';
import { stripe } from '@/lib/strip';

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await currentUser();

    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const course = await db.course.findFirst({
      where: { id: params.courseId, isPublished: true },
    });
    if (!course) {
      return new NextResponse('Course not found', { status: 404 });
    }

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: params.courseId,
        },
      },
    });
    if (purchase) {
      return new NextResponse('Already purchased', { status: 400 });
    }

    const lineItem: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          product_data: {
            name: course.title,
            description: course.description!,
          },
          unit_amount: Math.round(course.price! * 100),
        },
      },
    ];

    let stripeCustomer = await db.stipeCustomer.findUnique({
      where: { userId: user.id },
      select: { stripeCustomerId: true },
    });

    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        email: user.emailAddresses[0].emailAddress,
      });

      console.log('customer', customer);

      stripeCustomer = await db.stipeCustomer.create({
        data: {
          userId: user.id,
          stripeCustomerId: customer.id,
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItem,
      mode: 'payment',
      customer: stripeCustomer.stripeCustomerId,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/courses/${params.courseId}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/courses/${params.courseId}?cancel=1`,
      metadata: {
        courseId: params.courseId,
        userId: user.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('[COURSE_ID CHECKOUT] Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
