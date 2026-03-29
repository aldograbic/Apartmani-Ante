import nodemailer from "nodemailer";
import { env } from "$env/dynamic/private";

let transporterPromise;

function getRequiredMailConfig() {
  const user = env.SMTP_USER || env.GMAIL_USER || "";
  const pass = env.SMTP_PASS || env.GMAIL_APP_PASSWORD || "";
  const ownerEmail = env.CONTACT_EMAIL || user;
  const fromEmail = env.MAIL_FROM || user;

  if (!user || !pass || !ownerEmail) {
    throw new Error(
      "Missing mail configuration. Expected SMTP_USER/GMAIL_USER, SMTP_PASS/GMAIL_APP_PASSWORD and CONTACT_EMAIL.",
    );
  }

  return {
    user,
    pass,
    ownerEmail,
    fromEmail,
  };
}

function getTransporter() {
  if (!transporterPromise) {
    const { user, pass } = getRequiredMailConfig();
    transporterPromise = Promise.resolve(
      nodemailer.createTransport({
        service: "gmail",
        auth: {
          user,
          pass,
        },
      }),
    );
  }

  return transporterPromise;
}

function formatDate(value) {
  if (!value) return "Nije navedeno";

  return new Intl.DateTimeFormat("hr-HR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Europe/Zagreb",
  }).format(new Date(`${value}T00:00:00`));
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function sendMail(options) {
  const transporter = await getTransporter();
  const { fromEmail } = getRequiredMailConfig();

  return transporter.sendMail({
    from: `"Apartmani Ante" <${fromEmail}>`,
    ...options,
  });
}

export async function sendContactEmail({
  ime,
  prezime,
  email,
  telefon,
  apartman,
  dolazak,
  odlazak,
  osobe,
  poruka,
}) {
  const { ownerEmail } = getRequiredMailConfig();
  const fullName = [ime, prezime].filter(Boolean).join(" ").trim();

  const lines = [
    "Nova poruka s kontakt forme",
    "",
    `Ime i prezime: ${fullName}`,
    `Email: ${email}`,
    `Telefon: ${telefon || "Nije naveden"}`,
    `Apartman: ${apartman || "Nije odabran"}`,
    `Dolazak: ${formatDate(dolazak)}`,
    `Odlazak: ${formatDate(odlazak)}`,
    `Broj osoba: ${osobe || "Nije naveden"}`,
    "",
    "Poruka:",
    poruka || "Nema dodatne poruke.",
  ];

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#173330">
      <h2 style="margin:0 0 16px;">Nova poruka s kontakt forme</h2>
      <p><strong>Ime i prezime:</strong> ${escapeHtml(fullName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Telefon:</strong> ${escapeHtml(telefon || "Nije naveden")}</p>
      <p><strong>Apartman:</strong> ${escapeHtml(apartman || "Nije odabran")}</p>
      <p><strong>Dolazak:</strong> ${escapeHtml(formatDate(dolazak))}</p>
      <p><strong>Odlazak:</strong> ${escapeHtml(formatDate(odlazak))}</p>
      <p><strong>Broj osoba:</strong> ${escapeHtml(osobe || "Nije naveden")}</p>
      <p><strong>Poruka:</strong><br />${escapeHtml(poruka || "Nema dodatne poruke.").replaceAll("\n", "<br />")}</p>
    </div>
  `;

  return sendMail({
    to: ownerEmail,
    replyTo: email,
    subject: `Kontakt upit - ${fullName || email}`,
    text: lines.join("\n"),
    html,
  });
}

export async function sendReservationEmails(requestData) {
  const { ownerEmail } = getRequiredMailConfig();

  const stayLine = `${formatDate(requestData.checkIn)} - ${formatDate(requestData.checkOut)}`;
  const guestName = requestData.name || "Gost";

  const ownerText = [
    `Novi rezervacijski upit za ${requestData.apartmentName}`,
    "",
    `Apartman: ${requestData.apartmentName}`,
    `Termin: ${stayLine}`,
    `Ime i prezime: ${requestData.name}`,
    `Email: ${requestData.email}`,
    `Telefon: ${requestData.phone}`,
    `Broj odraslih: ${requestData.adults}`,
    `Broj djece: ${requestData.children}`,
    `Očekivano vrijeme dolaska: ${requestData.arrivalTime || "Nije navedeno"}`,
    "",
    "Komentar:",
    requestData.comment || "Nema dodatnog komentara.",
  ].join("\n");

  const ownerHtml = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#173330">
      <h2 style="margin:0 0 16px;">Novi rezervacijski upit</h2>
      <p><strong>Apartman:</strong> ${escapeHtml(requestData.apartmentName)}</p>
      <p><strong>Termin:</strong> ${escapeHtml(stayLine)}</p>
      <p><strong>Ime i prezime:</strong> ${escapeHtml(requestData.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(requestData.email)}</p>
      <p><strong>Telefon:</strong> ${escapeHtml(requestData.phone)}</p>
      <p><strong>Broj odraslih:</strong> ${escapeHtml(requestData.adults)}</p>
      <p><strong>Broj djece:</strong> ${escapeHtml(requestData.children)}</p>
      <p><strong>Očekivano vrijeme dolaska:</strong> ${escapeHtml(requestData.arrivalTime || "Nije navedeno")}</p>
      <p><strong>Komentar:</strong><br />${escapeHtml(requestData.comment || "Nema dodatnog komentara.").replaceAll("\n", "<br />")}</p>
    </div>
  `;

  const guestText = [
    `Poštovani ${guestName},`,
    "",
    "hvala vam na upitu za smještaj Apartmani Ante.",
    "",
    `Apartman: ${requestData.apartmentName}`,
    `Termin: ${stayLine}`,
    `Broj odraslih: ${requestData.adults}`,
    `Broj djece: ${requestData.children}`,
    `Očekivano vrijeme dolaska: ${requestData.arrivalTime || "Nije navedeno"}`,
    "",
    "Vaš upit je zaprimljen i javit ćemo vam se uskoro s potvrdom dostupnosti.",
    "",
    "Srdačan pozdrav,",
    "Apartmani Ante",
  ].join("\n");

  const guestHtml = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#173330">
      <p>Poštovani ${escapeHtml(guestName)},</p>
      <p>hvala vam na upitu za smještaj <strong>Apartmani Ante</strong>.</p>
      <p><strong>Apartman:</strong> ${escapeHtml(requestData.apartmentName)}<br />
      <strong>Termin:</strong> ${escapeHtml(stayLine)}<br />
      <strong>Broj odraslih:</strong> ${escapeHtml(requestData.adults)}<br />
      <strong>Broj djece:</strong> ${escapeHtml(requestData.children)}<br />
      <strong>Očekivano vrijeme dolaska:</strong> ${escapeHtml(requestData.arrivalTime || "Nije navedeno")}</p>
      <p>Vaš upit je zaprimljen i javit ćemo vam se uskoro s potvrdom dostupnosti.</p>
      <p>Srdačan pozdrav,<br />Apartmani Ante</p>
    </div>
  `;

  await Promise.all([
    sendMail({
      to: ownerEmail,
      replyTo: requestData.email,
      subject: `Novi rezervacijski upit - ${requestData.apartmentName}`,
      text: ownerText,
      html: ownerHtml,
    }),
    sendMail({
      to: requestData.email,
      subject: `Zaprimili smo vaš upit - ${requestData.apartmentName}`,
      text: guestText,
      html: guestHtml,
    }),
  ]);
}
