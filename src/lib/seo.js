export const SITE = {
  name: "Apartmani Ante",
  legalName: "Apartmani Ante Makarska",
  defaultTitle: "Apartmani Ante Makarska | Privatni apartmani za odmor",
  defaultDescription:
    "Neka vaš odmor u Makarskoj bude nezaboravan uz Apartmane Ante. Smješteni u mirnom dijelu grada, naši apartmani nude udobnost, prostranost i prekrasan pogled. Rezervirajte sada i osigurajte si savršen odmor!",
  defaultImage: "/img/kuca-apartmani-ante.webp",
  locale: "hr_HR",
  language: "hr-HR",
  email: "apartmani.ante01@gmail.com",
  facebook: "https://www.facebook.com/apartman.makarska.18",
  streetAddress: "Kotromanića 9",
  postalCode: "21300",
  addressLocality: "Makarska",
  addressCountry: "HR",
};

export function absoluteUrl(path, origin) {
  if (!path) {
    return origin;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return new URL(path, origin).toString();
}

function buildBreadcrumbs(origin, items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path, origin),
    })),
  };
}

function buildOrganizationSchema(origin) {
  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "@id": `${origin}/#organization`,
    name: SITE.legalName,
    url: origin,
    image: absoluteUrl(SITE.defaultImage, origin),
    email: SITE.email,
    sameAs: [SITE.facebook],
    priceRange: "EUR",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.streetAddress,
      postalCode: SITE.postalCode,
      addressLocality: SITE.addressLocality,
      addressCountry: SITE.addressCountry,
    },
  };
}

function buildWebsiteSchema(origin) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${origin}/#website`,
    url: origin,
    name: SITE.legalName,
    inLanguage: SITE.language,
    publisher: {
      "@id": `${origin}/#organization`,
    },
  };
}

export function buildSeo({ pathname, origin, data }) {
  const apartment = data?.apartment;
  const canonicalPath = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  const canonical = absoluteUrl(canonicalPath || "/", origin);

  const seo = {
    title: SITE.defaultTitle,
    description: SITE.defaultDescription,
    image: absoluteUrl(SITE.defaultImage, origin),
    canonical,
    robots:
      "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
    type: "website",
    schema: [buildOrganizationSchema(origin), buildWebsiteSchema(origin)],
  };

  if (pathname === "/login") {
    return {
      ...seo,
      title: "Prijava | Apartmani Ante",
      robots: "noindex,nofollow",
      schema: [],
    };
  }

  if (pathname.startsWith("/dashboard")) {
    return {
      ...seo,
      title: "Kontrolna ploča | Apartmani Ante",
      robots: "noindex,nofollow",
      schema: [],
    };
  }

  if (pathname === "/") {
    seo.title = "Apartmani Ante Makarska | Privatni apartmani za odmor";
    seo.description =
      "Neka vaš odmor u Makarskoj bude nezaboravan uz Apartmane Ante. Smješteni u mirnom dijelu grada, naši apartmani nude udobnost, prostranost i prekrasan pogled. Rezervirajte sada i osigurajte si savršen odmor!";
    seo.schema.push(
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: seo.title,
        description: seo.description,
        inLanguage: SITE.language,
        primaryImageOfPage: seo.image,
      },
      buildBreadcrumbs(origin, [{ name: "Početna", path: "/" }]),
    );
    return seo;
  }

  if (pathname === "/apartmani") {
    seo.title = "Apartmani u Makarskoj | Apartmani Ante";
    seo.description =
      "Odaberite apartman koji vam najviše odgovara i pogledajte fotografije, sadržaje i dostupne termine za odmor u Makarskoj.";
    seo.schema.push(
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${canonical}#collection`,
        url: canonical,
        name: seo.title,
        description: seo.description,
        hasPart: (data?.apartments || []).map((item) => ({
          "@type": "Apartment",
          name: item.name,
          url: absoluteUrl(item.href, origin),
          image: absoluteUrl(
            item.image || item.images?.[0] || SITE.defaultImage,
            origin,
          ),
          description: `${item.name} u Makarskoj, ${item.size}, kapacitet ${item.capacity}.`,
        })),
      },
      buildBreadcrumbs(origin, [
        { name: "Početna", path: "/" },
        { name: "Apartmani", path: "/apartmani" },
      ]),
    );
    return seo;
  }

  if (pathname.startsWith("/apartmani/") && apartment) {
    seo.title = `${apartment.name} | Apartmani Ante Makarska`;
    seo.description = `${apartment.name} u Makarskoj nudi smještaj za ${apartment.capacity}, površinu ${apartment.size}, fotografije, sadržaje i jednostavan upit za rezervaciju.`;
    seo.image = absoluteUrl(
      apartment.images?.[0] || apartment.image || SITE.defaultImage,
      origin,
    );
    seo.schema.push(
      {
        "@context": "https://schema.org",
        "@type": "Apartment",
        "@id": `${canonical}#apartment`,
        name: apartment.name,
        url: canonical,
        image: apartment.images?.map((image) => absoluteUrl(image, origin)) || [
          seo.image,
        ],
        description: seo.description,
        numberOfRooms: 1,
        amenityFeature: (apartment.amenities || []).map((name) => ({
          "@type": "LocationFeatureSpecification",
          name,
          value: true,
        })),
        containedInPlace: {
          "@id": `${origin}/#organization`,
        },
      },
      buildBreadcrumbs(origin, [
        { name: "Početna", path: "/" },
        { name: "Apartmani", path: "/apartmani" },
        { name: apartment.name, path: pathname },
      ]),
    );
    return seo;
  }

  if (pathname === "/o-nama") {
    seo.title = "O nama | Apartmani Ante Makarska";
    seo.description =
      "Saznajte više o obitelji koja vodi Apartmane Ante u Makarskoj i o gostoprimstvu koje stoji iza svakog boravka.";
    seo.schema.push(
      {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "@id": `${canonical}#about`,
        url: canonical,
        name: seo.title,
        description: seo.description,
        about: {
          "@id": `${origin}/#organization`,
        },
      },
      buildBreadcrumbs(origin, [
        { name: "Početna", path: "/" },
        { name: "O nama", path: "/o-nama" },
      ]),
    );
    return seo;
  }

  if (pathname === "/kontakt") {
    seo.title = "Kontakt i rezervacije | Apartmani Ante Makarska";
    seo.description =
      "Kontaktirajte Apartmane Ante za upit ili rezervaciju smještaja u Makarskoj putem obrasca ili e-maila.";
    seo.schema.push(
      {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "@id": `${canonical}#contact`,
        url: canonical,
        name: seo.title,
        description: seo.description,
        mainEntity: {
          "@id": `${origin}/#organization`,
        },
      },
      buildBreadcrumbs(origin, [
        { name: "Početna", path: "/" },
        { name: "Kontakt", path: "/kontakt" },
      ]),
    );
    return seo;
  }

  return seo;
}
