import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <header className="flex justify-between items-center mb-16">
          <h1 className="text-4xl font-bold text-foreground">Centsible</h1>
          <nav>
            {user ? (
              <Link href="/dashboard">
                <Button variant="outline">Go to Dashboard</Button>
              </Link>
            ) : (
              <Link href="/auth">
                <Button variant="outline">Sign In</Button>
              </Link>
            )}
          </nav>
        </header>

        <main className="text-center">
          <h2 className="text-6xl font-bold text-foreground mb-6">
            Take Control of Your Finances
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Track expenses, set savings goals, and make smarter financial decisions
            with Centsible - your personal finance companion.
          </p>

          {!user && (
            <Link href="/auth">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Get Started
              </Button>
            </Link>
          )}
        </main>

        <section className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card/50 backdrop-blur-lg rounded-lg p-6 text-card-foreground">
            <h3 className="text-xl font-semibold mb-4">Track Expenses</h3>
            <p>Monitor your spending habits and categorize transactions easily.</p>
          </div>

          <div className="bg-card/50 backdrop-blur-lg rounded-lg p-6 text-card-foreground">
            <h3 className="text-xl font-semibold mb-4">Set Goals</h3>
            <p>Create and track savings goals to achieve your financial targets.</p>
          </div>

          <div className="bg-card/50 backdrop-blur-lg rounded-lg p-6 text-card-foreground">
            <h3 className="text-xl font-semibold mb-4">Analyze Trends</h3>
            <p>Visualize your financial patterns with intuitive charts and graphs.</p>
          </div>
        </section>
      </div>
    </div>
  );
}