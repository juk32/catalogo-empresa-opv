"use client"

import { useEffect, useRef, useState } from "react"

export default function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShow(true)
            io.disconnect()
            break
          }
        }
      },
      { root: null, threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    )

    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={[
        "transition-all duration-700 will-change-transform",
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        delay ? `delay-[${delay}ms]` : "",
        className,
      ].join(" ")}
      style={delay ? ({ transitionDelay: `${delay}ms` } as any) : undefined}
    >
      {children}
    </div>
  )
}
