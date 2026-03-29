<script>
  const year = new Date().getFullYear();

  const links = [
    { href: "/", label: "Početna" },
    { href: "/apartmani", label: "Naši apartmani" },
    { href: "/o-nama", label: "O nama" },
    { href: "/kontakt", label: "Kontakt" },
  ];
</script>

<footer class="mt-auto bg-[#091e1c] text-white">
  <!-- Top body -->
  <div class="py-20 pb-16">
    <div class="footer__inner w-[var(--container)] mx-auto">
      <!-- Brand col -->
      <div class="flex flex-col gap-2">
        <span
          class="font-display text-[1.75rem] font-light leading-none tracking-[0.01em] text-white"
        >
          Apartmani Ante
        </span>
        <span
          class="font-body text-[0.58rem] tracking-[0.22em] uppercase text-white/30 mb-2"
        >
          Makarska · Hrvatska
        </span>
        <p
          class="font-display text-[0.95rem] italic font-light text-white/40 mb-5"
        >
          "Vaša udobnost, naša misija."
        </p>

        <div class="w-8 h-px bg-white/10 mb-4"></div>

        <a
          href="https://www.facebook.com/apartman.makarska.18"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center gap-2.5 font-body text-[0.78rem] text-white/40 no-underline w-fit transition-colors duration-200 hover:text-white/80 group"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="opacity-50 group-hover:opacity-100 transition-opacity duration-200"
          >
            <path
              d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
            />
          </svg>
          Facebook
        </a>
      </div>

      <!-- Nav col -->
      <nav class="flex flex-col gap-0">
        <span
          class="block font-body text-[0.55rem] font-medium tracking-[0.24em] uppercase text-white/25 mb-5"
        >
          Stranice
        </span>
        {#each links as link}
          <a
            href={link.href}
            class="font-body text-[0.875rem] font-light text-white/55 no-underline w-fit py-[0.4rem] transition-colors duration-200 hover:text-white border-b border-white/5 last:border-0"
          >
            {link.label}
          </a>
        {/each}
      </nav>

      <!-- Contact col -->
      <div class="flex flex-col gap-0">
        <span
          class="block font-body text-[0.55rem] font-medium tracking-[0.24em] uppercase text-white/25 mb-5"
        >
          Kontakt
        </span>

        <a
          href="mailto:apartmani.ante01@gmail.com"
          class="font-body text-[0.8rem] font-light text-white/55 no-underline w-fit mb-4 transition-colors duration-200 hover:text-white break-all"
        >
          apartmani.ante01@gmail.com
        </a>

        <address
          class="not-italic font-body text-[0.875rem] font-light text-white/35 leading-[1.8] mb-6"
        >
          Kotromanića 9<br />21300 Makarska, Hrvatska
        </address>

        <a href="/kontakt" class="footer__reserve">
          Rezervirajte odmor
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </a>
      </div>
    </div>
  </div>

  <!-- Bottom bar -->
  <div class="border-t border-white/[0.06] py-5">
    <div
      class="w-[var(--container)] mx-auto flex items-center justify-between gap-4 flex-wrap font-body text-[0.68rem] text-white/45"
    >
      <span>© {year} Apartmani Ante. Sva prava pridržana.</span>
      <span class="flex items-center gap-1.5">
        <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 1C5.239 1 3 3.239 3 6c0 3.75 5 9 5 9s5-5.25 5-9c0-2.761-2.239-5-5-5z"
            fill="currentColor"
            opacity=".4"
          />
        </svg>
        Makarska, Dalmacija
      </span>
    </div>
  </div>
</footer>

<style lang="less">
  @import "../../lib/styles/variables.less";

  .footer__inner {
    display: grid;
    grid-template-columns: 1.8fr 1fr 1.6fr;
    gap: 4rem;

    @media (max-width: 860px) {
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
    }
    @media (max-width: 540px) {
      grid-template-columns: 1fr;
      gap: 2.5rem;
    }
  }

  .footer__reserve {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-family: @font-body;
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: @sea-light;
    text-decoration: none;
    border-bottom: 1px solid rgba(184, 216, 216, 0.2);
    padding-bottom: 0.2rem;
    width: fit-content;
    transition:
      border-color 0.2s,
      gap 0.25s @ease-out;

    &:hover {
      border-color: @sea-light;
      gap: 0.7rem;
    }
  }
</style>
