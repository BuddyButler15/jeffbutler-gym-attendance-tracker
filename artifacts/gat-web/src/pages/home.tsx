import { useState, useMemo } from "react";
import { format } from "date-fns";
import { 
  useListGyms, 
  useGetGymTrends, 
  getGetGymTrendsQueryKey 
} from "@workspace/api-client-react";
import type { GymWithOccupancy, OccupancyTrend } from "@workspace/api-client-react/src/generated/api.schemas";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { MapPin, Users, Activity, Clock, AlertCircle } from "lucide-react";

const BUSYNESS_COLORS = {
  quiet: "bg-green-500",
  moderate: "bg-yellow-500",
  busy: "bg-orange-500",
  very_busy: "bg-red-500"
};

const BUSYNESS_LABELS = {
  quiet: "Quiet",
  moderate: "Moderate",
  busy: "Busy",
  very_busy: "Very Busy"
};

const DAYS_OF_WEEK = [
  { value: "0", label: "Sunday" },
  { value: "1", label: "Monday" },
  { value: "2", label: "Tuesday" },
  { value: "3", label: "Wednesday" },
  { value: "4", label: "Thursday" },
  { value: "5", label: "Friday" },
  { value: "6", label: "Saturday" },
];

export default function Home() {
  const [selectedGymId, setSelectedGymId] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>(new Date().getDay().toString());

  const { data: gyms, isLoading: isLoadingGyms, dataUpdatedAt } = useListGyms({
    query: {
      refetchInterval: 45000,
    }
  });

  const { data: trends, isLoading: isLoadingTrends } = useGetGymTrends(selectedGymId!, {
    query: {
      enabled: !!selectedGymId,
      queryKey: getGetGymTrendsQueryKey(selectedGymId!),
    }
  });

  const selectedGym = useMemo(() => {
    if (!gyms || !selectedGymId) return null;
    return gyms.find(g => g.id === selectedGymId) || null;
  }, [gyms, selectedGymId]);

  const chartData = useMemo(() => {
    if (!trends) return [];
    return trends
      .filter(t => t.dayOfWeek.toString() === selectedDay)
      .sort((a, b) => a.hour - b.hour)
      .map(t => ({
        ...t,
        formattedHour: format(new Date().setHours(t.hour), "h a"),
      }));
  }, [trends, selectedDay]);

  const lastUpdatedStr = dataUpdatedAt ? format(dataUpdatedAt, "h:mm:ss a") : null;

  return (
    <div className="min-h-screen bg-background text-foreground pb-12 font-sans selection:bg-primary selection:text-primary-foreground">
      <header className="sticky top-0 z-10 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Gym Attendance</h1>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                {lastUpdatedStr ? `Live updated at ${lastUpdatedStr}` : "Connecting..."}
              </p>
            </div>
            <div className="hidden sm:flex bg-secondary px-3 py-1.5 rounded-full text-xs font-medium text-secondary-foreground">
              University of Iowa
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {/* Gyms Grid */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isLoadingGyms ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full rounded-xl" />
              ))
            ) : gyms?.map((gym) => (
              <GymCard 
                key={gym.id} 
                gym={gym} 
                isSelected={selectedGymId === gym.id}
                onClick={() => setSelectedGymId(gym.id === selectedGymId ? null : gym.id)}
              />
            ))}
          </div>
        </section>

        {/* Trends Section */}
        {selectedGymId && selectedGym && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="p-6 overflow-hidden rounded-xl border-border bg-card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-xl font-bold">{selectedGym.shortName} Trends</h2>
                  <p className="text-sm text-muted-foreground">Typical occupancy by hour</p>
                </div>
                <Select value={selectedDay} onValueChange={setSelectedDay}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS_OF_WEEK.map(day => (
                      <SelectItem key={day.value} value={day.value}>
                        {day.value === new Date().getDay().toString() ? "Today" : day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="h-64 w-full">
                {isLoadingTrends ? (
                  <Skeleton className="h-full w-full" />
                ) : chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="formattedHour" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                        minTickGap={15}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip
                        cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload as typeof chartData[0];
                            return (
                              <div className="bg-popover border border-border p-3 rounded-lg shadow-lg">
                                <p className="font-medium text-popover-foreground mb-1">{data.formattedHour}</p>
                                <p className="text-sm text-muted-foreground flex items-center justify-between gap-4">
                                  <span>Occupancy:</span>
                                  <span className="font-bold text-foreground">{data.capacityPercent}%</span>
                                </p>
                                <p className="text-sm text-muted-foreground flex items-center justify-between gap-4">
                                  <span>Est. Count:</span>
                                  <span className="font-bold text-foreground">{data.avgCount}</span>
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar 
                        dataKey="capacityPercent" 
                        radius={[4, 4, 0, 0]}
                        fill="hsl(var(--primary))"
                      >
                        {chartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`}
                            fill={entry.capacityPercent > 80 ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
                            fillOpacity={entry.capacityPercent > 80 ? 0.9 : 1}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No trend data available for this day.
                  </div>
                )}
              </div>
            </Card>
          </section>
        )}

        {/* About Section */}
        <section className="pt-8 border-t border-border/50">
          <div className="bg-secondary/50 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm mb-1">About this data</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This application is a prototype designed to pitch to UI Rec Services. The occupancy counts shown are simulated based on typical peak-hour patterns at the university gyms. Real-time accuracy would require integration with the university's ID scanner system.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

function GymCard({ gym, isSelected, onClick }: { gym: GymWithOccupancy, isSelected: boolean, onClick: () => void }) {
  const isBusy = gym.busynessLevel === "busy" || gym.busynessLevel === "very_busy";
  
  return (
    <button
      onClick={onClick}
      className={`group relative text-left w-full transition-all duration-200 overflow-hidden ${
        isSelected 
          ? "ring-2 ring-primary ring-offset-2 ring-offset-background" 
          : "hover:ring-1 hover:ring-border hover:-translate-y-1"
      }`}
    >
      <Card className="h-full p-5 rounded-xl border-border bg-card flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{gym.shortName}</h3>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <MapPin className="w-3 h-3 mr-1 opacity-70" />
              {gym.location}
            </p>
          </div>
          <div className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${isBusy ? 'bg-destructive/10 text-destructive' : 'bg-primary/20 text-foreground'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${BUSYNESS_COLORS[gym.busynessLevel]}`} />
            {BUSYNESS_LABELS[gym.busynessLevel]}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-end mb-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black tracking-tight">{gym.capacityPercent}%</span>
              <span className="text-sm text-muted-foreground font-medium">full</span>
            </div>
            <div className="text-xs text-muted-foreground flex items-center">
              <Users className="w-3 h-3 mr-1 opacity-70" />
              {gym.currentCount} / {gym.capacity}
            </div>
          </div>
          
          <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out ${
                gym.capacityPercent > 80 
                  ? "bg-destructive" 
                  : gym.capacityPercent > 50 
                    ? "bg-yellow-500" 
                    : "bg-primary"
              }`}
              style={{ width: `${gym.capacityPercent}%` }}
            />
          </div>
        </div>
      </Card>
    </button>
  );
}
