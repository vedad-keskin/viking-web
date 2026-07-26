import {
  Component,
  signal,
  computed,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// ── Translation dictionary ──
const TRANSLATIONS: Record<string, Record<string, string>> = {
  // Nav
  'nav.about': { bs: 'O nama', en: 'About' },
  'nav.services': { bs: 'Usluge', en: 'Services' },
  'nav.reviews': { bs: 'Recenzije', en: 'Reviews' },
  'nav.gallery': { bs: 'Galerija', en: 'Gallery' },
  'nav.team': { bs: 'Naš tim', en: 'Our Team' },
  'nav.location': { bs: 'Lokacija', en: 'Location' },
  'nav.contact': { bs: 'Kontakt', en: 'Contact' },

  // Hero
  'hero.subtitle': { bs: 'Auto Servis • Jablanica', en: 'Auto Service • Jablanica' },
  'hero.cta': { bs: 'Pozovi nas', en: 'Call us' },
  'hero.scroll': { bs: 'Saznaj više', en: 'Learn more' },

  // About
  'about.heading': { bs: 'O NAMA', en: 'ABOUT US' },
  'about.text': {
    bs: 'Viking je porodični auto servis u srcu Jablanice. Sa dugogodišnjim iskustvom, nudimo vulkanizerske usluge, profesionalno pranje automobila i punjenje auto klima. Naša misija je pružiti brzu, pouzdanu i pristupačnu uslugu svakom klijentu — bilo da ste lokalni stanovnik ili putnik na proputovanju.',
    en: 'Viking is a family-run auto service in the heart of Jablanica. With years of experience, we offer tire services, professional car washing, and AC recharging. Our mission is to provide fast, reliable, and affordable service to every client — whether you\'re a local or a traveler passing through.',
  },

  // Services
  'services.heading': { bs: 'USLUGE', en: 'SERVICES' },
  'service.tires.name': { bs: 'Vulkanizerske usluge', en: 'Tire Services' },
  'service.tires.desc': {
    bs: 'Zamjena, balansiranje i popravka guma za sve tipove vozila. Brzo i profesionalno.',
    en: 'Tire replacement, balancing, and repair for all vehicle types. Fast and professional.',
  },
  'service.wash.name': { bs: 'Pranje automobila', en: 'Car Wash' },
  'service.wash.desc': {
    bs: 'Kompletno unutrašnje i vanjsko pranje vašeg automobila. Detaljno i temeljito.',
    en: 'Complete interior and exterior car washing. Detailed and thorough.',
  },
  'service.ac.name': { bs: 'Punjenje auto klima', en: 'AC Recharge' },
  'service.ac.desc': {
    bs: 'Punjenje i servis klima uređaja za sve marke automobila. Brza usluga.',
    en: 'AC recharge and service for all car brands. Fast service.',
  },
  'service.call': { bs: 'Pozovi', en: 'Call' },
  'service.whatsapp': { bs: 'WhatsApp', en: 'WhatsApp' },

  // Reviews
  'reviews.heading': { bs: 'RECENZIJE', en: 'REVIEWS' },
  'reviews.subtitle': {
    bs: 'Šta naši klijenti kažu o nama',
    en: 'What our clients say about us',
  },
  'reviews.leave': { bs: 'Ostavite recenziju', en: 'Leave a Review' },
  'reviews.google': { bs: 'Google recenzije', en: 'Google Reviews' },

  // Gallery
  'gallery.heading': { bs: 'GALERIJA', en: 'GALLERY' },

  // Team
  'team.heading': { bs: 'NAŠ TIM', en: 'OUR TEAM' },

  // Location
  'location.heading': { bs: 'LOKACIJA', en: 'LOCATION' },
  'location.open': { bs: 'Otvori u Google Maps', en: 'Open in Google Maps' },

  // Contact / Footer
  'contact.heading': { bs: 'KONTAKT', en: 'CONTACT' },
  'contact.address.label': { bs: 'Adresa', en: 'Address' },
  'contact.phone.label': { bs: 'Telefon', en: 'Phone' },
  'contact.email.label': { bs: 'Email', en: 'Email' },
  'contact.follow': { bs: 'Pratite nas', en: 'Follow us' },
  'footer.rights': { bs: 'Sva prava zadržana.', en: 'All rights reserved.' },

  // Floating CTA
  'cta.call': { bs: 'Pozovi', en: 'Call' },
};

// ── Review data ──
interface Review {
  name: string;
  text: string;
  stars: number;
}

const REVIEWS: Review[] = [
  {
    name: 'Yasir Burić',
    text: 'Brza usluga, popio sam kafu u obližnjem kafiću dok sam čekao!',
    stars: 5,
  },
  {
    name: 'Benjamin Cero',
    text: 'Punjenje klime obave za svega par min pa nije problem i neplanski usput svrnut, jako povoljne nove gume širok izbor i lahko se nagoditi. Ja sam prezadovoljan jako prefesionalni, ljubazni i mogu reći strpljivi. Sve pet, toplo preporučujem!',
    stars: 5,
  },
  {
    name: 'Mirnes Šubara',
    text: 'Zamjena i balansiranje guma obavljeno brzo i profesionalno. Ljubazno osoblje, odlična usluga.',
    stars: 5,
  },
  {
    name: 'Mateja Volarević',
    text: 'Sve pohvale i preporuke! Priskočili su nam u pomoć iako im je radno vrijeme isteklo. Momak nam je napunio klima uređaj plinom i besplatno stavio dezinfekcijsko sredstvo. Usluga je bila više nego profesionalna. Osoblje je bilo vrlo ljubazno!',
    stars: 5,
  },
  {
    name: 'Edin Muratovic',
    text: 'Odlicna i ljubazna usluga, izlaze u susret i poslije radnog vremena. Super momci odradili intervenciju i spasili nas.',
    stars: 5,
  },
  {
    name: 'Elvedina Cajdin',
    text: 'Iznenada smo ostali bez klime na +35 i svratili! Vrhunska usluga! Sve preporuke!',
    stars: 5,
  },
  {
    name: 'Villa Harmony Sarajevo',
    text: 'Vlasnik je vrhunski momak prije svega. Primio nas je 3-4 sata iza radnog vremena, jer smo se zadesili na putu i guma nam je pukla. Momak nam je odradio intervenciju, zamjenio gumu novom i docekao nas vrhunski. Usluga je vrhunska. Sva oprema koju koriste je profi i visokog kvaliteta. Svaka cast!!! Preporucujem svima i puno uspjeha!',
    stars: 5,
  },
];

// ── Staff data ──
interface StaffMember {
  name: string;
  phone: string;
  whatsapp: string;
  roleBs: string;
  roleEn: string;
  image: string;
}

const STAFF: StaffMember[] = [
  {
    name: 'Almir Beli Keskin',
    phone: '+387 61 839 067',
    whatsapp: '38761839067',
    roleBs: 'Vulkanizer',
    roleEn: 'Tire Specialist',
    image: 'assets/staff/1.webp',
  },
  {
    name: 'Said Keskin',
    phone: '+387 64 40 65 144',
    whatsapp: '38764406514',
    roleBs: 'Auto klima',
    roleEn: 'AC Specialist',
    image: 'assets/staff/1.webp',
  },
  {
    name: 'Haris Ćosić',
    phone: '+387 62 581 310',
    whatsapp: '38762581310',
    roleBs: 'Pranje auta',
    roleEn: 'Car Wash Specialist',
    image: 'assets/staff/1.webp',
  },
];

// ── Service data ──
interface Service {
  nameBs: string;
  nameEn: string;
  descBs: string;
  descEn: string;
  icon: string;
  contactName: string;
  phone: string;
  whatsapp: string;
}

const SERVICES: Service[] = [
  {
    nameBs: 'Vulkanizerske usluge',
    nameEn: 'Tire Services',
    descBs: 'Zamjena, balansiranje i popravka guma za sve tipove vozila. Brzo i profesionalno.',
    descEn: 'Tire replacement, balancing, and repair for all vehicle types. Fast and professional.',
    icon: 'tire',
    contactName: 'Almir Beli Keskin',
    phone: '+387 61 839 067',
    whatsapp: '38761839067',
  },
  {
    nameBs: 'Pranje automobila',
    nameEn: 'Car Wash',
    descBs: 'Kompletno unutrašnje i vanjsko pranje vašeg automobila. Detaljno i temeljito.',
    descEn: 'Complete interior and exterior car washing. Detailed and thorough.',
    icon: 'wash',
    contactName: 'Haris Ćosić',
    phone: '+387 62 581 310',
    whatsapp: '38762581310',
  },
  {
    nameBs: 'Punjenje auto klima',
    nameEn: 'AC Recharge',
    descBs: 'Punjenje i servis klima uređaja za sve marke automobila. Brza usluga.',
    descEn: 'AC recharge and service for all car brands. Fast service.',
    icon: 'ac',
    contactName: 'Said Keskin',
    phone: '+387 64 40 65 144',
    whatsapp: '38764406514',
  },
];

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements AfterViewInit, OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private observer: IntersectionObserver | null = null;

  // ── State ──
  lang = signal<'bs' | 'en'>('bs');
  menuOpen = signal(false);
  headerScrolled = signal(false);

  // ── Data ──
  reviews = REVIEWS;
  staff = STAFF;
  services = SERVICES;

  // ── Computed ──
  otherLangFlag = computed(() => (this.lang() === 'bs' ? 'assets/flags/en.png' : 'assets/flags/bs.png'));
  otherLangLabel = computed(() => (this.lang() === 'bs' ? 'EN' : 'BS'));

  // ── Translation helper ──
  t(key: string): string {
    const entry = TRANSLATIONS[key];
    if (!entry) return key;
    return entry[this.lang()] || entry['bs'] || key;
  }

  // ── Lifecycle ──
  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Scroll animations
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            this.observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const animatedElements = this.el.nativeElement.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el: Element) => this.observer?.observe(el));

    // Header scroll listener
    window.addEventListener('scroll', this.onScroll, { passive: true });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('scroll', this.onScroll);
    }
  }

  // ── Methods ──
  private onScroll = (): void => {
    this.headerScrolled.set(window.scrollY > 50);
  };

  toggleLang(): void {
    this.lang.update((l) => (l === 'bs' ? 'en' : 'bs'));
  }

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  scrollTo(sectionId: string): void {
    this.closeMenu();
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  getPhoneHref(phone: string): string {
    return 'tel:' + phone.replace(/\s/g, '');
  }

  getWhatsAppHref(number: string): string {
    return 'https://wa.me/' + number;
  }

  getStars(count: number): number[] {
    return Array.from({ length: count }, (_, i) => i);
  }

  getInitial(name: string): string {
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }
}
