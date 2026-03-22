import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { faqs } from "@/data/faqData";


const FAQSection = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="relative border-t border-border/60 bg-secondary/20 py-20 sm:py-28"
    >
      {/* Glow accent */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-teal/5 blur-[150px]" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-block font-body text-xs font-semibold uppercase tracking-widest text-teal mb-3">
            Got Questions?
          </span>
          <h2 className="font-heading text-4xl font-black text-foreground sm:text-5xl md:text-6xl">
            Frequently Asked{" "}
            <span className="text-gradient-orange">Questions</span>
          </h2>
          <p className="mt-4 font-body text-sm leading-relaxed text-muted-foreground sm:text-base">
            Everything you need to know before working with us. Still have
            something on your mind? Just ask — we love a good conversation.
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="mx-auto mt-14 max-w-3xl space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className={`rounded-xl border transition-all duration-300 ${
                  isOpen
                    ? "border-teal/40 bg-card/60 shadow-teal-glow/20"
                    : "border-border/50 bg-card/20 hover:border-border"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading text-sm font-bold text-foreground sm:text-base">
                    {faq.q}
                  </span>
                  <span
                    className={`mt-0.5 flex-shrink-0 rounded-full p-1 transition-colors duration-200 ${
                      isOpen
                        ? "bg-teal/20 text-teal"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {isOpen ? <Minus size={14} /> : <Plus size={14} />}
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
                      <p className="px-6 pb-6 font-body text-sm leading-relaxed text-muted-foreground sm:text-base">
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
          className="mt-12 text-center font-body text-sm text-muted-foreground"
        >
          Still have questions?{" "}
          <a
            href="https://wa.me/919322720861"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-teal underline-offset-4 hover:underline"
          >
            Message us on WhatsApp
          </a>{" "}
          or{" "}
          <a
            href="mailto:aurionstack@gmail.com"
            className="font-semibold text-teal underline-offset-4 hover:underline"
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
