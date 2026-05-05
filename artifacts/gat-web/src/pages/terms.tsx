import { Link } from "wouter";

export default function Terms() {
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

        <div>
          <h2 className="text-xl font-bold">Terms of Use &amp; Privacy Policy</h2>
          <p className="text-xs text-muted-foreground mt-1">Last updated: May 2025</p>
        </div>

        <section className="space-y-3">
          <h3 className="font-semibold">1. About This App</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Gym Attendance Tracker (GAT) is a crowd-sourced, student-built tool for tracking gym occupancy at University of Iowa recreational facilities. It is not affiliated with, endorsed by, or connected to the University of Iowa or UI Recreation Services.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="font-semibold">2. No Account Required</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            GAT does not require you to create an account or provide any personal information. A randomly generated anonymous session ID is stored in your browser's local storage solely to track your check-in state across page loads. This ID cannot be linked to your identity.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="font-semibold">3. Data We Collect</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We collect the following data:
          </p>
          <ul className="text-sm text-muted-foreground leading-relaxed list-disc list-inside space-y-1">
            <li>Anonymous check-in and check-out events (gym ID, timestamp, anonymous session ID)</li>
            <li>Aggregated gym occupancy counts</li>
            <li>Usage analytics via Google Analytics (page views, session duration, general location by country/region)</li>
          </ul>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We do not collect your name, email, student ID, or any personally identifiable information.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="font-semibold">4. Cookies &amp; Analytics</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This site uses Google Analytics 4 to understand how the app is used. Google Analytics uses cookies to track anonymous usage patterns. By accepting cookies, you consent to this data being collected and processed by Google. You can opt out at any time by clicking "Decline" on the cookie banner or using the{" "}
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
              Google Analytics Opt-out Browser Add-on
            </a>.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="font-semibold">5. Data Accuracy</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Occupancy counts are crowd-sourced and reflect only users of this app. They are estimates and may not accurately represent actual gym capacity. Do not rely on this data for health or safety decisions.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="font-semibold">6. Data Retention</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Check-in records are automatically expired after 3 hours. Aggregated usage data may be retained for up to 12 months for analytics purposes.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="font-semibold">7. Contact</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Questions or concerns? Reach out via{" "}
            <a href="https://buddybutler.me" className="text-primary underline underline-offset-2">
              buddybutler.me
            </a>.
          </p>
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
