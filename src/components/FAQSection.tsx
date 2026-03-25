import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { faqs } from "@/data/faqData";

const FAQSection = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="relative border-t border-border bg-muted/20 py-24 sm:py-32"
    >
      <div className="container relative mx-auto px-4 sm:px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            Got Questions?
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Frequently Asked <span className="text-muted-foreground">Questions</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Everything you need to know before working with us. Still have
            something on your mind? Just ask — we love a good conversation.
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className={`rounded-xl border transition-all duration-300 ${
                  isOpen
                    ? "border-primary bg-card shadow-sm"
                    : "border-border bg-card/50 hover:border-border/80"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-bold text-foreground sm:text-lg">
                    {faq.q}
                  </span>
                  <span
                    className={`mt-1 flex-shrink-0 rounded-full p-1 transition-colors duration-200 ${
                      isOpen
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center text-sm text-muted-foreground"
        >
          Still have questions?{" "}
          <a
            href="https://wa.me/919322720861"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Message us on WhatsApp
          </a>{" "}
          or{" "}
          <a
            href="mailto:aurionstack@gmail.com"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            drop us an email
          </a>
          .
        </motion.p>
      </div>
    </section>
  );
};

export default FAQSection;
