// Importing the environment variables
import "dotenv/config";
import "./protocols/utility/logger";
import { logger, requestLogger } from "./utils/logger";

// Importing the necessary modules
import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { clerkMiddleware } from "@clerk/express";
import { contentSecurityPolicy } from "./protocols/utility/contentSecurityPolicy";
import http from "http";
import youtubeTranscript from "./contexts/services/youtubeTranscript";
// Middleware
import clerkClient from "./protocols/middleware/ClerkClient";

// Importing the routes
import routes from "./protocols/routes/index";
import { SocketService } from "./protocols/utility/socket";

const app: Express = express();
const port = process.env.PORT || 3001;

// Create HTTP server
const server = http.createServer(app);

// Log startup information
logger.info("Starting Unpuzzle server", { port });

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Middleware
app.use(
  helmet({
    contentSecurityPolicy: contentSecurityPolicy,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// Origins
const m1Server = process.env.M1_URL_ENDPOINT || "http://localhost:4000";
const clientServer =
  process.env.CORE_URL_ENDPOINT || "https://dev.nazmulcodes.org";
const studentAppUrl = process.env.STUDENT_APP_URL || "http://localhost:3000";
const instructorAppUrl =
  process.env.INSTRUCTOR_APP_URL || "https://instructor.nazmulcodes.org"; // Fixed typo
const rootDomain = process.env.ROOT_APP_URL || "https://nazmulcodes.org";
const socketUrl =
  process.env.SOCKET_IO_URL ||
  process.env.CORE_URL_ENDPOINT ||
  "https://dev.nazmulcodes.org";


// Set of allowed origins
const allowedOrigins = new Set([
  m1Server,
  clientServer,
  studentAppUrl,
  instructorAppUrl,
  rootDomain,
  "https://www.nazmulcodes.org", // Added additional domains
  "https://student.nazmulcodes.org", // Explicitly add student domain
  "https://dev.nazmulcodes.org", // Explicitly add dev domain

]);

// Update your CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }, // Remove any undefined values
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Cookie",
    ],
    exposedHeaders: ["Set-Cookie"],
  })
);

app.options("*", cors());

// Apply JSON body parser to all routes except Stripe webhooks
app.use((req, res, next) => {
  if (req.originalUrl === "/api/stripe/credit-webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Initialize SocketService
const socketService = new SocketService(app);
socketService.initSocket(server);

// Global variables for all views
app.locals.ASSET_ORIGIN = clientServer;
app.locals.SOCKET_IO_URL = socketUrl;
app.locals.isProduction = process.env.DEBUG == "false";

app.locals.name = "Unpuzzle";
app.locals.currentYear = new Date().getFullYear();
app.locals.clerkPublishableKey = process.env.CLERK_PUBLISHABLE_KEY;

app.use(express.static(path.join(__dirname, "public")));

// Clerk authentication
app.use(clerkMiddleware());

app.use(clerkClient.getUser);

app.use((req, res, next) => {
  // console.log(req.user)
  next();
});

// Routes
app.use("/", routes);
app.post("/", async (req, res) => {
  try {
    const response = await youtubeTranscript.fetchTranscript("v4t0E3S1N1k");
    return res.send(response);
  } catch (error: any) {
    return res.send({ message: error?.message, error });
  }
});
// Add request logging middleware
app.use(requestLogger);

// Error handling middleware
app.use((err: Error, req: Request, res: Response) => {
  logger.error("Unhandled error", err);
  res.status(500).render("pages/error", {
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

// Start server
server.listen(port, () => {
  logger.info(`⚡️ Server is running at http://localhost:${port}`);
});

// Graceful shutdown handling
const shutdown = () => {
  logger.info("Shutdown signal received: closing HTTP server");
  server.close(() => {
    logger.info("HTTP server closed");
    process.exit(0);
  });

  // Force shutdown after 5 seconds
  setTimeout(() => {
    logger.error(
      "Could not close connections in time, forcefully shutting down"
    );
    process.exit(1);
  }, 5000);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
