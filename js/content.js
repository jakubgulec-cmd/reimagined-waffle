/**
 * content.js — TADY EDITUJ reference a blogové články
 * ─────────────────────────────────────────────────────
 * Obrázky dej do složky assets/ a uveď cestu: 'assets/nazev.jpg'
 * Pokud obrázek ještě nemáš, dej image: null — zobrazí se tmavý placeholder
 */

/* ── REFERENCE ─────────────────────────────────────────────────────────── */
window.REFERENCES = [
  {
    quote:    "Unipi nám umožnilo nasadit vlastní branded PLC bez nutnosti vyvíjet hardware od nuly. Za 15 týdnů jsme měli produkt na trhu.",
    name:     "Tomáš Novák",
    role:     "CTO, SmartBuild Systems",
    initials: "TN",
    tag:      "ODM program"
  },
  {
    quote:    "Nasadili jsme přes 200 jednotek v nemocničních budovách. Spolehlivost hardwaru i podpora od Unipi týmu předčila naše očekávání.",
    name:     "Markus Bauer",
    role:     "Lead Engineer, MedTech Facility GmbH",
    initials: "MB",
    tag:      "BMS / Healthcare"
  },
  {
    quote:    "Node-RED na Edge controlleru nám zkrátil dobu vývoje prototypu o polovinu. Ideální platforma pro rychlý IoT deployment.",
    name:     "Lucie Horáčková",
    role:     "Solution Architect, IoT Factory s.r.o.",
    initials: "LH",
    tag:      "Edge / Node-RED"
  },
  {
    quote:    "Patron PLC zvládá řízení FVE pro 40 objektů najednou. Robustní, spolehlivý a plně kompatibilní s naším SCADA systémem.",
    name:     "Erik Svensson",
    role:     "Project Manager, NordSolar AB",
    initials: "ES",
    tag:      "Solar / SCADA"
  },
  {
    quote:    "Díky ODM programu jsme mohli zákazníkům nabídnout řešení pod naší značkou. Profesionální přístup od prvního kontaktu.",
    name:     "Jan Pospíšil",
    role:     "CEO, AutoControl CZ",
    initials: "JP",
    tag:      "OEM / Branding"
  },
  {
    quote:    "Integrace s Home Assistantem funguje bez problémů. Ideální pro rezidenční projekty, kde zákazník chce lokální správu.",
    name:     "Sophie Müller",
    role:     "Smart Home Integrator, DE",
    initials: "SM",
    tag:      "Home Assistant"
  }
];

/* ── BLOGOVÉ ČLÁNKY ─────────────────────────────────────────────────────── */
window.BLOG_POSTS = [
  {
    image:    "assets/feqbxs1uwv_._IMG-20191007-104732-2-uai-2064x1161.jpg",   /* cesta k obrázku, nebo null */
    tag:      "Návod",
    tagColor: "#1B75BC",
    date:     "12. května 2025",
    title:    "Jak nasadit Node-RED na Edge E413 za 30 minut",
    perex:    "Krok za krokem od vybalení po první funkční flow — včetně konfigurace RS485 a Modbus TCP pro průmyslové senzory.",
    url:      "#"
  },
  {
    image:    "assets/ubhbpvk7bc_._pasted-image-0.png",
    tag:      "Case study",
    tagColor: "#FF8D3F",
    date:     "3. dubna 2025",
    title:    "200 jednotek v nemocnici: jak jsme řídili BMS bez výpadku",
    perex:    "Projekt MedTech Facility GmbH — nasazení Patron PLC v kritické infrastruktuře, redundance a nepřetržitý monitoring.",
    url:      "#"
  },
  {
    image:    "assets/image07.jpg",
    tag:      "ODM",
    tagColor: "#1B75BC",
    date:     "18. března 2025",
    title:    "Od prototypu k vlastnímu produktu: ODM program krok za krokem",
    perex:    "Co obnáší zakázkové barvení, potisk loga a certifikace — a proč 15 týdnů není jen marketingové číslo.",
    url:      "#"
  },
  {
    image:    "assets/ndj48wr1ob_._shutterstock-337316813.jpg",
    tag:      "Ekosystém",
    tagColor: "#FF8D3F",
    date:     "5. února 2025",
    title:    "CODESYS vs Mervis vs Node-RED: kdy použít co",
    perex:    "Praktické srovnání tří nejčastějších softwarových stacků na Unipi hardware — výhody, limity a typické use-casy.",
    url:      "#"
  }
];
