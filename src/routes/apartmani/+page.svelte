<script>
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { apartments } from "$lib/data/apartments.js";
  import Select from "$lib/components/Select.svelte";

  export let data;

  const gostiItems = [
    { value: "", label: "Svi kapaciteti" },
    { value: "1", label: "1 osoba" },
    { value: "2", label: "2 osobe" },
    { value: "3", label: "3 osobe" },
    { value: "4", label: "4 osobe" },
    { value: "5", label: "5 osoba" },
  ];

  const sizeItems = [
    { value: "", label: "Sve veličine" },
    { value: "small", label: "Studio (do 25m2)" },
    { value: "medium", label: "Srednji (25-32m2)" },
    { value: "large", label: "Veći (32m2+)" },
  ];

  let filterGostiOption = gostiItems[0];
  let filterSizeOption = sizeItems[0];

  $: filterGosti = filterGostiOption?.value || "";
  $: filterSize = filterSizeOption?.value || "";

  let filterDolazak = "";
  let filterOdlazak = "";
  let filterGosti = "";
  let filterSize = "";
  let mobileFiltersOpen = false;

  let dateInputFocused = false;

  $: if (!dateInputFocused) {
    const p = $page.url.searchParams;
    filterDolazak = p.get("dolazak") || "";
    filterOdlazak = p.get("odlazak") || "";
    filterGosti = p.get("gosti") || "";
    filterSize = p.get("velicina") || "";
  }

  const maxGuests = { "apartman-1": 5, "apartman-2": 4, studio: 2 };

  function hasBookingOverlap(apartmentId, checkIn, checkOut) {
    const bookings = data.bookingsByApartment?.[apartmentId] || [];

    return bookings.some(
      (booking) => checkIn < booking.checkOut && checkOut > booking.checkIn,
    );
  }

  function getSeasonalPriceForDate(apt, value) {
    if (!value || !apt.seasonalPrices?.length) return null;

    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return null;

    const monthDay = Number(match[2]) * 100 + Number(match[3]);

    if (monthDay >= 1001 || monthDay < 601) return apt.seasonalPrices[0];
    if (monthDay >= 601 && monthDay < 715) return apt.seasonalPrices[1];
    if (monthDay >= 715 && monthDay < 820) return apt.seasonalPrices[2];
    return apt.seasonalPrices[3];
  }

  function isSeasonallyBookable(apt, checkIn, checkOut) {
    if (!checkIn || !checkOut || checkOut <= checkIn) return true;

    const start = new Date(`${checkIn}T00:00:00`);
    const end = new Date(`${checkOut}T00:00:00`);

    for (
      const cursor = new Date(start);
      cursor < end;
      cursor.setDate(cursor.getDate() + 1)
    ) {
      const year = cursor.getFullYear();
      const month = String(cursor.getMonth() + 1).padStart(2, "0");
      const day = String(cursor.getDate()).padStart(2, "0");
      const season = getSeasonalPriceForDate(apt, `${year}-${month}-${day}`);

      if (!season || season.price === "-") {
        return false;
      }
    }

    return true;
  }

  $: guestiNum = parseInt(filterGosti) || 0;
  $: filtered = apartments.filter((apt) => {
    if (guestiNum > 0 && maxGuests[apt.id] < guestiNum) return false;
    if (filterSize === "small" && parseInt(apt.size) > 25) return false;
    if (
      filterSize === "medium" &&
      (parseInt(apt.size) < 25 || parseInt(apt.size) > 32)
    )
      return false;
    if (filterSize === "large" && parseInt(apt.size) < 32) return false;
    if (filterDolazak && filterOdlazak) {
      if (filterOdlazak <= filterDolazak) return false;
      if (!isSeasonallyBookable(apt, filterDolazak, filterOdlazak))
        return false;
      if (hasBookingOverlap(apt.id, filterDolazak, filterOdlazak)) return false;
    }
    return true;
  });

  $: hasFilters = filterDolazak || filterOdlazak || filterGosti || filterSize;
  $: mobileFilterSummary = [
    filterDolazak && "Datumi odabrani",
    filterGostiOption?.value && filterGostiOption.label,
    filterSizeOption?.value && filterSizeOption.label,
  ]
    .filter(Boolean)
    .join(" · ");

  function applyFilters() {
    const params = new URLSearchParams();

    if (filterDolazak) params.set("dolazak", filterDolazak);
    if (filterOdlazak) params.set("odlazak", filterOdlazak);
    if (filterGosti) params.set("gosti", filterGosti);
    if (filterSize) params.set("velicina", filterSize);

    goto(`?${params.toString()}`, { replaceState: true, noScroll: true });
  }

  function clearFilters() {
    filterDolazak = "";
    filterOdlazak = "";
    filterGosti = "";
    filterSize = "";
    goto("/apartmani", { replaceState: true, noScroll: true });
  }

  function buildApartmentHref(href) {
    const params = [
      filterDolazak && `dolazak=${filterDolazak}`,
      filterOdlazak && `odlazak=${filterOdlazak}`,
      filterGosti && `gosti=${filterGosti}`,
    ]
      .filter(Boolean)
      .join("&");

    return `${href}${params ? `?${params}` : ""}`;
  }
</script>

<section class="hero-shell relative" style="height: clamp(380px, 48vw, 560px)">
  <div class="hero-bg absolute inset-0">
    <img
      src="/img/hero-apartmani-ante.webp"
      alt="Makarska obala"
      class="hero-img h-full w-full object-cover object-[center_40%]"
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
    class="relative z-10 mx-auto flex h-full w-full max-w-[1320px] flex-col justify-end px-8 pb-16 md:px-16"
  >
    <p
      class="hero-eyebrow mb-7 flex items-center gap-3 text-[0.6rem] uppercase tracking-[0.3em] text-white/45"
    >
      <span class="h-px w-8 shrink-0 bg-white/35"></span>
      Smještaj
    </p>
    <h1 class="hero-title mb-5 text-white leading-[1.0] tracking-[-0.01em]">
      Naši<br /><em class="text-[#c8a97e]">apartmani</em>
    </h1>
    <p
      class="hero-sub max-w-[42ch] text-[0.92rem] leading-relaxed text-white/55"
    >
      Tri pažljivo opremljene jedinice za svaki tip odmora - od romantičnog
      bijega do obiteljskog ljetovanja.
    </p>
  </div>
</section>

<div class="filter-shell z-30">
  <div class="mx-auto max-w-[1200px] px-8 py-4 md:px-16">
    <button
      type="button"
      class="filter-mobile-toggle"
      class:open={mobileFiltersOpen}
      aria-expanded={mobileFiltersOpen}
      aria-controls="apartments-filters"
      on:click={() => (mobileFiltersOpen = !mobileFiltersOpen)}
    >
      <span class="filter-mobile-toggle__copy">
        <strong>Filteri apartmana</strong>
        <small>{mobileFilterSummary || "Datumi, broj gostiju i veličina"}</small
        >
      </span>
      <svg class="h-4 w-4" viewBox="0 0 16 16" fill="none">
        <path
          d="M4 6l4 4 4-4"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    <div
      id="apartments-filters"
      class="filter-bar flex items-stretch gap-0"
      class:filter-bar--mobile-open={mobileFiltersOpen}
    >
      <div class="filter-field flex-1 border-r border-white/10">
        <label for="dolazak">Dolazak</label>
        <input
          id="dolazak"
          type="date"
          bind:value={filterDolazak}
          on:focus={() => (dateInputFocused = true)}
          on:change={() => {
            dateInputFocused = false;
            applyFilters();
          }}
          on:blur={() => (dateInputFocused = false)}
        />
      </div>

      <div class="filter-field flex-1 border-r border-white/10">
        <label for="odlazak">Odlazak</label>
        <input
          id="odlazak"
          type="date"
          bind:value={filterOdlazak}
          on:focus={() => (dateInputFocused = true)}
          on:blur={() => {
            dateInputFocused = false;
            applyFilters();
          }}
        />
      </div>

      <div class="filter-field flex-1 border-r border-white/10">
        <label for="gosti-select">Gosti</label>
        <Select
          bind:value={filterGostiOption}
          items={gostiItems}
          placeholder="Svi kapaciteti"
          variant="dark"
          clearable={false}
          searchable={false}
          on:change={applyFilters}
        />
      </div>

      <div class="filter-field flex-1 border-r border-white/10">
        <label for="velicina-select">Veličina</label>
        <Select
          bind:value={filterSizeOption}
          items={sizeItems}
          placeholder="Sve veličine"
          variant="dark"
          clearable={false}
          searchable={false}
          on:change={applyFilters}
        />
      </div>

      <div class="filter-cta flex shrink-0 items-center gap-3 px-4">
        <span class="result-label">
          {filtered.length}
          {filtered.length === 1 ? "apartman" : "apartmana"}
        </span>
        {#if hasFilters}
          <button
            on:click={clearFilters}
            class="clear-btn"
            aria-label="Resetiraj filtere"
          >
            <svg class="h-3 w-3" viewBox="0 0 12 12" fill="none">
              <path
                d="M1 1l10 10M11 1L1 11"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          </button>
        {:else}
          <span class="search-icon">
            <svg class="h-4 w-4" viewBox="0 0 16 16" fill="none">
              <circle
                cx="6.5"
                cy="6.5"
                r="5"
                stroke="currentColor"
                stroke-width="1.4"
              />
              <path
                d="M10.5 10.5l3.5 3.5"
                stroke="currentColor"
                stroke-width="1.4"
                stroke-linecap="round"
              />
            </svg>
          </span>
        {/if}
      </div>
    </div>
  </div>
</div>

<section class="bg-[#faf8f5] py-0 md:py-28">
  <div class="mx-auto max-w-[1200px] px-8 md:px-16">
    {#if filtered.length === 0}
      <div class="py-24 text-center">
        <p class="empty-title mb-3 text-[#1a2e2c]">Nema dostupnih apartmana</p>
        <p
          class="mb-8 text-[0.88rem] text-[#8a8a80]"
          style="font-family: var(--font-body)"
        >
          Pokušajte s drugačijim filterima ili nas kontaktirajte direktno.
        </p>
        <button on:click={clearFilters} class="btn-primary"
          >Pokaži sve apartmane</button
        >
      </div>
    {:else}
      <div class="space-y-6 md:space-y-8">
        {#each filtered as apt, i}
          <a
            href={buildApartmentHref(apt.href)}
            class="listing-card group block overflow-hidden rounded-[2rem] border border-[#e6dcc8] bg-white/85 text-inherit no-underline shadow-[0_20px_50px_rgba(18,36,34,0.07)] backdrop-blur-sm"
            style="--i:{i}"
          >
            <div
              class="grid items-stretch lg:grid-cols-[minmax(0,1.02fr)_minmax(22rem,0.98fr)]"
            >
              <div
                class:lg:order-2={i % 2 === 1}
                class="relative min-h-[320px] overflow-hidden md:min-h-[420px]"
              >
                <img
                  src={apt.image}
                  alt={apt.name}
                  class="listing-image h-full w-full object-cover"
                  loading="lazy"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-[#071513]/55 via-[#071513]/15 to-transparent"
                ></div>
                <div
                  class="absolute left-5 right-5 top-5 flex items-start justify-between md:left-7 md:right-7 md:top-7"
                >
                  <span
                    class="listing-index rounded-full border border-white/15 bg-[#071513]/55 px-3 py-1.5 text-white backdrop-blur-md"
                  >
                    0{i + 1}
                  </span>
                  <span
                    class="listing-price rounded-full border border-white/15 bg-[#071513]/65 px-3 py-1.5 text-white shadow-[0_8px_20px_rgba(7,21,19,0.18)] backdrop-blur-md"
                  >
                    {apt.price}
                  </span>
                </div>
              </div>

              <div
                class:lg:order-1={i % 2 === 1}
                class="flex flex-col justify-between p-6 md:p-8 lg:p-10"
              >
                <div>
                  <div class="mb-4 flex flex-wrap gap-2">
                    {#each apt.tags as tag}
                      <span
                        class="listing-tag rounded-full border border-[#8fd5cc]/20 bg-[#edf7f6] px-2.5 py-1 text-[#2a6764]"
                      >
                        {tag}
                      </span>
                    {/each}
                  </div>

                  <h3 class="listing-name mb-3 text-[#173330]">{apt.name}</h3>
                  <p
                    class="mb-6 max-w-[54ch] text-[0.92rem] leading-[1.9] text-[#5c6664]"
                  >
                    {apt.description}
                  </p>

                  <div class="grid gap-3 sm:grid-cols-2">
                    {#each apt.amenities.slice(0, 6) as amenity}
                      <div
                        class="flex items-start gap-3 rounded-2xl border border-[#efe7dc] bg-[#fcfaf6] px-4 py-3"
                      >
                        <span
                          class="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#3d7a7c]"
                        ></span>
                        <span class="text-[0.8rem] leading-[1.6] text-[#425150]"
                          >{amenity}</span
                        >
                      </div>
                    {/each}
                  </div>
                </div>

                <div
                  class="mt-8 flex flex-col gap-4 border-t border-[#ece3d5] pt-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <p class="listing-meta max-w-[28ch] text-[#7a7a70]">
                    Pogledajte sve detalje, fotografije i informacije za boravak
                    u ovom apartmanu.
                  </p>
                  <span
                    class="listing-link inline-flex items-center gap-2 text-[#2c5f60]"
                  >
                    Pogledajte detalje
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3 8h10M9 4l4 4-4 4"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </a>
        {/each}
      </div>

      <div class="mt-14 mb-4 md:mb-0 flex items-center justify-center gap-4">
        <span class="h-px max-w-[80px] flex-1 bg-[#e6dcc8]"></span>
        <p
          class="text-center text-[0.72rem] tracking-wide text-[#8a8a80]"
          style="font-family: var(--font-body)"
        >
          Svi apartmani uključuju: besplatni WiFi · klimatizacija · posteljina i
          ručnici · završno čišćenje
        </p>
        <span class="h-px max-w-[80px] flex-1 bg-[#e6dcc8]"></span>
      </div>
    {/if}
  </div>
</section>

<section class="relative overflow-hidden bg-[#091e1c] py-16">
  <div class="pointer-events-none absolute inset-0">
    <div
      class="absolute bottom-0 left-0 h-[80%] w-[35%] rounded-full bg-[#8fd5cc]/[0.04] blur-3xl"
    ></div>
    <div
      class="absolute right-0 top-0 h-[80%] w-[25%] rounded-full bg-[#8fd5cc]/[0.03] blur-3xl"
    ></div>
  </div>
  <div class="relative z-10 mx-auto max-w-[1200px] px-8 md:px-16">
    <div
      class="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-0 md:divide-x md:divide-white/[0.08]"
    >
      {#each [{ label: "Check-in", value: "14:00 - 22:00" }, { label: "Check-out", value: "do 10:00" }, { label: "Minimalni boravak", value: "2 noći (sezona)" }, { label: "Parking", value: "Besplatan" }] as item}
        <div class="text-center md:px-8">
          <span
            class="mb-2 block text-[0.58rem] uppercase tracking-[0.22em] text-[#8fd5cc]"
            style="font-family: var(--font-body)">{item.label}</span
          >
          <span class="info-value block text-white">{item.value}</span>
        </div>
      {/each}
    </div>
  </div>
</section>

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
      class="flex flex-col items-start justify-between gap-12 md:flex-row md:items-center"
    >
      <div>
        <p
          class="mb-5 flex items-center gap-3 text-[0.58rem] uppercase tracking-[0.28em] text-white/45"
        >
          <span class="h-px w-6 bg-white/35"></span>
          Pomoć pri odabiru
        </p>
        <h2
          class="cta-heading mb-4 text-white leading-[1.04] tracking-[-0.025em]"
        >
          Ne možete se<br />odlučiti?
        </h2>
        <p
          class="max-w-[38ch] text-[0.9rem] leading-relaxed text-white/55"
          style="font-family: var(--font-body)"
        >
          Javite nam se - rado ćemo vam preporučiti idealan apartman za vaše
          potrebe i termine.
        </p>
      </div>
      <div class="flex shrink-0 flex-col items-start gap-4 md:items-end">
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
          class="text-[0.78rem] text-white/40 transition-colors hover:text-white/70"
          style="font-family: var(--font-body)"
        >
          apartmani.ante01@gmail.com
        </a>
      </div>
    </div>
  </div>
</section>

<style lang="less">
  @ease: cubic-bezier(0.16, 1, 0.3, 1);

  .empty-title,
  .cta-heading,
  .info-value,
  .listing-name {
    font-family: var(--font-display);
    font-weight: 300;
  }

  .empty-title {
    font-size: clamp(1.6rem, 3vw, 2.2rem);
  }

  .cta-heading {
    font-size: clamp(2.4rem, 5vw, 3.8rem);
  }

  .info-value {
    font-size: clamp(1rem, 1.6vw, 1.2rem);
  }

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

  .filter-shell {
    background: rgba(5, 14, 31, 0.82);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  }

  .filter-bar {
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
    overflow: visible;
  }

  .filter-mobile-toggle {
    display: none;
  }

  .filter-field {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.25rem;
    padding: 0.85rem 1.25rem;
    cursor: pointer;
    transition: background 0.2s ease;

    &:first-child {
      border-bottom-left-radius: 16px;
      border-top-left-radius: 16px;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    label {
      font-family: var(--font-body);
      font-size: 0.46rem;
      font-weight: 500;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.35);
      pointer-events: none;
    }

    input {
      font-family: var(--font-body);
      font-size: 0.82rem;
      font-weight: 400;
      color: white;
      background: transparent;
      border: none;
      outline: none;
      padding: 0;
      appearance: none;
      -webkit-appearance: none;
      width: 100%;
      color-scheme: dark;
    }
    input::-webkit-datetime-edit,
    input::-webkit-datetime-edit-fields-wrapper,
    input::-webkit-datetime-edit-text,
    input::-webkit-datetime-edit-month-field,
    input::-webkit-datetime-edit-day-field,
    input::-webkit-datetime-edit-year-field {
      color: white;
    }
    input::-webkit-calendar-picker-indicator {
      opacity: 0.9;
      filter: invert(1);
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

  .filter-cta {
    padding: 0.85rem 1.25rem;
    background: rgba(255, 255, 255, 0.04);
    border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;
  }

  .result-label {
    font-family: var(--font-body);
    font-size: 0.62rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.4);
    white-space: nowrap;
  }

  .clear-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.45);
    background: transparent;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      border-color: rgba(255, 255, 255, 0.4);
      color: white;
      background: rgba(255, 255, 255, 0.08);
    }
  }

  .search-icon {
    display: inline-flex;
    color: rgba(255, 255, 255, 0.25);
  }

  .listing-card {
    opacity: 0;
    animation: cardin 0.65s @ease calc(var(--i) * 110ms) forwards;

    &:hover {
      .listing-image {
        transform: scale(1.04);
      }

      .listing-link {
        gap: 0.75rem;
        color: #1f6a68;
      }
    }
  }

  .listing-index,
  .listing-price,
  .listing-tag,
  .listing-link,
  .listing-meta {
    font-family: var(--font-body);
  }

  .listing-image {
    transition: transform 0.75s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .listing-index,
  .listing-price {
    font-size: 0.66rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .listing-tag {
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .listing-name {
    font-size: clamp(2rem, 3vw, 2.8rem);
    line-height: 1.02;
    letter-spacing: -0.025em;
  }

  .listing-meta {
    font-size: 0.78rem;
    line-height: 1.7;
  }

  .listing-link {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    transition:
      gap 0.25s @ease,
      color 0.25s ease;
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.9rem 1.9rem;
    background: var(--sea-deep, #1e5c5a);
    color: white;
    font-family: var(--font-body);
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    border: none;
    cursor: pointer;
    transition: all 0.3s @ease;

    &:hover {
      background: var(--sea-dark, #154240);
      transform: translateY(-2px);
      box-shadow: 0 16px 40px rgba(30, 92, 90, 0.4);
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

  @media (max-width: 900px) {
    .filter-bar {
      flex-wrap: wrap;
    }

    .filter-field,
    .filter-cta {
      min-width: 50%;
    }
  }

  @media (max-width: 640px) {
    .filter-shell {
      position: static;
      top: auto;
      z-index: 1;
      background: #faf8f5;
      border-bottom: none;

      .mx-auto {
        padding-top: 0.85rem;
        padding-bottom: 0.9rem;
      }
    }

    .filter-mobile-toggle {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 1rem 1.15rem;
      margin-bottom: 0.4rem;
      border: 1px solid #e8dfd2;
      border-radius: 1.35rem;
      background: white;
      box-shadow: 0 16px 36px rgba(18, 36, 34, 0.08);
      color: #173330;
      font-family: var(--font-body);

      &__copy {
        display: flex;
        min-width: 0;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.2rem;
      }

      strong {
        font-size: 0.68rem;
        font-weight: 600;
        letter-spacing: 0.14em;
        text-transform: uppercase;
      }

      small {
        max-width: 100%;
        overflow: hidden;
        color: #7d857f;
        font-size: 0.76rem;
        font-weight: 400;
        letter-spacing: 0.01em;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-transform: none;
      }

      svg {
        flex: none;
        transition: transform 0.25s ease;
      }

      &.open svg {
        transform: rotate(180deg);
      }
    }

    .filter-bar {
      border-radius: 1.5rem;
      overflow: visible;
      display: none !important;
      margin-top: 0.7rem;
      background: white;
      border: 1px solid #e8dfd2;
      box-shadow: 0 18px 40px rgba(18, 36, 34, 0.08);
    }

    .filter-bar--mobile-open {
      display: flex !important;
      flex-wrap: wrap;
    }

    .filter-field,
    .filter-cta {
      min-width: 100%;
      padding: 1rem 1.15rem;
      border-right: none !important;
      border-bottom: 1px solid #efe7dc;
    }

    .filter-field {
      background: transparent;

      label {
        margin-bottom: 0.2rem;
        color: #8a8a80;
      }

      input {
        font-size: 0.95rem;
        color: #173330;
        color-scheme: light;
      }

      :global(.select-wrap--dark) {
        color: #173330;
        width: 100%;
        --indicators-position: absolute;
        --indicators-right: 0;
        --indicators-top: 50%;
        --indicators-bottom: auto;
        --value-container-padding: 0 1.75rem 0 0;
        --chevron-width: 1.5rem;
        --chevron-height: 1.5rem;
      }

      :global(.select-wrap--dark .svelte-select .selected-item),
      :global(.select-wrap--dark .svelte-select .placeholder),
      :global(.select-wrap--dark .svelte-select input) {
        color: #173330 !important;
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

      :global(.select-wrap--dark .svelte-select .placeholder) {
        color: #a49c90 !important;
      }

      :global(.select-wrap--dark .svelte-select svg),
      :global(.select-wrap--dark .svelte-select .chevron),
      :global(.select-wrap--dark .svelte-select .clear-icon) {
        fill: rgba(23, 51, 48, 0.42) !important;
        color: rgba(23, 51, 48, 0.42) !important;
      }
    }

    .filter-cta {
      justify-content: space-between;
      gap: 0.75rem;
      border-bottom: none;
      border-top-right-radius: 0;
      border-bottom-left-radius: 1.5rem;
      border-bottom-right-radius: 1.5rem;
      background: #fcfaf6;
    }

    .result-label {
      font-size: 0.72rem;
      letter-spacing: 0.16em;
      color: #6f746f;
    }

    .clear-btn {
      border-color: #e1d8ca;
      color: #7d857f;

      &:hover {
        border-color: #cbbba6;
        color: #173330;
        background: rgba(30, 92, 90, 0.05);
      }
    }

    .search-icon {
      color: #8c938d;
    }
  }

  @keyframes cardin {
    from {
      opacity: 0;
      transform: translateY(22px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
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
