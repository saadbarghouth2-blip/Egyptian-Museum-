import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, Check, Clock, CreditCard, Minus, Plus, Shield, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import MuseumHero3D from '../components/MuseumHero3D';
import './Tickets.css';

gsap.registerPlugin(ScrollTrigger);

const TICKET_TYPES = [
  { id: 'adult', price: 400 },
  { id: 'student', price: 200 },
  { id: 'senior', price: 200 },
  { id: 'child', price: 0 },
  { id: 'egyptian', price: 100 },
] as const;

const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'] as const;

const ADD_ONS = [
  { id: 'audio', price: 50 },
  { id: 'guide', price: 200 },
  { id: 'photography', price: 100 },
  { id: 'parking', price: 30 },
] as const;

const STEP_TRANSITION = {
  initial: { opacity: 0, y: 18, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -18, filter: 'blur(6px)' },
};

export default function Tickets() {
  const { t } = useTranslation();
  const pageRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [ticketQuantities, setTicketQuantities] = useState<Record<string, number>>({
    adult: 0,
    student: 0,
    senior: 0,
    child: 0,
    egyptian: 0,
  });
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [step, setStep] = useState(1);

  const updateQuantity = (id: string, delta: number) => {
    setTicketQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, prev[id] + delta),
    }));
  };

  const toggleAddOn = (id: string) => {
    setSelectedAddOns(prev => (prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]));
  };

  const calculateTotal = () => {
    let total = 0;
    for (const ticket of TICKET_TYPES) total += ticket.price * ticketQuantities[ticket.id];
    for (const addOnId of selectedAddOns) {
      const addOn = ADD_ONS.find(a => a.id === addOnId);
      if (addOn) total += addOn.price;
    }
    return total;
  };

  const totalTickets = Object.values(ticketQuantities).reduce((a, b) => a + b, 0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.tickets-hero-content',
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.tickets-hero',
            start: 'top 80%',
          },
        },
      );

      gsap.fromTo(
        '.booking-panel',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.booking-section',
            start: 'top 75%',
          },
        },
      );

      gsap.fromTo(
        '.ticket-info-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.info-section',
            start: 'top 80%',
          },
        },
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const cards = pageRef.current?.querySelectorAll<HTMLElement>('.ticket-type-row, .addon-card, .ticket-info-card, .time-slot');
    if (!cards || cards.length === 0) return;

    const cleanup: Array<() => void> = [];

    cards.forEach((card) => {
      const onMove = (event: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mx', `${x}%`);
        card.style.setProperty('--my', `${y}%`);
      };

      const onLeave = () => {
        card.style.setProperty('--mx', '50%');
        card.style.setProperty('--my', '50%');
      };

      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
      cleanup.push(() => {
        card.removeEventListener('mousemove', onMove);
        card.removeEventListener('mouseleave', onLeave);
      });
    });

    return () => cleanup.forEach((fn) => fn());
  }, []);

  const minDate = new Date().toISOString().split('T')[0];
  const completion =
    step === 1
      ? Math.min(0.2 + totalTickets * 0.08, 0.46)
      : step === 2
        ? selectedDate && selectedTime
          ? 0.76
          : 0.62
        : 1;

  return (
    <div ref={pageRef} className="tickets-page">
      <section className="tickets-hero">
        <div className="tickets-hero-bg">
          <img src="/images/grand_hall.jpg" alt={t('tickets.hero.imageAlt')} />
          <div className="tickets-hero-overlay" />
        </div>
        <MuseumHero3D />
        <div className="tickets-hero-content">
          <span className="mono tickets-hero-label">{t('tickets.hero.label')}</span>
          <h1 className="headline-xl">{t('tickets.hero.title')}</h1>
          <p className="tickets-hero-description">{t('tickets.hero.description')}</p>
        </div>
      </section>

      <section className="booking-section">
        <div className="booking-container">
          <div className="booking-steps">
            <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
              <span className="step-number">1</span>
              <span className="step-label">{t('tickets.steps.selectTickets')}</span>
            </div>
            <div className="step-divider" />
            <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-label">{t('tickets.steps.chooseDate')}</span>
            </div>
            <div className="step-divider" />
            <div className={`step ${step >= 3 ? 'active' : ''}`}>
              <span className="step-number">3</span>
              <span className="step-label">{t('tickets.steps.checkout')}</span>
            </div>
          </div>

          <div className="booking-panel">
            <div className="booking-selection">
              <AnimatePresence mode="wait" initial={false}>
                {step === 1 && (
                  <motion.div
                    key="tickets-step-1"
                    variants={STEP_TRANSITION}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                  >
                  <div className="selection-section">
                    <h3 className="selection-title">
                      <Users size={20} />
                      {t('tickets.sections.selectTickets')}
                    </h3>
                    <div className="ticket-types">
                      {TICKET_TYPES.map((ticket) => (
                        <div key={ticket.id} className="ticket-type-row">
                          <div className="ticket-type-info">
                            <span className="ticket-type-name">{t(`tickets.types.${ticket.id}.name`)}</span>
                            <span className="ticket-type-desc">{t(`tickets.types.${ticket.id}.description`)}</span>
                          </div>
                          <div className="ticket-type-price">
                            {ticket.price === 0 ? t('tickets.free') : `${ticket.price} EGP`}
                          </div>
                          <div className="quantity-selector">
                            <button
                              className="quantity-btn"
                              onClick={() => updateQuantity(ticket.id, -1)}
                              disabled={ticketQuantities[ticket.id] === 0}
                              type="button"
                              aria-label={t('tickets.actions.decrease')}
                            >
                              <Minus size={16} />
                            </button>
                            <span className="quantity-value">{ticketQuantities[ticket.id]}</span>
                            <button
                              className="quantity-btn"
                              onClick={() => updateQuantity(ticket.id, 1)}
                              type="button"
                              aria-label={t('tickets.actions.increase')}
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="selection-section">
                    <h3 className="selection-title">{t('tickets.sections.addOns')}</h3>
                    <div className="addons-grid">
                      {ADD_ONS.map((addon) => (
                        <button
                          key={addon.id}
                          className={`addon-card ${selectedAddOns.includes(addon.id) ? 'selected' : ''}`}
                          onClick={() => toggleAddOn(addon.id)}
                          type="button"
                        >
                          <div className="addon-header">
                            <span className="addon-name">{t(`tickets.addOns.${addon.id}.name`)}</span>
                            <span className="addon-price">+{addon.price} EGP</span>
                          </div>
                          <p className="addon-desc">{t(`tickets.addOns.${addon.id}.description`)}</p>
                          {selectedAddOns.includes(addon.id) && <Check className="addon-check" size={20} />}
                        </button>
                      ))}
                    </div>
                  </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="tickets-step-2"
                    variants={STEP_TRANSITION}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                  >
                  <div className="selection-section">
                    <h3 className="selection-title">
                      <Calendar size={20} />
                      {t('tickets.sections.selectDate')}
                    </h3>
                    <div className="date-picker">
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={minDate}
                        className="date-input"
                      />
                    </div>
                  </div>

                  <div className="selection-section">
                    <h3 className="selection-title">
                      <Clock size={20} />
                      {t('tickets.sections.selectTime')}
                    </h3>
                    <div className="time-slots">
                      {TIME_SLOTS.map((time) => (
                        <button
                          key={time}
                          className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                          onClick={() => setSelectedTime(time)}
                          type="button"
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="tickets-step-3"
                    variants={STEP_TRANSITION}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                  >
                    <div className="selection-section">
                      <h3 className="selection-title">
                        <CreditCard size={20} />
                        {t('tickets.payment.title')}
                      </h3>
                      <div className="payment-form">
                        <div className="form-row">
                          <div className="form-group">
                            <label>{t('tickets.payment.firstName')}</label>
                            <input type="text" placeholder={t('tickets.payment.firstNamePlaceholder')} />
                          </div>
                          <div className="form-group">
                            <label>{t('tickets.payment.lastName')}</label>
                            <input type="text" placeholder={t('tickets.payment.lastNamePlaceholder')} />
                          </div>
                        </div>
                        <div className="form-group">
                          <label>{t('tickets.payment.email')}</label>
                          <input type="email" placeholder={t('tickets.payment.emailPlaceholder')} />
                        </div>
                        <div className="form-group">
                          <label>{t('tickets.payment.phone')}</label>
                          <input type="tel" placeholder={t('tickets.payment.phonePlaceholder')} />
                        </div>
                        <div className="payment-security">
                          <Shield size={18} />
                          <span>{t('tickets.payment.secure')}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="booking-summary">
              <h3 className="summary-title">{t('tickets.summary.title')}</h3>
              <div className="summary-progress" aria-hidden="true">
                <motion.span
                  className="summary-progress-fill"
                  initial={false}
                  animate={{ scaleX: completion }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                />
              </div>

              {totalTickets > 0 ? (
                <div className="summary-items">
                  {TICKET_TYPES.map((ticket) => (
                    ticketQuantities[ticket.id] > 0 && (
                      <div key={ticket.id} className="summary-item">
                        <span className="summary-item-name">
                          {t(`tickets.types.${ticket.id}.name`)} x {ticketQuantities[ticket.id]}
                        </span>
                        <span className="summary-item-price">{ticket.price * ticketQuantities[ticket.id]} EGP</span>
                      </div>
                    )
                  ))}

                  {selectedAddOns.map((addOnId) => {
                    const addon = ADD_ONS.find(a => a.id === addOnId);
                    return addon ? (
                      <div key={addOnId} className="summary-item">
                        <span className="summary-item-name">{t(`tickets.addOns.${addon.id}.name`)}</span>
                        <span className="summary-item-price">{addon.price} EGP</span>
                      </div>
                    ) : null;
                  })}
                </div>
              ) : (
                <p className="summary-empty">{t('tickets.summary.empty')}</p>
              )}

              <div className="summary-total">
                <span className="total-label">{t('tickets.summary.total')}</span>
                <span className="total-price">{calculateTotal()} EGP</span>
              </div>

              <div className="summary-actions">
                {step > 1 && (
                  <button className="btn-secondary" onClick={() => setStep(step - 1)} type="button">
                    {t('common.back')}
                  </button>
                )}
                <button
                  className="btn-gold"
                  onClick={() => (step < 3 ? setStep(step + 1) : alert(t('common.bookingConfirmed')))}
                  disabled={step === 1 && totalTickets === 0}
                  type="button"
                >
                  {step === 3 ? t('common.completeBooking') : t('common.continue')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="info-section">
        <div className="info-container">
          <div className="ticket-info-card">
            <Calendar className="info-card-icon" size={28} />
            <h3>{t('tickets.info.timedEntry.title')}</h3>
            <p>{t('tickets.info.timedEntry.text')}</p>
          </div>
          <div className="ticket-info-card">
            <Users className="info-card-icon" size={28} />
            <h3>{t('tickets.info.groupBookings.title')}</h3>
            <p>{t('tickets.info.groupBookings.text')}</p>
          </div>
          <div className="ticket-info-card">
            <Check className="info-card-icon" size={28} />
            <h3>{t('tickets.info.cancellation.title')}</h3>
            <p>{t('tickets.info.cancellation.text')}</p>
          </div>
        </div>
      </section>

      <div className="grain-overlay" />
    </div>
  );
}
