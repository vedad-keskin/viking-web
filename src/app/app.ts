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
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

// ── Translation dictionary ──
const TRANSLATIONS: Record<string, Record<string, string>> = {
  // Nav
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

  // Stats
  'stats.years': { bs: 'Godina iskustva', en: 'Years Experience' },
  'stats.services': { bs: 'Usluge', en: 'Services' },
  'stats.rating': { bs: 'Google ocjena', en: 'Google Rating' },
  'stats.clients': { bs: 'Zadovoljnih klijenata', en: 'Happy Clients' },

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
  'location.directions': { bs: 'Upute', en: 'Get Directions' },
  'location.hours': { bs: 'Radno vrijeme', en: 'Working hours' },
  'location.hours.value': { bs: '07:00 – 16:00', en: '07:00 – 16:00' },

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
    name: 'Said Keskin',
    phone: '+387 64 40 65 144',
    whatsapp: '387644065144',
    roleBs: 'Vulkanizer / Auto klime',
    roleEn: 'Tire / AC Specialist',
    image: 'assets/staff/1.png',
  },
  {
    name: 'Haris Ćosić',
    phone: '+387 62 581 310',
    whatsapp: '38762581310',
    roleBs: 'Pranje auta',
    roleEn: 'Car Wash Specialist',
    image: 'assets/staff/2.png',
  },
  {
    name: 'Almir Beli Keskin',
    phone: '+387 61 839 067',
    whatsapp: '38761839067',
    roleBs: 'Vulkanizer',
    roleEn: 'Tire Specialist',
    image: 'assets/staff/3.png',
  },
];

// ── Service data ──
interface ServiceContact {
  name: string;
  roleBs: string;
  roleEn: string;
  phone: string;
  whatsapp: string;
  image: string;
}

interface Service {
  nameBs: string;
  nameEn: string;
  descBs: string;
  descEn: string;
  image: string;
  contacts: ServiceContact[];
}

const SERVICES: Service[] = [
  {
    nameBs: 'Vulkanizerske usluge',
    nameEn: 'Tire Services',
    descBs: 'Zamjena, balansiranje i popravka guma za sve tipove vozila. Brzo i profesionalno.',
    descEn: 'Tire replacement, balancing, and repair for all vehicle types. Fast and professional.',
    image: 'assets/services/ser1.webp',
    contacts: [
      {
        name: 'Almir Beli Keskin',
        roleBs: 'Vulkanizer',
        roleEn: 'Tire Specialist',
        phone: '+387 61 839 067',
        whatsapp: '38761839067',
        image: 'assets/staff/3.png',
      },
      {
        name: 'Said Keskin',
        roleBs: 'Vulkanizer',
        roleEn: 'Tire Specialist',
        phone: '+387 64 40 65 144',
        whatsapp: '387644065144',
        image: 'assets/staff/1.png',
      },
    ],
  },
  {
    nameBs: 'Pranje automobila',
    nameEn: 'Car Wash',
    descBs: 'Kompletno unutrašnje i vanjsko pranje vašeg automobila. Detaljno i temeljito.',
    descEn: 'Complete interior and exterior car washing. Detailed and thorough.',
    image: 'assets/services/ser2.webp',
    contacts: [
      {
        name: 'Haris Ćosić',
        roleBs: 'Pranje auta',
        roleEn: 'Car Wash Specialist',
        phone: '+387 62 581 310',
        whatsapp: '38762581310',
        image: 'assets/staff/2.png',
      },
    ],
  },
  {
    nameBs: 'Punjenje auto klima',
    nameEn: 'AC Recharge',
    descBs: 'Punjenje i servis klima uređaja za sve marke automobila. Brza usluga.',
    descEn: 'AC recharge and service for all car brands. Fast service.',
    image: 'assets/services/ser4.webp',
    contacts: [
      {
        name: 'Said Keskin',
        roleBs: 'Auto klima',
        roleEn: 'AC Specialist',
        phone: '+387 64 40 65 144',
        whatsapp: '387644065144',
        image: 'assets/staff/1.png',
      },
    ],
  },
];

// ── Stats data ──
interface Stat {
  value: number;
  suffix: string;
  labelBs: string;
  labelEn: string;
}

const STATS: Stat[] = [
  { value: 5, suffix: '+', labelBs: 'Godina iskustva', labelEn: 'Years Experience' },
  { value: 3, suffix: '', labelBs: 'Usluge', labelEn: 'Services' },
  { value: 5, suffix: '.0', labelBs: 'Google ocjena', labelEn: 'Google Rating' },
  { value: 1000, suffix: '+', labelBs: 'Zadovoljnih klijenata', labelEn: 'Happy Clients' },
];

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements AfterViewInit, OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly sanitizer = inject(DomSanitizer);
  private observer: IntersectionObserver | null = null;
  private statsObserver: IntersectionObserver | null = null;
  private autoPlayInterval: ReturnType<typeof setInterval> | null = null;
  private autoPlayResumeTimeout: ReturnType<typeof setTimeout> | null = null;
  private autoPlayPaused = false;

  // ── State ──
  lang = signal<'bs' | 'en'>('bs');
  menuOpen = signal(false);
  headerScrolled = signal(false);
  theme = signal<'day' | 'night'>('night');
  showBackToTop = signal(false);

  // ── Stats animation ──
  statsAnimated = signal(false);
  animatedStatValues = signal<number[]>([0, 0, 0, 0]);

  // ── Data ──
  reviews = REVIEWS;
  staff = STAFF;
  services = SERVICES;
  stats = STATS;

  // ── Theme computed ──
  isNight = computed(() => this.theme() === 'night');

  // ── Maps ──
  readonly mapsPlaceUrl = 'https://maps.app.goo.gl/HAHf9eef7ErCuwpx5';
  readonly mapsDirectionsUrl =
    'https://www.google.com/maps/dir/?api=1&destination=43.6556649,17.7605798';
  readonly mapsEmbedUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    // Center slightly south of the pin so the marker sits higher in the viewport
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1200!2d17.7605798!3d43.65535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475f5f6dca002abb%3A0x5d6753c0407494a2!2sViking!5e0!3m2!1sbs!2sba!4v1706000000000'
  );

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

    // Load saved theme
    const savedTheme = localStorage.getItem('viking.theme');
    if (savedTheme === 'day' || savedTheme === 'night') {
      this.theme.set(savedTheme);
    }
    this.applyTheme(this.theme());

    // Hide splash screen
    setTimeout(() => {
      const splash = document.getElementById('appSplash');
      if (splash) {
        splash.classList.add('hidden');
        setTimeout(() => splash.remove(), 600);
      }
    }, 800);

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

    // Stats counter observer
    this.setupStatsObserver();

    // Header scroll listener + back-to-top
    window.addEventListener('scroll', this.onScroll, { passive: true });

    // Auto-play carousel
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.statsObserver?.disconnect();
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('scroll', this.onScroll);
    }
    this.stopAutoPlay();
    this.clearAutoPlayResumeTimeout();
  }

  // ── Methods ──
  private scrollTicking = false;

  private onScroll = (): void => {
    if (this.scrollTicking) return;
    this.scrollTicking = true;
    requestAnimationFrame(() => {
      this.headerScrolled.set(window.scrollY > 50);
      this.showBackToTop.set(window.scrollY > window.innerHeight);
      this.scrollTicking = false;
    });
  };

  // ── Theme ──
  toggleTheme(): void {
    const newTheme = this.theme() === 'day' ? 'night' : 'day';
    this.theme.set(newTheme);
    this.applyTheme(newTheme);
    localStorage.setItem('viking.theme', newTheme);
  }

  private applyTheme(theme: 'day' | 'night'): void {
    document.documentElement.setAttribute('data-theme', theme);
    const meta = document.getElementById('meta-theme-color');
    if (meta) {
      meta.setAttribute('content', theme === 'night' ? '#0D0D0D' : '#FAFAF8');
    }
  }

  // ── Lang ──
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

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  // ── Header Split Parts ──
  getHeaderParts(key: string): { part1: string; part2: string } {
    const isBs = this.lang() === 'bs';
    switch (key) {
      case 'services':
        return isBs ? { part1: 'US', part2: 'LUGE' } : { part1: 'SER', part2: 'VICES' };
      case 'reviews':
        return isBs ? { part1: 'RECEN', part2: 'ZIJE' } : { part1: 'RE', part2: 'VIEWS' };
      case 'gallery':
        return isBs ? { part1: 'GALE', part2: 'RIJA' } : { part1: 'GAL', part2: 'LERY' };
      case 'team':
        return isBs ? { part1: 'NAŠ', part2: 'TIM' } : { part1: 'OUR', part2: 'TEAM' };
      case 'location':
        return isBs ? { part1: 'LOKA', part2: 'CIJA' } : { part1: 'LOCA', part2: 'TION' };
      case 'contact':
        return isBs ? { part1: 'KON', part2: 'TAKT' } : { part1: 'CON', part2: 'TACT' };
      default:
        return { part1: '', part2: '' };
    }
  }

  // ── Stats Counter Animation ──
  private setupStatsObserver(): void {
    const statsSection = this.el.nativeElement.querySelector('#stats');
    if (!statsSection) return;

    this.statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.statsAnimated()) {
            this.statsAnimated.set(true);
            this.animateStats();
            this.statsObserver?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    this.statsObserver.observe(statsSection);
  }

  private animateStats(): void {
    const duration = 2000;
    const fps = 60;
    const totalFrames = duration / (1000 / fps);
    let frame = 0;

    const animate = () => {
      frame++;
      const progress = Math.min(frame / totalFrames, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic

      const values = this.stats.map((stat) =>
        Math.round(stat.value * eased)
      );
      this.animatedStatValues.set(values);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  getStatDisplay(index: number): string {
    const val = this.animatedStatValues()[index];
    const stat = this.stats[index];
    // Special formatting for the rating (5.0)
    if (stat.suffix === '.0') {
      return val + stat.suffix;
    }
    return val + stat.suffix;
  }

  // ── Carousel Navigation ──
  activeReviewIndex = signal(0);
  activeGalleryIndex = signal(0);

  scrollCarousel(carouselId: string, direction: 'prev' | 'next'): void {
    const carousel = this.el.nativeElement.querySelector(`#${carouselId}`);
    if (!carousel) return;

    const track = carousel.querySelector('.reviews-track, .gallery-track') as HTMLElement;
    if (!track) return;

    const firstChild = track.firstElementChild as HTMLElement;
    if (!firstChild) return;

    const gap = parseInt(getComputedStyle(track).gap) || 16;
    const scrollAmount = firstChild.offsetWidth + gap;

    if (direction === 'next') {
      carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    } else {
      carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }

    // Update active index after scroll
    setTimeout(() => {
      this.updateCarouselIndex(carouselId);
    }, 400);
  }

  goToSlide(carouselId: string, index: number): void {
    const carousel = this.el.nativeElement.querySelector(`#${carouselId}`);
    if (!carousel) return;

    const track = carousel.querySelector('.reviews-track, .gallery-track') as HTMLElement;
    if (!track) return;

    const firstChild = track.firstElementChild as HTMLElement;
    if (!firstChild) return;

    const gap = parseInt(getComputedStyle(track).gap) || 16;
    const scrollTo = index * (firstChild.offsetWidth + gap);

    carousel.scrollTo({ left: scrollTo, behavior: 'smooth' });

    if (carouselId === 'reviewsCarousel') {
      this.activeReviewIndex.set(index);
    } else {
      this.activeGalleryIndex.set(index);
    }
  }

  private updateCarouselIndex(carouselId: string): void {
    const carousel = this.el.nativeElement.querySelector(`#${carouselId}`);
    if (!carousel) return;

    const track = carousel.querySelector('.reviews-track, .gallery-track') as HTMLElement;
    if (!track) return;

    const firstChild = track.firstElementChild as HTMLElement;
    if (!firstChild) return;

    const gap = parseInt(getComputedStyle(track).gap) || 16;
    const index = Math.round(carousel.scrollLeft / (firstChild.offsetWidth + gap));

    if (carouselId === 'reviewsCarousel') {
      this.activeReviewIndex.set(index);
    } else {
      this.activeGalleryIndex.set(index);
    }
  }

  onCarouselScroll(carouselId: string): void {
    this.updateCarouselIndex(carouselId);
  }

  // ── Auto-play Reviews Carousel ──
  private startAutoPlay(): void {
    this.autoPlayInterval = setInterval(() => {
      if (this.autoPlayPaused) return;
      const currentIndex = this.activeReviewIndex();
      const nextIndex = (currentIndex + 1) % this.reviews.length;
      this.goToSlide('reviewsCarousel', nextIndex);
    }, 5000);
  }

  private stopAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  onReviewsMouseEnter(): void {
    this.clearAutoPlayResumeTimeout();
    this.autoPlayPaused = true;
  }

  onReviewsMouseLeave(): void {
    this.autoPlayPaused = false;
  }

  onReviewsTouchEnd(): void {
    this.clearAutoPlayResumeTimeout();
    this.autoPlayPaused = true;
    this.autoPlayResumeTimeout = setTimeout(() => {
      this.autoPlayPaused = false;
      this.autoPlayResumeTimeout = null;
    }, 8000);
  }

  private clearAutoPlayResumeTimeout(): void {
    if (this.autoPlayResumeTimeout) {
      clearTimeout(this.autoPlayResumeTimeout);
      this.autoPlayResumeTimeout = null;
    }
  }
}
