import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import session from "express-session";
import cors from "cors";
import { storage } from "./storage";
import { createServer } from "http";
import { AddressInfo } from "net";
import { checkPortAvailable } from "./port-check";

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
    : 'http://localhost:5000/',
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

// Simple request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (req.path.startsWith("/api")) {
      log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
    }
  });
  next();
});

(async () => {
  try {
    log('Starting server initialization...');

    // Check if port is available
    const isPortAvailable = await checkPortAvailable(5000);
    if (!isPortAvailable) {
      log('Port 5000 is already in use. Please ensure no other instance is running.');
      process.exit(1);
    }

    const server = await registerRoutes(app);

    // Global error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      console.error('Error:', err);
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    });

    // Cleanup function to ensure proper server shutdown
    const cleanup = () => {
      log('Shutting down server...');
      server.close(() => {
        log('Server closed');
        process.exit(0);
      });
    };

    // Handle process termination
    process.on('SIGTERM', cleanup);
    process.on('SIGINT', cleanup);

    // Setup middleware based on environment
    if (process.env.NODE_ENV !== 'production') {
      log('Setting up Vite development middleware...');
      await setupVite(app, server);
      log('Vite middleware setup complete');
    } else {
      log('Setting up static file serving...');
      serveStatic(app);
      log('Static file serving setup complete');
    }

    // Start server
    server.listen(5000, '0.0.0.0', () => {
      const address = server.address() as AddressInfo;
      log(`Server running at http://localhost:${address.port}`);
    });

  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
})();