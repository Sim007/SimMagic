/** @type {import('next').NextConfig} */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://simmagic.example.com";

// Decap CMS is loaded from unpkg.com. The CSP allows that and GitHub API access.
// 'unsafe-inline' is required for Decap and for Tailwind CSS-in-JS.
const ContentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' https://unpkg.com",
  "style-src 'self' 'unsafe-inline' https://unpkg.com https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  `connect-src 'self' ${siteUrl} https://api.github.com https://unpkg.com http://localhost:8081 http://127.0.0.1:8081`,
  "worker-src 'self' blob:",
  "frame-src 'self'",
  "form-action 'self'",
  "base-uri 'self'"
].join("; ");

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()"
  },
  { key: "Content-Security-Policy", value: ContentSecurityPolicy }
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
        headers: securityHeaders
      }
    ];
  }
};

export default nextConfig;
