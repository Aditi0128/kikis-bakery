import town from '../assets/town.jpg';
import caseImg from '../assets/case.png';
import cat from '../assets/cat.png';
import logoImg from '../assets/logo.jpg';
import { chocolateCake } from '../data/menu';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Bike, Zap, Compass, Coffee, Heart, CheckCircle2 } from 'lucide-react';
import SecretWord from '../components/SecretWord';

export default function About() {
  return (
    <section className="page about-page">
      {/* Header */}
      <div className="page-header text-center">
        <div className="intro-brand-header">
          <img src={logoImg} alt="Kiki's Bakery Seal" className="intro-seal-badge" />
          <h1>Our Bakeries & Delivery Routes</h1>
        </div>
        <p className="page-subtitle">
          From our ovens in Pune and Mumbai to your doorstep — see our physical bakery locations and suburban delivery zones.
        </p>
      </div>

      {/* Origin Story with Ghibli Seaside Framing */}
      <div className="about">
        <div className="about-img-frame">
          <div className="about-gradient-underlay" aria-hidden="true" />
          <img className="card about-img" src={town} alt="A hillside seaside town at golden hour" />
        </div>
        <div className="about-content">
          <h2>Baked With a Little Magic</h2>
          <p>
            Kiki's Bakery started with one hearth, one black cat, and an unwavering promise: artisan sourdough and laminated pastries should reach you while the butter is still steaming.
          </p>
          <p>
            Every morning at 4:00 am, our bakers shape sourdough by hand using stone-ground flour and 36-hour wild fermentations. By 8:00 am, our bicycle couriers and delivery riders take flight across Mumbai's coastal sea breeze and Pune's tree-lined hills.
          </p>
          <div className="about-pills-row">
            <span className="about-pill"><Heart size={14} className="pill-icon" /> 100% Real Butter</span>
            <span className="about-pill"><Clock size={14} className="pill-icon" /> 36-hr Fermentation</span>
            <span className="about-pill"><Coffee size={14} className="pill-icon" /> Fresh Hearth Daily</span>
          </div>
        </div>
      </div>

      {/* Physical Bakery Locations Section */}
      <div className="locations-section">
        <div className="section-title-wrap text-center">
          <span className="section-eyebrow">Visit Us in Person</span>
          <h2>Our Hearth & Bakery Counters</h2>
          <p className="muted">Drop in for warm morning coffee, watch the dough rolling, or sit by the window with a scone.</p>
        </div>

        <div className="shops-grid">
          {/* Pune Stores */}
          <div className="card shop-card">
            <div className="shop-card-head">
              <span className="city-tag pune-tag">Pune Hearth</span>
              <h3>Pune Bakery & Garden Courtyard</h3>
            </div>
            <div className="shop-details-list">
              <div className="shop-detail-row">
                <MapPin size={18} className="shop-icon" />
                <div>
                  <strong>Koregaon Park (Main Flagship)</strong>
                  <p className="muted">Lane 5, near South Main Road. Shaded garden seating under gulmohar trees with open view of the stone hearth oven.</p>
                </div>
              </div>
              <div className="shop-detail-row">
                <MapPin size={18} className="shop-icon" />
                <div>
                  <strong>Kothrud (Bake & Espresso Bar)</strong>
                  <p className="muted">Paud Road, near MIT Circle. Compact wooden counter with fresh morning loaves and pastry pickup.</p>
                </div>
              </div>
              <div className="shop-detail-row">
                <Clock size={18} className="shop-icon" />
                <div>
                  <strong>Hours:</strong> 7:30 am – 10:00 pm (Baking fresh hourly)
                </div>
              </div>
            </div>
            <div className="shop-card-actions">
              <Link to="/reservations" className="btn btn-cream btn-sm">Reserve a Window Table</Link>
            </div>
          </div>

          {/* Mumbai Stores */}
          <div className="card shop-card">
            <div className="shop-card-head">
              <span className="city-tag mumbai-tag">Mumbai Hearth</span>
              <h3>Mumbai Seaside Bakery Counter</h3>
            </div>
            <div className="shop-details-list">
              <div className="shop-detail-row">
                <MapPin size={18} className="shop-icon" />
                <div>
                  <strong>Bandra West (Seaside Flagship)</strong>
                  <p className="muted">Pali Hill, overlooking the Carter Road coastal promenade. Oceanfront salty breeze and Jiji's window cat sill.</p>
                </div>
              </div>
              <div className="shop-detail-row">
                <MapPin size={18} className="shop-icon" />
                <div>
                  <strong>Colaba (Heritage Waterfront Kitchen)</strong>
                  <p className="muted">Historic Causeway lane, near the harbor. Traditional French viennoiserie, baguettes, and afternoon tea pastries.</p>
                </div>
              </div>
              <div className="shop-detail-row">
                <Clock size={18} className="shop-icon" />
                <div>
                  <strong>Hours:</strong> 7:30 am – 10:30 pm (Every day)
                </div>
              </div>
            </div>
            <div className="shop-card-actions">
              <Link to="/reservations" className="btn btn-cream btn-sm">Reserve a Window Table</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Suburb Delivery Coverage Section */}
      <div className="delivery-coverage-section">
        <div className="section-title-wrap text-center">
          <span className="section-eyebrow">Delivery Radiuses</span>
          <h2>Where We Deliver in Pune & Mumbai</h2>
          <p className="muted">We deliver ultra-fresh bakes hot to nearby neighborhoods, and sealed cargo bakes to outer suburbs.</p>
        </div>

        <div className="delivery-zones-grid">
          {/* Zone 1: Local Express */}
          <div className="card delivery-zone-card local-zone-card">
            <div className="zone-badge-header">
              <span className="zone-indicator-badge zone-local">
                <Zap size={14} /> Zone 1: Local Broomstick Express
              </span>
              <span className="zone-time-tag">Within 30–40 Mins &bull; 0–7 km</span>
            </div>
            <h3>Piping Hot Oven Delivery</h3>
            <p className="zone-desc">
              All 12 items on the menu — delicate croissants, warm focaccia, and fresh baguettes — are dispatched immediately in insulated courier packs.
            </p>
            <div className="covered-neighborhoods">
              <div className="city-coverage-block">
                <strong>Pune Local:</strong>
                <p>Koregaon Park, Kalyani Nagar, Viman Nagar, Bund Garden, Kothrud, Deccan Gymkhana, FC Road, Shivajinagar, Camp, and Model Colony.</p>
              </div>
              <div className="city-coverage-block">
                <strong>Mumbai Local:</strong>
                <p>Bandra (West & East), Khar, Santacruz, Juhu, BKC, Colaba, Fort, Marine Drive, Nariman Point, and Churchgate.</p>
              </div>
            </div>
          </div>

          {/* Zone 2: Suburb Cargo Flight */}
          <div className="card delivery-zone-card suburb-zone-card">
            <div className="zone-badge-header">
              <span className="zone-indicator-badge zone-suburb">
                <Bike size={14} /> Zone 2: Suburb Cargo Flight
              </span>
              <span className="zone-time-tag">Same-Day Scheduled &bull; Up to 25 km</span>
            </div>
            <h3>Moisture-Sealed Suburb Delivery</h3>
            <p className="zone-desc">
              Our <strong>5 sturdiest long-range bakes</strong> (Glazed Brioche Donuts, Chunky Choco Cookies, English Scones, Artisan Baguettes, and Honey Pistachio Babka) are packed in airtight tins so they arrive in peak bakery condition.
            </p>
            <div className="covered-neighborhoods">
              <div className="city-coverage-block">
                <strong>Pune Suburbs Covered:</strong>
                <p>Baner, Balewadi, Aundh, Hinjawadi (Phases 1, 2, 3), Wakad, Pimple Saudagar, Pimpri-Chinchwad (PCMC), Magarpatta City, Hadapsar, Kharadi, and Bavdhan.</p>
              </div>
              <div className="city-coverage-block">
                <strong>Mumbai Suburbs Covered:</strong>
                <p>Andheri (West & East), Powai, Goregaon, Malad, Kandivali, Borivali, Chembur, Ghatkopar, Vikhroli, plus Navi Mumbai (Vashi, Nerul & Belapur).</p>
              </div>
            </div>
          </div>
        </div>

        {/* Suburb Ordering Tip Banner */}
        <div className="card suburb-tip-banner">
          <div className="tip-icon-wrap"><Compass size={24} /></div>
          <div>
            <strong>Ordering for the Suburbs?</strong>
            <p>
              On our <Link to="/menu" className="link-underline">Menu</Link>, look for the <strong>🛵 Extended Range</strong> badge or click the <em>Suburbs & Extended Delivery</em> filter to view the 5 items guaranteed to travel long distances without losing freshness.
            </p>
          </div>
        </div>
      </div>

      {/* Jiji & Kitchen Team Section */}
      <div className="about about-2">
        <div className="about-jiji-text">
          <span className="section-eyebrow">Head of Quality Control</span>
          <h2>Meet Jiji</h2>
          <p>
            He inspects every tray from his window sill perch and has never once approved a burnt crust. If a brioche loaf isn't golden and springy, it doesn't leave the kitchen.
          </p>
          <div className="cat-quote-box">
            "Purr-fection takes 36 hours. Don't rush the yeast."
          </div>
        </div>
        <div className="about-cat-frame">
          <div className="cat-gradient-glow" aria-hidden="true" />
          <img className="about-cat" src={cat} alt="Jiji, the bakery's black cat" />
        </div>
        <div className="about-case-frame">
          <div className="case-gradient-halo" aria-hidden="true" />
          <img className="about-case" src={chocolateCake} alt="Jiji's Signature Chocolate Celebration Cake" />
          <span className="case-sub-caption">Jiji's Signature Belgian Chocolate Drip Cake</span>
        </div>
      </div>
    </section>
  );
}
