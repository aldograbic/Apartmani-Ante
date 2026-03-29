<script>
  import { page } from "$app/stores";

  let menuOpen = false;

  const navLinks = [
    { href: "/", label: "Početna" },
    { href: "/apartmani", label: "Apartmani" },
    { href: "/o-nama", label: "O nama" },
    { href: "/kontakt", label: "Kontakt" },
  ];

  function toggleMenu() {
    menuOpen = !menuOpen;
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }

  function closeMenu() {
    menuOpen = false;
    document.body.style.overflow = "";
  }
</script>

<header
  class="navbar fixed top-0 left-0 right-0 z-[200] pt-5 transition-all duration-500"
  class:menu-open={menuOpen}
>
  <div class="navbar__pill mx-auto flex items-center justify-between gap-6">
    <!-- Logo -->
    <a
      href="/"
      class="flex flex-col gap-[2px] no-underline shrink-0"
      on:click={closeMenu}
    >
      <span class="navbar__logo-main">Apartmani Ante</span>
      <span class="navbar__logo-sub">Makarska · Hrvatska</span>
    </a>

    <!-- Nav desktop -->
    <nav class="navbar__nav" class:open={menuOpen}>
      <div class="navbar__mobile-head">
        <span class="navbar__mobile-title">Apartmani Ante</span>
        <button
          class="navbar__close-btn"
          on:click={closeMenu}
          aria-label="Zatvori"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M4 4l10 10M14 4L4 14"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </div>

      {#each navLinks as link}
        <a
          href={link.href}
          class="navbar__link"
          class:active={$page.url.pathname === link.href ||
            (link.href !== "/" && $page.url.pathname.startsWith(link.href))}
          on:click={closeMenu}
        >
          {link.label}
        </a>
      {/each}

      <a href="/kontakt" class="navbar__cta" on:click={closeMenu}>Rezerviraj</a>
    </nav>

    <!-- Burger -->
    <button
      class="navbar__burger"
      class:open={menuOpen}
      on:click={toggleMenu}
      aria-label="Izbornik"
    >
      <span></span>
      <span></span>
    </button>
  </div>
</header>

{#if menuOpen}
  <div
    class="fixed inset-0 bg-black/30 backdrop-blur-sm z-[150]"
    on:click={closeMenu}
    role="presentation"
  ></div>
{/if}

<style lang="less">
  @import "../../lib/styles/variables.less";

  // ── Pill container ─────────────────────────────────────────────
  .navbar__pill {
    max-width: 900px;
    width: calc(100% - 3rem);
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    // Border barely visible on dark — just enough to feel intentional, not like a sticker
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 9999px;
    padding: 0.65rem 0.75rem 0.65rem 1.5rem;
    // Shadow does the separation work instead of the border
    box-shadow:
      0 4px 24px rgba(0, 0, 0, 0.18),
      0 1px 2px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
    transition:
      background 0.4s ease,
      box-shadow 0.4s ease,
      border-color 0.4s ease;
  }

  // ── Scrolled state ─────────────────────────────────────────────
  :global(.navbar.scrolled) .navbar__pill {
    background: rgba(255, 255, 255, 0.82);
    // No border when scrolled — shadow handles the separation cleanly
    border-color: transparent;
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.1),
      0 2px 8px rgba(0, 0, 0, 0.07);

    .navbar__logo-main {
      color: @sea-dark;
    }
    .navbar__logo-sub {
      color: @charcoal-soft;
    }

    .navbar__link {
      color: @charcoal-mid;
      &:hover,
      &.active {
        color: @sea-dark;
      }
    }

    .navbar__cta {
      background: @sea-dark;
      border-color: @sea-dark;
      color: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      &:hover {
        background: @sea-deep;
        border-color: @sea-deep;
      }
    }

    .navbar__burger span {
      background: @charcoal;
    }
  }

  // ── Logo ───────────────────────────────────────────────────────
  .navbar__logo-main {
    font-family: @font-display;
    font-size: 1.15rem;
    font-weight: 500;
    color: white;
    letter-spacing: 0.01em;
    line-height: 1;
    transition: color 0.35s;
  }
  .navbar__logo-sub {
    font-family: @font-body;
    font-size: 0.55rem;
    font-weight: 400;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.5);
    transition: color 0.35s;
  }

  // ── Nav ───────────────────────────────────────────────────────
  .navbar__nav {
    display: flex;
    align-items: center;
    gap: 0.25rem;

    .navbar__mobile-head {
      display: none;
    }

    @media (max-width: 768px) {
      position: fixed;
      top: 5.5rem;
      left: 1rem;
      right: 1rem;
      width: auto;
      max-width: none;
      height: fit-content;
      max-height: calc(100vh - 6.5rem);
      background: rgba(255, 255, 255, 0.88);
      backdrop-filter: blur(32px) saturate(200%);
      -webkit-backdrop-filter: blur(32px) saturate(200%);
      border: 1px solid rgba(255, 255, 255, 0.6);
      border-radius: 24px;
      box-shadow:
        0 20px 60px rgba(0, 0, 0, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      padding: 1.5rem 1.75rem 2rem;
      gap: 0;
      transform: translateY(-0.75rem) scale(0.98);
      transform-origin: top center;
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transition:
        transform 0.35s cubic-bezier(0.32, 0.72, 0, 1),
        opacity 0.25s ease,
        visibility 0.25s ease;
      z-index: 250;
      overflow-y: auto;
      overscroll-behavior: contain;

      &.open {
        transform: translateY(0) scale(1);
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
      }

      .navbar__mobile-head {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 1.5rem;
        margin-bottom: 0.5rem;
        border-bottom: 1px solid rgba(0, 0, 0, 0.07);
      }
    }
  }

  .navbar__mobile-title {
    font-family: @font-display;
    font-size: 1rem;
    font-weight: 500;
    color: @sea-dark;
  }

  .navbar__close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.05);
    color: @charcoal-soft;
    cursor: pointer;
    transition:
      background 0.2s,
      color 0.2s;
    &:hover {
      background: rgba(0, 0, 0, 0.1);
      color: @charcoal;
    }
  }

  // ── Links ──────────────────────────────────────────────────────
  .navbar__link {
    font-family: @font-body;
    font-size: 0.78rem;
    font-weight: 400;
    letter-spacing: 0.04em;
    color: rgba(255, 255, 255, 0.85);
    text-decoration: none;
    padding: 0.4rem 0.75rem;
    border-radius: 9999px;
    transition:
      color 0.2s,
      background 0.2s;

    &:hover {
      color: white;
      background: rgba(255, 255, 255, 0.12);
    }
    &.active {
      color: white;
      background: rgba(255, 255, 255, 0.15);
    }

    @media (max-width: 768px) {
      font-family: @font-display;
      font-size: 1.35rem;
      font-weight: 300;
      font-style: italic;
      color: @charcoal;
      padding: 0.8rem 0;
      width: 100%;
      border-radius: 0;
      background: transparent !important;
      letter-spacing: 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);

      &:hover {
        color: @sea-dark;
      }
      &.active {
        color: @sea-dark;
      }
    }
  }

  // ── CTA ────────────────────────────────────────────────────────
  .navbar__cta {
    display: inline-flex;
    align-items: center;
    padding: 0.55rem 1.2rem;
    background: rgba(255, 255, 255, 0.14);
    border: 1px solid rgba(255, 255, 255, 0.22);
    border-radius: 9999px;
    color: white;
    font-family: @font-body;
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    text-decoration: none;
    backdrop-filter: blur(8px);
    margin-left: 0.5rem;
    transition:
      background 0.25s,
      border-color 0.25s,
      transform 0.2s,
      box-shadow 0.25s;
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.1);

    &:hover {
      background: rgba(255, 255, 255, 0.24);
      border-color: rgba(255, 255, 255, 0.4);
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.14);
    }

    @media (max-width: 768px) {
      margin-top: 1.75rem;
      margin-left: 0;
      padding: 0.8rem 1.6rem;
      font-size: 0.75rem;
      align-self: flex-start;
      background: @sea-dark;
      border-color: @sea-dark;
      backdrop-filter: none;
      color: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
    }
  }

  // ── Burger ─────────────────────────────────────────────────────
  .navbar__burger {
    display: none;
    flex-direction: column;
    gap: 5px;
    width: 36px;
    height: 36px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: background 0.2s;
    flex-shrink: 0;
    z-index: 300;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    span {
      display: block;
      height: 1.5px;
      background: white;
      border-radius: 2px;
      transition: all 0.35s cubic-bezier(0.32, 0.72, 0, 1);
      transform-origin: center;

      &:first-child {
        width: 16px;
      }
      &:last-child {
        width: 11px;
      }
    }

    &.open span:first-child {
      transform: translateY(3.25px) rotate(45deg);
      width: 16px;
    }
    &.open span:last-child {
      transform: translateY(-3.25px) rotate(-45deg);
      width: 16px;
    }

    @media (max-width: 768px) {
      display: flex;
    }
  }

  @media (max-width: 768px) {
    :global(.navbar.menu-open) .navbar__burger {
      opacity: 0;
      pointer-events: none;
    }
  }
</style>
