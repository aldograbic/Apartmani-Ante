<script>
  export let apartment;
  export let index = 0;
</script>

<a
  href={apartment.href}
  class="card group block text-white no-underline"
  style="--i: {index}"
>
  <div
    class="card__visual relative overflow-hidden bg-[#0a2220] shadow-[0_24px_60px_rgba(8,26,24,0.16)]"
  >
    <img
      src={apartment.image}
      alt={apartment.name}
      class="card__img absolute inset-0 h-full w-full object-cover"
      loading="lazy"
    />
    <div class="card__scrim absolute inset-0"></div>

    <div
      class="card__top absolute inset-x-0 top-0 z-[2] flex items-start justify-between p-4 md:p-5"
    >
      <span class="card__num">0{index + 1}</span>
      <span
        class="card__price rounded-full border border-white/15 bg-[#071513]/65 px-3 py-1.5 text-white shadow-[0_8px_20px_rgba(7,21,19,0.18)] backdrop-blur-md"
      >
        {apartment.price}
      </span>
    </div>

    <div class="card__overlay absolute inset-x-0 bottom-0 z-[2] p-4 md:p-5">
      <div class="card__tags mb-3 flex flex-wrap gap-2">
        {#each apartment.tags as tag}
          <span
            class="card__tag rounded-full border border-[#8fd5cc]/20 bg-[#8fd5cc]/10 px-2.5 py-1"
          >
            {tag}
          </span>
        {/each}
      </div>

      <h3 class="card__title">{apartment.name}</h3>

      <div class="card__reveal">
        <p class="card__desc">{apartment.description}</p>
        <span class="card__cta inline-flex items-center gap-2">
          Saznajte više
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

<style lang="less">
  @import "../../lib/styles/variables.less";

  .card {
    display: block;
    text-decoration: none;
    color: white;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    animation: cardIn 0.65s @ease-out calc(var(--i) * 110ms) both;

    &:nth-child(2) .card__visual {
      aspect-ratio: 3/4;
    }

    &:hover {
      .card__img {
        transform: scale(1.06);
        filter: brightness(0.82);
      }

      .card__reveal {
        opacity: 1;
        max-height: 180px;
        transform: translateY(0);
      }

      .card__scrim {
        opacity: 1;
      }

      .card__overlay {
        padding-bottom: 2.25rem;
      }

      .card__top {
        opacity: 0.72;
      }

      .card__num {
        color: @sea-light;
      }

      .card__cta {
        gap: 0.7rem;
        border-color: @sea-light;
      }
    }

    &__visual {
      position: relative;
      aspect-ratio: 2/3;
      overflow: hidden;
      background: #0a2220;
    }

    &__img {
      transition:
        transform 0.85s cubic-bezier(0.25, 0.46, 0.45, 0.94),
        filter 0.5s ease;
    }

    &__scrim {
      background: linear-gradient(
        to top,
        rgba(8, 26, 24, 0.97) 0%,
        rgba(8, 26, 24, 0.58) 42%,
        rgba(8, 26, 24, 0.08) 68%,
        transparent 100%
      );
      opacity: 0.84;
      transition: opacity 0.5s ease;
    }

    &__top {
      transition: opacity 0.3s ease;
    }

    &__num {
      font-family: @font-body;
      font-size: 0.62rem;
      font-weight: 600;
      letter-spacing: 0.22em;
      color: rgba(255, 255, 255, 0.48);
      font-variant-numeric: tabular-nums;
      transition: color 0.25s;
    }

    &__price,
    &__tag,
    &__cta {
      font-family: @font-body;
    }

    &__price {
      font-size: 0.68rem;
      font-weight: 500;
      letter-spacing: 0.08em;
    }

    &__tag {
      font-size: 0.58rem;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: @sea-light;
    }

    &__title {
      font-family: @font-display;
      font-size: clamp(1.5rem, 2.4vw, 1.9rem);
      font-weight: 400;
      color: white;
      line-height: 1.08;
      letter-spacing: -0.01em;
    }

    &__reveal {
      overflow: hidden;
      max-height: 0;
      opacity: 0;
      transform: translateY(10px);
      transition:
        max-height 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94),
        opacity 0.38s ease 0.06s,
        transform 0.38s @ease-out 0.06s;
    }

    &__desc {
      font-family: @font-body;
      font-size: 0.8rem;
      font-weight: 300;
      color: rgba(255, 255, 255, 0.66);
      line-height: 1.65;
      margin-top: 0.8rem;
      margin-bottom: 1rem;
    }

    &__cta {
      font-size: 0.68rem;
      font-weight: 500;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: @sea-light;
      border-bottom: 1px solid rgba(184, 216, 216, 0.3);
      padding-bottom: 0.12rem;
      transition:
        gap 0.25s @ease-out,
        border-color 0.25s;
    }
  }

  @keyframes cardIn {
    from {
      opacity: 0;
      transform: translateY(22px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    .card {
      &:nth-child(2) .card__visual {
        aspect-ratio: 2/3;
      }

      &__title {
        font-size: 1.72rem;
      }
    }
  }
</style>
