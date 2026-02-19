// app/contact/page.tsx
import Link from "next/link"

function IconPhone(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M5.5 4.8c.3-1 1.4-1.6 2.4-1.2l2.1.8c.8.3 1.3 1.2 1 2l-.9 2.1c-.2.6 0 1.3.5 1.7l3.2 3.2c.4.4 1.1.6 1.7.5l2.1-.9c.8-.3 1.7.2 2 .9l.8 2.2c.4 1-.2 2.1-1.2 2.4l-1.6.5c-1.4.4-2.9.1-4.1-.8-2.4-1.7-5.1-4.4-6.8-6.8-.9-1.2-1.2-2.7-.8-4.1l.5-1.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconMail(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4.5 7.5A2.5 2.5 0 0 1 7 5h10a2.5 2.5 0 0 1 2.5 2.5v9A2.5 2.5 0 0 1 17 19H7a2.5 2.5 0 0 1-2.5-2.5v-9Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m6.5 8 5.1 4.1c.9.7 2 .7 2.9 0L19.5 8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconWhatsapp(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 3.5a8.5 8.5 0 0 0-7.3 12.8l-.7 3.2 3.3-.7A8.5 8.5 0 1 0 12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 9.4c.2-.6.7-.7 1-.7h.6c.2 0 .5 0 .7.5l.4 1c.2.4.1.7-.1 1l-.4.5c.6 1 1.6 1.9 2.7 2.4l.5-.4c.3-.2.6-.2 1 0l1 .5c.4.2.5.4.5.7v.6c0 .3-.1.8-.7 1-1 .4-2.8.2-4.9-1.9-2.1-2.1-2.3-3.9-1.9-4.8Z"
        fill="currentColor"
        opacity=".9"
      />
    </svg>
  )
}

function IconRoute(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M6 7a2 2 0 1 0 0 .01V7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M18 17a2 2 0 1 0 0 .01V17Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M8 7h6a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3H9a3 3 0 0 0-3 3v1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Row({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode
  label: string
  value: string
  href?: string
}) {
  const inner = (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-blue-100">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-white/10">
          {icon}
        </span>
        <span className="text-xs opacity-85">{label}</span>
      </div>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  )

  if (!href) return inner

  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className="block rounded-xl p-2 transition hover:bg-white/10"
    >
      {inner}
    </a>
  )
}

export default function ContactRightBlueCard() {
  return (
    <section className="space-y-4">
      <div className="relative overflow-hidden rounded-3xl border border-white/20 shadow-[0_18px_60px_rgba(2,6,23,0.08)]">
        <div className="relative h-[520px] w-full">
          {/* MAPA */}
          <div className="absolute inset-0">
            <iframe
              title="Mapa Operadora Balles"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d234.15614998222438!2d-98.8220113152185!3d20.113244452914266!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d10bbe2374e353%3A0xd814313740663d25!2sOperadora%20Balles!5e0!3m2!1ses-419!2smx!4v1771517239207!5m2!1ses-419!2smx"
              className="h-full w-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Overlay suave sin bloquear interacción */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />

          {/* 🔵 CARD DERECHA (DESKTOP) */}
          <div className="pointer-events-none absolute right-6 top-6 hidden w-[320px] sm:block">
            <div className="pointer-events-auto rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold text-white">
                    Operadora Balles
                  </h2>
                  <p className="text-sm text-blue-100">
                    Pachuca de Soto, Hgo.
                  </p>
                </div>

                <a
                  href="https://www.google.com/maps?ll=20.11327084781714,-98.82201627565635"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-blue-700 transition hover:opacity-90"
                >
                  <IconRoute className="h-4 w-4" />
                  Ruta
                </a>
              </div>

              <div className="mt-4 space-y-2">
                {/* Cambia a tus datos reales */}
                <Row
                  icon={<IconPhone className="h-4 w-4 text-white" />}
                  label="Tel"
                  value="771 000 0000"
                  href="tel:+527710000000"
                />
                <Row
                  icon={<IconMail className="h-4 w-4 text-white" />}
                  label="Email"
                  value="compras@operadoraballes.com"
                  href="mailto:compras@operadoraballes.com"
                />
                <Row
                  icon={<IconWhatsapp className="h-4 w-4 text-white" />}
                  label="WhatsApp"
                  value="+52 771 556 5797"
                  href="https://wa.me/5217715565797"
                />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link
                  href="/productos"
                  className="rounded-xl bg-white/15 py-2 text-center text-sm font-semibold text-white transition hover:bg-white/25"
                >
                  Catálogo
                </Link>
                <Link
                  href="/contacto"
                  className="rounded-xl bg-white py-2 text-center text-sm font-semibold text-blue-700 transition hover:opacity-90"
                >
                  Contacto
                </Link>
              </div>
            </div>
          </div>

          {/* 🔵 CARD MÓVIL (ABAJO) */}
          <div className="absolute inset-x-0 bottom-0 sm:hidden">
            <div className="mx-3 mb-3 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-4 shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-white">Operadora Balles</div>
                <a
                  href="https://www.google.com/maps?ll=20.11327084781714,-98.82201627565635"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-blue-700"
                >
                  <IconRoute className="h-4 w-4" />
                  Ruta
                </a>
              </div>

              <div className="mt-3 space-y-2">
                <Row
                  icon={<IconPhone className="h-4 w-4 text-white" />}
                  label="Tel"
                  value="771 000 0000"
                  href="tel:+527710000000"
                />
                <Row
                  icon={<IconMail className="h-4 w-4 text-white" />}
                  label="Email"
                  value="compras@operadoraballes.com"
                  href="mailto:compras@operadoraballes.com"
                />
                <Row
                  icon={<IconWhatsapp className="h-4 w-4 text-white" />}
                  label="WhatsApp"
                  value="+52 771 556 5797"
                  href="https://wa.me/5217715565797"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
