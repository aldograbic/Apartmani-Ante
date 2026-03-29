<script>
  import { enhance } from "$app/forms";
  import { apartments } from "$lib/data/apartments.js";
  import BookingCalendar from "$lib/components/BookingCalendar.svelte";
  import Select from "$lib/components/Select.svelte";

  export let data;
  export let form;

  let apt = data.apartment;
  let activeApartmentId = data.apartment.id;
  const today = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Zagreb",
  }).format(new Date());
  let activeImage = 0;
  let viewerOpen = false;
  let modalOpen = false;
  let reservationStep = 1;
  let selectedDates = { checkIn: "", checkOut: "" };
  const adultOptions = [
    { value: "", label: "Odaberite" },
    { value: "1", label: "1 odrasla osoba" },
    { value: "2", label: "2 odrasle osobe" },
    { value: "3", label: "3 odrasle osobe" },
    { value: "4", label: "4 odrasle osobe" },
    { value: "5", label: "5 odraslih osoba" },
  ];
  const childrenOptions = [
    { value: "", label: "Odaberite" },
    { value: "0", label: "0 djece" },
    { value: "1", label: "1 dijete" },
    { value: "2", label: "2 djece" },
    { value: "3", label: "3 djece" },
    { value: "4", label: "4 djece" },
  ];
  let adultsOption = adultOptions[0];
  let childrenOption = childrenOptions[0];

  $: apt = data.apartment;
  $: others = apartments.filter((a) => a.id !== apt.id);
  $: if (apt.id !== activeApartmentId) {
    activeApartmentId = apt.id;
    activeImage = 0;
    viewerOpen = false;
    modalOpen = false;
    reservationStep = 1;
    selectedDates = { checkIn: "", checkOut: "" };
    adultsOption = adultOptions[0];
    childrenOption = childrenOptions[0];
  }
  $: if (form?.reservationSuccess) {
    modalOpen = false;
    reservationStep = 1;
    selectedDates = { checkIn: "", checkOut: "" };
    adultsOption = adultOptions[0];
    childrenOption = childrenOptions[0];
  }

  function openModal() {
    modalOpen = true;
    reservationStep = 1;
  }

  function openViewer(index = activeImage) {
    activeImage = index;
    viewerOpen = true;
  }

  function closeViewer() {
    viewerOpen = false;
  }

  function closeModal() {
    modalOpen = false;
    reservationStep = 1;
  }

  function showPrevImage() {
    activeImage = activeImage === 0 ? apt.images.length - 1 : activeImage - 1;
  }

  function showNextImage() {
    activeImage = activeImage === apt.images.length - 1 ? 0 : activeImage + 1;
  }

  function handleRangeSelect(event) {
    selectedDates = {
      checkIn: event.detail.checkIn,
      checkOut: event.detail.checkOut,
    };
  }

  function goToGuestStep() {
    if (!selectedDates.checkIn || !selectedDates.checkOut) return;
    reservationStep = 2;
  }

  function formatDateLabel(value) {
    return new Intl.DateTimeFormat("hr-HR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(`${value}T00:00:00`));
  }

  function getSeasonalPriceForDate(value) {
    if (!value || !apt.seasonalPrices?.length) return null;

    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return null;

    const monthDay = Number(match[2]) * 100 + Number(match[3]);

    if (monthDay >= 1001 || monthDay < 601) return apt.seasonalPrices[0];
    if (monthDay >= 601 && monthDay < 715) return apt.seasonalPrices[1];
    if (monthDay >= 715 && monthDay < 820) return apt.seasonalPrices[2];
    return apt.seasonalPrices[3];
  }

  function parseEuroPrice(value) {
    const amount = Number(String(value || "").replace(/[^\d]/g, ""));
    return Number.isFinite(amount) ? amount : 0;
  }

  function calculateSelectedStay(checkIn, checkOut) {
    if (!checkIn || !checkOut) return null;

    const start = new Date(`${checkIn}T00:00:00`);
    const end = new Date(`${checkOut}T00:00:00`);
    let total = 0;
    let nights = 0;

    for (
      const cursor = new Date(start);
      cursor < end;
      cursor.setDate(cursor.getDate() + 1)
    ) {
      const dateKey = cursor.toISOString().slice(0, 10);
      const season = getSeasonalPriceForDate(dateKey);
      if (!season || season.price === "-") {
        return null;
      }

      total += parseEuroPrice(season.price);
      nights += 1;
    }

    return nights > 0 ? { total, nights } : null;
  }

  function getCalendarDayMeta(date) {
    const season = getSeasonalPriceForDate(date);
    if (!season) return null;

    return {
      priceLabel: season.price !== "-" ? season.price : "",
      unavailable: season.price === "-",
    };
  }

  $: selectedSeasonPrice = getSeasonalPriceForDate(selectedDates.checkIn);
  $: selectedStayPrice = calculateSelectedStay(
    selectedDates.checkIn,
    selectedDates.checkOut,
  );
</script>

<section class="hero-shell relative" style="height: clamp(300px, 38vw, 460px)">
  <div class="hero-bg absolute inset-0">
    <img
      src={apt.images[0]}
      alt={apt.name}
      class="hero-img h-full w-full object-cover"
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
    <div class="mb-5 flex flex-wrap gap-2">
      {#each apt.tags as tag}
        <span class="apt-tag-pill">{tag}</span>
      {/each}
    </div>
    <h1 class="hero-title mb-4 text-white leading-[1.0] tracking-[-0.01em]">
      {apt.name}
    </h1>
    <p
      class="hero-sub max-w-[42ch] text-[0.92rem] leading-relaxed text-white/55"
    >
      {apt.description}
    </p>
  </div>
</section>

<div class="border-b border-[#e6dcc8] bg-[#faf8f5]">
  <div
    class="breadcrumb-bar mx-auto flex max-w-[var(--container)] items-center gap-2 px-8 py-4 text-[0.72rem] text-[#8a8a80] md:px-16"
  >
    <a href="/" class="text-[#1e5c5a] transition-colors hover:text-[#154240]"
      >Pocetna</a
    >
    <span class="text-[#c8c0b4]">/</span>
    <a
      href="/apartmani"
      class="text-[#1e5c5a] transition-colors hover:text-[#154240]">Apartmani</a
    >
    <span class="text-[#c8c0b4]">/</span>
    <span>{apt.name}</span>
  </div>
</div>

<section class="bg-white py-20 md:py-28">
  <div class="mx-auto max-w-[1200px] px-8 md:px-16">
    <div
      class="grid items-start gap-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)]"
    >
      <div class="gallery-shell">
        <div class="gallery-stage">
          <button
            class="gallery-nav gallery-nav--left"
            on:click={showPrevImage}
            aria-label="Prethodna slika"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
              ><path
                d="M11 4L6 9l5 5"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              /></svg
            >
          </button>
          <button
            type="button"
            class="gallery-open"
            on:click={() => openViewer(activeImage)}
            aria-label="Otvori veliku sliku"
          >
            <img
              src={apt.images[activeImage]}
              alt="{apt.name} - slika {activeImage + 1}"
              class="gallery-main"
            />
            <span class="gallery-zoom-hint"> Kliknite za puni prikaz </span>
          </button>
          <button
            class="gallery-nav gallery-nav--right"
            on:click={showNextImage}
            aria-label="Sljedeca slika"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
              ><path
                d="M7 4l5 5-5 5"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              /></svg
            >
          </button>
          <div class="gallery-counter">
            {activeImage + 1} / {apt.images.length}
          </div>
        </div>

        <div class="gallery-thumbs">
          {#each apt.images as img, i}
            <button
              class:active={activeImage === i}
              class="gallery-thumb"
              on:click={() => (activeImage = i)}
              aria-label="Slika {i + 1}"
            >
              <img src={img} alt="Pregled slike {i + 1}" />
            </button>
          {/each}
        </div>
      </div>

      <div class="info-panel">
        <div class="mb-8 -mt-8 md:mt-0 border-b border-[#e6dcc8] pb-7">
          <div class="mb-4 flex flex-wrap gap-2">
            <span class="info-pill">{apt.size}</span>
            <span class="info-pill">{apt.capacity}</span>
            <span class="info-pill">{apt.price}</span>
          </div>
          <p
            class="text-[0.95rem] leading-[1.9] text-[#5a5a52]"
            style="font-family: var(--font-body); font-weight: 300"
          >
            {apt.description}
          </p>
        </div>

        <div class="mb-10">
          <p class="section-kicker">
            <span class="section-kicker__line"></span>Sadržaji
          </p>
          <ul class="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
            {#each apt.amenities as amenity}
              <li class="amenity-item">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 16 16"
                  fill="none"
                  class="shrink-0 text-[#1e5c5a]"
                >
                  <circle
                    cx="8"
                    cy="8"
                    r="7.25"
                    stroke="currentColor"
                    stroke-width="1.5"
                  />
                  <path
                    d="M5 8l2 2 4-4"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                {amenity}
              </li>
            {/each}
          </ul>
        </div>

        <div class="mb-8 grid grid-cols-3 gap-4 border-y border-[#e6dcc8] py-6">
          {#each [["Check-in", "14:00 - 22:00"], ["Check-out", "do 10:00"], ["Min. boravak", "2 noći"]] as [k, v]}
            <div>
              <span class="policy-key">{k}</span>
              <span class="policy-value">{v}</span>
            </div>
          {/each}
        </div>

        {#if form?.reservationSuccess}
          <p class="feedback feedback--success">{form.reservationSuccess}</p>
        {/if}
        {#if form?.reservationNotice}
          <p class="feedback feedback--error">{form.reservationNotice}</p>
        {/if}
        {#if form?.reservationError}
          <p class="feedback feedback--error">{form.reservationError}</p>
        {/if}

        <div class="flex flex-wrap gap-3">
          <button type="button" class="btn-primary" on:click={openModal}>
            Rezerviraj ovaj apartman
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none"
              ><path
                d="M3 9h12M11 5l4 4-4 4"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              /></svg
            >
          </button>
          <a href="/kontakt" class="btn-ghost-teal">Pitajte nas</a>
        </div>
      </div>
    </div>
    {#if apt.detailsSections?.length}
      <div class="mb-10 mt-12">
        <p class="section-kicker">
          <span class="section-kicker__line"></span>Detalji apartmana
        </p>
        <div class="details-grid">
          {#each apt.detailsSections as section}
            <article class="detail-card">
              <h3>{section.title}</h3>
              <ul>
                {#each section.items as item}
                  <li>{item}</li>
                {/each}
              </ul>
            </article>
          {/each}
        </div>
      </div>
    {/if}
    <div class="mb-10">
      <p class="section-kicker">
        <span class="section-kicker__line"></span>U blizini
      </p>
      <div class="detail-card">
        <ul>
          {#each ["Udaljenost kafića: 150 m", "Udaljenost od trgovine: 290 m (Ribola), 300 m (Konzum)", "Udaljenost do crkve i parka: 300 m", "Udaljenost restorana: 400 m", "Udaljenost do plaže: 600 m", "Udaljenost do autobusnog kolodvora: 1 km", "Udaljenost do centra grada: 1,4 km"] as nearbyItem}
            <li>{nearbyItem}</li>
          {/each}
        </ul>
      </div>
    </div>
    {#if apt.seasonalPrices?.length}
      <div class="mb-10">
        <p class="section-kicker">
          <span class="section-kicker__line"></span>Cjenik
        </p>
        <div class="price-season-table">
          <div class="price-season-table__head">Razdoblje</div>
          <div class="price-season-table__head">Cijena</div>
          {#each apt.seasonalPrices as season}
            <div class="price-season-table__cell">
              {season.from} - {season.to}
            </div>
            <div
              class="price-season-table__cell price-season-table__cell--strong"
            >
              {season.price}
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</section>

<section class="border-t border-[#e6dcc8] bg-[#faf8f5] py-20 md:py-28">
  <div class="mx-auto max-w-[1200px] px-8 md:px-16">
    <div
      class="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
    >
      <div>
        <p class="section-kicker">
          <span class="section-kicker__line"></span>Više opcija
        </p>
        <h2
          class="section-heading text-[#1a2e2c] leading-tight tracking-[-0.02em]"
        >
          Ostali apartmani
        </h2>
      </div>
      <a
        href="/apartmani"
        class="inline-flex items-center gap-2 border-b border-[#2c5f60]/30 pb-0.5 text-[0.68rem] uppercase tracking-[0.14em] text-[#2c5f60] transition-all duration-200 hover:gap-3 hover:border-[#2c5f60]"
        style="font-family: var(--font-body)"
      >
        Pogledaj sve
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none"
          ><path
            d="M1 7h12M8 2l5 5-5 5"
            stroke="currentColor"
            stroke-width="1.4"
            stroke-linecap="round"
            stroke-linejoin="round"
          /></svg
        >
      </a>
    </div>

    <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
      {#each others as apt2, i}
        <a href={apt2.href} class="apt-card" style="--i:{i}">
          <div class="apt-visual">
            <img
              src={apt2.image}
              alt={apt2.name}
              class="apt-img"
              loading="lazy"
            />
            <div class="apt-scrim"></div>
            <div class="apt-top">
              <span class="apt-num"
                >0{apartments.findIndex((a) => a.id === apt2.id) + 1}</span
              >
              <span class="apt-price">{apt2.price}</span>
            </div>
            <div class="apt-overlay">
              <div class="apt-tags">
                {#each apt2.tags as tag}
                  <span class="apt-tag-inner">{tag}</span>
                {/each}
              </div>
              <h3 class="apt-title">{apt2.name}</h3>
              <div class="apt-reveal">
                <p class="apt-desc">{apt2.description}</p>
                <span class="apt-cta">
                  Saznajte vise
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none"
                    ><path
                      d="M3 8h10M9 4l4 4-4 4"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    /></svg
                  >
                </span>
              </div>
            </div>
          </div>
        </a>
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
          <span class="h-px w-6 bg-white/35"></span>Rezervacija
        </p>
        <h2
          class="cta-heading mb-4 text-white leading-[1.04] tracking-[-0.025em]"
        >
          Planirate odmor<br />u Makarskoj?
        </h2>
        <p
          class="max-w-[38ch] text-[0.9rem] leading-relaxed text-white/55"
          style="font-family: var(--font-body)"
        >
          Slobodno nas kontaktirajte - rado ćemo pronaći idealan termin za vas i
          vašu obitelj.
        </p>
      </div>
      <div class="flex shrink-0 flex-col items-start gap-4 md:items-end">
        <a href="/kontakt" class="btn-cta-white"
          >Kontaktirajte nas<svg class="h-4 w-4" viewBox="0 0 16 16" fill="none"
            ><path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            /></svg
          ></a
        >
        <a
          href="mailto:apartmani.ante01@gmail.com"
          class="text-[0.78rem] text-white/40 transition-colors hover:text-white/70"
          style="font-family: var(--font-body)">apartmani.ante01@gmail.com</a
        >
      </div>
    </div>
  </div>
</section>

{#if modalOpen}
  <div class="modal-backdrop" on:click={closeModal} role="presentation"></div>
  <div
    class="modal-shell"
    role="dialog"
    aria-modal="true"
    aria-labelledby="reservation-title"
  >
    <div class="modal-card">
      <button
        class="modal-close"
        type="button"
        on:click={closeModal}
        aria-label="Zatvori"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
          ><path
            d="M3 3l10 10M13 3L3 13"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          /></svg
        >
      </button>

      <div class="modal-head">
        <p class="modal-kicker">Rezervacija apartmana</p>
        <h2 id="reservation-title">{apt.name}</h2>
        <div class="modal-steps">
          <span class:active={reservationStep === 1}>1. Termin</span>
          <span class:active={reservationStep === 2}>2. Podaci</span>
        </div>
      </div>

      {#if reservationStep === 1}
        <div class="modal-step">
          <p class="modal-copy">
            Najprije odaberite željeni raspon datuma. Kliknite datum dolaska pa
            datum odlaska, a zauzeti termini su vec označeni na kalendaru.
          </p>
          <BookingCalendar
            bookings={data.bookings}
            showGuestNames={false}
            mergeAdjacentBookings={true}
            minDate={today}
            allowDragSelection={false}
            getDayMeta={getCalendarDayMeta}
            on:selectrange={handleRangeSelect}
          />
          <div class="selected-range">
            <div>
              <span>Dolazak</span><strong
                >{selectedDates.checkIn
                  ? formatDateLabel(selectedDates.checkIn)
                  : "Odaberite datum"}</strong
              >
            </div>
            <div>
              <span>Odlazak</span><strong
                >{selectedDates.checkOut
                  ? formatDateLabel(selectedDates.checkOut)
                  : "Odaberite datum"}</strong
              >
            </div>
          </div>
          {#if selectedStayPrice}
            <div class="selected-summary selected-summary--single">
              <div>
                <span>Cijena za odabrano razdoblje</span>
                <strong
                  >{selectedStayPrice.total}€ ukupno za {selectedStayPrice.nights}
                  noći</strong
                >
              </div>
            </div>
          {/if}
          <div class="modal-actions">
            <button type="button" class="btn-ghost-teal" on:click={closeModal}
              >Odustani</button
            >
            <button
              type="button"
              class="btn-primary"
              on:click={goToGuestStep}
              disabled={!selectedDates.checkIn || !selectedDates.checkOut}
              >Nastavi</button
            >
          </div>
        </div>
      {:else}
        <form
          method="POST"
          action="?/reserve"
          class="modal-step modal-form"
          use:enhance
        >
          <div class="hp-field" aria-hidden="true">
            <label>
              <span>Company</span>
              <input
                type="text"
                name="company"
                tabindex="-1"
                autocomplete="off"
              />
            </label>
          </div>
          <input type="hidden" name="checkIn" value={selectedDates.checkIn} />
          <input type="hidden" name="checkOut" value={selectedDates.checkOut} />
          <input
            type="hidden"
            name="adults"
            value={adultsOption?.value || ""}
          />
          <input
            type="hidden"
            name="children"
            value={childrenOption?.value || ""}
          />
          <div class="selected-summary">
            <div>
              <span>Odabrani termin</span><strong
                >{formatDateLabel(selectedDates.checkIn)} - {formatDateLabel(
                  selectedDates.checkOut,
                )}</strong
              >
            </div>
          </div>
          <label
            ><span>Ime i prezime <em class="required-mark">*</em></span><input
              type="text"
              name="name"
              required
            /></label
          >
          <label
            ><span>Email <em class="required-mark">*</em></span><input
              type="email"
              name="email"
              required
            /></label
          >
          <label
            ><span>Telefon <em class="required-mark">*</em></span><input
              type="tel"
              name="phone"
              required
            /></label
          >
          <div class="modal-form__grid">
            <div class="modal-form__field">
              <span>Broj odraslih <em class="required-mark">*</em></span>
              <div class="modal-select">
                <Select
                  bind:value={adultsOption}
                  items={adultOptions}
                  variant="light"
                  clearable={false}
                  searchable={false}
                />
              </div>
            </div>
            <div class="modal-form__field">
              <span>Broj djece <em class="required-mark">*</em></span>
              <div class="modal-select">
                <Select
                  bind:value={childrenOption}
                  items={childrenOptions}
                  variant="light"
                  clearable={false}
                  searchable={false}
                />
              </div>
            </div>
          </div>
          <label
            ><span>Očekivano vrijeme dolaska</span><input
              type="time"
              name="arrivalTime"
            /></label
          >
          <label
            ><span>Komentar</span><textarea
              name="comment"
              rows="4"
              placeholder="Opcionalno"
            ></textarea></label
          >
          {#if form?.reservationError}
            <p class="feedback feedback--error">{form.reservationError}</p>
          {/if}
          <div class="modal-actions">
            <button
              type="button"
              class="btn-ghost-teal"
              on:click={() => (reservationStep = 1)}>Natrag</button
            >
            <button type="submit" class="btn-primary">Pošalji upit</button>
          </div>
        </form>
      {/if}
    </div>
  </div>
{/if}

{#if viewerOpen}
  <div class="viewer-backdrop" on:click={closeViewer} role="presentation"></div>
  <div
    class="viewer-shell"
    role="dialog"
    aria-modal="true"
    aria-label="Galerija slika"
  >
    <button
      class="viewer-close"
      type="button"
      on:click={closeViewer}
      aria-label="Zatvori galeriju"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
        ><path
          d="M3 3l10 10M13 3L3 13"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
        /></svg
      >
    </button>
    <div class="viewer-card">
      <div class="viewer-stage">
        <button
          class="viewer-nav viewer-nav--left"
          type="button"
          on:click={showPrevImage}
          aria-label="Prethodna slika"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
            ><path
              d="M11 4L6 9l5 5"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            /></svg
          >
        </button>

        <img
          src={apt.images[activeImage]}
          alt="{apt.name} - velika slika {activeImage + 1}"
          class="viewer-image"
        />

        <button
          class="viewer-nav viewer-nav--right"
          type="button"
          on:click={showNextImage}
          aria-label="Sljedeca slika"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
            ><path
              d="M7 4l5 5-5 5"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            /></svg
          >
        </button>
      </div>

      <div class="viewer-meta">
        <div>
          <span>Galerija apartmana</span>
          <strong>{apt.name}</strong>
        </div>
        <div class="viewer-counter">
          {activeImage + 1} / {apt.images.length}
        </div>
      </div>

      <div class="viewer-thumbs">
        {#each apt.images as img, i}
          <button
            type="button"
            class:active={activeImage === i}
            class="viewer-thumb"
            on:click={() => (activeImage = i)}
            aria-label="Otvori sliku {i + 1}"
          >
            <img src={img} alt="{apt.name} - pregled {i + 1}" />
          </button>
        {/each}
      </div>
    </div>
  </div>
{/if}

<style lang="less">
  @ease: cubic-bezier(0.16, 1, 0.3, 1);

  .breadcrumb-bar,
  .info-panel {
    font-family: var(--font-body);
  }
  .hero-title {
    font-family: var(--font-hero);
    font-weight: 500;
    font-size: clamp(2.8rem, 6vw, 5.5rem);
    opacity: 0;
    animation: slideUp 0.8s 0.35s @ease forwards;
  }
  .hero-sub {
    font-family: var(--font-body);
    opacity: 0;
    animation: slideUp 0.7s 0.5s @ease forwards;
  }
  .section-heading,
  .cta-heading,
  .modal-head h2 {
    font-family: var(--font-display);
    font-weight: 300;
  }
  .section-heading {
    font-size: clamp(2.2rem, 4vw, 3rem);
  }
  .cta-heading {
    font-size: clamp(2.4rem, 5vw, 3.8rem);
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
    object-position: center 40%;
  }
  @keyframes heroZoom {
    to {
      transform: scale(1) translateZ(0);
    }
  }
  .apt-tag-pill {
    font-family: var(--font-body);
    font-size: 0.62rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.55);
    border: 1px solid rgba(255, 255, 255, 0.18);
    background: rgba(255, 255, 255, 0.07);
    backdrop-filter: blur(8px);
    padding: 0.3rem 0.8rem;
    border-radius: 999px;
    opacity: 0;
    animation: slideUp 0.6s 0.2s @ease forwards;
  }
  .gallery-shell {
    display: grid;
    gap: 1rem;
  }
  .gallery-stage {
    position: relative;
    min-height: 480px;
    overflow: hidden;
    border-radius: 2rem;
    background: #efe7da;
    box-shadow: 0 28px 70px rgba(19, 36, 34, 0.12);
  }
  .gallery-main {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .gallery-open {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    cursor: zoom-in;
  }
  .gallery-zoom-hint {
    position: absolute;
    left: 1rem;
    bottom: 1rem;
    z-index: 2;
    padding: 0.48rem 0.85rem;
    border-radius: 999px;
    background: rgba(7, 21, 19, 0.58);
    color: rgba(255, 255, 255, 0.92);
    font-family: var(--font-body);
    font-size: 0.64rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    backdrop-filter: blur(10px);
    transition:
      transform 0.25s ease,
      background 0.25s ease;
  }
  .gallery-open:hover .gallery-zoom-hint {
    transform: translateY(-2px);
    background: rgba(7, 21, 19, 0.72);
  }
  .gallery-nav {
    position: absolute;
    top: 50%;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    border-radius: 999px;
    background: rgba(7, 21, 19, 0.52);
    color: white;
    backdrop-filter: blur(10px);
    transform: translateY(-50%);
  }
  .gallery-nav--left {
    left: 1rem;
  }
  .gallery-nav--right {
    right: 1rem;
  }
  .gallery-counter {
    position: absolute;
    right: 1rem;
    bottom: 1rem;
    padding: 0.45rem 0.8rem;
    border-radius: 999px;
    background: rgba(7, 21, 19, 0.58);
    color: white;
    font-family: var(--font-body);
    font-size: 0.68rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    backdrop-filter: blur(10px);
  }
  .gallery-thumbs {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.75rem;
  }
  .gallery-thumb {
    overflow: hidden;
    border-radius: 1.2rem;
    border: 2px solid transparent;
    opacity: 0.62;
    transition:
      opacity 0.2s ease,
      border-color 0.2s ease,
      transform 0.2s ease;
  }
  .gallery-thumb img {
    width: 100%;
    height: 7rem;
    object-fit: cover;
  }
  .gallery-thumb:hover,
  .gallery-thumb.active {
    opacity: 1;
    transform: translateY(-2px);
    border-color: #1e5c5a;
  }
  .info-pill {
    display: inline-flex;
    align-items: center;
    padding: 0.7rem 1rem;
    border-radius: 999px;
    border: 1px solid #e8ddcd;
    background: #fbf8f2;
    color: #183533;
    font-family: var(--font-body);
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  .section-kicker {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
    color: #3d7a7c;
    font-size: 0.58rem;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    font-family: var(--font-body);
  }
  .section-kicker__line {
    width: 1.5rem;
    height: 1px;
    background: #3d7a7c;
  }
  .amenity-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: #5a5a52;
    font-size: 0.92rem;
  }
  .details-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
  }
  .price-season-table {
    display: grid;
    grid-template-columns: minmax(0, 1.6fr) minmax(7rem, 0.8fr);
    border: 1px solid #e8ddcd;
    border-radius: 1.25rem;
    overflow: hidden;
    background: #fbf8f2;
  }
  .price-season-table__head,
  .price-season-table__cell {
    padding: 0.95rem 1.1rem;
    border-bottom: 1px solid #e8ddcd;
  }
  .price-season-table__head {
    background: #f5efe5;
    color: #6f776f;
    font-family: var(--font-body);
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }
  .price-season-table__cell {
    color: #4f554f;
    font-size: 0.92rem;
  }
  .price-season-table__cell--strong {
    color: #173330;
    font-weight: 700;
  }
  .price-season-table > :nth-last-child(-n + 2) {
    border-bottom: none;
  }
  .detail-card {
    padding: 1.1rem 1.15rem;
    border-radius: 1.25rem;
    background: #fbf8f2;
    border: 1px solid #e8ddcd;
  }
  .detail-card h3 {
    margin: 0 0 0.75rem;
    color: #173330;
    font-family: var(--font-body);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }
  .detail-card ul {
    display: grid;
    gap: 0.45rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .detail-card li {
    position: relative;
    padding-left: 0.95rem;
    color: #5a5a52;
    font-size: 0.88rem;
    line-height: 1.65;
  }
  .detail-card li::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0.62rem;
    width: 0.32rem;
    height: 0.32rem;
    border-radius: 999px;
    background: #1e5c5a;
  }
  .policy-key {
    display: block;
    margin-bottom: 0.25rem;
    color: #8a8a80;
    font-family: var(--font-body);
    font-size: 0.55rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }
  .policy-value {
    display: block;
    color: #3a3a32;
    font-family: var(--font-body);
    font-size: 0.9rem;
    font-weight: 500;
  }
  .feedback {
    margin: 0 0 1rem;
    padding: 0.95rem 1rem;
    border-radius: 1rem;
    font-family: var(--font-body);
  }
  .feedback--success {
    background: rgba(43, 121, 94, 0.12);
    border: 1px solid rgba(43, 121, 94, 0.16);
    color: #215f4b;
  }
  .feedback--error {
    background: rgba(183, 59, 59, 0.12);
    border: 1px solid rgba(183, 59, 59, 0.16);
    color: #8a2323;
  }
  .btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    padding: 1rem 2rem;
    background: #1e5c5a;
    color: white;
    font-family: var(--font-body);
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    transition: all 0.3s @ease;
  }
  .btn-primary:hover {
    background: #154240;
    transform: translateY(-2px);
    box-shadow: 0 16px 40px rgba(30, 92, 90, 0.4);
  }
  .btn-primary:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  .btn-ghost-teal {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 1rem 2rem;
    border: 1.5px solid #1e5c5a;
    color: #1e5c5a;
    font-family: var(--font-body);
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    transition: all 0.25s ease;
  }
  .btn-ghost-teal:hover {
    background: #1e5c5a;
    color: white;
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
  }
  .btn-cta-white:hover {
    background: #faf8f5;
    transform: translateY(-2px);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3);
  }
  .apt-card {
    display: block;
    text-decoration: none;
    color: white;
    overflow: hidden;
    cursor: pointer;
    opacity: 0;
    animation: cardin 0.65s @ease calc(var(--i) * 110ms) forwards;
  }
  .apt-card:hover .apt-img {
    transform: scale(1.06);
    filter: brightness(0.82);
  }
  .apt-card:hover .apt-reveal {
    opacity: 1;
    max-height: 180px;
    transform: translateY(0);
  }
  .apt-card:hover .apt-scrim {
    opacity: 1;
  }
  .apt-card:hover .apt-overlay {
    padding-bottom: 2.25rem;
  }
  .apt-card:hover .apt-top {
    opacity: 0.6;
  }
  .apt-card:hover .apt-num {
    color: #8fd5cc;
  }
  .apt-visual {
    position: relative;
    aspect-ratio: 3/2;
    overflow: hidden;
    background: #0a2220;
  }
  .apt-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition:
      transform 0.85s cubic-bezier(0.25, 0.46, 0.45, 0.94),
      filter 0.5s ease;
  }
  .apt-scrim {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgba(8, 26, 24, 0.97) 0%,
      rgba(8, 26, 24, 0.58) 42%,
      rgba(8, 26, 24, 0.08) 68%,
      transparent 100%
    );
    opacity: 0.8;
    transition: opacity 0.5s ease;
  }
  .apt-top {
    position: absolute;
    top: 1.25rem;
    left: 1.25rem;
    right: 1.25rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    z-index: 2;
    transition: opacity 0.3s ease;
  }
  .apt-num {
    font-family: var(--font-body);
    font-size: 0.6rem;
    font-weight: 500;
    letter-spacing: 0.22em;
    color: rgba(255, 255, 255, 0.4);
    transition: color 0.25s;
  }
  .apt-price {
    font-family: var(--font-body);
    font-size: 0.68rem;
    font-weight: 400;
    letter-spacing: 0.06em;
    color: white;
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    padding: 0.28rem 0.72rem;
    border-radius: 100px;
  }
  .apt-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2;
    padding: 0 1.5rem 1.5rem;
    transition: padding-bottom 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  .apt-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0;
    margin-bottom: 0.6rem;
  }
  .apt-tag-inner {
    font-family: var(--font-body);
    font-size: 0.58rem;
    font-weight: 500;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #8fd5cc;
    opacity: 0.85;
  }
  .apt-tag-inner + .apt-tag-inner::before {
    content: " · ";
    opacity: 0.35;
    margin: 0 0.3rem;
  }
  .apt-title {
    font-family: var(--font-display);
    font-size: clamp(1.4rem, 2.4vw, 1.8rem);
    font-weight: 400;
    color: white;
    line-height: 1.1;
    letter-spacing: -0.01em;
  }
  .apt-reveal {
    overflow: hidden;
    max-height: 0;
    opacity: 0;
    transform: translateY(10px);
    transition:
      max-height 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94),
      opacity 0.38s ease 0.06s,
      transform 0.38s @ease 0.06s;
  }
  .apt-desc {
    font-family: var(--font-body);
    font-size: 0.8rem;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.65;
    margin-top: 0.75rem;
    margin-bottom: 1rem;
  }
  .apt-cta {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-family: var(--font-body);
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #8fd5cc;
    border-bottom: 1px solid rgba(143, 213, 204, 0.3);
    padding-bottom: 0.12rem;
  }
  .modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 220;
    background: rgba(4, 13, 23, 0.55);
    backdrop-filter: blur(8px);
  }
  .modal-shell {
    position: fixed;
    inset: 0;
    z-index: 230;
    display: grid;
    place-items: center;
    padding: 1.5rem;
  }
  .modal-card {
    position: relative;
    width: min(100%, 62rem);
    max-height: calc(100vh - 3rem);
    overflow: auto;
    border-radius: 2rem;
    background: #faf7f1;
    box-shadow: 0 30px 90px rgba(8, 26, 24, 0.24);
    padding: 1.5rem;
  }
  .viewer-backdrop {
    position: fixed;
    inset: 0;
    z-index: 240;
    background: rgba(3, 10, 18, 0.8);
    backdrop-filter: blur(10px);
  }
  .viewer-shell {
    position: fixed;
    inset: 0;
    z-index: 250;
    overflow-y: auto;
    padding: 2rem;
    pointer-events: none;
  }
  .viewer-card {
    position: relative;
    width: min(100%, 88rem);
    margin: 0 auto;
    margin-top: 3.5rem;
    padding: 1.35rem;
    border-radius: 2rem;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), transparent),
      rgba(6, 18, 30, 0.88);
    box-shadow: 0 36px 100px rgba(0, 0, 0, 0.34);
    pointer-events: auto;
  }
  .viewer-close {
    position: fixed;
    top: 1.25rem;
    right: 1.25rem;
    z-index: 260;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(8, 20, 30, 0.78);
    color: white;
    box-shadow: 0 14px 34px rgba(0, 0, 0, 0.24);
    backdrop-filter: blur(14px);
    pointer-events: auto;
  }
  .viewer-stage {
    position: relative;
    min-height: min(78vh, 52rem);
    overflow: hidden;
    border-radius: 1.4rem;
    background: rgba(255, 255, 255, 0.04);
  }
  .viewer-image {
    width: 100%;
    height: 100%;
    min-height: min(78vh, 52rem);
    object-fit: contain;
  }
  .viewer-nav {
    position: absolute;
    top: 50%;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 3.4rem;
    height: 3.4rem;
    border-radius: 999px;
    background: rgba(10, 24, 32, 0.6);
    color: white;
    transform: translateY(-50%);
    backdrop-filter: blur(10px);
  }
  .viewer-nav--left {
    left: 1.1rem;
  }
  .viewer-nav--right {
    right: 1.1rem;
  }
  .viewer-meta {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.2rem 0 1rem;
    color: white;
    font-family: var(--font-body);
  }
  .viewer-meta span {
    display: block;
    margin-bottom: 0.35rem;
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.63rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }
  .viewer-meta strong {
    display: block;
    font-size: 1.1rem;
    font-weight: 500;
    letter-spacing: 0.02em;
  }
  .viewer-counter {
    padding: 0.55rem 0.9rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.72rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }
  .viewer-thumbs {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(9rem, 12rem);
    gap: 0.85rem;
    overflow-x: auto;
    padding-bottom: 0.35rem;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.22) transparent;
  }
  .viewer-thumb {
    overflow: hidden;
    border-radius: 1rem;
    border: 2px solid transparent;
    opacity: 0.58;
    transition:
      opacity 0.2s ease,
      transform 0.2s ease,
      border-color 0.2s ease;
  }
  .viewer-thumb img {
    width: 100%;
    height: 6.8rem;
    object-fit: cover;
  }
  .viewer-thumb:hover,
  .viewer-thumb.active {
    opacity: 1;
    transform: translateY(-2px);
    border-color: rgba(143, 213, 204, 0.9);
  }
  .modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 999px;
    background: rgba(19, 34, 32, 0.06);
    color: #173330;
  }
  .modal-head {
    padding: 0.5rem 0 1.25rem;
  }
  .modal-kicker {
    margin: 0 0 0.75rem;
    color: #487473;
    font-family: var(--font-body);
    font-size: 0.7rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
  }
  .modal-steps {
    display: flex;
    gap: 0.75rem;
    margin-top: 1rem;
  }
  .modal-steps span {
    padding: 0.55rem 0.9rem;
    border-radius: 999px;
    background: rgba(19, 34, 32, 0.06);
    color: #6c7d7b;
    font-family: var(--font-body);
    font-size: 0.72rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  .modal-steps span.active {
    background: #173f3d;
    color: white;
  }
  .modal-step {
    display: grid;
    gap: 1rem;
  }
  .modal-copy {
    margin: 0;
    color: #5a6664;
    line-height: 1.8;
    font-family: var(--font-body);
  }
  .selected-range,
  .selected-summary {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
    padding: 1rem;
    border-radius: 1.25rem;
    background: white;
    border: 1px solid #ece3d5;
  }
  .selected-summary--single {
    grid-template-columns: 1fr;
  }
  .selected-range span,
  .selected-summary span,
  .modal-form label span,
  .modal-form__field span {
    display: block;
    margin-bottom: 0.35rem;
    color: #7a817e;
    font-family: var(--font-body);
    font-size: 0.68rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }
  .required-mark {
    color: #b85c38;
    font-style: normal;
  }
  .selected-range strong,
  .selected-summary strong {
    color: #173330;
    font-size: 0.95rem;
  }
  .modal-form {
    gap: 0.9rem;
  }
  .hp-field {
    position: absolute;
    left: -9999px;
    width: 1px;
    height: 1px;
    overflow: hidden;
    opacity: 0;
    pointer-events: none;
  }
  .modal-form label {
    display: grid;
    gap: 0.4rem;
  }
  .modal-form__field {
    display: grid;
    gap: 0.4rem;
  }
  .modal-form__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.9rem;
  }
  .modal-select {
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    border: 1px solid #ddd4c7;
    background: white;
    color: #173330;
  }
  .modal-form input,
  .modal-form textarea {
    width: 100%;
    padding: 0.95rem 1rem;
    border-radius: 1rem;
    border: 1px solid #ddd4c7;
    background: white;
    color: #173330;
    font-family: var(--font-body);
    outline: none;
  }
  .modal-actions {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding-top: 0.5rem;
  }
  @media (max-width: 900px) {
    .gallery-stage {
      min-height: 360px;
    }
    .viewer-shell {
      padding: 1rem;
    }
    .viewer-stage,
    .viewer-image {
      min-height: 62vh;
    }
  }
  @media (max-width: 640px) {
    .hero-shell {
      height: 370px !important;
    }
    .hero-shell > .relative.z-10 {
      padding-top: 7.2rem;
      justify-content: flex-start;
      padding-bottom: 1.4rem;
    }
    .hero-title {
      font-size: 3rem;
      line-height: 0.98;
    }
    .hero-sub {
      font-size: 0.86rem !important;
      line-height: 1.7 !important;
      max-width: 30ch;
    }
    .breadcrumb-bar {
      padding-top: 0.9rem;
      padding-bottom: 0.9rem;
      font-size: 0.68rem;
      overflow-x: auto;
      white-space: nowrap;
      scrollbar-width: none;
    }
    .breadcrumb-bar::-webkit-scrollbar {
      display: none;
    }
    .bg-white.py-20 {
      padding-top: 1.7rem !important;
      padding-bottom: 4.5rem !important;
    }
    .gallery-shell {
      gap: 0.85rem;
    }
    .gallery-stage {
      min-height: 0;
      aspect-ratio: 1 / 0.82;
      border-radius: 1.4rem;
    }
    .gallery-thumb img {
      height: 4.75rem;
    }
    .flex.flex-wrap.gap-3 {
      display: grid;
      grid-template-columns: 1fr;
    }
    .flex.flex-wrap.gap-3 .btn-primary,
    .flex.flex-wrap.gap-3 .btn-ghost-teal {
      width: 100%;
      justify-content: center;
    }
    .selected-range,
    .selected-summary {
      grid-template-columns: 1fr;
    }
    .modal-form__grid {
      grid-template-columns: 1fr;
    }
    .price-season-table {
      grid-template-columns: minmax(0, 1fr) auto;
    }
    .price-season-table__head:first-child {
      grid-column: 1 / -1;
    }
    .price-season-table__head:nth-child(2) {
      display: none;
    }
    .price-season-table__head,
    .price-season-table__cell {
      padding: 0.9rem 1rem;
    }
    .price-season-table__cell:nth-child(odd) {
      grid-column: 1;
    }
    .price-season-table__cell:nth-child(even) {
      grid-column: 2;
    }
    .price-season-table__cell--strong {
      text-align: right;
      white-space: nowrap;
    }
    .details-grid {
      grid-template-columns: 1fr;
    }
    .modal-actions {
      flex-direction: column;
    }
    .modal-card {
      padding: 1.1rem;
      border-radius: 1.4rem;
    }
    .gallery-zoom-hint {
      left: 0.75rem;
      bottom: 0.75rem;
      font-size: 0.57rem;
    }
    .viewer-card {
      padding: 0.85rem;
      border-radius: 1.35rem;
      margin-top: 3.1rem;
    }
    .viewer-close {
      top: 0.85rem;
      right: 0.85rem;
      width: 2.4rem;
      height: 2.4rem;
    }
    .viewer-nav {
      width: 2.7rem;
      height: 2.7rem;
    }
    .viewer-nav--left {
      left: 0.65rem;
    }
    .viewer-nav--right {
      right: 0.65rem;
    }
    .viewer-stage,
    .viewer-image {
      min-height: 48vh;
    }
    .viewer-meta {
      flex-direction: column;
      align-items: flex-start;
    }
    .viewer-thumbs {
      grid-auto-columns: minmax(7.6rem, 9rem);
    }
    .viewer-thumb img {
      height: 5.25rem;
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
