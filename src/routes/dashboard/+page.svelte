<script>
  import { enhance } from "$app/forms";
  import BookingCalendar from "$lib/components/BookingCalendar.svelte";

  export let data;
  export let form;

  const dateFormatter = new Intl.DateTimeFormat("hr-HR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  let bookingDrafts = Object.fromEntries(
    data.apartments.map((apartment) => [
      apartment.id,
      {
        checkIn: "",
        checkOut: "",
      },
    ]),
  );

  function formatDate(value) {
    return dateFormatter.format(new Date(`${value}T00:00:00`));
  }

  function countNights(checkIn, checkOut) {
    const start = new Date(`${checkIn}T00:00:00`);
    const end = new Date(`${checkOut}T00:00:00`);

    return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }

  function handleRangeSelect(apartmentId, event) {
    bookingDrafts = {
      ...bookingDrafts,
      [apartmentId]: {
        checkIn: event.detail.checkIn,
        checkOut: event.detail.checkOut,
      },
    };
  }
</script>

<section class="dashboard-shell">
  <div class="dashboard-topbar">
    <div>
      <p class="dashboard-kicker">Kontrolna ploča vlasnika</p>
      <h1>Dobrodošli natrag, {data.user?.username}</h1>
      <p class="dashboard-topbar__copy">
        Ovdje pregledavate rezervacije po apartmanima i brzo uklanjate termine
        ako dođe do otkazivanja.
      </p>
    </div>

    <form method="POST" action="?/logout" use:enhance>
      <button type="submit" class="dashboard-logout">Odjava</button>
    </form>
  </div>

  <div class="dashboard-hero">
    <div>
      <p class="dashboard-hero__eyebrow">Rezervacije pod kontrolom</p>
      <h2>Za svaki apartman imate pregled zauzetih termina u modernom kalendaru.</h2>
      <p>
        Označite raspon datuma na kalendaru kako biste brzo dodali rezervaciju.
        U popisu ispod svakog apartmana možete odmah ukloniti termin ako gost
        otkaže dolazak.
      </p>
    </div>

    <div class="dashboard-hero__stats">
      <div class="stat-pill">
        <span>Apartmani</span>
        <strong>{data.stats.apartmentCount}</strong>
      </div>
      <div class="stat-pill">
        <span>Nadolazeće rezervacije</span>
        <strong>{data.stats.upcomingBookings}</strong>
      </div>
    </div>
  </div>

  {#if form?.bookingError}
    <p class="dashboard-message dashboard-message--error">{form.bookingError}</p>
  {/if}

  {#if form?.bookingSuccess}
    <p class="dashboard-message dashboard-message--success">{form.bookingSuccess}</p>
  {/if}

  <div class="apartment-sections">
    {#each data.apartments as apartment}
      <section class="apartment-panel">
        <div class="apartment-panel__header">
          <div>
            <p class="apartment-panel__eyebrow">{apartment.size} · {apartment.capacity}</p>
            <h3>{apartment.name}</h3>
            <p>{apartment.price}</p>
          </div>
          <a href={apartment.href} class="apartment-panel__link">Javna stranica</a>
        </div>

        <div class="apartment-panel__content">
          <div class="apartment-panel__calendar">
            <BookingCalendar
              bookings={apartment.bookings}
              allowDragSelection={false}
              on:selectrange={(event) => handleRangeSelect(apartment.id, event)}
            />
            <p class="apartment-panel__hint">
              Kliknite datum dolaska pa datum odlaska. Odabrani raspon odmah se
              upisuje u obrazac desno.
            </p>
          </div>

          <div class="apartment-panel__sidebar">
            <form method="POST" action="?/addBooking" class="booking-form" use:enhance>
              <input type="hidden" name="apartmentId" value={apartment.id} />

              <div class="booking-form__grid">
                <label>
                  <span>Dolazak</span>
                  <input
                    type="date"
                    name="checkIn"
                    bind:value={bookingDrafts[apartment.id].checkIn}
                    required
                  />
                </label>

                <label>
                  <span>Odlazak</span>
                  <input
                    type="date"
                    name="checkOut"
                    bind:value={bookingDrafts[apartment.id].checkOut}
                    required
                  />
                </label>
              </div>

              <label>
                <span>Ime gosta</span>
                <input type="text" name="guestName" placeholder="Npr. Ivan Horvat" />
              </label>

              <label>
                <span>Napomena</span>
                <textarea
                  name="note"
                  rows="3"
                  placeholder="Npr. kasni dolazak ili posebni zahtjevi"
                ></textarea>
              </label>

              <button type="submit" class="booking-form__submit">
                Spremi rezervaciju
              </button>
            </form>

            <div class="booking-list">
              <div class="booking-list__header">
                <h4>Upisane rezervacije</h4>
                <span>{apartment.bookings.length}</span>
              </div>

              {#if apartment.bookings.length > 0}
                <div class="booking-list__items">
                  {#each apartment.bookings as booking}
                    <article class="booking-item">
                      <div>
                        <p class="booking-item__dates">
                          {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                        </p>
                        <p class="booking-item__meta">
                          {countNights(booking.checkIn, booking.checkOut)} noći
                          {#if booking.guestName}
                            · {booking.guestName}
                          {/if}
                        </p>
                        {#if booking.note}
                          <p class="booking-item__note">{booking.note}</p>
                        {/if}
                      </div>

                      <form method="POST" action="?/deleteBooking" use:enhance>
                        <input type="hidden" name="apartmentId" value={apartment.id} />
                        <input type="hidden" name="bookingId" value={booking.id} />
                        <button type="submit" class="booking-item__delete">Ukloni</button>
                      </form>
                    </article>
                  {/each}
                </div>
              {:else}
                <p class="booking-list__empty">
                  Još nema upisanih rezervacija za ovaj apartman.
                </p>
              {/if}
            </div>
          </div>
        </div>
      </section>
    {/each}
  </div>
</section>

<style lang="less">
  .dashboard-shell {
    min-height: 100vh;
    padding: 2rem;
    background:
      radial-gradient(circle at top left, rgba(143, 213, 204, 0.16), transparent 24%),
      linear-gradient(180deg, #f6f0e5 0%, #f4f1eb 42%, #eef3ef 100%);
    color: #132220;
  }

  .dashboard-topbar,
  .dashboard-hero,
  .dashboard-message,
  .apartment-sections {
    width: min(100%, 78rem);
    margin: 0 auto;
  }

  .dashboard-topbar {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .dashboard-kicker,
  .dashboard-hero__eyebrow,
  .apartment-panel__eyebrow,
  .booking-form span,
  .booking-item__meta {
    margin: 0;
    font-size: 0.72rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .dashboard-kicker {
    color: #487473;
  }

  .dashboard-topbar h1 {
    margin: 0.4rem 0 0.7rem;
    font-size: clamp(2rem, 4vw, 3.2rem);
    line-height: 1;
  }

  .dashboard-topbar__copy {
    margin: 0;
    max-width: 48ch;
    color: #52615f;
    line-height: 1.8;
  }

  .dashboard-logout,
  .apartment-panel__link,
  .booking-form__submit,
  .booking-item__delete {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    text-decoration: none;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease,
      background 0.2s ease;
  }

  .dashboard-logout {
    padding: 0.9rem 1.2rem;
    border: 1px solid rgba(19, 34, 32, 0.14);
    background: white;
    cursor: pointer;
    color: #132220;
    font-size: 0.78rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .dashboard-logout:hover,
  .apartment-panel__link:hover,
  .booking-form__submit:hover,
  .booking-item__delete:hover {
    transform: translateY(-2px);
  }

  .dashboard-hero {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 2rem;
    align-items: end;
    padding: 2rem;
    border-radius: 2rem;
    background:
      linear-gradient(135deg, rgba(7, 21, 19, 0.96), rgba(25, 70, 67, 0.88)),
      #0d1f1d;
    color: white;
    box-shadow: 0 24px 60px rgba(10, 27, 25, 0.14);
  }

  .dashboard-hero__eyebrow {
    color: rgba(255, 255, 255, 0.55);
  }

  .dashboard-hero h2 {
    margin: 0.75rem 0 1rem;
    font-size: clamp(2rem, 4vw, 3.3rem);
    line-height: 1;
    max-width: 15ch;
  }

  .dashboard-hero p {
    margin: 0;
    max-width: 54ch;
    color: rgba(255, 255, 255, 0.74);
    line-height: 1.8;
  }

  .dashboard-hero__stats {
    display: grid;
    gap: 0.9rem;
  }

  .stat-pill {
    min-width: 13rem;
    padding: 1rem 1.1rem;
    border-radius: 1.25rem;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.12);
  }

  .stat-pill span {
    display: block;
    color: rgba(255, 255, 255, 0.58);
    font-size: 0.72rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .stat-pill strong {
    display: block;
    margin-top: 0.45rem;
    font-size: 2rem;
    line-height: 1;
  }

  .dashboard-message {
    margin-top: 1rem;
    padding: 1rem 1.2rem;
    border-radius: 1rem;
  }

  .dashboard-message--error {
    background: rgba(183, 59, 59, 0.12);
    border: 1px solid rgba(183, 59, 59, 0.16);
    color: #8a2323;
  }

  .dashboard-message--success {
    background: rgba(43, 121, 94, 0.12);
    border: 1px solid rgba(43, 121, 94, 0.16);
    color: #215f4b;
  }

  .apartment-sections {
    display: grid;
    gap: 1.5rem;
    margin-top: 1.5rem;
  }

  .apartment-panel {
    padding: 1.5rem;
    border-radius: 2rem;
    background: rgba(255, 255, 255, 0.62);
    border: 1px solid rgba(19, 34, 32, 0.08);
    box-shadow: 0 14px 40px rgba(19, 34, 32, 0.06);
    backdrop-filter: blur(16px);
  }

  .apartment-panel__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.35rem;
  }

  .apartment-panel__eyebrow {
    color: #5d8483;
  }

  .apartment-panel__header h3 {
    margin: 0.45rem 0 0.35rem;
    font-size: clamp(1.5rem, 3vw, 2.2rem);
    line-height: 1;
  }

  .apartment-panel__header p:last-child {
    margin: 0;
    color: #52615f;
  }

  .apartment-panel__link {
    padding: 0.8rem 1rem;
    background: rgba(19, 34, 32, 0.06);
    color: #173330;
    font-size: 0.72rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .apartment-panel__content {
    display: grid;
    grid-template-columns: minmax(0, 1.3fr) minmax(18rem, 0.9fr);
    gap: 1.25rem;
    align-items: start;
  }

  .apartment-panel__hint {
    margin: 0.8rem 0 0;
    color: #5f7270;
    line-height: 1.7;
  }

  .apartment-panel__sidebar {
    display: grid;
    gap: 1rem;
  }

  .booking-form,
  .booking-list {
    padding: 1.25rem;
    border-radius: 1.5rem;
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(19, 34, 32, 0.08);
    box-shadow: 0 12px 30px rgba(19, 34, 32, 0.06);
  }

  .booking-form {
    display: grid;
    gap: 0.9rem;
  }

  .booking-form__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
  }

  .booking-form label {
    display: grid;
    gap: 0.45rem;
  }

  .booking-form span {
    color: #5f7270;
  }

  .booking-form input,
  .booking-form textarea {
    width: 100%;
    padding: 0.9rem 1rem;
    border-radius: 1rem;
    border: 1px solid rgba(19, 34, 32, 0.1);
    background: #fffdfa;
    color: #132220;
    outline: none;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease,
      transform 0.2s ease;
  }

  .booking-form input:focus,
  .booking-form textarea:focus {
    border-color: rgba(23, 63, 61, 0.4);
    box-shadow: 0 0 0 4px rgba(143, 213, 204, 0.18);
    transform: translateY(-1px);
  }

  .booking-form textarea {
    min-height: 6rem;
    resize: vertical;
  }

  .booking-form__submit {
    padding: 0.95rem 1.2rem;
    border: none;
    background: linear-gradient(135deg, #d5b182 0%, #b88c57 100%);
    color: #0d1715;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;
    box-shadow: 0 14px 28px rgba(184, 140, 87, 0.24);
  }

  .booking-list__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 0.9rem;
  }

  .booking-list__header h4 {
    margin: 0;
    font-size: 1rem;
  }

  .booking-list__header span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 2rem;
    height: 2rem;
    padding: 0 0.5rem;
    border-radius: 999px;
    background: rgba(19, 34, 32, 0.08);
    color: #173330;
    font-weight: 700;
  }

  .booking-list__items {
    display: grid;
    gap: 0.75rem;
  }

  .booking-item {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 1rem;
    border-radius: 1.15rem;
    background: #fffdfa;
    border: 1px solid rgba(19, 34, 32, 0.07);
  }

  .booking-item__dates {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 700;
    color: #173330;
  }

  .booking-item__meta {
    margin: 0.35rem 0 0;
    color: #6d7e7d;
  }

  .booking-item__note {
    margin: 0.55rem 0 0;
    color: #52615f;
    line-height: 1.6;
  }

  .booking-item__delete {
    padding: 0.75rem 0.95rem;
    border: none;
    background: rgba(160, 45, 45, 0.1);
    color: #8e3030;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    cursor: pointer;
  }

  .booking-list__empty {
    margin: 0;
    color: #5f7270;
    line-height: 1.7;
  }

  @media (max-width: 1024px) {
    .apartment-panel__content,
    .dashboard-hero {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 720px) {
    .dashboard-shell {
      padding: 1rem;
    }

    .dashboard-topbar,
    .apartment-panel__header {
      flex-direction: column;
    }

    .booking-form__grid {
      grid-template-columns: 1fr;
    }

    .booking-item {
      flex-direction: column;
    }
  }
</style>
