export default function Head() {
  return (
    <>
      {/* Explicit favicon links to ensure broad browser support (SVG + PNG fallback) */}
      <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      <link rel="icon" href="/web-app-manifest-192x192.png" sizes="192x192" />
      <link rel="apple-touch-icon" href="/web-app-manifest-192x192.png" />
      <meta name="theme-color" content="#9B292C" />
    </>
  );
}
