/**
 * All page copy lives here so the client can edit the site without
 * touching a component. Brand facts (29 branches, Salalah origin,
 * Volcano Roastery in Khazaen) come from 55coffee's public site;
 * everything else is demo copy written for this pitch.
 */

export const brand = {
  name: "55coffee",
  tagline: "beyond coffee",
  email: "info@55coffee.co",
  regions: "Muscat · Salalah · Batinah",
};

export const hero = {
  eyebrow: "Proudly Omani · Since 2018",
  titleTop: "Born in Oman.",
  titleBottom: "Crafted for every cup.",
  sub: "From a small kiosk in Salalah to 29 branches nationwide — quality, identity and community in every sip.",
  actTwoLead: "Beyond",
  actTwoAccent: "coffee",
  actTwoSub: "Everything past this line is the reason it tastes the way it does.",
  facts: [
    { value: 29, suffix: "", label: "Branches nationwide" },
    { value: 100, suffix: "%", label: "Omani owned" },
    { value: 14, prefix: "<", label: "Days bean to cup" },
  ],
};

export const testimonials = [
  // Placeholder voices for the demo — swap for real reviews before launch.
  { quote: "The shaken espresso is the only reason I make it to work on time.", name: "Amal", place: "Ghubrah" },
  { quote: "You can taste that it was roasted this week, not last quarter.", name: "Yusuf", place: "Rusayl" },
  { quote: "Their Spanish latte ruined every other Spanish latte for me.", name: "Reem", place: "Sahnoot" },
  { quote: "Open at 3am and still pulling a proper shot. Respect.", name: "Khalid", place: "Muscat Expressway" },
  { quote: "Started with them in Salalah, followed them all the way to Muscat.", name: "Fatma", place: "Qurum" },
  { quote: "Ask for cardamom in the latte. Thank me later.", name: "Salim", place: "Barka" },
  { quote: "The baristas actually know which farm the beans came from.", name: "Noor", place: "Azaiba" },
  { quote: "Cleanest iced americano in the country, no argument.", name: "Hamed", place: "Sohar" },
];

export const benefits = [
  {
    icon: "bean",
    n: "01",
    title: "More origin",
    body: "We handpick at the farm and follow every lot through processing. Traceable from soil to shot — no anonymous blends, no broker sacks.",
    img: "/assets/origin-1.jpg",
  },
  {
    icon: "roaster",
    n: "02",
    title: "More roast",
    body: "Roasted in-house at our Volcano Roastery in Khazaen, Muscat. One profile, one team, zero drift between branches.",
    img: "/assets/gen-roastery.jpg",
  },
  {
    icon: "cup",
    n: "03",
    title: "More craft",
    body: "Every barista trains on our bar before they pour for you. Dialled in each morning, dialled in again after lunch.",
    img: "/assets/gen-extraction.jpg",
  },
  {
    icon: "pin",
    n: "04",
    title: "More everywhere",
    body: "29 branches and counting, from the Salalah kiosk that started it to the 24-hour stops on the expressway.",
    img: "/assets/hero-2.jpg",
  },
] as const;

export const signature = [
  {
    n: "01",
    name: "Iced Americano",
    img: "/assets/drink-americano.jpg",
    body: "Two shots poured long over ice. Clean, crisp and unhidden — the cup that shows whether the roast is honest.",
    meta: "Iced coffee · No sugar",
  },
  {
    n: "02",
    name: "Iced Latte",
    img: "/assets/drink-latte.jpg",
    body: "Fresh espresso dropped into chilled milk. Soft, round and steady — the one you order when you want no surprises.",
    meta: "Iced coffee · Milk of choice",
  },
  {
    n: "03",
    name: "Iced Shaken",
    img: "/assets/drink-shaken.jpg",
    body: "Shaken hard until the crema turns to foam. Lighter body, bigger aroma, and a kick that lands before you finish it.",
    meta: "Iced coffee · House favourite",
  },
  {
    n: "04",
    name: "Salted Caramel Latte",
    img: "/assets/drink-caramel.jpg",
    body: "Caramel folded through milk and espresso, finished with salt so it stays a coffee and never becomes a dessert.",
    meta: "Iced coffee · Lightly sweet",
  },
  {
    n: "05",
    name: "Spanish Latte",
    img: "/assets/drink-spanish.jpg",
    body: "Condensed milk, cold milk and a bold ristretto on top. Rich enough to be the reason you drove out here.",
    meta: "Iced coffee · Best seller",
  },
];

export const compareRows = [
  "Roasted in our own roastery",
  "Traceable, farm-identified lots",
  "Under 14 days from roast to cup",
  "Ground per order, never pre-ground",
  "Baristas trained on our own bar",
  "Omani owned and operated",
  "24-hour branches on the expressway",
];

export const roastSteps = [
  {
    n: "01",
    title: "Green intake",
    body: "Every sack is logged against its farm and lot before it touches a drum. Moisture, density and screen size on record.",
  },
  {
    n: "02",
    title: "Profile roasting",
    body: "Curves are built per origin, then locked so no batch drifts from the last. Same charge, same turn, same drop.",
  },
  {
    n: "03",
    title: "Rest & dispatch",
    body: "Degassed, cupped, and out to the branches inside the same fortnight. Nothing sits in a warehouse.",
  },
];

export const origins = [
  { img: "/assets/origin-1.jpg", caption: "Handpicked at source", meta: "Farm level" },
  { img: "/assets/origin-2.jpg", caption: "Supervised processing", meta: "Washing station" },
  { img: "/assets/gen-extraction.jpg", caption: "Dialled in daily", meta: "On the bar" },
  { img: "/assets/origin-3.jpg", caption: "Logged, lot by lot", meta: "Green store" },
];

export const branches = [
  {
    name: "Rusayl Expressway",
    hours: "Open 24 hours",
    address: "Rusayl Expressway, Muscat",
    open24: true,
    img: "/assets/branch-rusayl.jpg",
  },
  {
    name: "Ghubrah",
    hours: "Open 24 hours",
    address: "North Ghubrah, Muscat",
    open24: true,
    img: "/assets/branch-ghubrah.jpg",
  },
  {
    name: "Qurum",
    hours: "Open 24 hours",
    address: "Qurum, Muscat",
    open24: true,
    img: "/assets/branch-qurum.jpg",
  },
  {
    name: "Airport Heights",
    hours: "6:00 AM — 1:00 AM",
    address: "Oman Oil, Ghala Heights, Muscat",
    open24: false,
    img: "/assets/branch-airport-heights.jpg",
  },
  {
    name: "Sahnoot",
    hours: "7:00 AM — 1:00 AM",
    address: "Sahnoot, Salalah",
    open24: false,
    img: "/assets/branch-sahnoot.jpg",
  },
  {
    name: "Salalah Center",
    hours: "7:00 AM — 2:00 AM",
    address: "Salalah Center, Salalah",
    open24: false,
    img: "/assets/branch-salalah-center.jpg",
  },
];

export const payments = ["Visa", "Mastercard", "Apple Pay", "Google Pay", "Thawani", "Cash"];

export const tickerItems = [
  "Start your day with 55",
  "Roasted in Khazaen",
  "29 branches nationwide",
  "Beyond coffee",
];

