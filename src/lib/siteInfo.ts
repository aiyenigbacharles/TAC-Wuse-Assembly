export const CHURCH_NAME = "The Apostolic Church Nigeria, Wuse Assembly";
export const ADDRESS_LINES = ["No. 1 Parakou Street", "Opposite First-Forty Hotel", "Wuse 2, Abuja"] as const;
export const ADDRESS_ONE_LINE = ADDRESS_LINES.join(", ");
export const ADDRESS_WITH_COUNTRY = `${ADDRESS_ONE_LINE}, Nigeria`;
const mapQuery = encodeURIComponent(`${CHURCH_NAME}, ${ADDRESS_WITH_COUNTRY}`);
export const MAPS_SEARCH_URL = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
export const MAPS_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`;
export const MAPS_EMBED_URL = `https://www.google.com/maps?q=${mapQuery}&output=embed`;
