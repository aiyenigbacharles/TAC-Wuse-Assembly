import { describe, expect, it } from "vitest";
import { ADDRESS_LINES, ADDRESS_ONE_LINE, ADDRESS_WITH_COUNTRY, CHURCH_NAME, MAPS_DIRECTIONS_URL, MAPS_EMBED_URL, MAPS_SEARCH_URL } from "@/lib/siteInfo";

describe("church location helpers", () => {
  it("exposes the canonical address and encoded map destinations", () => {
    expect(CHURCH_NAME).toBe("The Apostolic Church Nigeria, Wuse Assembly");
    expect(ADDRESS_LINES).toEqual(["No. 1 Parakou Street", "Opposite First-Forty Hotel", "Wuse 2, Abuja"]);
    expect(ADDRESS_ONE_LINE).toBe("No. 1 Parakou Street, Opposite First-Forty Hotel, Wuse 2, Abuja");
    expect(ADDRESS_WITH_COUNTRY).toBe(`${ADDRESS_ONE_LINE}, Nigeria`);
    const query = encodeURIComponent(`${CHURCH_NAME}, ${ADDRESS_WITH_COUNTRY}`);
    expect(MAPS_SEARCH_URL).toContain(query);
    expect(MAPS_DIRECTIONS_URL).toContain(query);
    expect(MAPS_EMBED_URL).toContain(query);
  });
});
