import { Component, HostListener, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { MENU_ITEMS, MenuItem } from './menu';
import { MenuCardComponent } from './components/menu-card/menu-card.component';

type Language = 'ar' | 'en' | 'de';

type BackgroundItem = {
  src: string;
  left: number;
  top: number;
  transform: string;
};

type ItemField = 'name' | 'description' | 'category';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MenuCardComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit, AfterViewInit, OnDestroy {
  language: Language = 'ar';
  selectedCategory = '';
  currentSloganIndex = 0;
  sloganIntervalId?: number;
  showScrollButton = false;
  backgroundItems: BackgroundItem[] = [];
  floatingMenuItems: BackgroundItem[] = [];
  imageSources = [
    'https://i.imgur.com/6ae8XS9.png',
    'https://i.imgur.com/wIv1Udd.png',
    'https://i.imgur.com/xEg1i0u.png',
    'https://i.imgur.com/QsPkK53.png'
  ];
  languages: { code: Language; label: string }[] = [
    { code: 'ar', label: 'العربية' },
    { code: 'en', label: 'English' },
    { code: 'de', label: 'Deutsch' }
  ];

  slogans = [
    {
      title: {
        ar: 'الآغا... سيد النكهة',
        en: 'Al Agha... Master of Flavor',
        de: 'Al Agha... Meister des Geschmacks'
      },
      text: {
        ar: '',
        en: '',
        de: ''
      }
    },
    {
      title: {
        ar: 'طعم يستحق العودة إليه',
        en: 'The Taste Worth Coming Back For',
        de: ' Der Geschmack, zu dem man zurückkehrt'
      },
      text: {
        ar: '',
        en: '',
        de: ''
      }
    },
    {
      title: {
        ar: 'نكهة الشام في كل لقمة',
        en: 'Authentic Flavor in Every Bite',
        de: 'Authentischer Geschmack in jedem Bissen'
      },
      text: {
        ar: '',
        en: '',
        de: ''
      }
    },
    {
      title: {
        ar: 'الآغا... نكهة الشام الأصيلة',
        en: 'Al Agha... The Authentic Taste of Syria',
        de: 'Der authentische Geschmack Syriens'
      },
      text: {
        ar: '',
        en: '',
        de: ''
      }
    }
  ];

  text: Record<string, Record<Language, string>> = {
    navMenu: {
      ar: 'القائمة',
      en: 'Menu',
      de: 'Speisekarte'
    },
    navContact: {
      ar: 'تواصل',
      en: 'Contact',
      de: 'Kontakt'
    },
    heroEyebrow: {
      ar: 'تجربة المشاوي العربية',
      en: 'Arabian BBQ Experience',
      de: 'Arabisches Barbecue-Erlebnis'
    },
    heroTitle: {
      ar: 'أشهى أطباق الشاورما والمشاوي في أجواء الآغا',
      en: 'Delicious Shawarma and Grill Flavors at alagha',
      de: 'Leckere Shawarma- und Grillgerichte bei alagha'
    },
    heroText: {
      ar: 'اكتشف قائمة متنوعة من الشاورما، الدجاج، الأطباق الخاصة والمقبلات مع لمسة شرقية عصرية.',
      en: 'Discover a varied menu of shawarma, chicken, signature plates and appetizers with a modern eastern touch.',
      de: 'Entdecke eine vielfältige Speisekarte mit Shawarma, Hähnchen, Spezialitäten und Vorspeisen mit modernem orientalischen Touch.'
    },
    heroButton: {
      ar: 'استعرض القائمة',
      en: 'View the Menu',
      de: 'Speisekarte ansehen'
    },
    menuSectionTitle: {
      ar: 'اختياراتنا المميزة',
      en: 'Our Featured Picks',
      de: 'Unsere Empfehlungen'
    },
    menuSectionSubtitle: {
      ar: 'القائمة',
      en: 'Menu',
      de: 'Speisekarte'
    },
    menuSectionDescription: {
      ar: 'اختر الفئة المناسبة ثم استعرض الأطباق المفضلة لديك مع الأسعار والوصف المختصر.',
      en: 'Choose the right category then browse your favorite dishes with prices and short descriptions.',
      de: 'Wähle die passende Kategorie und stöbere durch die Gerichte mit Preisen und kurzen Beschreibungen.'
    },
    sloganSectionSubtitle: {
      ar: 'سلايدات ملهمة',
      en: 'Inspiration',
      de: 'Inspiration'
    },
    sloganSectionTitle: {
      ar: 'الشعارات قبل التواصل',
      en: 'Slogans Before Contact',
      de: 'Slogans vor dem Kontakt'
    },
    contactHeader: {
      ar: 'تواصل معنا',
      en: 'Get in touch',
      de: 'Kontakt aufnehmen'
    },
    contactTitle: {
      ar: 'احجز أو اطلب الآن',
      en: 'Book or Order Now',
      de: 'Jetzt reservieren oder bestellen'
    },
    contactText: {
      ar: 'أرسل لنا رسالة وسنرد عليك سريعاً لتأكيد طلبك أو الحجز.',
      en: 'Send us a message and we will reply quickly to confirm your order or reservation.',
      de: 'Sende uns eine Nachricht und wir melden uns schnell zurück, um deine Bestellung oder Reservierung zu bestätigen.'
    },
    contactEmailLabel: {
      ar: 'البريد الإلكتروني',
      en: 'Email',
      de: 'Email'
    },
    contactLocationLabel: {
      ar: 'الموقع',
      en: 'Location',
      de: 'Ort'
    },
    labelName: {
      ar: 'الاسم',
      en: 'Name',
      de: 'Name'
    },
    placeholderName: {
      ar: 'الاسم الكامل',
      en: 'Full name',
      de: 'Vollständiger Name'
    },
    labelPhone: {
      ar: 'رقم الهاتف',
      en: 'Phone number',
      de: 'Telefonnummer'
    },
    placeholderPhone: {
      ar: 'رقم الاتصال',
      en: 'Contact number',
      de: 'Kontakt Nummer'
    },
    labelMessage: {
      ar: 'الرسالة',
      en: 'Message',
      de: 'Nachricht'
    },
    placeholderMessage: {
      ar: 'اكتب رسالتك هنا',
      en: 'Write your message here',
      de: 'Schreibe hier deine Nachricht'
    },
    requiredName: {
      ar: 'الاسم مطلوب.',
      en: 'Name is required.',
      de: 'Name ist erforderlich.'
    },
    requiredPhone: {
      ar: 'رقم الهاتف مطلوب.',
      en: 'Phone number is required.',
      de: 'Telefonnummer ist erforderlich.'
    },
    invalidPhone: {
      ar: 'يرجى إدخال رقم هاتف صالح.',
      en: 'Please enter a valid phone number.',
      de: 'Bitte gib eine gültige Telefonnummer ein.'
    },
    requiredMessage: {
      ar: 'الرجاء كتابة رسالة.',
      en: 'Please enter a message.',
      de: 'Bitte schreibe eine Nachricht.'
    },
    sendButton: {
      ar: 'أرسل',
      en: 'Send',
      de: 'Senden'
    },
    closeButton: {
      ar: 'إغلاق',
      en: 'Close',
      de: 'Schließen'
    },
    footerCopy: {
      ar: '© 2026 الآغا',
      en: '© 2026 alagha',
      de: '© 2026 alagha'
    },
    footerNote: {
      ar: 'مطعم عربي مع تجربة شاورما ومشاوي مميزة.',
      en: 'An Arabic restaurant with a unique shawarma and grill experience.',
      de: 'Ein arabisches Restaurant mit einzigartigem Shawarma- und Grill-Erlebnis.'
    },
    scrollTopLabel: {
      ar: 'العودة للأعلى',
      en: 'Scroll to top',
      de: 'Nach oben'
    },
    contactSuccess: {
      ar: 'شكراً! تم إرسال طلبك بنجاح.',
      en: 'Thank you! Your request has been sent successfully.',
      de: 'Danke! Deine Anfrage wurde erfolgreich gesendet.'
    }
  };

  menuItems$: Observable<MenuItem[]>;
  contactForm: FormGroup;
  successMessage = '';
  selectedItem: MenuItem | null = null;

  constructor(private fb: FormBuilder) {
    this.menuItems$ = of(MENU_ITEMS);
    this.selectedCategory = '';
    if (typeof document !== 'undefined') {
      document.documentElement.dir = 'rtl';
    }

    this.updateFloatingMenuItems();

    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[+\d][\d\s-]{4,}$/)]],
      message: ['', Validators.required]
    });
  }

  get f() {
    return this.contactForm.controls;
  }

  translate(key: keyof typeof this.text) {
    return this.text[key][this.language] || '';
  }

  get currentSlogan() {
    return this.slogans[this.currentSloganIndex];
  }

  nextSlogan() {
    this.currentSloganIndex = (this.currentSloganIndex + 1) % this.slogans.length;
  }

  prevSlogan() {
    this.currentSloganIndex = (this.currentSloganIndex - 1 + this.slogans.length) % this.slogans.length;
  }

  goToSlogan(index: number) {
    this.currentSloganIndex = index;
  }

  goToSloganByObject(slogan: { title: Record<Language, string>; text: Record<Language, string> }) {
    const index = this.slogans.indexOf(slogan);
    if (index >= 0) {
      this.currentSloganIndex = index;
    }
  }

  startSloganCarousel() {
    if (typeof window === 'undefined') {
      return;
    }
    this.stopSloganCarousel();
    this.sloganIntervalId = window.setInterval(() => this.nextSlogan(), 5000);
  }

  stopSloganCarousel() {
    if (this.sloganIntervalId != null) {
      window.clearInterval(this.sloganIntervalId);
      this.sloganIntervalId = undefined;
    }
  }

  ngOnDestroy() {
    this.stopSloganCarousel();
  }

  itemField(item: MenuItem, field: ItemField) {
    const key = `${field}_${this.language}` as keyof MenuItem;
    return item[key] || item[`${field}_ar` as keyof MenuItem] || '';
  }

  itemName(item: MenuItem) {
    return this.itemField(item, 'name');
  }

  itemDescription(item: MenuItem) {
    return this.itemField(item, 'description');
  }

  itemCategory(item: MenuItem) {
    return this.itemField(item, 'category');
  }

  categories(items: MenuItem[]) {
    return Array.from(new Set(items.map((item) => this.itemCategory(item)))).filter(Boolean);
  }

  private updateDocumentDirection(language: Language) {
    if (typeof document === 'undefined') {
      return;
    }

    const dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', language);
  }

  selectLanguage(language: Language) {
    this.language = language;
    this.selectedCategory = '';
    this.updateDocumentDirection(language);
  }

  getAllLabel(): string {
    const labels: Record<Language, string> = {
      ar: 'الكل',
      en: 'All',
      de: 'Alle'
    };
    return labels[this.language];
  }

  ngOnInit() {
    this.initBackgroundItems();
    this.startSloganCarousel();
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.updateFloatingMenuItems();
  }

  filteredItems(items: MenuItem[]) {
    if (!this.selectedCategory) {
      return items;
    }
    return items.filter((item) => this.itemCategory(item) === this.selectedCategory);
  }

  openPopup(item: MenuItem) {
    this.selectedItem = item;
    try {
      document.documentElement.style.overflow = 'hidden';
    } catch (e) {}
  }

  closePopup() {
    this.selectedItem = null;
    try {
      document.documentElement.style.overflow = '';
    } catch (e) {}
  }

  submitContact() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    console.log('Contact payload:', this.contactForm.value);
    this.successMessage = this.translate('contactSuccess');
    this.contactForm.reset();
    setTimeout(() => {
      this.successMessage = '';
    }, 5000);
  }

  @HostListener('window:scroll', [])
  @HostListener('window:touchmove', [])
  @HostListener('window:wheel', [])
  onWindowScroll() {
    this.updateScrollState();
  }

  ngAfterViewInit() {
    this.updateScrollState();
  }

  private updateScrollState() {
    if (typeof window === 'undefined') {
      return;
    }

    const visualTop = (window.visualViewport && window.visualViewport.pageTop) || 0;
    const rawScrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || visualTop || 0;
    const scrollTop = Math.max(0, rawScrollTop);
    this.showScrollButton = scrollTop > 520;
    const bgTranslate = -scrollTop * 0.15;
    document.documentElement.style.setProperty('--scroll-y', `${bgTranslate}px`);
  }

  scrollToTop() {
    if (typeof document === 'undefined') {
      return;
    }

    const scrollToTopIfPossible = (target: any) => {
      try {
        if (target && typeof target.scrollTo === 'function') {
          target.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } catch {
        // ignore failures for non-window/document targets
      }
      if (target && 'scrollTop' in target) {
        target.scrollTop = 0;
      }
    };

    scrollToTopIfPossible(document.documentElement);
    scrollToTopIfPossible(document.body);

    const nestedScrollContainers = Array.from(document.querySelectorAll<HTMLElement>('body *'))
      .filter((el) => el.scrollHeight > el.clientHeight);

    nestedScrollContainers.forEach((container) => {
      scrollToTopIfPossible(container);
    });

    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  private updateFloatingMenuItems() {
    const visibleItems = this.filteredItems(MENU_ITEMS);
    const maxCount = Math.min(12, Math.max(5, visibleItems.length));
    const availableZones = [
      { top: 6, left: 4 },
      { top: 12, left: 84 },
      { top: 32, left: 8 },
      { top: 38, left: 68 },
      { top: 58, left: 20 },
      { top: 64, left: 82 },
      { top: 78, left: 10 },
      { top: 82, left: 54 },
      { top: 24, left: 38 },
      { top: 50, left: 14 },
      { top: 52, left: 76 },
      { top: 70, left: 44 }
    ];

    this.floatingMenuItems = Array.from({ length: maxCount }, (_, index) => {
      const zone = availableZones[index % availableZones.length];
      const offsetX = Math.random() * 10 - 5;
      const offsetY = Math.random() * 10 - 5;
      const rotation = Math.floor(Math.random() * 40) - 20;
      const src = this.imageSources[index % this.imageSources.length];
      return {
        src,
        left: Math.min(94, Math.max(4, zone.left + offsetX)),
        top: Math.min(88, Math.max(6, zone.top + offsetY)),
        transform: `rotate(${rotation}deg)`
      };
    });
  }

  private initBackgroundItems() {
    const rows = 8;
    const cols = 8;
    const totalItemsNeeded = 50;
    const cells: { r: number; c: number }[] = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        cells.push({ r, c });
      }
    }

    for (let i = cells.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cells[i], cells[j]] = [cells[j], cells[i]];
    }

    this.backgroundItems = cells.slice(0, totalItemsNeeded).map((cell) => {
      const cellWidth = 100 / cols;
      const cellHeight = 100 / rows;
      const padding = 15;
      const minX = cell.c * cellWidth + (cellWidth * padding) / 100;
      const maxX = (cell.c + 1) * cellWidth - (cellWidth * padding) / 100 - 4;
      const minY = cell.r * cellHeight + (cellHeight * padding) / 100;
      const maxY = (cell.r + 1) * cellHeight - (cellHeight * padding) / 100 - 4;
      const left = minX + Math.random() * (maxX - minX);
      const top = minY + Math.random() * (maxY - minY);
      const rotation = Math.floor(Math.random() * 360);
      return {
        src: this.imageSources[Math.floor(Math.random() * this.imageSources.length)],
        left,
        top,
        transform: `rotate(${rotation}deg)`
      };
    });
  }
}
