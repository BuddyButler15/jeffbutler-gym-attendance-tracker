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

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">

        <div>
          <Link href="/">
            <a className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
              Back to the app
            </a>
          </Link>
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">About GAT</h2>
          <p className="text-muted-foreground text-sm">Gym Attendance Tracker — a student check-in tool</p>
        </div>

        <section className="space-y-3" aria-labelledby="problem-heading">
          <h3 id="problem-heading" className="text-base font-semibold">The Problem</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Students at the University of Iowa balance packed schedules — class, work, extracurriculars — and when they carve out 45 minutes to work out, the last thing they can afford is arriving at an overcrowded gym. There's currently no way to know how busy a facility is before you walk through the door.
          </p>
        </section>

        <section className="space-y-3" aria-labelledby="solution-heading">
          <h3 id="solution-heading" className="text-base font-semibold">The Solution</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            GAT is a crowd-sourced check-in app. Students tap <strong className="text-foreground">Check In</strong> when they arrive and <strong className="text-foreground">Check Out</strong> when they leave. The live count is visible to anyone — no account, no login, no download required.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The more students use it, the more accurate the counts become. GAT gets more useful with every check-in.
          </p>
        </section>

        <section className="space-y-3" aria-labelledby="how-heading">
          <h3 id="how-heading" className="text-base font-semibold">How it Works</h3>
          <ol className="space-y-2 list-none">
            {[
              ["Arrive at the gym", "Tap Check In on that gym's card. Your count is added to the live total instantly."],
              ["Leave the gym", "Tap Check Out on your way out. The count drops in real time for everyone watching."],
              ["Check before you go", "Open the app before heading over to see how busy each facility is right now."],
            ].map(([title, desc], i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-medium">{title}</p>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="space-y-3" aria-labelledby="gyms-heading">
          <h3 id="gyms-heading" className="text-base font-semibold">Supported Facilities</h3>
          <div className="grid gap-2">
            {[
              ["CRWC", "Campus Recreation & Wellness Center — fitness equipment, pools, courts, and a climbing wall.", 350],
              ["Field House", "Indoor track and weight room at the heart of campus — great between classes.", 150],
              ["Fitness East", "Cardio and strength training on the east side — often the quietest option.", 120],
            ].map(([name, desc, cap]) => (
              <div key={name as string} className="rounded-lg border border-border bg-card p-4 flex gap-4 items-start">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs text-muted-foreground">capacity</p>
                  <p className="text-sm font-bold">{cap}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3" aria-labelledby="data-heading">
          <h3 id="data-heading" className="text-base font-semibold">About the Data</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Counts are crowd-sourced — they reflect students who have checked in through this app. There is no integration with the university's ID card system. Each check-in is anonymous and stored using a random ID in your browser. Check-ins expire automatically after 3 hours so stale data never builds up.
          </p>
        </section>

        <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-primary">BB</span>
          </div>
          <div>
            <p className="text-sm font-semibold">Buddy Butler</p>
            <p className="text-xs text-muted-foreground">University of Iowa &mdash; Product Design Project, 2025</p>
          </div>
        </div>

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
