import { describe, expect, it } from "vitest";
import { donationAccounts } from "@/lib/donationAccounts";

describe("donation account details", () => {
  it("lists the three account details shown in the uploaded account images", () => {
    expect(donationAccounts).toEqual([
      {
        label: "Offerings",
        bank: "Zenith Bank",
        accountName: "TACN WUSE ASSEMBLY",
        accountNumber: "1311512268",
      },
      {
        label: "Tithes",
        bank: "Zenith Bank",
        accountName: "THE APOSTOLIC CHURCH - GEN. FUNDS",
        accountNumber: "1014382335",
      },
      {
        label: "Temple",
        bank: "Zenith Bank",
        accountName: "TACN WUSE AREA TEMPLE PROJECT",
        accountNumber: "1311511845",
      },
    ]);
  });
});