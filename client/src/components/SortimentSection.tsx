/* kaffeegraf SortimentSection – Refined Dark Elegance
   3 Kaffeesorten als elegante Cards mit Specs */
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const PRODUCT_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663492934822/L7t4bFiPiLxiqH6LDV52Qk/kaffeegraf-boardroom-product_a976d357.png";

const products = [
  {
    name: "BOARDROOM",
    tagline: "Houseblend Nr. 1",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663492934822/L7t4bFiPiLxiqH6LDV52Qk/kaffeegraf-boardroom_0bd5ff6a.png",
    description:
      "Ein kraftvoller, ausgewogener Blend für den täglichen Bürobetrieb. Robusta verlängt Körper und Crema, Arabica bringt Aromatik und Süße.",
    specs: [
      { label: "Arabica", value: "60%" },
      { label: "Robusta", value: "40%" },
      { label: "Röstgrad", value: "Medium-Dark" },
      { label: "Profil", value: "Melasse · Kirsche · Bitter-Schoko" },
    ],
    badge: "Bestseller",
    highlight: true,
  },
  {
    name: "OFF THE RECORD",
    tagline: "Houseblend Nr. 2",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663492934822/L7t4bFiPiLxiqH6LDV52Qk/kaffeegraf-off-the-record_a80957bb.png",
    description:
      "Für Büros, die einen milderen, aromatischeren Kaffee bevorzugen. Höherer Arabica-Anteil für mehr Fruchtigkeit und Finesse.",
    specs: [
      { label: "Arabica", value: "70%" },
      { label: "Robusta", value: "30%" },
      { label: "Röstgrad", value: "Medium" },
      { label: "Profil", value: "Schoko · Haselnuss · Kakao" },
    ],
    badge: null,
    highlight: false,
  },
  {
    name: "DULIMA DIVINA",
    tagline: "Single Origin",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663492934822/L7t4bFiPiLxiqH6LDV52Qk/kaffeegraf-dulima-divina_f926686b.png",
    description:
      "100% Arabica aus der Region Huila, Kolumbien. Für Kenner und anspruchsvolle Gastronomie – ein Kaffee mit Charakter und Herkunft.",
    specs: [
      { label: "Arabica", value: "100%" },
      { label: "Herkunft", value: "Kolumbien" },
      { label: "Röstgrad", value: "Medium" },
      { label: "Profil", value: "Karamell · Zitrus · rote Beeren" },
    ],
    badge: "Premium",
    highlight: false,
  },
];

function ProductCard({ product, index }: { product: typeof products[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15 }}
      className={`relative flex flex-col p-8 card-glow ${
        product.highlight
          ? "bg-[#1E1A14] border border-[#C9A84C]/30"
          : "bg-[#141210]"
      }`}
    >
      {/* Badge */}
      {product.badge && (
        <div className="absolute top-6 right-6">
          <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest text-[#C9A84C] border border-[#C9A84C]/40 px-2 py-1">
            {product.badge}
          </span>
        </div>
      )}

      {/* Product image */}
      <div className="flex justify-center mb-6 h-52 items-center">
        <div className="relative flex items-center justify-center">
          {product.highlight && (
            <div
              className="absolute inset-0 rounded-full blur-2xl opacity-30"
              style={{ background: "radial-gradient(circle, #C9A84C 0%, transparent 70%)" }}
            />
          )}
          <img
            src={product.image || PRODUCT_IMG}
            alt={product.name}
            className="relative z-10 h-44 w-auto"
            style={{
              filter: product.highlight
                ? "drop-shadow(0 8px 30px rgba(201,168,76,0.25))"
                : "drop-shadow(0 4px 16px rgba(0,0,0,0.5)) brightness(0.85)",
            }}
          />
        </div>
      </div>

      {/* Gold line */}
      <div className="gold-line mb-6" />

      {/* Name */}
      <div className="mb-1">
        <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-mokka">
          {product.tagline}
        </span>
      </div>
      <h3 className="font-['Poppins'] text-2xl font-semibold text-cream mb-3 tracking-wide text-center">
        {product.name}
      </h3>
      <p className="font-['Figtree'] text-xs text-mokka leading-relaxed mb-6 flex-1 text-center">
        {product.description}
      </p>

      {/* Specs */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {product.specs.map((spec) => (
          <div key={spec.label} className="bg-[#0D0D0B] p-3">
            <div className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest text-mokka mb-1">
              {spec.label}
            </div>
            <div className="font-['Figtree'] text-xs text-cream font-medium">
              {spec.value}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={() => {
          const el = document.querySelector("#kontakt");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        className={product.highlight ? "btn-gold text-center" : "btn-outline-gold text-center"}
      >
        Verkostung anfragen
      </button>
    </motion.div>
  );
}

export default function SortimentSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="sortiment" className="py-24 md:py-32 bg-[#0D0D0B]">
      <div className="container">
        {/* Section header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#C9A84C] opacity-60" />
            <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em] text-[#C9A84C]">
              Das Sortiment
            </span>
          </div>
          <h2 className="font-['Poppins'] text-4xl md:text-5xl lg:text-6xl font-light text-cream max-w-2xl leading-tight">
            Drei Sorten.
            <br />
            <span className="font-semibold italic text-[#C9A84C]">Jede ein Statement.</span>
          </h2>
          <p className="font-['Figtree'] text-mokka text-base mt-6 max-w-xl leading-relaxed" style={{width: '650px'}}>
            Unser B2B-Sortiment ist bewusst kuratiert: Qualität statt Masse.
            Alle Sorten sind 100% Specialty Coffee und werden frisch geröstet und aromageschützt geliefert.
          </p>
        </motion.div>

        {/* Product grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.name} product={product} index={index} />
          ))}
        </div>

        {/* White label note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 p-6 border border-[#C9A84C]/20 bg-[#1A1512] flex flex-col md:flex-row items-start md:items-center gap-4"
        >
          <div className="flex-1">
            <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest text-[#C9A84C] mb-2">
              White-Label Option
            </div>
            <p className="font-['Figtree'] text-sm text-mokka">
              Alle Sorten sind auf Wunsch auch unter Ihrem eigenen Firmenlabel
              erhältlich – ideal für Gastronomie und Cafés mit eigenem Branding.
            </p>
          </div>
          <button
            onClick={() => {
              const el = document.querySelector("#kontakt");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="btn-outline-gold whitespace-nowrap flex-shrink-0"
          >
            Mehr erfahren
          </button>
        </motion.div>
      </div>
    </section>
  );
}
