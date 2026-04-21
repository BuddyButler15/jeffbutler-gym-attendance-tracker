import { Link } from "wouter";

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="max-w-2xl mx-auto px-4 py-5">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Gym Attendance Tracker</h1>
              <p className="text-sm text-muted-foreground mt-0.5">University of Iowa</p>
            </div>
            <p className="text-xs text-muted-foreground pb-0.5">by Buddy Butler</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        <Link href="/" className="text-sm text-primary hover:underline">
          &larr; Back to the app
        </Link>

        <h2 className="text-xl font-bold">About</h2>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Gym Attendance Tracker (GAT) is a crowd-sourced check-in app built for University of Iowa students. It shows live headcounts for the three main rec facilities on campus — CRWC, Field House, and Fitness East — so you can see how busy each gym is before you make the trip.
        </p>

        <p className="text-sm text-muted-foreground leading-relaxed">
          When you arrive at a gym, tap Check In. When you leave, tap Check Out. Your count is added to and removed from the live total instantly, and everyone else using the app sees it update in real time.
        </p>

        <p className="text-sm text-muted-foreground leading-relaxed">
          No account or login is required. The app uses a random ID stored in your browser to keep track of where you are checked in. Check-ins expire automatically after 3 hours so the counts stay accurate even if someone forgets to check out.
        </p>

        <p className="text-sm text-muted-foreground leading-relaxed">
          The counts are crowd-sourced, meaning they only reflect students who use this app — there is no connection to the university's ID card system. The more students who use GAT, the more accurate the counts become.
        </p>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Designed and built by Buddy Butler, University of Iowa, 2025.
        </p>
      </main>

      <footer className="border-t border-border mt-12">
        <div className="max-w-2xl mx-auto px-4 py-6 text-center">
          <p className="text-xs text-muted-foreground">
            Gym Attendance Tracker &mdash; a student check-in tool for University of Iowa rec facilities.
          </p>
        </div>
      </footer>
    </div>
  );
}
