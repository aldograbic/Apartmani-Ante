<script>
  import { env as publicEnv } from "$env/dynamic/public";
  import "../app.less";
  import "../app.css";
  import Navbar from "$lib/components/Navbar.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import { apartments } from "$lib/data/apartments.js";
  import { buildSeo, SITE } from "$lib/seo.js";
  import { onMount } from "svelte";
  import { afterNavigate } from "$app/navigation";
  import { page } from "$app/stores";

  $: siteOrigin = publicEnv.PUBLIC_SITE_URL || $page.url.origin;
  $: isPrivateRoute =
    $page.url.pathname === "/login" || $page.url.pathname.startsWith("/dashboard");
  $: seo = buildSeo({
    pathname: $page.url.pathname,
    origin: siteOrigin,
    data: {
      ...$page.data,
      apartments: $page.url.pathname === "/apartmani" ? apartments : $page.data.apartments,
    },
  });
  $: schemaScripts = seo.schema.map((item) => JSON.stringify(item));

  onMount(() => {
    // Navbar scroll effect
    const header = document.querySelector(".navbar");
    if (!header) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.scrollY > 40) {
            header.classList.add("scrolled");
          } else {
            header.classList.remove("scrolled");
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  });

  afterNavigate(() => {
    window.scrollTo(0, 0);
  });
</script>

<svelte:head>
  <title>{seo.title}</title>
  <meta name="description" content={seo.description} />
  <meta name="robots" content={seo.robots} />
  <meta name="author" content={SITE.legalName} />
  <meta name="referrer" content="strict-origin-when-cross-origin" />
  <meta name="format-detection" content="telephone=no" />
  <meta property="og:site_name" content={SITE.legalName} />
  <meta property="og:locale" content={SITE.locale} />
  <meta property="og:type" content={seo.type} />
  <meta property="og:title" content={seo.title} />
  <meta property="og:description" content={seo.description} />
  <meta property="og:url" content={seo.canonical} />
  <meta property="og:image" content={seo.image} />
  <meta property="og:image:alt" content={seo.title} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={seo.title} />
  <meta name="twitter:description" content={seo.description} />
  <meta name="twitter:image" content={seo.image} />
  <link rel="canonical" href={seo.canonical} />
  {#each schemaScripts as schema}
    <script type="application/ld+json">{schema}</script>
  {/each}
</svelte:head>

{#if !isPrivateRoute}
  <Navbar />
{/if}

<main class:main-content={!isPrivateRoute} class:private-content={isPrivateRoute}>
  <slot />
</main>

{#if !isPrivateRoute}
  <Footer />
{/if}

<style lang="less">
  .main-content {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #f5f3ef;
  }

  .private-content {
    min-height: 100vh;
  }
</style>
