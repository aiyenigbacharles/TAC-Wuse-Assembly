import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Reveal } from "@/components/motion";
import { Check, Copy } from "@/components/FontAwesomeIcons";
import { donationAccounts } from "@/lib/donationAccounts";
import { useToast } from "@/hooks/use-toast";

const AccountCard = ({ account, index }: { account: (typeof donationAccounts)[number]; index: number }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(account.accountNumber);
      setCopied(true);
      toast({ title: "Account number copied", description: `${account.label}: ${account.accountNumber}` });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Could not copy", description: "Please copy the number manually.", variant: "destructive" });
    }
  };

  return (
    <Reveal delay={index * 0.08} className="flex flex-col rounded-lg bg-card p-7">
      <h2 className="display-3 mb-1">{account.label}</h2>
      <p className="mb-8 text-sm text-muted-foreground">{account.bank}</p>
      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.06em] text-muted-foreground">Account number</p>
      <p className="mb-5 text-[2rem] font-semibold tabular-nums tracking-tight">{account.accountNumber}</p>
      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.06em] text-muted-foreground">Account name</p>
      <p className="mb-8 text-[0.95rem] font-medium">{account.accountName}</p>
      <button onClick={copy} className="btn btn-primary mt-auto h-11 w-fit px-5 text-sm">
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "Copied" : "Copy account number"}
      </button>
    </Reveal>
  );
};

const DonatePage = () => (
  <>
    <PageHeader label="Giving" title="Give cheerfully.">
      <p>Give towards offerings, tithes and the Temple project using the accounts below. God loveth a cheerful giver (2 Corinthians 9:7).</p>
    </PageHeader>
    <section className="container pb-24">
      <div className="grid gap-5 md:grid-cols-3">
        {donationAccounts.map((account, i) => (
          <AccountCard key={account.accountNumber} account={account} index={i} />
        ))}
      </div>
    </section>
  </>
);

export default DonatePage;
