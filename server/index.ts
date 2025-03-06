import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import session from "express-session";
import cors from "cors";
import { storage } from "./storage";

declare module 'express-session' {
  interface SessionData {
    passport: {
      user?: number;
    };
  }
}

const app = express();

// Enable CORS with credentials for development
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CLIENT_URL 
    : 'http://localhost:5000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add session middleware before routes
app.use(session({
  secret: process.env.SESSION_SECRET || 'development_secret',
  resave: false,
  saveUninitialized: false,
  store: storage.sessionStore,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 120) {
        logLine = logLine.slice(0, 119) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    const server = await registerRoutes(app);

    // Global error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      console.error('Error:', err);
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    });

    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Try primary port, fall back to alternative if needed
    const tryPort = (port: number): Promise<number> => {
      return new Promise((resolve, reject) => {
        server.listen({
          port,
          host: "0.0.0.0",
          reusePort: true,
        }, () => {
          log(`Server running at http://0.0.0.0:${port}`);
          resolve(port);
        }).on('error', (err: any) => {
          if (err.code === 'EADDRINUSE') {
            log(`Port ${port} is busy, trying alternative port`);
            resolve(0); // Signal to try another port
          } else {
            reject(err);
          }
        });
      });
    };
    
    // Try port 5000 first, then fall back to random port if needed
    const port = await tryPort(5000) || await tryPort(0);
    if (port === 0) {
      const address = server.address();
      if (address && typeof address !== 'string') {
        log(`Server running at http://0.0.0.0:${address.port}`);
      }
    }
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
})();