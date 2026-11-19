import { useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import { Send, Upload, X, Image } from "@/components/FontAwesomeIcons";
import { useToast } from "@/hooks/use-toast";

const TestimoniesPage = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "",
    contact: "",
    testimony: "",
    consent: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles].slice(0, 5));
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.testimony.trim()) {
      toast({ title: "Please enter your testimony", variant: "destructive" });
      return;
    }
    if (!form.consent) {
      toast({ title: "Please give consent to share", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      toast({ title: "Testimony submitted!", description: "Thank you for sharing. God bless you!" });
      setForm({ name: "", contact: "", testimony: "", consent: false });
      setFiles([]);
      setSubmitting(false);
    }, 1000);
  };

  return (
    <>
      <PageHeader label="Testimonies" title="Share what God has done.">
        <p>Your testimony can encourage others. Tell us your story.</p>
      </PageHeader>
      <form
            onSubmit={handleSubmit}
            className="container grid grid-cols-1 gap-6 pb-24 md:grid-cols-5"
          >
            {/* Form fields */}
            <div className="md:col-span-3 bg-card rounded-lg p-6 sm:p-8 space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Name <span className="text-muted-foreground">(optional)</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-4 py-3 outline-none transition-shadow focus:border-ring focus:ring-2 focus:ring-ring/40"
                  placeholder="Your name"
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Contact <span className="text-muted-foreground">(optional)</span>
                </label>
                <input
                  type="text"
                  value={form.contact}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-4 py-3 outline-none transition-shadow focus:border-ring focus:ring-2 focus:ring-ring/40"
                  placeholder="Phone or email"
                  maxLength={255}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Your Testimony <span className="text-destructive">*</span>
                </label>
                <textarea
                  value={form.testimony}
                  onChange={(e) => setForm({ ...form, testimony: e.target.value })}
                  rows={5}
                  className="w-full rounded-md border border-input bg-background px-4 py-3 outline-none transition-shadow focus:border-ring focus:ring-2 focus:ring-ring/40 resize-none"
                  placeholder="Share what God has done for you..."
                  maxLength={1000}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {form.testimony.length}/1000
                </p>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                  className="mt-1 h-4 w-4 accent-[hsl(var(--ring))]"
                />
                <span className="text-sm text-muted-foreground">
                  I consent to my testimony being shared publicly by the church for the encouragement of others.
                </span>
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary w-full disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {submitting ? "Submitting..." : "Submit Testimony"}
              </button>
            </div>

            {/* Media upload side */}
            <div className="md:col-span-2 bg-card rounded-lg p-6 sm:p-8">
              <h3 className="mb-3 flex items-center gap-2 text-xl font-semibold tracking-tight">
                <Image className="w-5 h-5" /> Media Upload
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Optionally attach photos or videos related to your testimony (max 5 files).
              </p>

              <label className="flex flex-col items-center justify-center border-2 border-dashed border-input rounded-md p-6 cursor-pointer hover:border-foreground/50 transition-colors mb-4">
                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Click to upload</span>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {files.length > 0 && (
                <div className="space-y-2">
                  {files.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-md bg-background px-3 py-2 text-sm"
                    >
                      <span className="truncate mr-2">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="p-1 hover:bg-secondary rounded"
                      >
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
    </>
  );
};

export default TestimoniesPage;
