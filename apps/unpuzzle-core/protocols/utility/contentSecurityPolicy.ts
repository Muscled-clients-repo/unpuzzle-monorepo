import helmet from 'helmet';

const origin = process.env.CORE_URL_ENDPOINT || "https://dev.nazmulcodes.org"
const studentAppUrl = process.env.STUDENT_APP_URL || "https://nazmulcodes.org"
const socketUrl = process.env.SOCKET_IO_URL || origin

export const contentSecurityPolicy = {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": [
        "'self'",
        origin,
        studentAppUrl,
        socketUrl,
        "https://hopeful-skink-17.clerk.accounts.dev",
        "https://above-goldfish-15.clerk.accounts.dev",
      ],
      "default-src": [
        "'self'",
        origin,
        studentAppUrl,
        socketUrl,
        "https://www.youtube.com",
        "https://challenges.cloudflare.com",
        "https://js.stripe.com",
      ],
      "script-src-elem": [
        "'self'",
        "'unsafe-inline'",
        origin,
        studentAppUrl,
        "https://www.youtube.com",
        "https://cdn.jsdelivr.net",
        "https://challenges.cloudflare.com",
        "https://hopeful-skink-17.clerk.accounts.dev",
        "https://above-goldfish-15.clerk.accounts.dev",
        "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js",
        "https://esm.sh",
        "https://cdn.socket.io",
        "https://cdnjs.cloudflare.com",
        "https://unpkg.com",
        "https://js.stripe.com",
      ],
      "connect-src": [
        "'self'",
        ...(process.env.M1_URL_ENDPOINT ? [process.env.M1_URL_ENDPOINT] : []),
        origin,
        studentAppUrl,
        socketUrl,
        `wss://${new URL(origin).host}`,
        `ws://${new URL(origin).host}`,
        `wss://${new URL(socketUrl).host}`,
        `ws://${new URL(socketUrl).host}`,
        "https://clerk-telemetry.com",
        "https://hopeful-skink-17.clerk.accounts.dev",
        "https://above-goldfish-15.clerk.accounts.dev",
        "https://googleads.g.doubleclick.net"
      ],
      "worker-src": [
        "'self'",
        "blob:",
        origin,
        studentAppUrl,
        "https://hopeful-skink-17.clerk.accounts.dev",
        "https://above-goldfish-15.clerk.accounts.dev",
      ],
      "img-src": [
        "'self'",
        "data:",
        origin,
        studentAppUrl,
        "https://i.ytimg.com",
        "https://img.clerk.com",
        "https://hopeful-skink-17.clerk.accounts.dev",
        "https://above-goldfish-15.clerk.accounts.dev",
      ],
      "media-src": [
        "'self'",
        "blob:",
        origin,
        studentAppUrl,
        "https://www.w3schools.com",
      ],
      "style-src": [
        "'self'",
        "'unsafe-inline'",
        origin,
        studentAppUrl,
        "https://unpkg.com",
      ],
      "font-src": [
        "'self'",
        origin,
        studentAppUrl,
        "data:",
      ],
    },
  }