<script>
  export let form;
</script>

<section class="login-shell">
  <div class="login-shell__glow login-shell__glow--one"></div>
  <div class="login-shell__glow login-shell__glow--two"></div>

  <div class="login-card">
    <p class="login-card__eyebrow">Privatni pristup vlasnika</p>
    <h1>Prijavite se u svoju kontrolnu ploču</h1>
    <p class="login-card__copy">
      Upotrijebite svoje privatne podatke za pristup pregledu rezervacija i
      upravljanju smještajem.
    </p>

    <form method="POST" class="login-form">
      <div class="hp-field" aria-hidden="true">
        <label>
          <span>Company</span>
          <input name="company" type="text" tabindex="-1" autocomplete="off" />
        </label>
      </div>

      <label class="login-field">
        <span>Korisničko ime</span>
        <input
          name="username"
          type="text"
          autocomplete="username"
          value={form?.username ?? ""}
          required
        />
      </label>

      <label class="login-field">
        <span>Lozinka</span>
        <input
          name="password"
          type="password"
          autocomplete="current-password"
          required
        />
      </label>

      {#if form?.error}
        <p class="login-error">{form.error}</p>
      {/if}

      <button type="submit" class="login-submit">Otvori kontrolnu ploču</button>
    </form>
  </div>
</section>

<style lang="less">
  .login-shell {
    position: relative;
    min-height: 100vh;
    display: grid;
    place-items: center;
    overflow: hidden;
    padding: 2rem;
    background: radial-gradient(
        circle at top,
        rgba(143, 213, 204, 0.24),
        transparent 30%
      ),
      linear-gradient(135deg, #071513 0%, #0f2b29 48%, #f1e4cf 100%);
  }

  .login-shell__glow {
    position: absolute;
    border-radius: 999px;
    filter: blur(80px);
    opacity: 0.6;
    pointer-events: none;
  }

  .login-shell__glow--one {
    top: 10%;
    left: -5%;
    width: 18rem;
    height: 18rem;
    background: rgba(200, 169, 126, 0.22);
  }

  .login-shell__glow--two {
    right: -4rem;
    bottom: 8%;
    width: 20rem;
    height: 20rem;
    background: rgba(143, 213, 204, 0.2);
  }

  .login-card {
    position: relative;
    z-index: 1;
    width: min(100%, 30rem);
    padding: 2.5rem;
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 1.75rem;
    background: rgba(7, 21, 19, 0.65);
    color: white;
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.28);
    backdrop-filter: blur(22px);
  }

  .login-card__eyebrow {
    margin: 0 0 1rem;
    font-size: 0.7rem;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.58);
  }

  .login-card h1 {
    margin: 0;
    font-size: clamp(2rem, 5vw, 3rem);
    line-height: 1;
    color: #f7f3ec;
  }

  .login-card__copy {
    margin: 1rem 0 0;
    max-width: 32ch;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.7;
  }

  .login-form {
    display: grid;
    gap: 1rem;
    margin-top: 2rem;
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

  .login-field {
    display: grid;
    gap: 0.55rem;
  }

  .login-field span {
    font-size: 0.75rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.62);
  }

  .login-field input {
    width: 100%;
    padding: 0.95rem 1rem;
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 0.95rem;
    background: rgba(255, 255, 255, 0.08);
    color: white;
    outline: none;
    transition:
      border-color 0.2s ease,
      background 0.2s ease,
      transform 0.2s ease;
  }

  .login-field input:focus {
    border-color: rgba(143, 213, 204, 0.75);
    background: rgba(255, 255, 255, 0.12);
    transform: translateY(-1px);
  }

  .login-error {
    margin: 0;
    padding: 0.85rem 1rem;
    border-radius: 0.9rem;
    background: rgba(183, 59, 59, 0.16);
    border: 1px solid rgba(255, 139, 139, 0.24);
    color: #ffd7d7;
  }

  .login-submit {
    margin-top: 0.5rem;
    padding: 1rem 1.2rem;
    border: none;
    border-radius: 999px;
    background: linear-gradient(135deg, #d5b182 0%, #b88c57 100%);
    color: #0d1715;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    cursor: pointer;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
    box-shadow: 0 14px 30px rgba(184, 140, 87, 0.3);
  }

  .login-submit:hover {
    transform: translateY(-2px);
    box-shadow: 0 18px 34px rgba(184, 140, 87, 0.4);
  }

  @media (max-width: 640px) {
    .login-card {
      padding: 1.6rem;
      border-radius: 1.25rem;
    }
  }
</style>
