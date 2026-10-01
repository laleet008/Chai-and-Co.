'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useCheckoutStore } from '@/store/checkout';
import {
  FREE_SHIPPING_THRESHOLD,
  useCartStore,
  STANDARD_SHIPPING_COST,
  EXPRESS_SHIPPING_COST,
  KATHMANDU_SHIPPING_COST,
} from '@/store/cart';
import { Reveal } from '@/components/ui/Reveal';
import { SplitText } from '@/components/ui/SplitText';
import { CheckoutStepper } from '@/components/checkout/Stepper';
import { StepContact } from '@/components/checkout/StepContact';
import { StepPayment } from '@/components/checkout/StepPayment';
import { StepReview } from '@/components/checkout/StepReview';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { defaultEasing } from '@/lib/motion';
import type { CheckoutContact, CardDetails } from '@/lib/validators';

function StepSync() {
  const params = useSearchParams();
  const stepQuery = params.get('step');
  const setStep = useCheckoutStore((s) => s.setStep);
  const step = useCheckoutStore((s) => s.step);

  useEffect(() => {
    let s: 1 | 2 | 3 = 1;
    if (stepQuery === '1') s = 1;
    else if (stepQuery === '2') s = 2;
    else if (stepQuery === '3') s = 3;
    if (s !== step) setStep(s);
  }, [stepQuery, step, setStep]);

  return null;
}

function CheckoutBody() {
  const step = useCheckoutStore((s) => s.step);
  const contact = useCheckoutStore((s) => s.contact);
  const payment = useCheckoutStore((s) => s.payment);
  const setContact = useCheckoutStore((s) => s.setContact);
  const setPayment = useCheckoutStore((s) => s.setPayment);
  const commitOrder = useCheckoutStore((s) => s.commitOrder);
  const clearCheckout = useCheckoutStore((s) => s.clearCheckout);
  const router = useRouter();
  const reduced = useReducedMotion();
  const prevStep = useRef<1 | 2 | 3>(step);

  useEffect(() => {
    prevStep.current = step;
  }, [step]);

  const steps = [
    { no: 1 as const, label: 'Contact & delivery' },
    { no: 2 as const, label: 'Payment' },
    { no: 3 as const, label: 'Review' },
  ];

  const forward = step >= prevStep.current;

  function handleContactSubmit(values: CheckoutContact) {
    setContact(values);
    router.replace('/checkout?step=2', { scroll: false });
  }

  function handlePaymentSubmit(values: CardDetails) {
    setPayment(values);
    router.replace('/checkout?step=3', { scroll: false });
  }

  function handlePlace() {
    const cart = useCartStore.getState();
    const delivery = contact.deliveryOption || 'standard';
    let ship = STANDARD_SHIPPING_COST;
    if (delivery === 'express') ship = EXPRESS_SHIPPING_COST;
    else if (delivery === 'kathmandu') ship = KATHMANDU_SHIPPING_COST;
    if (delivery === 'standard' && cart.subtotal() >= FREE_SHIPPING_THRESHOLD) {
      ship = STANDARD_SHIPPING_COST;
    }
    const subtotal = cart.subtotal();
    const discount = cart.discount();
    const total = Math.max(0, subtotal - discount + ship);
    const order = commitOrder({
      contact: contact as CheckoutContact,
      paymentMethod: payment.method || 'card',
      subtotal,
      discount,
      shipping: ship,
      total,
      itemCount: cart.itemCount(),
    });
    cart.clear();
    clearCheckout();
    router.replace('/order/' + order.id);
  }

  function handleEdit(s: 1 | 2) {
    router.replace('/checkout?step=' + String(s), { scroll: false });
  }

  const stepVariants = {
    enter: (dir: 'forward' | 'back') => ({
      x: reduced ? 0 : (dir === 'forward' ? 40 : -40),
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: 'forward' | 'back') => ({
      x: reduced ? 0 : (dir === 'forward' ? -40 : 40),
      opacity: 0,
    }),
  };

  const dir: 'forward' | 'back' = forward ? 'forward' : 'back';

  return (
    <div className="bg-paper text-ink pt-32 pb-32 px-6 min-h-screen">
      <Suspense fallback={null}>
        <StepSync />
      </Suspense>
      <div className="mx-auto w-[min(92%,1120px)]">
        <Reveal variant="maskUp">
          <p className="small-caps text-ink/50 mb-4">Checkout · demo</p>
        </Reveal>
        <Reveal variant="fadeUp" delay={0.05}>
          <h1 className="font-serif text-fluid-h2 tracking-tight leading-[1.05] mb-14 text-balance max-w-3xl">
            <SplitText text="Almost there. Three short steps." as="words" />
          </h1>
        </Reveal>

        <div className="mb-14">
          <CheckoutStepper steps={steps} step={step} />
        </div>

        <AnimatePresence mode="wait" custom={dir} initial={false}>
          {step === 1 && (
            <motion.div
              key="step-1"
              custom={dir}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: reduced ? 0.12 : 0.45, ease: defaultEasing }}
            >
              <StepContact initial={contact} onSubmit={handleContactSubmit} />
            </motion.div>
          )}
          {step === 2 && (
            <motion.div
              key="step-2"
              custom={dir}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: reduced ? 0.12 : 0.45, ease: defaultEasing }}
            >
              <StepPayment
                initial={payment}
                onSubmit={handlePaymentSubmit}
                onBack={() => router.replace('/checkout?step=1', { scroll: false })}
              />
            </motion.div>
          )}
          {step === 3 && (
            <motion.div
              key="step-3"
              custom={dir}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: reduced ? 0.12 : 0.45, ease: defaultEasing }}
            >
              <StepReview
                contact={contact}
                payment={payment}
                onPlace={handlePlace}
                onBack={() => router.replace('/checkout?step=2', { scroll: false })}
                onEdit={handleEdit}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function CheckoutClient() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-paper" />}>
      <CheckoutBody />
    </Suspense>
  );
}
