<script>
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";
  import Select from "$lib/components/Select.svelte";

  export let form;

  const apartmanItems = [
    { value: "", label: "— Odaberite apartman —" },
    { value: "Apartman 1", label: "Apartman 1" },
    { value: "Apartman 2", label: "Apartman 2" },
    { value: "Studio apartman", label: "Studio apartman" },
    { value: "Nisam siguran/a", label: "Nisam siguran/a" },
  ];

  const osobeItems = [
    { value: "", label: "— Odaberite —" },
    { value: "1 osoba", label: "1 osoba" },
    { value: "2 osobe", label: "2 osobe" },
    { value: "3 osobe", label: "3 osobe" },
    { value: "4 osobe", label: "4 osobe" },
    { value: "5 osoba", label: "5 osoba" },
  ];

  let apartmanOption = apartmanItems[0];
  let osobeOption = osobeItems[0];

  let contactForm = {
    ime: "",
    prezime: "",
    email: "",
    telefon: "",
    apartman: "",
    dolazak: "",
    odlazak: "",
    osobe: "",
    poruka: "",
  };

  let sent = false;
  let sending = false;
  let lastSuccessMessage = "";

  function resetContactForm() {
    contactForm = {
      ime: "",
      prezime: "",
      email: "",
      telefon: "",
      apartman: "",
      dolazak: "",
      odlazak: "",
      osobe: "",
      poruka: "",
    };
    apartmanOption = apartmanItems[0];
    osobeOption = osobeItems[0];
  }

  $: contactForm.apartman = apartmanOption?.value || "";
  $: contactForm.osobe = osobeOption?.value || "";

  $: {
    const apartmanFromQuery = $page.url.searchParams.get("apartman");
    if (apartmanFromQuery) {
      const mapping = {
        "apartman-1": "Apartman 1",
        "apartman-2": "Apartman 2",
        studio: "Studio apartman",
      };

      const mapped = mapping[apartmanFromQuery] || "";
      contactForm.apartman = mapped;
      apartmanOption =
        apartmanItems.find((item) => item.value === mapped) || apartmanItems[0];
    }
  }

  $: if (form?.successMessage && form.successMessage !== lastSuccessMessage) {
    lastSuccessMessage = form.successMessage;
    sent = true;
    sending = false;
    resetContactForm();
  }
</script>

<!-- ══════════════════════════════════════ HERO ══ -->
<section class="hero-shell relative" style="height: clamp(380px, 48vw, 560px)">
  <div class="hero-bg absolute inset-0">
    <img
      src="img/apartmani-makarska-more-obala.webp"
      alt="Odmor uz more"
      class="h-full w-full object-cover object-[center_40%] hero-img"
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
      Javite nam se
    </p>
    <h1 class="hero-title text-white leading-[1.0] tracking-[-0.01em] mb-5">
      Kontakt &<br />
      <em class="text-[#c8a97e]">Rezervacija</em>
    </h1>
    <p
      class="hero-sub max-w-[40ch] text-white/55 leading-relaxed text-[0.92rem]"
    >
      Ispunite formu i javit ćemo vam se u roku 24 sata.
    </p>
  </div>
</section>

<!-- ══════════════════════════ CONTENT ══ -->
<section class="bg-[#faf8f5] py-28 md:py-40">
  <div class="mx-auto max-w-[1200px] px-8 md:px-16">
    <div class="grid md:grid-cols-[1.3fr_1fr] gap-16 items-start">
      <!-- ── Form ── -->
      <div>
        {#if sent}
          <div class="text-center py-20 border border-[#e6dcc8] bg-white px-8">
            <div
              class="w-14 h-14 rounded-full bg-[#1e5c5a] text-white flex items-center justify-center mx-auto mb-6"
            >
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12l5 5L19 7"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <h2 class="text-[#1e5c5a] mb-3 success-heading">
              Poruka primljena!
            </h2>
            <p
              class="text-[#8a8a80] text-[0.88rem] leading-relaxed mb-10 max-w-xs mx-auto"
              style="font-family: var(--font-body)"
            >
              Hvala vam na upitu. Javit ćemo vam se u najkraćem mogućem roku.
            </p>
            <button
              on:click={() => {
                sent = false;
                resetContactForm();
              }}
              class="btn-primary"
            >
              Pošalji novu poruku
            </button>
          </div>
        {:else}
          <div class="mb-10">
            <p
              class="flex items-center gap-3 text-[0.58rem] tracking-[0.28em] uppercase text-[#3d7a7c] mb-4"
            >
              <span class="h-px w-6 bg-[#3d7a7c]"></span>
              Upit / Rezervacija
            </p>
            <h2
              class="text-[#1a2e2c] leading-tight tracking-[-0.02em] form-heading"
            >
              Pišite nam
            </h2>
            <p
              class="text-[#8a8a80] text-[0.88rem] mt-2"
              style="font-family: var(--font-body)"
            >
              Odgovaramo u roku 24 sata.
            </p>
          </div>

          <form
            method="POST"
            class="space-y-5"
            use:enhance={() => {
              sending = true;
              sent = false;

              return async ({ update }) => {
                await update();
                sending = false;
              };
            }}
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
            <input
              type="hidden"
              name="apartman"
              value={apartmanOption?.value || ""}
            />
            <input
              type="hidden"
              name="osobe"
              value={osobeOption?.value || ""}
            />
            <div class="grid grid-cols-2 gap-4">
              <div class="form-group">
                <label for="ime">Ime <span class="req">*</span></label>
                <input
                  id="ime"
                  type="text"
                  name="ime"
                  bind:value={contactForm.ime}
                  required
                  placeholder="Vaše ime"
                />
              </div>
              <div class="form-group">
                <label for="prezime">Prezime <span class="req">*</span></label>
                <input
                  id="prezime"
                  type="text"
                  name="prezime"
                  bind:value={contactForm.prezime}
                  required
                  placeholder="Vaše prezime"
                />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="form-group">
                <label for="email">Email <span class="req">*</span></label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  bind:value={contactForm.email}
                  required
                  placeholder="email@primjer.com"
                />
              </div>
              <div class="form-group">
                <label for="telefon">Telefon</label>
                <input
                  id="telefon"
                  type="tel"
                  name="telefon"
                  bind:value={contactForm.telefon}
                  placeholder="+385 91 234 5678"
                />
              </div>
            </div>
            <div class="form-group">
              <label for="apartman">Apartman</label>
              <div class="form-select">
                <Select
                  bind:value={apartmanOption}
                  items={apartmanItems}
                  placeholder="— Odaberite apartman —"
                  variant="light"
                  clearable={false}
                  searchable={false}
                />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="form-group">
                <label for="dolazak">Datum dolaska</label>
                <input
                  id="dolazak"
                  type="date"
                  name="dolazak"
                  bind:value={contactForm.dolazak}
                />
              </div>
              <div class="form-group">
                <label for="odlazak">Datum odlaska</label>
                <input
                  id="odlazak"
                  type="date"
                  name="odlazak"
                  bind:value={contactForm.odlazak}
                />
              </div>
            </div>
            <div class="form-group">
              <label for="osobe">Broj osoba</label>
              <div class="form-select">
                <Select
                  bind:value={osobeOption}
                  items={osobeItems}
                  placeholder="— Odaberite —"
                  variant="light"
                  clearable={false}
                  searchable={false}
                />
              </div>
            </div>
            <div class="form-group">
              <label for="poruka">Poruka</label>
              <textarea
                id="poruka"
                name="poruka"
                bind:value={contactForm.poruka}
                placeholder="Imate li posebnih zahtjeva ili pitanja?"
                rows="4"
              ></textarea>
            </div>

            {#if form?.errorMessage}
              <p class="form-feedback form-feedback--error">{form.errorMessage}</p>
            {/if}

            <button
              type="submit"
              disabled={sending}
              class="submit-btn w-full flex items-center justify-center gap-2.5"
            >
              {#if sending}
                <span class="spinner"></span> Šaljem...
              {:else}
                Pošalji upit
                <svg class="h-4 w-4" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M1 7h12M8 2l5 5-5 5"
                    stroke="currentColor"
                    stroke-width="1.4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              {/if}
            </button>
          </form>
        {/if}
      </div>

      <!-- ── Sidebar ── -->
      <div class="flex flex-col gap-4 md:sticky md:top-28">
        <!-- Contact card -->
        <div class="bg-white border border-[#e6dcc8] p-8">
          <p
            class="flex items-center gap-3 text-[0.58rem] tracking-[0.28em] uppercase text-[#3d7a7c] mb-7"
          >
            <span class="h-px w-6 bg-[#3d7a7c]"></span>
            Kontakt informacije
          </p>
          <div class="space-y-6">
            <div class="flex gap-4 items-start">
              <span
                class="shrink-0 w-9 h-9 rounded-full bg-[#1e5c5a]/[0.08] flex items-center justify-center text-[#1e5c5a]"
              >
                <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M3 5h14l-7 6-7-6zM3 5v10h14V5"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
              <div>
                <span
                  class="block text-[0.58rem] tracking-[0.2em] uppercase text-[#8a8a80] mb-1"
                  style="font-family: var(--font-body)">Email</span
                >
                <a
                  href="mailto:apartmani.ante01@gmail.com"
                  class="text-[0.88rem] text-[#2c5f60] transition-colors hover:text-[#1a3f40]"
                  style="font-family: var(--font-body)"
                  >apartmani.ante01@gmail.com</a
                >
              </div>
            </div>
            <div class="flex gap-4 items-start">
              <span
                class="shrink-0 w-9 h-9 rounded-full bg-[#1e5c5a]/[0.08] flex items-center justify-center text-[#1e5c5a]"
              >
                <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 2C7.24 2 5 4.24 5 7c0 4.25 5 11 5 11s5-6.75 5-11c0-2.76-2.24-5-5-5zm0 6.5A1.5 1.5 0 1110 5a1.5 1.5 0 010 3.5z"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
              <div>
                <span
                  class="block text-[0.58rem] tracking-[0.2em] uppercase text-[#8a8a80] mb-1"
                  style="font-family: var(--font-body)">Adresa</span
                >
                <span
                  class="text-[0.88rem] text-[#5a5a52]"
                  style="font-family: var(--font-body)"
                  >Kotromanića 9<br />21300 Makarska</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Hours -->
        <div class="bg-white border border-[#e6dcc8] p-8">
          <p
            class="flex items-center gap-3 text-[0.58rem] tracking-[0.28em] uppercase text-[#3d7a7c] mb-6"
          >
            <span class="h-px w-6 bg-[#3d7a7c]"></span>
            Dostupnost
          </p>
          <div class="space-y-3">
            {#each [["Ponedjeljak – Petak", "08:00 – 22:00"], ["Subota", "09:00 – 22:00"], ["Nedjelja", "10:00 – 20:00"]] as [day, time]}
              <div
                class="flex justify-between items-center border-b border-[#f0ebe3] pb-3 last:border-0 last:pb-0"
              >
                <span
                  class="text-[0.82rem] text-[#8a8a80]"
                  style="font-family: var(--font-body)">{day}</span
                >
                <span
                  class="text-[0.82rem] font-medium text-[#3a3a32]"
                  style="font-family: var(--font-body)">{time}</span
                >
              </div>
            {/each}
          </div>
        </div>

        <!-- Facebook -->
        <div class="bg-[#091e1c] border border-white/[0.06] p-8">
          <p
            class="flex items-center gap-3 text-[0.58rem] tracking-[0.28em] uppercase text-[#8fd5cc] mb-5"
          >
            <span class="h-px w-6 bg-[#8fd5cc]"></span>
            Pratite nas
          </p>
          <a
            href="https://www.facebook.com/apartman.makarska.18"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-3 text-[0.68rem] tracking-[0.14em] uppercase text-[#8fd5cc] border-b border-[#8fd5cc]/30 pb-0.5 transition-all duration-200 hover:gap-4 hover:border-[#8fd5cc]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
              />
            </svg>
            Facebook stranica
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
          Apartmani
        </p>
        <h2
          class="text-white leading-[1.04] tracking-[-0.025em] mb-4 cta-heading"
        >
          Pogledajte naš<br />smještaj
        </h2>
        <p class="text-white/55 text-[0.9rem] max-w-[38ch] leading-relaxed">
          Tri pažljivo opremljene jedinice — pronađite savršenu za vaš odmor.
        </p>
      </div>
      <div class="flex flex-col items-start md:items-end gap-4 shrink-0">
        <a href="/apartmani" class="btn-cta-white">
          Pogledaj apartmane
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
  .form-heading,
  .success-heading,
  .cta-heading {
    font-family: var(--font-display);
    font-weight: 300;
  }
  .form-heading {
    font-size: clamp(2rem, 3.5vw, 2.8rem);
  }
  .success-heading {
    font-size: clamp(1.8rem, 3vw, 2.4rem);
    color: #1e5c5a;
  }
  .cta-heading {
    font-size: clamp(2.4rem, 5vw, 3.8rem);
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

  // ─── Form ─────────────────────────────────────────────────────────────
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;

    label {
      font-family: var(--font-body);
      font-size: 0.68rem;
      font-weight: 500;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #5a5a52;
    }

    .req {
      color: #c8a97e;
    }

    .form-select {
      padding: 0.2rem 1rem;
      border: 1.5px solid #e6dcc8;
      background: white;
      transition:
        border-color 0.2s,
        box-shadow 0.2s;
    }

    .form-select:focus-within {
      border-color: #1e5c5a;
      box-shadow: 0 0 0 3px rgba(30, 92, 90, 0.08);
    }

    input,
    textarea {
      padding: 0.8rem 1rem;
      border: 1.5px solid #e6dcc8;
      background: white;
      font-family: var(--font-body);
      font-size: 0.9rem;
      color: #3a3a32;
      outline: none;
      transition:
        border-color 0.2s,
        box-shadow 0.2s;
      appearance: none;
      -webkit-appearance: none;

      &::placeholder {
        color: #c8c0b4;
      }
      &:focus {
        border-color: #1e5c5a;
        box-shadow: 0 0 0 3px rgba(30, 92, 90, 0.08);
      }
    }

    textarea {
      resize: vertical;
      min-height: 110px;
    }
  }

  // ─── Submit button ─────────────────────────────────────────────────────
  .hp-field {
    position: absolute;
    left: -9999px;
    width: 1px;
    height: 1px;
    overflow: hidden;
    opacity: 0;
    pointer-events: none;
  }

  .submit-btn {
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
    &:hover:not(:disabled) {
      background: var(--sea-dark, #154240);
      transform: translateY(-2px);
      box-shadow: 0 16px 40px rgba(30, 92, 90, 0.3);
    }
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  // ─── Buttons ──────────────────────────────────────────────────────────
  .form-feedback {
    padding: 0.9rem 1rem;
    border: 1px solid #ead3cd;
    background: #fff7f4;
    color: #9a4a36;
    font-family: var(--font-body);
    font-size: 0.85rem;
    line-height: 1.6;
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

  // ─── Spinner ──────────────────────────────────────────────────────────
  .spinner {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 1.5px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
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
