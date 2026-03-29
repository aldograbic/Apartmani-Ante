<script>
  import { browser } from "$app/environment";
  import { createEventDispatcher, onDestroy, onMount } from "svelte";
  import { Calendar } from "@fullcalendar/core";
  import hrLocale from "@fullcalendar/core/locales/hr";
  import dayGridPlugin from "@fullcalendar/daygrid";
  import interactionPlugin from "@fullcalendar/interaction";

  export let bookings = [];
  export let showGuestNames = true;
  export let mergeAdjacentBookings = false;
  export let minDate = "";
  export let allowDragSelection = true;
  export let getDayMeta = null;

  const dispatch = createEventDispatcher();
  const selectionFormatter = new Intl.DateTimeFormat("hr-HR", {
    day: "2-digit",
    month: "2-digit",
  });
  const dayKeyFormatter = new Intl.DateTimeFormat("sv-SE");

  let calendarElement;
  let calendar;
  let pendingCheckIn = "";
  let selectedCheckIn = "";
  let selectedCheckOut = "";
  let selectedVisualEnd = "";
  let statusMessage = "Kliknite datum dolaska, zatim datum odlaska.";
  let statusTone = "info";

  function parseDate(value) {
    return new Date(`${value}T00:00:00`);
  }

  function toDayKey(date) {
    return dayKeyFormatter.format(date);
  }

  function formatShortDate(value) {
    return selectionFormatter.format(parseDate(value));
  }

  function shiftDay(value, days) {
    const date = parseDate(value);
    date.setDate(date.getDate() + days);
    return toDayKey(date);
  }

  function isBeforeMinDate(date) {
    return Boolean(minDate) && date < minDate;
  }

  function resolveDayMeta(date) {
    return typeof getDayMeta === "function" ? getDayMeta(date) : null;
  }

  function isSeasonUnavailable(date) {
    return resolveDayMeta(date)?.unavailable === true;
  }

  function isDateInSelectedRange(date) {
    return Boolean(selectedCheckIn && selectedCheckOut) &&
      date >= selectedCheckIn &&
      date < selectedCheckOut;
  }

  function hasRangeOverlap(checkIn, checkOut, items = bookings) {
    return items.some(
      (booking) => checkIn < booking.checkOut && checkOut > booking.checkIn,
    );
  }

  function isArrivalDateUnavailable(date) {
    return (
      isSeasonUnavailable(date) ||
      bookings.some(
      (booking) => date >= booking.checkIn && date < booking.checkOut,
      )
    );
  }

  function hasUnavailableDateInRange(checkIn, checkOut) {
    const cursor = parseDate(checkIn);
    const end = parseDate(checkOut);

    while (cursor < end) {
      if (isSeasonUnavailable(toDayKey(cursor))) {
        return true;
      }
      cursor.setDate(cursor.getDate() + 1);
    }

    return false;
  }

  function setStatus(message, tone = "info") {
    statusMessage = message;
    statusTone = tone;
  }

  function syncSelection(checkIn, checkOut = "") {
    selectedCheckIn = checkIn;
    selectedCheckOut = checkOut;
    selectedVisualEnd = checkOut
      ? allowDragSelection
        ? shiftDay(checkOut, -1)
        : checkOut
      : "";
    dispatch("selectrange", {
      checkIn,
      checkOut,
    });
    refreshCalendarDayCells();
  }

  function refreshCalendarDayCells() {
    calendar?.render();
  }

  function markPendingArrival(date) {
    pendingCheckIn = date;
    syncSelection(date, "");
    refreshCalendarDayCells();
    setStatus(
      `Dolazak je odabran za ${formatShortDate(date)}. Sada kliknite datum odlaska.`,
    );
  }

  function clearPendingSelection() {
    pendingCheckIn = "";
    refreshCalendarDayCells();
  }

  function mergeBookings(items) {
    const sorted = [...items].sort(
      (a, b) => parseDate(a.checkIn).getTime() - parseDate(b.checkIn).getTime(),
    );

    return sorted.reduce((merged, booking) => {
      const last = merged.at(-1);

      if (!last) {
        merged.push({ ...booking });
        return merged;
      }

      const lastEnd = parseDate(last.checkOut).getTime();
      const nextStart = parseDate(booking.checkIn).getTime();
      const nextEnd = parseDate(booking.checkOut).getTime();

      if (nextStart <= lastEnd) {
        if (nextEnd > lastEnd) {
          last.checkOut = booking.checkOut;
        }
        return merged;
      }

      merged.push({ ...booking });
      return merged;
    }, []);
  }

  function toCalendarEvents(items) {
    const visibleBookings = mergeAdjacentBookings ? mergeBookings(items) : items;

    return visibleBookings.map((booking) => ({
      id: booking.id,
      title:
        showGuestNames && booking.guestName
          ? `${booking.guestName} · Rezervirano`
          : "Rezervirano",
      start: booking.checkIn,
      end: booking.checkOut,
      allDay: true,
      classNames: ["booking-event"],
    }));
  }

  onMount(() => {
    if (!browser || !calendarElement) {
      return;
    }

    calendar = new Calendar(calendarElement, {
      plugins: [dayGridPlugin, interactionPlugin],
      locale: hrLocale,
      initialView: "dayGridMonth",
      firstDay: 1,
      height: "auto",
      fixedWeekCount: false,
      selectable: allowDragSelection,
      selectMirror: allowDragSelection,
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "",
      },
      buttonText: {
        today: "Danas",
      },
      events: toCalendarEvents(bookings),
      dayCellClassNames: ({ date }) => {
        const dateStr = toDayKey(date);
        return [
          ...(isBeforeMinDate(dateStr) ? ["booking-day-disabled"] : []),
          ...(isSeasonUnavailable(dateStr) ? ["booking-day-unavailable-season"] : []),
          ...(pendingCheckIn === dateStr ? ["booking-day-pending"] : []),
          ...(selectedCheckIn === dateStr ? ["booking-day-selected-start"] : []),
          ...(selectedVisualEnd === dateStr ? ["booking-day-selected-end"] : []),
          ...(isDateInSelectedRange(dateStr) ? ["booking-day-selected-range"] : []),
        ];
      },
      dayCellDidMount: ({ date, el }) => {
        const meta = resolveDayMeta(toDayKey(date));
        if (!meta?.priceLabel) return;

        const frame = el.querySelector(".fc-daygrid-day-frame");
        if (!frame || frame.querySelector(".booking-day-price")) return;

        const price = document.createElement("span");
        price.className = "booking-day-price";
        price.textContent = meta.priceLabel;
        frame.appendChild(price);
      },
      selectAllow: ({ startStr, endStr }) => {
        if (!startStr || !endStr || endStr <= startStr) {
          return false;
        }

        if (isBeforeMinDate(startStr)) {
          return false;
        }

        if (hasUnavailableDateInRange(startStr, endStr)) {
          return false;
        }

        return !hasRangeOverlap(startStr, endStr);
      },
      select: ({ startStr, endStr }) => {
        if (!allowDragSelection) {
          return;
        }

        pendingCheckIn = "";
        syncSelection(startStr, endStr);
        setStatus(
          `Odabran je termin od ${formatShortDate(startStr)} do ${formatShortDate(endStr)}.`,
        );
        calendar.unselect();
      },
      dateClick: ({ dateStr }) => {
        if (isBeforeMinDate(dateStr)) {
          setStatus("Nije moguce odabrati datume prije danasnjeg dana.", "error");
          return;
        }

        if (!pendingCheckIn) {
          if (isArrivalDateUnavailable(dateStr)) {
            setStatus("Taj datum nije dostupan za dolazak.", "error");
            return;
          }

          markPendingArrival(dateStr);
          return;
        }

        if (dateStr <= pendingCheckIn) {
          if (isArrivalDateUnavailable(dateStr)) {
            setStatus("Odaberite slobodan datum dolaska.", "error");
            return;
          }

          markPendingArrival(dateStr);
          return;
        }

        if (hasRangeOverlap(pendingCheckIn, dateStr)) {
          setStatus(
            "Odabrani raspon prelazi preko zauzetih termina. Odaberite drugi odlazak.",
            "error",
          );
          return;
        }

        syncSelection(pendingCheckIn, dateStr);
        setStatus(
          `Odabran je termin od ${formatShortDate(pendingCheckIn)} do ${formatShortDate(dateStr)}.`,
        );
        clearPendingSelection();
      },
    });

    calendar.render();
  });

  onDestroy(() => {
    calendar?.destroy();
  });

  $: if (calendar) {
    calendar.removeAllEvents();
    calendar.addEventSource(toCalendarEvents(bookings));
  }
</script>

<div class="booking-calendar">
  <div bind:this={calendarElement}></div>
  <p class:booking-calendar__status--error={statusTone === "error"} class="booking-calendar__status">
    {statusMessage}
  </p>
</div>

<style lang="less">
  .booking-calendar {
    border-radius: 1.5rem;
    background: rgba(255, 255, 255, 0.82);
    border: 1px solid rgba(19, 34, 32, 0.08);
    box-shadow: 0 12px 30px rgba(19, 34, 32, 0.06);
    overflow: hidden;
  }
  .booking-calendar__status {
    margin: 0;
    padding: 0 1rem 1rem;
    color: #45605e;
    font-size: 0.8rem;
    line-height: 1.6;
    font-family: var(--font-body, inherit);
  }
  .booking-calendar__status--error {
    color: #a33a2f;
  }

  :global(.booking-calendar .fc) {
    --fc-border-color: rgba(19, 34, 32, 0.08);
    --fc-button-bg-color: #173f3d;
    --fc-button-border-color: #173f3d;
    --fc-button-hover-bg-color: #21504d;
    --fc-button-hover-border-color: #21504d;
    --fc-button-active-bg-color: #102a29;
    --fc-button-active-border-color: #102a29;
    --fc-page-bg-color: transparent;
    --fc-neutral-bg-color: rgba(19, 34, 32, 0.04);
    padding: 1rem;
    color: #132220;
    font-family: inherit;
  }

  :global(.booking-calendar .fc-toolbar.fc-header-toolbar) {
    margin-bottom: 1rem;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  :global(.booking-calendar .fc-toolbar-title) {
    font-size: clamp(1.1rem, 2vw, 1.5rem);
    font-weight: 600;
  }

  :global(.booking-calendar .fc-button) {
    border-radius: 999px;
    padding: 0.45rem 0.9rem;
    box-shadow: none !important;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 0.68rem;
  }

  :global(.booking-calendar .fc-col-header-cell-cushion) {
    padding: 0.75rem 0.25rem;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #577674;
  }

  :global(.booking-calendar .fc-daygrid-day-number) {
    padding: 0.45rem;
    color: #173330;
    font-size: 0.82rem;
  }

  :global(.booking-calendar .fc-daygrid-day.fc-day-today) {
    background: rgba(213, 177, 130, 0.16);
  }

  :global(.booking-calendar .fc-daygrid-day.booking-day-disabled) {
    background: rgba(19, 34, 32, 0.035);
  }

  :global(.booking-calendar .fc-daygrid-day.booking-day-disabled .fc-daygrid-day-number) {
    color: rgba(23, 51, 48, 0.38);
  }
  :global(.booking-calendar .fc-daygrid-day.booking-day-unavailable-season) {
    background: rgba(179, 154, 120, 0.08);
  }
  :global(.booking-calendar .fc-daygrid-day.booking-day-unavailable-season .fc-daygrid-day-number) {
    color: rgba(98, 76, 52, 0.62);
  }
  :global(.booking-calendar .fc-daygrid-day-frame) {
    position: relative;
    min-height: 100%;
  }
  :global(.booking-calendar .booking-day-price) {
    position: absolute;
    right: 0.3rem;
    bottom: 0.2rem;
    color: rgba(23, 51, 48, 0.56);
    font-size: 0.56rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    pointer-events: none;
  }

  :global(.booking-calendar .fc-daygrid-day.booking-day-pending) {
    background: rgba(143, 213, 204, 0.18);
    box-shadow: inset 0 0 0 2px rgba(30, 92, 90, 0.35);
  }

  :global(.booking-calendar .fc-daygrid-day.booking-day-selected-range) {
    background: rgba(143, 213, 204, 0.2);
  }

  :global(.booking-calendar .fc-daygrid-day.booking-day-selected-start),
  :global(.booking-calendar .fc-daygrid-day.booking-day-selected-end) {
    background: rgba(30, 92, 90, 0.2);
    box-shadow: inset 0 0 0 2px rgba(30, 92, 90, 0.55);
  }

  :global(.booking-calendar .fc-daygrid-day.booking-day-selected-start .fc-daygrid-day-number),
  :global(.booking-calendar .fc-daygrid-day.booking-day-selected-end .fc-daygrid-day-number) {
    color: #173f3d;
    font-weight: 700;
  }

  :global(.booking-calendar .fc-highlight) {
    background: rgba(143, 213, 204, 0.28);
  }

  :global(.booking-calendar .fc-event.booking-event) {
    border: none;
    border-radius: 0.65rem;
    background: linear-gradient(135deg, #d3a86e 0%, #b57b44 100%);
    color: #1b1208;
    padding: 0.2rem 0.35rem;
  }

  :global(.booking-calendar .fc-event-main) {
    font-weight: 700;
  }
</style>
