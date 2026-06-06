/** @type {import('next').NextConfig} */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://simmagic.example.com";

// Strict CSP for the public site. Next.js requires 'unsafe-inline' for hydration
// scripts/styles without a nonce-based middleware setup; everything else is locked down.
const SiteCSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  `connect-src 'self' ${siteUrl}`,
  "worker-src 'self' blob:",
  "frame-src 'self'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'"
].join("; ");

// Decap CMS (served from /admin) is loaded from unpkg.com and needs 'unsafe-eval'
// for its bundle plus access to the GitHub API.
const AdminCSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' https://unpkg.com",
  "style-src 'self' 'unsafe-inline' https://unpkg.com https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  `connect-src 'self' ${siteUrl} https://api.github.com https://unpkg.com http://localhost:8081 http://127.0.0.1:8081`,
  "worker-src 'self' blob:",
  "frame-src 'self'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'"
].join("; ");

const commonHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload"
  },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()"
  }
];

const siteHeaders = [
  ...commonHeaders,
  { key: "Content-Security-Policy", value: SiteCSP }
];

const adminHeaders = [
  ...commonHeaders,
  { key: "Content-Security-Policy", value: AdminCSP }
];

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      }
    ]
  },
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/admin/index.html",
        permanent: false
      },
      {
        source: "/admin/",
        destination: "/admin/index.html",
        permanent: false
      }
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: siteHeaders
      },
      {
        source: "/admin/:path*",
        headers: adminHeaders
      }
    ];
  }
};

export default nextConfig;
