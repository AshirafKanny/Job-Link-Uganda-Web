/* eslint-disable @next/next/no-img-element -- static brand SVG in the admin */

/** Login-screen logo for the admin. */
export function AdminLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
      <img src="/brand/job-link-uganda-logo.svg" alt="" width={64} height={64} />
      <div style={{ lineHeight: 1.1 }}>
        <div style={{ fontWeight: 800, fontSize: '1.35rem', letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
          Job <span style={{ color: '#d91519' }}>Link</span> Uganda
        </div>
        <div style={{ fontSize: '0.8rem', letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.65, marginTop: 4 }}>
          Admin
        </div>
      </div>
    </div>
  )
}
