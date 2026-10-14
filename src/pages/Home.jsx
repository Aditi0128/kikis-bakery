import hero from '../assets/hero.png';
import town from '../assets/town.jpg';
import logoImg from '../assets/logo.jpg';
import { Link } from 'react-router-dom';
import { MENU, STORES } from '../data/menu';
import { useCart } from '../context/CartContext';
import SecretWord from '../components/SecretWord';
import { Sparkles, Clock, Flame, Bike } from 'lucide-react';

const SCHEDULE = [
  { name: 'Artisan Breads', time: 'Fresh at 8:00 am', icon: '🍞' },
  { name: 'Flaky Pastries', time: 'Fresh at 10:00 am', icon: '🥐' },
  { name: 'Donuts & Tea Loaves', time: 'Fresh at 12:30 pm', icon: '🍩' },
  { name: 'Evening Hot Bake', time: 'Fresh at 4:30 pm', icon: '🥖' },
];

export default function Home() {
  const { add } = useCart();
  // Choose 3 standout specials including the new glazed donut!
  const specials = [
    MENU.find(m => m.id === '1'), // Croissant
    MENU.find(m => m.id === '4'), // Glazed Brioche Donut
    MENU.find(m => m.id === '3'), // Cinnamon Swirl
  ].filter(Boolean);

  return (
    <>
      <section className="intro intro-with-glow">
        <div className="intro-ambient-glow" aria-hidden="true" />
        <div className="intro-brand-header">
          <img src={logoImg} alt="Kiki's Bakery Emblem" className="intro-seal-badge" />
          <h1>Baked with a little magic.</h1>
        </div>
        <p>
          Fresh from the hearth in Mumbai & Pune, delivered straight to your{' '}
          <SecretWord word="Backpack" hint="🧺 Backpack = Your Shopping Cart">
            <strong>Backpack</strong>
          </SecretWord>{' '}
          via{' '}
          <SecretWord word="Broomstick Express" hint="🧹 Broomstick Express = Rapid local courier delivering warm in 30 mins">
            <strong>Broomstick Express</strong>
          </SecretWord>
          .
        </p>
      </section>

      <section className="stage">
        {/* Fixed & Polished Left Bar: Specials of the Day */}
        <aside className="side card specials-side">
          <div className="side-title-row">
            <Flame size={20} className="flame-icon" />
            <h2>Specials of the day</h2>
          </div>
          <span className="side-sub-caption">Pulled warm from the hearth</span>

          <ul className="specials-list-enhanced">
            {specials.map((s) => (
              <li key={s.id} className="special-item-row">
                <div className="special-info-wrap">
                  <img src={s.img} alt={s.name} className="special-mini-thumb" />
                  <div>
                    <span className="special-item-name">{s.name}</span>
                    {s.deliverFurther && (
                      <span className="mini-extended-pill" title="Can be delivered further away">
                        <Bike size={11} /> Suburbs ok
                      </span>
                    )}
                  </div>
                </div>
                <button
                  className="chip chip-add"
                  onClick={() => add(s)}
                  aria-label={`Add ${s.name} to backpack`}
                >
                  ₹{s.price} +
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Center Scene Window with Sunlit Gradient Underneath */}
        <div className="scene-container">
          <div className="scene-gradient-backdrop" aria-hidden="true" />
          <div className="scene">
            <img src={hero} alt="A cozy bakery counter with a window over a seaside town, a black cat on the sill" />
            <div className="steam" aria-hidden="true"><span /><span /><span /></div>
            <div className="scene-cta">
              <Link to="/menu" className="btn btn-cream">Order online (12 Bakes)</Link>
              <Link to="/reservations" className="btn btn-cream">Book a table</Link>
            </div>
          </div>
        </div>

        {/* Fixed Right Bar: Oven Baking Schedule (No longer duplicate 'Daily specials') */}
        <aside className="side card schedule-side">
          <div className="side-title-row">
            <Clock size={20} className="clock-icon" />
            <h2>Oven Schedule</h2>
          </div>
          <span className="live-oven-pulse">
            <span className="pulse-dot" /> Hearth 1 &bull; Active
          </span>

          <ul className="schedule-list-enhanced">
            {SCHEDULE.map((s) => (
              <li key={s.name} className="schedule-item-row">
                <span className="schedule-item-icon">{s.icon}</span>
                <div className="grow">
                  <strong className="schedule-name">{s.name}</strong>
                  <span className="muted schedule-time">{s.time}</span>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      {/* Stores Section with Seaside Gradient Wash */}
      <section
        className="stores"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(253,248,245,.88) 0%, rgba(255,235,215,.78) 50%, rgba(207,227,236,.82) 100%), url(${town})`
        }}
      >
        {STORES.map((s) => (
          <div className="card store" key={s.city}>
            <h3>{s.city}</h3>
            <p>{s.note}</p>
            <p className="muted">Open daily, {s.hours}</p>
          </div>
        ))}
      </section>
    </>
  );
}
