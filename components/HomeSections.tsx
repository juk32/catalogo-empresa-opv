"use client"

import Reveal from "@/components/Reveal"

export default function HomeSection({
  title,
  subtitle,
  children,
  delay = 0,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
  delay?: number
}) {
  return (
    <Reveal delay={delay}>
      <section className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-2xl shadow-[0_18px_55px_-40px_rgba(2,6,23,0.18)]">
        <div className="p-5 sm:p-7">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">
              {title}
            </h2>
            {subtitle ? <p className="text-sm text-slate-600">{subtitle}</p> : null}
          </div>

          <div className="mt-5">{children}</div>
        </div>
      </section>
    </Reveal>
  )
}
