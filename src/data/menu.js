import croissant from '../assets/croissant.png';
import sourdough from '../assets/sourdough.png';
import rolls from '../assets/rolls.png';
import cookies from '../assets/cookies.png';
import scone from '../assets/scone.png';
import baguette from '../assets/baguette.png';
import donut from '../assets/donut.jpg';
import babka from '../assets/babka.jpg';
import painChocolat from '../assets/pain-chocolat.jpg';
import focaccia from '../assets/focaccia.jpg';
import cardamomBun from '../assets/cardamom-bun.jpg';
import financiers from '../assets/financiers.jpg';
import chocolateCake from '../assets/chocolate-cake.png';

export const STORES = [
  { city: 'Mumbai', note: 'Coastal wind delivery route (Bandra, Colaba, Juhu)', hours: '8am – 9pm' },
  { city: 'Pune', note: 'Hillside thermal flight path (KP, Kothrud, Baner)', hours: '8am – 9pm' },
];

export const MENU = [
  // 1. Hot Butter Croissant (Local Express)
  {
    id: '1',
    name: 'Hot Butter Croissant',
    price: 150,
    category: 'Broomstick Express',
    img: croissant,
    desc: 'Flaky, buttery layers with a crisp golden shell, served piping hot from the morning bake.',
    deliverFurther: false
  },
  // 2. Warm Country Sourdough (Local Express)
  {
    id: '2',
    name: 'Warm Country Sourdough',
    price: 200,
    category: 'Broomstick Express',
    img: sourdough,
    desc: 'Slow-fermented for 36 hours. Wild yeast culture with an open, airy crumb.',
    deliverFurther: false
  },
  // 3. Cinnamon Swirl Rolls (Local Express)
  {
    id: '3',
    name: 'Cinnamon Swirl Rolls',
    price: 220,
    category: 'Broomstick Express',
    img: rolls,
    desc: 'Warm spiced Ceylon cinnamon rolled with brown sugar and vanilla cream cheese glaze.',
    deliverFurther: false
  },
  // 4. Classic Glazed Brioche Donut (EXTENDED DELIVERY 1)
  {
    id: '4',
    name: 'Classic Glazed Brioche Donut',
    price: 180,
    category: 'Cargo Flight',
    img: donut,
    desc: 'Fluffy 24-hr brioche dough dipped in pure Madagascar vanilla bean glaze. Stays tender for long journeys.',
    deliverFurther: true
  },
  // 5. Jiji's Choco Cookies (EXTENDED DELIVERY 2)
  {
    id: '5',
    name: "Jiji's Chunky Choco Cookies",
    price: 250,
    category: 'Cargo Flight',
    img: cookies,
    desc: 'Rich 70% dark Belgian chocolate chunks and roasted walnuts, sealed airtight in a souvenir tin.',
    deliverFurther: true
  },
  // 6. Traditional French Baguette (EXTENDED DELIVERY 3)
  {
    id: '6',
    name: 'Artisan French Baguette',
    price: 180,
    category: 'Cargo Flight',
    img: baguette,
    desc: 'Stone-hearth baked with a shatteringly crisp crust that stays intact across longer city routes.',
    deliverFurther: true
  },
  // 7. Raisin & Citrus Tea Scones (EXTENDED DELIVERY 4)
  {
    id: '7',
    name: 'Raisin & Orange Tea Scones',
    price: 160,
    category: 'Cargo Flight',
    img: scone,
    desc: 'Buttery English tea scones studded with plump raisins and orange zest, paired with clotted cream.',
    deliverFurther: true
  },
  // 8. Honey Pistachio Babka Loaf (EXTENDED DELIVERY 5)
  {
    id: '8',
    name: 'Honey Pistachio Babka',
    price: 280,
    category: 'Cargo Flight',
    img: babka,
    desc: 'Braided brioche ribboned with pistachio cream, wildflower honey, and roasted pistachios. Keeps fresh for days.',
    deliverFurther: true
  },
  // 9. Chocolate Pain au Chocolat (Local Express)
  {
    id: '9',
    name: 'Pain au Chocolat',
    price: 170,
    category: 'Broomstick Express',
    img: painChocolat,
    desc: 'Double batons of rich Belgian dark chocolate folded into crisp, laminated butter pastry.',
    deliverFurther: false
  },
  // 10. Rosemary Garlic Focaccia (Local Express)
  {
    id: '10',
    name: 'Rosemary Garlic Focaccia',
    price: 210,
    category: 'Broomstick Express',
    img: focaccia,
    desc: 'Dimpled olive oil bread topped with garden rosemary sprigs, slow-roasted garlic cloves, and flaky Maldon salt.',
    deliverFurther: false
  },
  // 11. Swedish Cardamom Morning Bun (Local Express)
  {
    id: '11',
    name: 'Swedish Cardamom Bun',
    price: 190,
    category: 'Broomstick Express',
    img: cardamomBun,
    desc: 'Twisted Scandinavian dough layered with fresh crushed green cardamom and crunchy pearl sugar.',
    deliverFurther: false
  },
  // 12. Toasted Almond Financiers Box (Local Express)
  {
    id: '12',
    name: 'Toasted Almond Financiers',
    price: 230,
    category: 'Broomstick Express',
    img: financiers,
    desc: 'Petite French teacakes made with browned butter (beurre noisette) and toasted sliced almonds.',
    deliverFurther: false
  }
];

export { chocolateCake };

export const CATEGORIES = ['All Items', 'Broomstick Express', 'Cargo Flight'];

export const SECRET_WORDS = {
  backpack: {
    term: 'Backpack',
    meaning: '🧺 Backpack = Your Shopping Cart / Order Bag'
  },
  broomstick: {
    term: 'Broomstick Express',
    meaning: '🧹 Broomstick Express = Fresh oven bakes delivered hot to nearby neighborhoods within 30 mins'
  },
  cargo: {
    term: 'Cargo Flight',
    meaning: '🛵 Cargo Flight = Moisture-sealed bakery items that can be safely delivered further away to suburbs'
  },
  jiji: {
    term: "Jiji's Pick",
    meaning: "🐾 Jiji's Pick = Inspected and approved by our resident bakery cat"
  }
};
