/**
 * A RAFI PARINGGOM IWARI, S.Si. — PORTOFOLIO DATA SCIENCE & EDTECH
 * Interactive Engine (Inspired by ekawahyu-portofolio.vercel.app)
 */

(() => {
  'use strict';

  // Helper shortcuts
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

  // Toast notification
  const showToast = (message) => {
    const toast = $('#toast-notification');
    const msgEl = $('#toast-msg');
    if (!toast || !msgEl) return;

    msgEl.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  };

  // Set current year in footer
  const yearEl = $('#current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ==========================================================================
     1. NAVBAR, SCROLLSPY & SCROLL PROGRESS BAR
     ========================================================================== */
  const navbar = $('#navbar');
  const progressBar = $('#scroll-progress');
  const navLinks = $$('.nav-links .nav-item');
  const sections = navLinks.map(link => $(link.getAttribute('href'))).filter(Boolean);

  const handleScroll = () => {
    const docEl = document.documentElement;
    const scrollTop = docEl.scrollTop || document.body.scrollTop;
    const scrollHeight = docEl.scrollHeight - docEl.clientHeight;

    // Progress Bar
    if (progressBar && scrollHeight > 0) {
      const progressPercent = (scrollTop / scrollHeight) * 100;
      progressBar.style.width = `${progressPercent}%`;
    }

    // Navbar scrolled state
    if (navbar) {
      navbar.classList.toggle('scrolled', scrollTop > 25);
    }

    // Scrollspy active link
    let currentSectionIndex = -1;
    sections.forEach((sec, idx) => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 180) {
        currentSectionIndex = idx;
      }
    });

    navLinks.forEach((link, idx) => {
      link.classList.toggle('active', idx === currentSectionIndex);
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ==========================================================================
     2. MOBILE DRAWER NAVIGATION
     ========================================================================== */
  const burgerBtn = $('#burger-btn');
  const mobileDrawer = $('#mobile-drawer');
  const drawerClose = $('#drawer-close');
  const drawerLinks = $$('.drawer-link');

  const openDrawer = () => {
    if (mobileDrawer) mobileDrawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    if (mobileDrawer) mobileDrawer.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (burgerBtn) burgerBtn.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));

  /* ==========================================================================
     3. DYNAMIC TYPING EFFECT (HERO)
     ========================================================================== */
  const typedEl = $('#typed-text');
  if (typedEl) {
    const roles = [
      'Data Scientist',
      'Statistical Modeler',
      'EdTech Data Specialist',
      'Geospatial Analyst',
      'Financial Econometrician'
    ];

    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    const typeAnimation = () => {
      const currentRole = roles[roleIdx];

      if (isDeleting) {
        typedEl.textContent = currentRole.substring(0, charIdx - 1);
        charIdx--;
      } else {
        typedEl.textContent = currentRole.substring(0, charIdx + 1);
        charIdx++;
      }

      let typeSpeed = isDeleting ? 40 : 85;

      if (!isDeleting && charIdx === currentRole.length) {
        typeSpeed = 1600; // Pause at end of word
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        typeSpeed = 400; // Pause before typing next word
      }

      setTimeout(typeAnimation, typeSpeed);
    };

    setTimeout(typeAnimation, 600);
  }

  /* ==========================================================================
     4. NUMBER COUNTER ANIMATION
     ========================================================================== */
  const animateCount = (element) => {
    const targetValue = parseFloat(element.dataset.count);
    const decimals = parseInt(element.dataset.dec, 10) || 0;
    const suffix = element.dataset.suffix || '';
    const duration = 1400; // ms
    const startTime = performance.now();

    const updateNumber = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentVal = targetValue * easeOut;

      element.textContent = currentVal.toFixed(decimals) + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        element.textContent = targetValue.toFixed(decimals) + suffix;
      }
    };

    requestAnimationFrame(updateNumber);
  };

  /* ==========================================================================
     5. SCROLL REVEAL OBSERVER
     ========================================================================== */
  const revealElements = $$('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');

        // Check for counters inside revealed element
        const counters = $$('[data-count]', entry.target);
        counters.forEach(counter => {
          if (!counter.dataset.animated) {
            counter.dataset.animated = 'true';
            animateCount(counter);
          }
        });

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ==========================================================================
     6. SKILLS CATEGORY FILTER
     ========================================================================== */
  const skillCategoryButtons = $$('[data-filter-group="skill"] .cat-btn');
  const skillCards = $$('.skill-card');

  skillCategoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      skillCategoryButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.dataset.filter;

      skillCards.forEach(card => {
        if (filterValue === 'all' || card.dataset.category === filterValue) {
          card.style.display = 'block';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
    });
  });

  /* ==========================================================================
     7. MAIN PORTFOLIO TABS (Projects, Certificates, Awards)
     ========================================================================== */
  const portTabs = $$('.port-tab');
  const tabContents = $$('.tab-content');

  portTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      portTabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const targetId = `tab-${tab.dataset.tab}`;
      const targetContent = $(`#${targetId}`);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });

  /* ==========================================================================
     8. PROJECTS SUB-FILTER (All, ds, viz, research)
     ========================================================================== */
  const projSubButtons = $$('.sub-filter-bar .sub-btn');
  const projectCards = $$('.projects-grid .project-card');

  projSubButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      projSubButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.dataset.projFilter;

      projectCards.forEach(card => {
        const categories = (card.dataset.category || '').split(' ');
        if (filterVal === 'all' || categories.includes(filterVal)) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
    });
  });

  /* ==========================================================================
     9. PROJECT & PORTFOLIO MODAL SYSTEM
     ========================================================================== */
  const modalData = {
    hivmate: {
      tag: '🏆 Juara 1 Best Presenter · SAINTEK 2024',
      title: 'HiVMate: Ekosistem Digital Pendukung Kesehatan Pasien Terapi',
      bodyHtml: `
        <div class="modal-media-box">
          <img src="assets/images/hivmate-logo.png" alt="HiVMate Logo" class="modal-hivmate-logo">
        </div>
        <p><strong>Latar Belakang:</strong> Kepatuhan pasien dalam menjalani terapi antiretroviral (ART) merupakan faktor krusial untuk menekan replikasi virus dan mempertahankan kualitas hidup penderita. Kegagalan jadwal minum obat sering kali memicu resistensi obat.</p>
        <p><strong>Solusi &amp; Metodologi:</strong> Bersama tim, saya merancang dan membangun <em>HiVMate</em>, sebuah ekosistem digital cerdas yang memadukan fitur pendampingan harian, pelacak kepatuhan, serta modul pemodelan prediktif berbasis Python untuk mengidentifikasi potensi putus terapi secara dini.</p>
        <p><strong>Prestasi Ilmiah:</strong> Dipresentasikan pada Seminar Nasional Sains dan Teknologi (SAINTEK) Series III tahun 2024 di ITERA dan berhasil meraih predikat <strong>Juara 1 Presentasi Terbaik (1st Best Presenter)</strong> di antara puluhan peserta peneliti dari berbagai perguruan tinggi nasional.</p>
        <div class="modal-cta-row">
          <a href="https://hivmateteam19.streamlit.app/" target="_blank" rel="noopener" class="btn-primary modal-live-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            <span>Buka Aplikasi Web (hivmateteam19.streamlit.app) ↗</span>
          </a>
        </div>
        <div class="modal-meta-box">
          <div class="modal-meta-row"><span class="modal-meta-label">Tautan Live:</span><span class="modal-meta-val"><a href="https://hivmateteam19.streamlit.app/" target="_blank" rel="noopener" style="color:var(--accent-cyan);text-decoration:underline;">https://hivmateteam19.streamlit.app/</a></span></div>
          <div class="modal-meta-row"><span class="modal-meta-label">Peran:</span><span class="modal-meta-val">Lead Analyst &amp; Co-Developer</span></div>
          <div class="modal-meta-row"><span class="modal-meta-label">Teknologi:</span><span class="modal-meta-val">Python, Streamlit, Scikit-learn, Statistical Modeling</span></div>
          <div class="modal-meta-row"><span class="modal-meta-label">Kategori:</span><span class="modal-meta-val">Healthcare Data Science &amp; EdTech Health</span></div>
          <div class="modal-meta-row"><span class="modal-meta-label">Tahun:</span><span class="modal-meta-val">2024</span></div>
        </div>
      `
    },
    egarch: {
      tag: '🎓 Tugas Akhir / Skripsi S1 Sains Data',
      title: 'Analisis & Prediksi Volatilitas Return Saham BBRI dengan Model EGARCH',
      bodyHtml: `
        <div class="modal-media-box">
          <img src="assets/images/egarch-plot.png" alt="Plot Volatilitas Return Saham BBRI" class="modal-plot-img">
          <div class="modal-img-caption">Visualisasi Deret Waktu: Return Harian Saham PT Bank Rakyat Indonesia (BBRI) Periode September 2018 – September 2024 menunjukkan fenomena volatility clustering dan shock asimetris.</div>
        </div>
        <p><strong>Latar Belakang:</strong> Saham PT Bank Rakyat Indonesia (Persero) Tbk (BBRI) merupakan salah satu saham perbankan berkapitalisasi terbesar di Bursa Efek Indonesia. Volatilitas return saham sering kali memiliki sifat heteroskedastisitas dan efek asimetri (leverage effect), di mana berita buruk (bad news) menimbulkan fluktuasi lebih besar daripada berita baik.</p>
        <p><strong>Pendekatan Ekonometrika:</strong> Menggunakan model <em>Exponential Generalized Autoregressive Conditional Heteroskedasticity (EGARCH)</em> oleh Nelson (1991). Model ini tidak membatasi parameter harus non-negatif dan mampu menangkap respons asimetris return finansial secara rigid.</p>
        <p><strong>Hasil &amp; Temuan:</strong> Pengujian stasioneritas, uji efek ARCH-LM, estimasi parameter model EGARCH dengan berbagai distribusi inovasi (Normal, Student-t, GED), serta uji diagnostik residual Ljung-Box berhasil memetakan persistensi volatilitas return saham BBRI untuk manajemen risiko portofolio.</p>
        <div class="modal-meta-box">
          <div class="modal-meta-row"><span class="modal-meta-label">Penulis:</span><span class="modal-meta-val">Rafi Paringgom Iwari, S.Si.</span></div>
          <div class="modal-meta-row"><span class="modal-meta-label">Alat Bantu:</span><span class="modal-meta-val">R Language (rugarch, tseries, forecast), Time Series Analysis</span></div>
          <div class="modal-meta-row"><span class="modal-meta-label">Institusi:</span><span class="modal-meta-val">Program Studi Sains Data, Jurusan Sains, ITERA</span></div>
          <div class="modal-meta-row"><span class="modal-meta-label">Tahun:</span><span class="modal-meta-val">2026</span></div>
        </div>
      `
    },
    bps: {
      tag: '🏛️ Publikasi Resmi Badan Pusat Statistik',
      title: 'Kabupaten Lampung Timur dalam Angka 2024',
      bodyHtml: `
        <p><strong>Latar Belakang:</strong> Buku <em>Kabupaten Lampung Timur dalam Angka</em> adalah publikasi rujukan utama BPS yang memuat kumpulan data statistik dasar dan sektoral dari dinas, instansi, serta hasil survei sensus di 24 kecamatan.</p>
        <p><strong>Kontribusi &amp; Tanggung Jawab:</strong> Sebagai Asisten Pengolah Data di BPS Kabupaten Lampung Timur, saya bertanggung jawab melakukan integrasi puluhan tabel sektoral, verifikasi konsistensi logika data antar-bab, standarisasi format data BPS, serta pembersihan data anomali sebelum naskah diterbitkan secara resmi kepada pemerintah daerah dan publik.</p>
        <div class="modal-meta-box">
          <div class="modal-meta-row"><span class="modal-meta-label">Instansi:</span><span class="modal-meta-val">Badan Pusat Statistik (BPS) Kabupaten Lampung Timur</span></div>
          <div class="modal-meta-row"><span class="modal-meta-label">Perangkat:</span><span class="modal-meta-val">MS Excel (Advanced Functions &amp; Power Query), Database Sektoral</span></div>
          <div class="modal-meta-row"><span class="modal-meta-label">Cakupan Data:</span><span class="modal-meta-val">Demografi, Geografi, Pertanian, Tenaga Kerja, Makroekonomi</span></div>
          <div class="modal-meta-row"><span class="modal-meta-label">Tahun:</span><span class="modal-meta-val">2024</span></div>
        </div>
      `
    },
    fraud: {
      tag: '🤖 Machine Learning & Data Integrity',
      title: 'Sistem Deteksi Kecurangan (Fraud Detection) Data Survei',
      bodyHtml: `
        <p><strong>Tujuan Proyek:</strong> Mengurangi potensi <em>data fabrication</em> atau kecurangan pengisian kuesioner survei lapangan oleh surveyor dengan menerapkan algoritma machine learning pendeteksi anomali tanpa label (unsupervised learning).</p>
        <p><strong>Metodologi:</strong> Menggunakan kombinasi metode statistik Z-score multivariate untuk filtering data ekstrem serta algoritma <em>Isolation Forest</em> untuk mendeteksi kuesioner dengan pola waktu pengerjaan tidak rasional, keseragaman varians respon, dan korelasi silang atribut yang menyimpang.</p>
        <p><strong>Hasil Pengujian:</strong> Sistem mampu menandai entri yang mencurigakan secara otomatis sehingga tim pengawas survei dapat segera melakukan spot-check verifikasi lapangan secara presisi.</p>
        <div class="modal-meta-box">
          <div class="modal-meta-row"><span class="modal-meta-label">Bahasa:</span><span class="modal-meta-val">Python</span></div>
          <div class="modal-meta-row"><span class="modal-meta-label">Pustaka:</span><span class="modal-meta-val">Scikit-learn, Pandas, NumPy, Matplotlib</span></div>
          <div class="modal-meta-row"><span class="modal-meta-label">Metode:</span><span class="modal-meta-val">Isolation Forest, Mahalanobis Distance, Z-Score Anomaly</span></div>
          <div class="modal-meta-row"><span class="modal-meta-label">Tahun:</span><span class="modal-meta-val">2024</span></div>
        </div>
      `
    },
    desa: {
      tag: '🎨 Visual Analytics & Data Storytelling',
      title: 'Infografis Visualisasi Program Desa Cantik (Desa Cinta Statistik)',
      bodyHtml: `
        <div class="modal-media-box">
          <img src="assets/images/desa-cantik.jpg" alt="Infografis Desa Cantik" class="modal-plot-img">
          <div class="modal-img-caption">Dokumentasi Infografis Resmi Pembinaan Statistik Program Desa Cantik BPS Kabupaten Lampung Timur</div>
        </div>
        <p><strong>Latar Belakang:</strong> Program pembinaan Desa Cantik oleh BPS bertujuan meningkatkan literasi statistik di tingkat desa agar perangkat desa dapat menggunakan data administrasi desa dalam merumuskan dana desa dan pembangunan wilayah.</p>
        <p><strong>Pekerjaan Desain &amp; Analisis:</strong> Mentransformasikan angka-angka tabel demografi, tingkat kesejahteraan, potensi pertanian, dan sarana kesehatan desa menjadi 3 seri infografis visual yang komunikatif, menarik, dan mudah dipahami oleh masyarakat umum.</p>
        <div class="modal-meta-box">
          <div class="modal-meta-row"><span class="modal-meta-label">Penyelenggara:</span><span class="modal-meta-val">BPS Kabupaten Lampung Timur</span></div>
          <div class="modal-meta-row"><span class="modal-meta-label">Keahlian:</span><span class="modal-meta-val">Data Storytelling, Visual Communication, Graphic Design</span></div>
          <div class="modal-meta-row"><span class="modal-meta-label">Hasil Karya:</span><span class="modal-meta-val">3 Lembar Infografis Resmi Pembinaan Desa</span></div>
          <div class="modal-meta-row"><span class="modal-meta-label">Tahun:</span><span class="modal-meta-val">2024</span></div>
        </div>
      `
    }
  };

  const modalOverlay = $('#detail-modal');
  const modalTag = $('#modal-tag');
  const modalTitle = $('#modal-title');
  const modalBody = $('#modal-body');
  const modalCloseBtn = $('#modal-close');
  const modalDismissBtn = $('#modal-dismiss-btn');

  const openModal = (key) => {
    const data = modalData[key];
    if (!data || !modalOverlay) return;

    modalTag.textContent = data.tag;
    modalTitle.textContent = data.title;
    modalBody.innerHTML = data.bodyHtml;

    // Slideshow foto di dalam modal (jika galeri untuk karya ini tersedia)
    const items = galleries[key];
    if (items && items.length) {
      const oldBox = $('.modal-media-box', modalBody);
      const duplicate = oldBox && $$('img', oldBox).some(img => items.some(it => it.src === img.getAttribute('src')));
      modalBody.prepend(createSlider(items, {
        variant: 'slider-media slider-modal',
        onReady: () => { if (duplicate) oldBox.style.display = 'none'; }
      }));
    }

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  $$('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(btn.dataset.openModal);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalDismissBtn) modalDismissBtn.addEventListener('click', closeModal);

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeDrawer();
    }
  });


  /* ==========================================================================
     9B. GALERI FOTO & SLIDESHOW OTOMATIS (Karya, Sertifikat, Penghargaan)
     ========================================================================== */

  // >>> EDIT DI SINI: daftar foto untuk tiap karya / sertifikat. <<<
  // Kunci (hivmate, cert-bpmp, dst.) sama dengan atribut data-gallery di index.html.
  // Foto yang file-nya belum ada otomatis dilewati, jadi aman diisi bertahap.
  const galleries = {
    // ---- Karya ----
    hivmate: [
      { src: 'assets/images/karya/hivmate-1.png', caption: 'Tampilan aplikasi HiVMate' },
      { src: 'assets/images/karya/hivmate-2.png', caption: 'Logo HiVMate' }
    ],
    egarch: [
      { src: 'assets/images/egarch-plot.png', caption: 'Return harian saham BBRI (2018–2024): volatility clustering dan shock asimetris' }
    ],
    bps: [
      { src: 'assets/images/karya/Kabupaten Lampung Timur Dalam Angka.png', caption: 'Sampul Kabupaten Lampung Timur dalam Angka 2024' }
    ],
    fraud: [
      // belum ada foto — tambahkan di sini bila sudah ada
    ],
    desa: [
      { src: 'assets/images/desa-cantik.jpg', caption: 'Dokumentasi Program Desa Cantik' },
      { src: 'assets/images/karya/Infografis desa cantik.png', caption: 'Infografis Program Desa Cantik' }
    ],

    // ---- Sertifikat ----
    'cert-bpmp': [
      { src: 'assets/images/sertifikat/Bimtek literasi numerasi.jpeg', caption: 'Bimtek Literasi & Numerasi' },
      { src: 'assets/images/sertifikat/Bimtek Digitalisasi.jpeg', caption: 'Bimtek Digitalisasi Pembelajaran' },
      { src: 'assets/images/sertifikat/Desiminasi Internal sekolaj.jpeg', caption: 'Desiminasi internal di sekolah' }
    ],
    'cert-soal': [
      { src: 'assets/images/sertifikat/Pengembangan Pembuatan butir soal.jpeg', caption: 'Pelatihan Pengembangan & Pembuatan Butir Soal' }
    ],
    'cert-itera': [
      { src: 'assets/images/sertifikat/Asisten Praktikum.jpeg', caption: 'Asisten Praktikum — ITERA' },
      { src: 'assets/images/sertifikat/Asisten praktium.jpeg', caption: 'Asisten Praktikum — ITERA' }
    ],
    'cert-bps': [
      { src: 'assets/images/sertifikat/tim pengelolan data bps-1.jpeg', caption: 'Tim Pengolah Data BPS Kabupaten Lampung Timur' },
      { src: 'assets/images/sertifikat/tim pengelolan data bps-2.jpeg', caption: 'Tim Pengolah Data BPS Kabupaten Lampung Timur' }
    ]
  };

  const SLIDE_INTERVAL = 4500; // jeda antar foto (milidetik)
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Geser jari (swipe) di layar sentuh
  const addSwipe = (el, onNext, onPrev) => {
    let x0 = null, y0 = null;
    el.addEventListener('touchstart', (e) => {
      x0 = e.touches[0].clientX;
      y0 = e.touches[0].clientY;
    }, { passive: true });
    el.addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      const dy = e.changedTouches[0].clientY - y0;
      x0 = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) (dx < 0 ? onNext : onPrev)();
    }, { passive: true });
  };

  /* ---------- Lightbox: perbesar foto ---------- */
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Penampil foto');
  lightbox.innerHTML = `
    <button class="lightbox-close" type="button" aria-label="Tutup foto">×</button>
    <button class="lightbox-nav prev" type="button" aria-label="Foto sebelumnya">‹</button>
    <figure class="lightbox-figure">
      <img class="lightbox-img" alt="">
      <figcaption class="lightbox-caption"></figcaption>
    </figure>
    <button class="lightbox-nav next" type="button" aria-label="Foto berikutnya">›</button>
    <div class="lightbox-count"></div>`;
  document.body.appendChild(lightbox);

  const lbImg = $('.lightbox-img', lightbox);
  const lbCaption = $('.lightbox-caption', lightbox);
  const lbCount = $('.lightbox-count', lightbox);
  const lbCloseBtn = $('.lightbox-close', lightbox);
  let lbItems = [];
  let lbIndex = 0;

  const lbShow = (i) => {
    lbIndex = (i + lbItems.length) % lbItems.length;
    const item = lbItems[lbIndex];
    lbImg.src = item.src;
    lbImg.alt = item.caption || 'Foto';
    lbCaption.textContent = item.caption || '';
    lbCount.textContent = lbItems.length > 1 ? `${lbIndex + 1} / ${lbItems.length}` : '';
    lightbox.classList.toggle('single', lbItems.length < 2);
  };

  const openLightbox = (items, start) => {
    lbItems = items;
    lbShow(start);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lbCloseBtn.focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    // Jika modal detail masih terbuka, scroll halaman tetap dikunci
    if (!(modalOverlay && modalOverlay.classList.contains('open'))) {
      document.body.style.overflow = '';
    }
  };

  lbCloseBtn.addEventListener('click', closeLightbox);
  $('.lightbox-nav.prev', lightbox).addEventListener('click', () => lbShow(lbIndex - 1));
  $('.lightbox-nav.next', lightbox).addEventListener('click', () => lbShow(lbIndex + 1));
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-figure')) closeLightbox();
  });
  addSwipe(lightbox, () => lbShow(lbIndex + 1), () => lbShow(lbIndex - 1));

  // Fase capture: Esc menutup lightbox saja, tidak ikut menutup modal di bawahnya
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') { e.stopPropagation(); closeLightbox(); }
    else if (e.key === 'ArrowLeft') lbShow(lbIndex - 1);
    else if (e.key === 'ArrowRight') lbShow(lbIndex + 1);
  }, true);

  /* ---------- Slider otomatis ---------- */
  const createSlider = (items, { variant = 'slider-media', onReady } = {}) => {
    const root = document.createElement('div');
    root.className = `slider ${variant}`;
    root.setAttribute('role', 'group');
    root.setAttribute('aria-roledescription', 'carousel');
    root.setAttribute('aria-label', 'Galeri foto');
    root.innerHTML = `
      <div class="slider-track"></div>
      <button class="slider-btn prev" type="button" aria-label="Foto sebelumnya">‹</button>
      <button class="slider-btn next" type="button" aria-label="Foto berikutnya">›</button>
      <div class="slider-dots"></div>`;

    const track = $('.slider-track', root);
    const dotsBox = $('.slider-dots', root);
    let index = 0;
    let timer = null;
    let ready = false;
    let hovering = false;
    let inView = true;

    const slides = () => $$('.slide', track);

    const show = (i) => {
      const list = slides();
      if (!list.length) return;
      index = (i + list.length) % list.length;
      list.forEach((s, n) => {
        s.classList.toggle('active', n === index);
        s.setAttribute('aria-hidden', String(n !== index));
      });
      $$('.slider-dot', dotsBox).forEach((d, n) => d.classList.toggle('active', n === index));
    };

    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(tick, SLIDE_INTERVAL);
    };

    // Jalan otomatis hanya jika: tidak di-hover, terlihat di layar, tab aktif,
    // lightbox tertutup, dan pengguna tidak meminta animasi dikurangi.
    const tick = () => {
      if (!document.body.contains(root)) return; // slider sudah dibuang (mis. modal dibuka ulang)
      const canPlay = !reduceMotion && !hovering && inView && !document.hidden &&
        !lightbox.classList.contains('open') && slides().length > 1;
      if (canPlay) show(index + 1);
      schedule();
    };

    const go = (i) => { show(i); schedule(); };

    const refresh = () => {
      const list = slides();
      if (!list.length) { clearTimeout(timer); root.remove(); return; }
      dotsBox.innerHTML = '';
      root.classList.toggle('single', list.length < 2);
      list.forEach((_, k) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'slider-dot';
        b.setAttribute('aria-label', `Foto ${k + 1}`);
        b.addEventListener('click', (e) => { e.stopPropagation(); go(k); });
        dotsBox.appendChild(b);
      });
      show(Math.min(index, list.length - 1));
    };

    items.forEach((item) => {
      const fig = document.createElement('figure');
      fig.className = 'slide';
      const img = new Image();
      img.loading = 'lazy';
      img.decoding = 'async';
      img.alt = item.caption || 'Foto';
      img.addEventListener('load', () => {
        if (ready) return;
        ready = true;
        root.classList.add('is-ready');
        if (onReady) onReady();
      });
      img.addEventListener('error', () => { fig.remove(); refresh(); }); // file belum ada → dilewati
      img.src = item.src;
      fig.appendChild(img);
      if (item.caption) {
        const cap = document.createElement('figcaption');
        cap.textContent = item.caption;
        fig.appendChild(cap);
      }
      track.appendChild(fig);
    });
    refresh();

    $('.slider-btn.prev', root).addEventListener('click', (e) => { e.stopPropagation(); go(index - 1); });
    $('.slider-btn.next', root).addEventListener('click', (e) => { e.stopPropagation(); go(index + 1); });

    // Klik foto → perbesar
    root.addEventListener('click', (e) => {
      if (e.target.closest('.slider-btn, .slider-dot')) return;
      const list = slides().map(s => ({
        src: $('img', s).currentSrc || $('img', s).src,
        caption: ($('figcaption', s) || {}).textContent || ''
      }));
      if (list.length) openLightbox(list, index);
    });

    // Jeda saat kursor di atas slider (hanya mouse; di layar sentuh tidak menahan)
    root.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') hovering = true; });
    root.addEventListener('pointerleave', () => { hovering = false; });
    root.addEventListener('focusin', () => { hovering = true; });
    root.addEventListener('focusout', () => { hovering = false; });
    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') go(index - 1);
      if (e.key === 'ArrowRight') go(index + 1);
    });
    addSwipe(root, () => go(index + 1), () => go(index - 1));

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; }, { threshold: 0.2 }).observe(root);
    }

    schedule();
    return root;
  };

  // Pasang slider ke setiap elemen yang punya atribut data-gallery="kunci"
  $$('[data-gallery]').forEach((host) => {
    const items = galleries[host.dataset.gallery];
    if (!items || !items.length) return;
    const variant = host.matches('.project-banner') ? 'slider-banner' : 'slider-media';
    host.prepend(createSlider(items, { variant }));
  });

  /* ==========================================================================
     10. COPY EMAIL BUTTON
     ========================================================================== */
  const copyEmailBtn = $('#copy-email-btn');
  const emailTextEl = $('#email-text');

  if (copyEmailBtn && emailTextEl) {
    copyEmailBtn.addEventListener('click', () => {
      const email = emailTextEl.textContent.trim();
      navigator.clipboard.writeText(email).then(() => {
        showToast('Alamat email berhasil disalin ke clipboard!');
      }).catch(() => {
        // Fallback
        const temp = document.createElement('textarea');
        temp.value = email;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        showToast('Alamat email berhasil disalin!');
      });
    });
  }

  /* ==========================================================================
     11. CONTACT FORM HANDLER
     ========================================================================== */
  const contactForm = $('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const name = formData.get('name');
      const email = formData.get('email');
      const subject = formData.get('subject');
      const message = formData.get('message');

      const mailBody = `Nama: ${name}\nEmail Pengirim: ${email}\n\nPesan:\n${message}`;
      const mailtoUrl = `mailto:a.rafiparinggomiwari@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`;

      showToast('Membuka aplikasi email Anda…');
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 500);
    });
  }

  /* ==========================================================================
     12. DYNAMIC CONSTELLATION / PARTICLES CANVAS
     ========================================================================== */
  const canvas = $('#bg-canvas');
  if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 140 };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createParticles();
    };

    const createParticles = () => {
      particles = [];
      const density = Math.floor((canvas.width * canvas.height) / 18000);
      const particleCount = Math.min(Math.max(density, 35), 85);

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          size: Math.random() * 1.8 + 0.8,
          color: Math.random() > 0.4 ? 'rgba(56, 189, 248, ' : 'rgba(99, 102, 241, '
        });
      }
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    resizeCanvas();

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around screen
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw particle
        ctx.fillStyle = `${p.color}0.75)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect particles with lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 125) {
            const alpha = (1 - dist / 125) * 0.16;
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Connect with mouse position
        if (mouse.x !== null && mouse.y !== null) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const mdist = Math.hypot(mdx, mdy);

          if (mdist < mouse.radius) {
            const mAlpha = (1 - mdist / mouse.radius) * 0.28;
            ctx.strokeStyle = `rgba(99, 102, 241, ${mAlpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(drawParticles);
    };

    drawParticles();
  }
})();
