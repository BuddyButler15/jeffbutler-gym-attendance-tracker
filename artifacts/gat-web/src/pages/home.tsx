import { useState } from "react";
import { Link } from "wouter";
import {
  useListGyms,
  useGetSessionStatus,
  useCheckInGym,
  useCheckOutGym,
  getListGymsQueryKey,
  getGetSessionStatusQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

const BUSYNESS_LABELS: Record<string, string> = {
  quiet: "Quiet",
  moderate: "Moderate",
  busy: "Busy",
  very_busy: "Very Busy",
};

function getOrCreateSessionId(): string {
  let id = localStorage.getItem("gat_session_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("gat_session_id", id);
  }
  return id;
}

export default function Home() {
  const [sessionId] = useState<string>(() => getOrCreateSessionId());
  const queryClient = useQueryClient();

  const { data: gyms, isLoading: loadingGyms } = useListGyms({
    query: {
      queryKey: getListGymsQueryKey(),
      refetchInterval: 30000,
    },
  });

  const { data: session, isLoading: loadingSession } = useGetSessionStatus(sessionId, {
    query: {
      queryKey: getGetSessionStatusQueryKey(sessionId),
      refetchInterval: 30000,
    },
  });

  const checkedInGymId = session?.checkedInGymId ?? null;

  const checkIn = useCheckInGym({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListGymsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetSessionStatusQueryKey(sessionId) });
      },
    },
  });

  const checkOut = useCheckOutGym({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListGymsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetSessionStatusQueryKey(sessionId) });
      },
    },
  });

  const handleCheckIn = (gymId: number) => {
    checkIn.mutate({ id: gymId, data: { sessionId } });
  };

  const handleCheckOut = (gymId: number) => {
    checkOut.mutate({ id: gymId, data: { sessionId } });
  };

  const isLoading = loadingGyms || loadingSession;

  return (
    <div className="min-h-screen bg-background text-foreground" data-testid="home-page">
      <header className="border-b border-border bg-card">
        <div className="max-w-2xl mx-auto px-4 py-5">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight" data-testid="app-title">
                Gym Attendance Tracker
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">University of Iowa</p>
            </div>
            <div className="flex flex-col items-end gap-1 pb-0.5">
              <p className="text-xs text-muted-foreground">by Buddy Butler</p>
              <Link href="/about">
                <a className="text-xs text-primary hover:underline">About this app</a>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        {isLoading ? (
          <div className="space-y-4" data-testid="loading-state">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          gyms?.map((gym) => {
            const isHere = checkedInGymId === gym.id;
            const isElsewhere = checkedInGymId !== null && !isHere;
            const pct = Math.round((gym.currentCount / gym.capacity) * 100);
            const busy = gym.busynessLevel;
            const isPending = checkIn.isPending || checkOut.isPending;

            return (
              <div
                key={gym.id}
                data-testid={`gym-card-${gym.id}`}
                className={`rounded-xl border bg-card p-5 transition-all duration-200 ${
                  isHere ? "border-primary ring-2 ring-primary/20" : "border-border"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2
                        className="text-lg font-semibold leading-tight"
                        data-testid={`gym-name-${gym.id}`}
                      >
                        {gym.name}
                      </h2>
                      {isHere && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                          You are here
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex items-end gap-3">
                      <span
                        className="text-3xl font-black tabular-nums"
                        data-testid={`gym-count-${gym.id}`}
                      >
                        {gym.currentCount}
                      </span>
                      <span className="text-sm text-muted-foreground mb-1">
                        / {gym.capacity} people
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            pct >= 78
                              ? "bg-destructive"
                              : pct >= 55
                              ? "bg-yellow-500"
                              : pct >= 30
                              ? "bg-primary"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                          data-testid={`gym-bar-${gym.id}`}
                        />
                      </div>
                      <span
                        className="text-xs font-medium text-muted-foreground whitespace-nowrap"
                        data-testid={`gym-busyness-${gym.id}`}
                      >
                        {BUSYNESS_LABELS[busy] ?? busy}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 pt-1">
                    {isHere ? (
                      <button
                        data-testid={`checkout-btn-${gym.id}`}
                        onClick={() => handleCheckOut(gym.id)}
                        disabled={isPending}
                        className="px-4 py-2 rounded-lg text-sm font-semibold bg-secondary text-foreground border border-border hover:bg-muted transition-colors disabled:opacity-50"
                      >
                        Check Out
                      </button>
                    ) : (
                      <button
                        data-testid={`checkin-btn-${gym.id}`}
                        onClick={() => handleCheckIn(gym.id)}
                        disabled={isPending || isElsewhere}
                        className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40"
                      >
                        Check In
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        <p className="text-center text-xs text-muted-foreground pt-4">
          Counts update every 30 seconds. Check in when you arrive, check out when you leave.
        </p>
      </main>

      <footer className="border-t border-border mt-12">
        <div className="max-w-2xl mx-auto px-4 py-6 text-center">
          <p className="text-xs text-muted-foreground">
            Gym Attendance Tracker &mdash; a student check-in tool for University of Iowa rec facilities.
            Data is crowd-sourced: counts reflect students who have checked in through this app.
          </p>
        </div>
      </footer>
    </div>
  );
}
