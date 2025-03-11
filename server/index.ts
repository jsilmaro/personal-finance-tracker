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
    const server = await registerRoutes(app);

    // Global error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      console.error('Error:', err);
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    });

    if (process.env.NODE_ENV !== 'production') {
      log('Setting up Vite middleware...');
      await setupVite(app, server);
      log('Vite middleware setup complete.');
    } else {
      log('Using static file serving...');
      serveStatic(app);
    }

    const MAX_RETRIES = 3;
    const RETRY_DELAY = 1000;
    let retries = 0;

    const startServer = async () => {
      try {
        server.listen(5000, '0.0.0.0', () => {
          log(`Server running at http://0.0.0.0:5000`);
        });
      } catch (error: any) {
        if (error.code === 'EADDRINUSE' && retries < MAX_RETRIES) {
          log(`Port 5000 is in use, retrying in ${RETRY_DELAY}ms...`);
          retries++;
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          await startServer();
        } else {
          throw error;
        }
      }
    };

    await startServer();

  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
})();