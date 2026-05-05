import { Link } from "wouter";

export default function Profile() {
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

      <main className="max-w-2xl mx-auto px-4 py-10 space-y-8">
        <Link href="/" className="text-sm text-primary hover:underline">
          &larr; Back to the app
        </Link>

        <div className="flex items-center gap-5">
          <img
            src="/images/jeff-butler.png"
            alt="Jeff Butler"
            className="w-20 h-20 rounded-full object-cover object-[center_30%] shrink-0 border-2 border-border"
          />
          <div>
            <h2 className="text-xl font-bold">Buddy Butler</h2>
            <p className="text-sm text-muted-foreground">University of Iowa &mdash; Business Analytics &amp; Information Systems, Class of 2027</p>
          </div>
        </div>

        <section className="space-y-3">
          <h3 className="font-semibold">About Me</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            I'm a student at the University of Iowa studying Business Analytics and Information Systems. I built Gym Attendance Tracker because I kept showing up to the CRWC only to find it packed — I wanted a simple way to check gym busyness before making the trip.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            GAT is a crowd-sourced check-in app that gives Iowa students real-time headcounts for CRWC, Field House, and Fitness East. The more students use it, the more accurate it gets.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="font-semibold">The Project</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            GAT was built as part of a product development course at the University of Iowa. It uses a React frontend, a Node.js API, and a PostgreSQL database — deployed on Azure and hosted at{" "}
            <a href="https://www.buddybutler.me" className="text-primary underline underline-offset-2">
              buddybutler.me
            </a>.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="font-semibold">Contact</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Have feedback or ideas? I'd love to hear from you.
          </p>
          <a
            href="mailto:jeffbutler@uiowa.edu"
            className="inline-block px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            Get in touch
          </a>
        </section>
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
