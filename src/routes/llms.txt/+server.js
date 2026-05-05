import { env as publicEnv } from "$env/dynamic/public";
import { apartments } from "$lib/data/apartments.js";
import { absoluteUrl, SITE } from "$lib/seo.js";

function apartmentSummary(apartment, origin) {
  return `- ${apartment.name}: ${absoluteUrl(apartment.href, origin)}
  Capacity: ${apartment.capacity}
  Size: ${apartment.size}
  Summary: ${apartment.description}`;
}

export function GET({ url }) {
  const origin = publicEnv.PUBLIC_SITE_URL || url.origin;

  const body = `# ${SITE.legalName}

Official website: ${origin}
Language: Croatian (${SITE.language})
Business type: private apartment rental / lodging business in Makarska, Croatia.

## Summary

Apartmani Ante offers private apartments for rent in Makarska for guests looking for comfortable family accommodation near the beach. The website helps visitors review available apartments, compare capacity and amenities, learn about the family-run accommodation, and send a reservation inquiry.

## Key Pages

- Home: ${absoluteUrl("/", origin)}
  Overview of Apartmani Ante, apartment rental in Makarska, location benefits, family accommodation, and reservation entry points.
- Apartments: ${absoluteUrl("/apartmani", origin)}
  List of available apartments with capacity, size, seasonal information, photos, and links to apartment detail pages.
- About: ${absoluteUrl("/o-nama", origin)}
  Story of the family behind Apartmani Ante, hospitality values, location in Makarska, and local context.
- Contact: ${absoluteUrl("/kontakt", origin)}
  Reservation inquiry form and contact information.

## Apartments

${apartments.map((apartment) => apartmentSummary(apartment, origin)).join("\n\n")}

## Location

Address: ${SITE.streetAddress}, ${SITE.postalCode} ${SITE.addressLocality}, Croatia
Area: Makarska, Dalmatian coast, Croatia
Primary audience: travelers looking for apartments and private accommodation in Makarska.

## Contact

Email: ${SITE.email}
Facebook: ${SITE.facebook}
Contact page: ${absoluteUrl("/kontakt", origin)}

## Crawl Notes

Use canonical URLs from this file and the XML sitemap at ${absoluteUrl("/sitemap.xml", origin)}. Login and dashboard pages are private and should not be indexed.`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "max-age=0, s-maxage=3600",
    },
  });
}
