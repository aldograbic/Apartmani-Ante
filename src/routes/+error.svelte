<svelte:head>
  <title>404 – Stranica nije pronađena</title>
</svelte:head>

<div class="min-h-[80vh] flex items-center justify-center px-6 bg-[#faf8f5]">
  <div class="text-center">
    <!-- Large 404 -->
    <p
      class="font-[Cormorant_Garamond] italic font-light text-[#1e5c5a]/10 leading-none select-none mb-4"
      style="font-size: clamp(8rem, 20vw, 16rem)"
    >
      404
    </p>

    <!-- Divider line -->
    <div class="flex items-center justify-center gap-4 mb-8 -mt-4">
      <span class="h-px w-16 bg-[#e6dcc8]"></span>
      <span
        class="font-[DM_Sans] text-[0.6rem] tracking-[0.25em] uppercase text-[#8a8a80]"
        >Stranica nije pronađena</span
      >
      <span class="h-px w-16 bg-[#e6dcc8]"></span>
    </div>

    <h1
      class="font-[Cormorant_Garamond] font-light text-[#2a2a22] mb-4"
      style="font-size: clamp(1.6rem, 3vw, 2.4rem)"
    >
      Izgubili ste se?
    </h1>
    <p
      class="font-[DM_Sans] font-light text-[#8a8a80] text-sm mb-10 max-w-xs mx-auto leading-relaxed"
    >
      Stranica koju tražite ne postoji ili je premještena. Vratite se na početnu
      stranicu.
    </p>
    <a
      href="/"
      class="inline-flex items-center gap-2.5 bg-[#1e5c5a] hover:bg-[#154240] text-white font-[DM_Sans] text-[0.72rem] tracking-[0.1em] uppercase px-8 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_35px_rgba(30,92,90,0.3)] group"
    >
      Povratak na početnu
      <svg
        width="15"
        height="15"
        viewBox="0 0 16 16"
        fill="none"
        class="transition-transform duration-200 group-hover:translate-x-0.5"
      >
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
