<script>
  import ApartmentCard from "$lib/components/ApartmentCard.svelte";
  import { apartments } from "$lib/data/apartments.js";
  import { goto } from "$app/navigation";
  import Select from "$lib/components/Select.svelte";

  const whyUs = [
    {
      num: "01",
      title: "Lokacija",
      desc: "Par minuta pješice do plaže i promenade.",
      tag: "Centar Makarske",
    },
    {
      num: "02",
      title: "Čistoća",
      desc: "Temeljito čišćenje između svakog gosta.",
      tag: "Pro čišćenje",
    },
    {
      num: "03",
      title: "Podrška",
      desc: "Brzo odgovaramo na upite i pomažemo oko svega što vam treba.",
      tag: "Uvijek dostupni",
    },
    {
      num: "04",
      title: "Parking",
      desc: "Besplatno privatno parkiranje za goste.",
      tag: "Gratis",
    },
    {
      num: "05",
      title: "Klima",
      desc: "A/C u svim sobama — i u srpanjskoj žezi.",
      tag: "Sve sobe",
    },
    {
      num: "06",
      title: "WiFi",
      desc: "100 Mbps fiber — streaming, rad, sve.",
      tag: "100 Mbps",
    },
  ];

  let dolazak = "";
  let odlazak = "";

  const gostiItems = [
    { value: "", label: "Svi kapaciteti" },
    { value: "1", label: "1 osoba" },
    { value: "2", label: "2 osobe" },
    { value: "3", label: "3 osobe" },
    { value: "4", label: "4 osobe" },
    { value: "5", label: "5 osoba" },
  ];

  let gosti = gostiItems.find((item) => item.value === "2");

  function rezerviraj() {
    const params = new URLSearchParams();
    if (dolazak) params.set("dolazak", dolazak);
    if (odlazak) params.set("odlazak", odlazak);
    if (gosti?.value) params.set("gosti", gosti.value);
    goto(`/apartmani?${params.toString()}`);
  }
</script>

<!-- ══════════════════════════════════════ HERO ══ -->
<section class="hero-shell relative min-h-screen">
  <!-- hero background -->
  <div class="hero-bg absolute inset-0">
    <img
      src="/img/hero-apartmani-ante.webp"
      alt="Makarska rivijera"
      class="h-full w-full object-cover object-center hero-img"
      loading="eager"
    />
    <div
      class="absolute inset-0 bg-gradient-to-r from-[#050e1f]/90 from-35% via-[#050e1f]/35 via-85% to-transparent"
    ></div>
    <div
      class="absolute inset-0 bg-gradient-to-t from-[#050e1f]/70 via-transparent to-transparent"
    ></div>
  </div>

  <div
    class="relative z-10 mx-auto flex min-h-screen max-w-[1320px] w-full flex-col justify-between px-8 pb-14 pt-10 md:px-16"
  >
    <!-- Main hero content -->
    <div class="flex-1 flex flex-col justify-center max-w-[800px] pt-16">
      <p
        class="hero-eyebrow flex items-center gap-3 text-white/45 text-[0.6rem] tracking-[0.3em] uppercase mb-8"
      >
        <span class="h-px w-8 shrink-0 bg-white/35"></span>
        Dobrodošli u Makarsku
      </p>

      <h1 class="hero-title mb-7 text-white leading-[1.0] tracking-[-0.01em]">
        Doživite ljeto<br />
        <em class="text-[#c8a97e]">onako kako treba</em>
      </h1>

      <p
        class="hero-sub mb-10 max-w-[40ch] text-white/55 leading-relaxed text-[0.92rem]"
      >
        Udobni obiteljski apartmani u srcu Makarske — samo par minuta pješice od
        kristalno čistog mora.
      </p>

      <div class="mb-10 flex flex-wrap gap-4">
        <a href="/apartmani" class="btn-primary">Pogledaj apartmane</a>
        <a href="/kontakt" class="btn-ghost">Rezerviraj odmor</a>
      </div>

      <div class="flex flex-wrap gap-2">
        {#each ["5 min od plaže", "Obiteljski smještaj", "Fleksibilan check-in", "Ocjena 5 / 5"] as f, i}
          <span
            class="pill text-white/75 border border-white/20 bg-white/[0.09] backdrop-blur-sm px-4 py-2 text-[0.65rem] tracking-[0.12em] uppercase"
            style="--d:{i * 80}ms">{f}</span
          >
        {/each}
      </div>
    </div>

    <!-- Bottom row: scroll cue + booking bar -->
    <div class="flex flex-col gap-5">
      <a
        href="#intro"
        class="scroll-cue self-start flex mt-6 md:mt-0 items-center gap-3 text-white/30 transition-colors hover:text-white/60"
        aria-label="Skrolaj dolje"
      >
        <span class="text-[0.55rem] tracking-[0.28em] uppercase">Skrolaj</span>
        <span class="relative block w-10 h-px overflow-hidden bg-current">
          <span class="scroll-pip absolute inset-y-0 left-0 w-4 bg-current"
          ></span>
        </span>
      </a>

      <div
        class="booking-bar flex items-stretch gap-0 bg-white/[0.07] backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden"
      >
        <div class="booking-field flex-1 px-6 py-4 border-r border-white/10">
          <p class="booking-label">Dolazak</p>
          <input
            type="date"
            bind:value={dolazak}
            class="booking-input"
            style="color-scheme: dark;"
          />
        </div>

        <div class="booking-field flex-1 px-6 py-4 border-r border-white/10">
          <p class="booking-label">Odlazak</p>
          <input
            type="date"
            bind:value={odlazak}
            class="booking-input"
            style="color-scheme: dark;"
          />
        </div>
        <div class="booking-field flex-1 px-6 py-4 border-r border-white/10">
          <p class="booking-label">Gosti</p>
          <Select
            bind:value={gosti}
            items={gostiItems}
            placeholder="4 osobe"
            variant="dark"
            clearable={false}
            searchable={false}
          />
        </div>
        <div class="booking-cta-wrap px-4 py-3 shrink-0 self-center">
          <button on:click={rezerviraj} class="btn-booking-cta">
            Rezerviraj
            <svg class="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 7h12M8 2l5 5-5 5"
                stroke="currentColor"
                stroke-width="1.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ══════════════════════════ TICKER ══ -->
<div
  class="overflow-hidden bg-[#091e1c] py-3 border-y border-white/[0.06]"
  aria-hidden="true"
>
  <div
    class="ticker flex w-max items-center gap-8 text-[0.58rem] tracking-[0.22em] uppercase text-white/25"
  >
    {#each Array(4) as _}
      {#each ["5 min od plaže", "Obiteljski smještaj", "Ocjena 5 / 5", "Besplatni parking", "Fleksibilan check-in", "15 godina iskustva"] as item}
        <span class="shrink-0">{item}</span>
        <span class="h-1 w-1 shrink-0 rounded-full bg-[#8fd5cc]/40"></span>
      {/each}
    {/each}
  </div>
</div>

<!-- ══════════════════════════ O NAMA ══ -->
<section id="intro" class="bg-[#faf8f5] py-28 md:py-40">
  <div class="mx-auto max-w-[1200px] px-8 md:px-16">
    <p
      class="flex items-center gap-3 text-[0.58rem] tracking-[0.28em] uppercase text-[#3d7a7c] mb-14"
    >
      <span class="h-px w-6 bg-[#3d7a7c]"></span>
      O nama
    </p>

    <div class="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
      <div>
        <h2
          class="text-[#1a2e2c] mb-6 leading-[1.06] tracking-[-0.025em] about-heading"
        >
          Vaš dom<br /><em class="italic text-[#2c5f60]">dalje od doma</em>
        </h2>
        <p class="text-[#5a5a52] leading-[1.9] text-[0.9rem] mb-4">
          Naša obitelj s ponosom pruža toplo i srdačno gostoprimstvo već dugi
          niz godina. Svaki detalj osmišljen je s jednom mišlju — da se osjećate
          kao kod kuće.
        </p>
        <p class="text-[#5a5a52] leading-[1.9] text-[0.9rem] mb-10">
          Smješteni u mirnoj četvrti Makarske, svega nekoliko koraka od gradske
          plaže — savršena kombinacija privatnosti i blizine svemu što Makarska
          nudi.
        </p>

        <div class="flex gap-10 border-t border-[#e6dcc8] pt-8 mb-10">
          {#each [["15+", "godina iskustva"], ["3", "apartmana"], ["5 / 5", "ocjena gostiju"]] as [num, lbl]}
            <div>
              <span
                class="stat-num block text-[2.4rem] leading-none text-[#1e5c5a]"
                >{num}</span
              >
              <span
                class="block text-[0.6rem] tracking-[0.2em] uppercase text-[#8a8a80] mt-1.5"
                >{lbl}</span
              >
            </div>
          {/each}
        </div>

        <a
          href="/o-nama"
          class="inline-flex items-center gap-2 text-[0.68rem] tracking-[0.14em] uppercase text-[#2c5f60] border-b border-[#2c5f60]/30 pb-0.5 transition-all duration-200 hover:gap-3 hover:border-[#2c5f60]"
        >
          Saznajte više o nama
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
            src="img/kuca-apartmani-ante.webp"
            alt="Interijer apartmana"
            class="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
            loading="lazy"
          />
        </div>
        <div
          class="absolute bottom-0 right-0 h-[44%] w-[50%] overflow-hidden border-4 border-[#faf8f5]"
        >
          <img
            src="img/sv-petar-makarska.jpg"
            alt="Makarska obala"
            class="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
            style="overflow-clip-margin: unset;"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ══════════════════════════ APARTMANI ══ -->
<section id="apartmani" class="bg-white py-28 md:py-40">
  <div class="mx-auto max-w-[1200px] px-8 md:px-16">
    <div
      class="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
    >
      <div>
        <p
          class="flex items-center gap-3 text-[0.58rem] tracking-[0.28em] uppercase text-[#3d7a7c] mb-4"
        >
          <span class="h-px w-6 bg-[#3d7a7c]"></span>
          Smještaj
        </p>
        <h2
          class="text-[#1a2e2c] leading-tight tracking-[-0.02em] section-heading"
        >
          Naši apartmani
        </h2>
      </div>
      <p
        class="text-[0.88rem] max-w-[30ch] text-[#8a8a80] md:text-right leading-relaxed"
      >
        Tri pažljivo opremljene jedinice za nezaboravan odmor uz Jadransko more.
      </p>
    </div>

    <div class="grid grid-cols-1 gap-5 md:grid-cols-3 md:items-end">
      {#each apartments as apt, i}
        <ApartmentCard apartment={apt} index={i} />
      {/each}
    </div>
  </div>
</section>

<!-- ══════════════════════════ ZAŠTO MI ══ -->
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
          Zašto mi?
        </p>
        <h2
          class="text-white mb-10 leading-[1.05] tracking-[-0.025em] whyus-heading"
        >
          Sve što trebate<br /><em class="italic text-[#8fd5cc]"
            >na jednom<br />mjestu</em
          >
        </h2>
        <a
          href="/kontakt"
          class="inline-flex items-center gap-2 text-[0.68rem] tracking-[0.14em] uppercase text-[#8fd5cc] border-b border-[#8fd5cc]/30 pb-0.5 transition-all duration-200 hover:gap-3 hover:border-[#8fd5cc]"
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

      <div class="border-t border-white/[0.08]">
        {#each whyUs as w, i}
          <div
            class="why-row group grid grid-cols-[2.5rem_1fr] items-center gap-x-5 border-b border-white/[0.08] py-6 md:grid-cols-[2.5rem_1fr_auto] md:gap-x-8"
            style="--i:{i}"
          >
            <span
              class="self-start pt-0.5 text-[0.58rem] tracking-[0.14em] text-white/25 transition-colors duration-200 group-hover:text-[#8fd5cc]"
              >{w.num}</span
            >
            <div>
              <h3
                class="mb-1.5 text-white/70 transition-colors duration-200 group-hover:text-white why-title"
              >
                {w.title}
              </h3>
              <p
                class="text-white/35 text-[0.85rem] leading-relaxed transition-colors duration-200 group-hover:text-white/55"
              >
                {w.desc}
              </p>
            </div>
            <span
              class="hidden text-[0.58rem] tracking-[0.14em] uppercase text-white/20 transition-colors duration-200 group-hover:text-white/40 md:block text-right whitespace-nowrap"
              >{w.tag}</span
            >
          </div>
        {/each}
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
          Planirate odmor<br />u Makarskoj?
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

  // ─── Font helpers ─────────────────────────────────────────────────────
  .about-heading,
  .section-heading,
  .whyus-heading,
  .cta-heading,
  .stat-num,
  .why-title {
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
    object-position: 60% center; /* pulls camera toward the bay */
  }
  @keyframes heroZoom {
    to {
      transform: scale(1) translateZ(0);
    }
  }

  .hero-title {
    font-family: var(--font-hero);
    font-weight: 500;
    font-size: clamp(4rem, 9vw, 8.5rem);
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
  .pill {
    font-family: var(--font-body);
    border-radius: 999px;
    opacity: 0;
    animation: slideUp 0.6s calc(0.7s + var(--d)) @ease forwards;
  }

  // ─── Booking bar ──────────────────────────────────────────────────────
  .booking-bar {
    background: rgba(255, 255, 255, 0.07);
    backdrop-filter: blur(14px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
    overflow: visible;

    .booking-field {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 0.25rem;
      min-width: 0;
      transition: background 0.2s ease;
      cursor: pointer;

      &:hover {
        background: rgba(255, 255, 255, 0.06);
      }

      &:first-child {
        border-top-left-radius: 1rem;
        border-bottom-left-radius: 1rem;
      }

      :global(.select-wrap--dark) {
        width: 100%;
        --indicators-position: absolute;
        --indicators-right: 0;
        --indicators-top: 50%;
        --indicators-bottom: auto;
        --value-container-padding: 0 1.75rem 0 0;
        --chevron-width: 1.5rem;
        --chevron-height: 1.5rem;
      }

      :global(.select-wrap--dark .svelte-select) {
        width: 100% !important;
      }

      :global(.select-wrap--dark .svelte-select .control) {
        width: 100% !important;
        position: relative !important;
      }

      :global(.select-wrap--dark .svelte-select .value-container) {
        flex: 1 1 auto !important;
        min-width: 0 !important;
        padding-right: 1.75rem !important;
      }

      :global(.select-wrap--dark .svelte-select .indicators) {
        position: absolute !important;
        right: 0 !important;
        top: 50% !important;
        transform: translateY(-50%) !important;
        margin-left: 0 !important;
        padding-left: 0 !important;
      }

      :global(.select-wrap--dark .svelte-select .chevron) {
        display: flex !important;
        align-items: center !important;
        justify-content: flex-end !important;
      }
    }
  }

  .booking-label {
    font-family: var(--font-body);
    font-size: 0.48rem;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.35);
    margin: 0 0 0.35rem;
    pointer-events: none;
  }

  .booking-input {
    width: 100%;
    padding: 0;
    border: none;
    outline: none;
    background: transparent;
    color: white;
    font-family: var(--font-body);
    font-size: 0.85rem;
    font-weight: 500;
    -webkit-appearance: none;
    appearance: none;
  }
  .booking-input::-webkit-datetime-edit,
  .booking-input::-webkit-datetime-edit-fields-wrapper,
  .booking-input::-webkit-datetime-edit-text,
  .booking-input::-webkit-datetime-edit-month-field,
  .booking-input::-webkit-datetime-edit-day-field,
  .booking-input::-webkit-datetime-edit-year-field {
    color: white;
  }
  .booking-input::-webkit-calendar-picker-indicator {
    opacity: 0.9;
    filter: invert(1);
  }

  .btn-booking-cta {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: var(--sea-deep, #1e5c5a);
    color: white;
    font-family: var(--font-body);
    font-size: 0.65rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    border-radius: 0.75rem;
    white-space: nowrap;
    transition: all 0.3s @ease;
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }
  }

  @media (max-width: 640px) {
    .booking-bar {
      display: grid !important;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0;
      border-radius: 1.35rem;
      overflow: visible;

      .booking-field {
        position: relative;
        padding: 1rem 1rem 0.95rem !important;
        min-height: 5.5rem;
        border-right: 1px solid rgba(255, 255, 255, 0.08);
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        overflow: visible;

        &:nth-child(2n) {
          border-right: none;
        }

        &:nth-child(3),
        &:nth-child(4) {
          border-bottom: none;
        }

        &:first-child {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }

        &:nth-child(3) {
          z-index: 5;
        }
      }
    }

    .booking-label {
      font-size: 0.45rem;
      margin-bottom: 0.45rem;
      letter-spacing: 0.16em;
    }

    .booking-input {
      font-size: 0.82rem;
    }

    .booking-cta-wrap {
      display: flex;
      align-items: stretch;
      justify-content: center;
      width: 100%;
      padding: 0.75rem !important;
      align-self: stretch;
    }

    .btn-booking-cta {
      width: 100%;
      justify-content: center;
      min-height: 3rem;
      padding: 0.85rem 1rem;
      border-radius: 0.9rem;
      font-size: 0.62rem;
    }
  }

  // ─── Ticker ───────────────────────────────────────────────────────────
  .ticker {
    animation: ticker 34s linear infinite;
  }
  @keyframes ticker {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-25%);
    }
  }

  // ─── Scroll pip ───────────────────────────────────────────────────────
  .scroll-pip {
    animation: pip 2.2s ease-in-out infinite;
  }
  @keyframes pip {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(350%);
    }
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
  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.9rem 1.9rem;
    background: var(--sea-deep);
    color: white;
    font-family: var(--font-body);
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    transition: all 0.3s @ease;
    &:hover {
      background: var(--sea-dark);
      transform: translateY(-2px);
      box-shadow: 0 16px 40px rgba(30, 92, 90, 0.4);
    }
  }
  .btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.9rem 1.9rem;
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    font-family: var(--font-body);
    font-size: 0.68rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    transition: all 0.3s @ease;
    &:hover {
      border-color: white;
      background: rgba(255, 255, 255, 0.08);
    }
  }
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
