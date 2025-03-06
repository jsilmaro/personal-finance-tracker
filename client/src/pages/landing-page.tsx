
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-16">
          <h1 className="text-3xl font-bold text-foreground">Centsible</h1>
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

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Copy */}
          <div className="space-y-6">
            <div className="inline-flex px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              Simple. Intuitive. Powerful.
            </div>
            
            <h2 className="text-5xl font-bold leading-tight">
              Track Your Finances <br /> with Centsible
            </h2>
            
            <p className="text-lg text-muted-foreground">
              Gain control of your financial journey with our intuitive tracking and
              visualization tools. Manage expenses, set goals, and make smarter
              decisions with your money.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href={user ? "/dashboard" : "/auth"}>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth">
                <Button variant="outline">
                  Already have an account? Sign in
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Right Column - Dashboard Preview */}
          <div className="rounded-xl bg-card/50 backdrop-blur-sm p-6 shadow-lg">
            <div className="aspect-[16/9] bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Dashboard Preview</h3>
                <p className="text-muted-foreground px-8">
                  Visualize your finances with intuitive charts and detailed breakdowns.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-card hover:bg-card-hover transition-colors rounded-lg p-6 shadow-sm">
            <div className="h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Expense Tracking</h3>
            <p className="text-muted-foreground">
              Keep track of every dollar spent with detailed categorization.
            </p>
          </div>

          <div className="bg-card hover:bg-card-hover transition-colors rounded-lg p-6 shadow-sm">
            <div className="h-12 w-12 rounded-full bg-rose-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Budget Goals</h3>
            <p className="text-muted-foreground">
              Set and monitor savings goals for your future plans.
            </p>
          </div>

          <div className="bg-card hover:bg-card-hover transition-colors rounded-lg p-6 shadow-sm">
            <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Analytics</h3>
            <p className="text-muted-foreground">
              Powerful visualizations to understand your spending habits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
