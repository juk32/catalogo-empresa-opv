export default function NeonFX() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="neon-aurora" />
      <div className="neon-grid" />
      <div className="neon-particles" />
      <div className="neon-scanline" />
    </div>
  )
}
