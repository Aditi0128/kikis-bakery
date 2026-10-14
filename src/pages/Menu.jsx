import caseImg from "../assets/case.png";
import { useState } from 'react';
import { MENU, CATEGORIES, SECRET_WORDS } from '../data/menu';
import { useCart } from '../context/CartContext';
import SecretWord from '../components/SecretWord';
import { Bike, Sparkles, Filter } from 'lucide-react';

export default function Menu() {
  const [cat, setCat] = useState('All Items');
  const [onlyExtended, setOnlyExtended] = useState(false);
  const { add } = useCart();

  // Filter items
  const filtered = MENU.filter((m) => {
    if (onlyExtended && !m.deliverFurther) return false;
    if (cat === 'All Items') return true;
    return m.category === cat;
  });

  const extendedCount = MENU.filter(m => m.deliverFurther).length;

  return (
    <section className="page menu-page">
      <div className="case-showcase">
        <div className="case-gradient-glow" aria-hidden="true" />
        <img className="case" src={caseImg} alt="Display case full of fresh bread and pastries" />
      </div>

      <div className="menu-header text-center">
        <h1>Our bakery menu</h1>
        <p className="menu-subtitle">
          12 hand-shaped bakes &bull; 5 sealed for{' '}
          <SecretWord word="Cargo Flight" hint={SECRET_WORDS.cargo.meaning}>
            <strong>Extended Delivery 🛵</strong>
          </SecretWord>{' '}
          and 7 warm via{' '}
          <SecretWord word="Broomstick Express" hint={SECRET_WORDS.broomstick.meaning}>
            <strong>Broomstick Express 🧹</strong>
          </SecretWord>
        </p>
      </div>

      {/* Tabs and Filters */}
      <div className="menu-nav-controls">
        <div className="tabs" role="tablist">
          {CATEGORIES.map((c) => {
            const count = c === 'All Items' ? MENU.length : MENU.filter(m => m.category === c).length;
            return (
              <button
                key={c}
                role="tab"
                aria-selected={cat === c}
                className={cat === c ? 'on' : ''}
                onClick={() => { setCat(c); setOnlyExtended(false); }}
              >
                {c === 'Broomstick Express' ? (
                  <SecretWord word="Broomstick" hint="⚡ Ultra-fresh local items delivered warm in 30 mins">
                    Broomstick ({count})
                  </SecretWord>
                ) : c === 'Cargo Flight' ? (
                  <SecretWord word="Cargo" hint="🛵 5 items packed in sealed tins for longer delivery journeys">
                    Cargo Flight ({count})
                  </SecretWord>
                ) : (
                  `${c} (${count})`
                )}
              </button>
            );
          })}
        </div>

        {/* Quick filter for the 5 extended delivery items */}
        <button
          className={`btn btn-sm extended-filter-pill ${onlyExtended ? 'active-filter' : 'btn-cream'}`}
          onClick={() => setOnlyExtended(!onlyExtended)}
        >
          <Bike size={16} /> Suburbs & Extended Delivery ({extendedCount} items)
        </button>
      </div>

      {/* Grid of 12 items */}
      <div className="grid">
        {filtered.map((m) => (
          <article className="card item" key={m.id}>
            <div className="item-img-container">
              <div className="item-gradient-pedestal" aria-hidden="true" />
              <img className="item-img" src={m.img} alt={m.name} />
              {m.deliverFurther ? (
                <span className="extended-pill-badge" title="Can be delivered further away to suburbs">
                  <Bike size={13} /> Extended Range
                </span>
              ) : (
                <span className="local-express-badge" title="Ultra-fresh local delivery">
                  ⚡ Oven Hot
                </span>
              )}
            </div>
            <h3>{m.name}</h3>
            <p>{m.desc}</p>
            <div className="row">
              <span className="price big">₹{m.price}</span>
              <button
                className="btn btn-red"
                onClick={() => add(m)}
                title="Add to your Backpack"
              >
                Add
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
