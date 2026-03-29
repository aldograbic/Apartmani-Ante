<script>
  const values = [
    {
      num: "01",
      title: "Gostoprimstvo",
      desc: "Svaki gost je dio naše obitelji. Dočekujemo vas s toplinom i iskrenošću koja se osjeća od prvog koraka.",
      tag: "Od srca",
    },
    {
      num: "02",
      title: "Pažnja na detalje",
      desc: "Od svježe posteljine do kuhinjskih detalja — brinemo o svakom aspektu vašeg boravka.",
      tag: "Svaki put",
    },
    {
      num: "03",
      title: "Lokalno znanje",
      desc: "Kao mještani, uvijek ćemo vam otkriti najljepše skrivene dragulje Makarske koje turisti ne poznaju.",
      tag: "Insider info",
    },
  ];

  const stats = [
    { num: "15+", label: "godina iskustva" },
    { num: "500+", label: "zadovoljnih gostiju" },
    { num: "3", label: "apartmana" },
    { num: "5 / 5", label: "ocjena gostiju" },
  ];
</script>

<!-- ══════════════════════════════════════ HERO ══ -->
<section class="hero-shell relative" style="height: clamp(420px, 55vw, 620px)">
  <div class="hero-bg absolute inset-0">
    <img
      src="img/apartmani-makarska-more.webp"
      alt="Pogled na Biokovo i Makarsku"
      class="h-full w-full object-cover object-[center_30%] hero-img"
      loading="eager"
    />
    <div
      class="absolute inset-0 bg-gradient-to-r from-[#050e1f]/95 from-30% via-[#050e1f]/55 via-65% to-transparent"
    ></div>
    <div
      class="absolute inset-0 bg-gradient-to-t from-[#050e1f]/80 via-transparent to-transparent"
    ></div>
  </div>

  <div
    class="relative z-10 mx-auto flex h-full max-w-[1320px] w-full flex-col justify-end px-8 pb-16 md:px-16"
  >
    <p
      class="hero-eyebrow flex items-center gap-3 text-white/45 text-[0.6rem] tracking-[0.3em] uppercase mb-7"
    >
      <span class="h-px w-8 shrink-0 bg-white/35"></span>
      Naša priča
    </p>
    <h1 class="hero-title text-white leading-[1.0] tracking-[-0.01em] mb-5">
      Obitelj koja<br />
      <em class="text-[#c8a97e]">živi za goste</em>
    </h1>
    <p
      class="hero-sub max-w-[42ch] text-white/55 leading-relaxed text-[0.92rem]"
    >
      Više od 15 godina toplog gostoprimstva u srcu Makarske.
    </p>
  </div>
</section>

<!-- ══════════════════════════ PRIČA ══ -->
<section id="prica" class="bg-[#faf8f5] py-28 md:py-40">
  <div class="mx-auto max-w-[1200px] px-8 md:px-16">
    <p
      class="flex items-center gap-3 text-[0.58rem] tracking-[0.28em] uppercase text-[#3d7a7c] mb-14"
    >
      <span class="h-px w-6 bg-[#3d7a7c]"></span>
      Tko smo mi
    </p>

    <div class="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
      <div>
        <h2
          class="text-[#1a2e2c] mb-6 leading-[1.06] tracking-[-0.025em] about-heading"
        >
          Obiteljska<br /><em class="italic text-[#2c5f60]"
            >tradicija i ljubav</em
          >
        </h2>
        <p class="text-[#5a5a52] leading-[1.9] text-[0.9rem] mb-4">
          Dobrodošli u Apartmane Ante — smještaj s dušom smješten u srcu
          Makarske, jednog od najljepših gradova na Dalmatinskoj obali. S
          ponosom i ljubavlju pružamo gostoprimstvo već više od 15 godina.
        </p>
        <p class="text-[#5a5a52] leading-[1.9] text-[0.9rem] mb-10">
          Kroz to vrijeme ugostili smo goste iz cijelog svijeta, svakome
          pružajući toplu, intimnu atmosferu koja naše apartmane čini posebnim.
          Naša kuća je naš dom, a apartmane u njoj tretiramo s jednakom pažnjom
          i brigom.
        </p>

        <div class="grid grid-cols-2 gap-x-8 gap-y-6 border-t border-[#e6dcc8] pt-8 mb-10 md:flex md:gap-10">
          {#each stats as s}
            <div>
              <span
                class="stat-num block text-[2.4rem] leading-none text-[#1e5c5a]"
                >{s.num}</span
              >
              <span
                class="block text-[0.6rem] tracking-[0.2em] uppercase text-[#8a8a80] mt-1.5"
                >{s.label}</span
              >
            </div>
          {/each}
        </div>

        <a
          href="/kontakt"
          class="inline-flex items-center gap-2 text-[0.68rem] tracking-[0.14em] uppercase text-[#2c5f60] border-b border-[#2c5f60]/30 pb-0.5 transition-all duration-200 hover:gap-3 hover:border-[#2c5f60]"
        >
          Rezervirajte odmor
          <svg class="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none">
            <path
              d="M1 7h12M8 2l5 5-5 5"
              stroke="currentColor"
              stroke-width="1.4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </a>
      </div>

      <div class="relative h-[460px] md:h-[520px]">
        <div class="absolute inset-y-0 left-0 right-[16%] overflow-hidden">
          <img
            src="img/apartmani-makarska-ljudi.webp"
            alt="Apartmani Makarska ljudi"
            style="overflow-clip-margin: unset;"
            class="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
            loading="lazy"
          />
        </div>
        <div
          class="absolute bottom-0 right-0 h-[44%] w-[50%] overflow-hidden border-4 border-[#faf8f5]"
        >
          <img
            src="https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=500&q=80"
            alt="Makarska obala"
            class="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
            loading="lazy"
          />
        </div>
        <!-- Pull quote badge -->
        <div
          class="absolute -bottom-6 left-0 right-[18%] bg-white px-6 py-5 shadow-sm border-l-2 border-[#1e5c5a]"
        >
          <p
            class="quote-text text-[#1e5c5a] italic leading-snug text-[0.88rem]"
          >
            "Naša misija je jednostavna — da svaki gost ode s osmijehom i željom
            za povratkom."
          </p>
          <span
            class="block mt-2 text-[0.58rem] tracking-[0.16em] uppercase text-[#8a8a80]"
            >— Apartmani Ante</span
          >
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ══════════════════════════ VRIJEDNOSTI ══ -->
<section class="relative overflow-hidden bg-[#091e1c] py-28 md:py-40">
  <div class="pointer-events-none absolute inset-0">
    <div
      class="absolute bottom-0 left-0 h-[60%] w-[40%] rounded-full bg-[#8fd5cc]/[0.05] blur-3xl"
    ></div>
    <div
      class="absolute right-0 top-0 h-[50%] w-[30%] rounded-full bg-[#8fd5cc]/[0.04] blur-3xl"
    ></div>
  </div>

  <div class="relative z-10 mx-auto max-w-[1200px] px-8 md:px-16">
    <div class="grid gap-16 md:grid-cols-[280px_1fr] md:gap-20">
      <div class="md:sticky md:top-28 md:self-start">
        <p
          class="flex items-center gap-3 text-[0.58rem] tracking-[0.28em] uppercase text-[#8fd5cc] mb-6"
        >
          <span class="h-px w-6 bg-[#8fd5cc]"></span>
          Naše vrijednosti
        </p>
        <h2
          class="text-white mb-10 leading-[1.05] tracking-[-0.025em] whyus-heading"
        >
          Što nas čini<br /><em class="italic text-[#8fd5cc]">posebnima</em>
        </h2>
        <a
          href="/apartmani"
          class="inline-flex items-center gap-2 text-[0.68rem] tracking-[0.14em] uppercase text-[#8fd5cc] border-b border-[#8fd5cc]/30 pb-0.5 transition-all duration-200 hover:gap-3 hover:border-[#8fd5cc]"
        >
          Pogledaj apartmane
          <svg class="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none">
            <path
              d="M1 7h12M8 2l5 5-5 5"
              stroke="currentColor"
              stroke-width="1.4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </a>
      </div>

      <div class="border-t border-white/[0.08]">
        {#each values as v, i}
          <div
            class="why-row group grid grid-cols-[2.5rem_1fr] items-center gap-x-5 border-b border-white/[0.08] py-6 md:grid-cols-[2.5rem_1fr_auto] md:gap-x-8"
            style="--i:{i}"
          >
            <span
              class="self-start pt-0.5 text-[0.58rem] tracking-[0.14em] text-white/25 transition-colors duration-200 group-hover:text-[#8fd5cc]"
              >{v.num}</span
            >
            <div>
              <h3
                class="mb-1.5 text-white/70 transition-colors duration-200 group-hover:text-white why-title"
              >
                {v.title}
              </h3>
              <p
                class="text-white/35 text-[0.85rem] leading-relaxed transition-colors duration-200 group-hover:text-white/55"
              >
                {v.desc}
              </p>
            </div>
            <span
              class="hidden text-[0.58rem] tracking-[0.14em] uppercase text-white/20 transition-colors duration-200 group-hover:text-white/40 md:block text-right whitespace-nowrap"
              >{v.tag}</span
            >
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>

<!-- ══════════════════════════ LOKACIJA ══ -->
<section class="bg-white py-28 md:py-40">
  <div class="mx-auto max-w-[1200px] px-8 md:px-16">
    <div
      class="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
    >
      <div>
        <p
          class="flex items-center gap-3 text-[0.58rem] tracking-[0.28em] uppercase text-[#3d7a7c] mb-4"
        >
          <span class="h-px w-6 bg-[#3d7a7c]"></span>
          Gdje smo
        </p>
        <h2
          class="text-[#1a2e2c] leading-tight tracking-[-0.02em] section-heading"
        >
          Savršena lokacija
        </h2>
      </div>
      <p
        class="text-[0.88rem] max-w-[32ch] text-[#8a8a80] md:text-right leading-relaxed"
      >
        Par minuta pješice od plaže, šetnice i centra Makarske.
      </p>
    </div>

    <div class="grid md:grid-cols-2 gap-10 items-start">
      <div>
        <p class="text-[#5a5a52] leading-[1.9] text-[0.9rem] mb-8">
          Smješteni u mirnoj ulici Kotromanića, svega par minuta pješice od
          makarske šljunčane plaže i šetnice. Blizina centra znači da je sve
          nadohvat ruke — restorani, kafići, tržnica i sav sadržaj što ovaj
          mediteranski grad nudi.
        </p>

        <div class="space-y-4 mb-10">
          <div class="flex items-center gap-4">
            <span
              class="shrink-0 w-8 h-8 rounded-full bg-[#1e5c5a]/10 flex items-center justify-center"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                class="text-[#1e5c5a]"
              >
                <path
                  d="M8 1C5.239 1 3 3.239 3 6c0 3.75 5 9 5 9s5-5.25 5-9c0-2.761-2.239-5-5-5zm0 6.75A1.75 1.75 0 118 4.25a1.75 1.75 0 010 3.5z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <address class="not-italic text-[0.88rem] text-[#5a5a52]">
              Kotromanića 9, 21300 Makarska
            </address>
          </div>
          <div class="flex items-center gap-4">
            <span
              class="shrink-0 w-8 h-8 rounded-full bg-[#1e5c5a]/10 flex items-center justify-center"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                class="text-[#1e5c5a]"
              >
                <path
                  d="M2 4h12l-6 5-6-5zM2 4v8h12V4"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <a
              href="mailto:apartmani.ante01@gmail.com"
              class="text-[0.88rem] text-[#2c5f60] transition-colors hover:text-[#1a3f40]"
            >
              apartmani.ante01@gmail.com
            </a>
          </div>
        </div>

        <!-- Distance chips -->
        <div class="flex flex-wrap gap-2">
          {#each ["150 m → Kafići", "290 m → Dućani", "400 m → Restorani", "600 m → Plaža", "1 km → Autobusni kolodvor", "1,4 km → Centar grada"] as chip}
            <span
              class="text-[0.62rem] tracking-[0.1em] uppercase text-[#2c5f60] border border-[#2c5f60]/25 bg-[#2c5f60]/5 px-3 py-1.5 rounded-full"
              >{chip}</span
            >
          {/each}
        </div>
      </div>

      <div class="aspect-[4/3] overflow-hidden border border-[#e6dcc8]">
        <iframe
          title="Lokacija Apartmani Ante"
          src="https://maps.google.com/maps?q=Kotromanića+9,+Makarska&output=embed&z=15"
          loading="lazy"
          allowfullscreen
          class="w-full h-full border-0"
        ></iframe>
      </div>
    </div>
  </div>
</section>

<!-- ══════════════════════════ CTA ══ -->
<section class="relative overflow-hidden bg-[#1e5c5a] py-24 md:py-32">
  <div class="pointer-events-none absolute inset-0 opacity-[0.05]">
    <svg class="h-full w-full" xmlns="http://www.w3.org/2000/svg">
      <filter id="noise2"
        ><feTurbulence
          type="fractalNoise"
          baseFrequency="0.85"
          numOctaves="4"
          stitchTiles="stitch"
        /></filter
      >
      <rect width="100%" height="100%" filter="url(#noise2)" />
    </svg>
  </div>
  <div
    class="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/[0.07] blur-3xl"
  ></div>
  <div
    class="pointer-events-none absolute -bottom-20 left-0 h-72 w-72 rounded-full bg-[#0d2623]/50 blur-3xl"
  ></div>

  <div class="relative z-10 mx-auto max-w-[1200px] px-8 md:px-16">
    <div
      class="flex flex-col md:flex-row items-start md:items-center justify-between gap-12"
    >
      <div>
        <p
          class="flex items-center gap-3 text-[0.58rem] tracking-[0.28em] uppercase text-white/45 mb-5"
        >
          <span class="h-px w-6 bg-white/35"></span>
          Rezervacija
        </p>
        <h2
          class="text-white leading-[1.04] tracking-[-0.025em] mb-4 cta-heading"
        >
          Spremi za Makarsku?
        </h2>
        <p class="text-white/55 text-[0.9rem] max-w-[38ch] leading-relaxed">
          Slobodno nas kontaktirajte — rado ćemo pronaći idealan termin za vas i
          vašu obitelj.
        </p>
      </div>

      <div class="flex flex-col items-start md:items-end gap-4 shrink-0">
        <a href="/kontakt" class="btn-cta-white">
          Kontaktirajte nas
          <svg class="h-4 w-4" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </a>
        <a
          href="mailto:apartmani.ante01@gmail.com"
          class="text-white/40 text-[0.78rem] transition-colors hover:text-white/70"
        >
          apartmani.ante01@gmail.com
        </a>
      </div>
    </div>
  </div>
</section>

<style lang="less">
  @ease: cubic-bezier(0.16, 1, 0.3, 1);

  // ─── Font helpers ──────────────────────────────────────────────────────
  .about-heading,
  .section-heading,
  .whyus-heading,
  .cta-heading,
  .stat-num,
  .why-title,
  .quote-text {
    font-family: var(--font-display);
    font-weight: 300;
  }
  .about-heading {
    font-size: clamp(2.6rem, 4.5vw, 3.8rem);
  }
  .section-heading {
    font-size: clamp(2.2rem, 4vw, 3rem);
  }
  .whyus-heading {
    font-size: clamp(1.9rem, 3vw, 2.6rem);
  }
  .cta-heading {
    font-size: clamp(2.4rem, 5vw, 3.8rem);
  }
  .why-title {
    font-size: clamp(1.1rem, 1.7vw, 1.3rem);
  }
  .quote-text {
    font-size: clamp(0.82rem, 1.1vw, 0.92rem);
  }

  // ─── Hero ─────────────────────────────────────────────────────────────
  .hero-shell {
    background: #0d2623;
  }

  .hero-bg {
    position: absolute;
    inset: 0;
    overflow: hidden;
    background: #0d2623;
  }

  .hero-img {
    image-rendering: auto;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    will-change: transform;
    transform: scale(1.02) translateZ(0);
    animation: heroZoom 12s ease-out forwards;
  }
  @keyframes heroZoom {
    to {
      transform: scale(1) translateZ(0);
    }
  }

  .hero-title {
    font-family: var(--font-hero);
    font-weight: 500;
    font-size: clamp(3.2rem, 7vw, 6.5rem);
    opacity: 0;
    animation: slideUp 0.8s 0.35s @ease forwards;
  }
  .hero-eyebrow {
    font-family: var(--font-body);
    opacity: 0;
    animation: slideUp 0.7s 0.2s @ease forwards;
  }
  .hero-sub {
    font-family: var(--font-body);
    opacity: 0;
    animation: slideUp 0.7s 0.5s @ease forwards;
  }

  // ─── Why rows ─────────────────────────────────────────────────────────
  .why-row {
    opacity: 0;
    transform: translateY(10px);
    animation: rowin 0.5s @ease calc(var(--i) * 65ms) forwards;
  }
  @keyframes rowin {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  // ─── Buttons ──────────────────────────────────────────────────────────
  .btn-cta-white {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    padding: 1rem 2.2rem;
    background: white;
    color: #1e5c5a;
    font-family: var(--font-body);
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    transition: all 0.3s @ease;
    &:hover {
      background: #faf8f5;
      transform: translateY(-2px);
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3);
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(22px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
