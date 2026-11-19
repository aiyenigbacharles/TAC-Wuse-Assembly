export interface DonationAccount {
  label: string;
  bank: string;
  accountName: string;
  accountNumber: string;
}

export const donationAccounts: DonationAccount[] = [
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
];