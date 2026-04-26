import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DIRECTIONS, Direction, ROOM_TYPES, RoomType, PlacedRoom, analyseVastu } from "@/lib/vastu";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Compass, Plus, Trash2, Loader2 } from "lucide-react";

const Vastu = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rooms, setRooms] = useState<PlacedRoom[]>([
    { id: crypto.randomUUID(), type: "Entrance", direction: "E" },
    { id: crypto.randomUUID(), type: "Kitchen", direction: "SE" },
  ]);
  const [type, setType] = useState<RoomType>("Living Room");
  const [direction, setDirection] = useState<Direction>("N");
  const [saving, setSaving] = useState(false);

  const addRoom = () => setRooms(r => [...r, { id: crypto.randomUUID(), type, direction }]);
  const removeRoom = (id: string) => setRooms(r => r.filter(x => x.id !== id));

  const analyse = async () => {
    const result = analyseVastu(rooms);
    if (user) {
      setSaving(true);
      const { data, error } = await supabase.from("reports").insert({
        user_id: user.id, type: "vastu", title: `Vastu reading · ${new Date().toLocaleDateString()}`,
        input: { rooms } as any, result: result as any,
      }).select().single();
      setSaving(false);
      if (error) toast.error(error.message);
      navigate("/vastu/report", { state: { result, rooms, reportId: data?.id } });
    } else {
      navigate("/vastu/report", { state: { result, rooms } });
    }
  };

  // Compass positions
  const positions: Record<Direction, { x: number; y: number }> = {
    N:  { x: 50, y: 8 },  NE: { x: 80, y: 20 },
    E:  { x: 92, y: 50 }, SE: { x: 80, y: 80 },
    S:  { x: 50, y: 92 }, SW: { x: 20, y: 80 },
    W:  { x: 8,  y: 50 }, NW: { x: 20, y: 20 },
  };

  return (
    <section className="container py-12 md:py-16">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Tool</p>
        <h1 className="text-4xl md:text-5xl font-serif mt-2">Room Vastu Analyser</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          Place each room of your home in the direction it occupies. We'll evaluate alignment and
          suggest where each room would thrive.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        {/* Compass canvas */}
        <div className="rounded-2xl border border-border bg-card p-6 md:p-10 shadow-elegant">
          <div className="relative mx-auto aspect-square max-w-xl">
            <div className="absolute inset-0 rounded-full gradient-hero" />
            <div className="absolute inset-4 rounded-full border-2 border-gold/40" />
            <div className="absolute inset-12 rounded-full border border-primary-foreground/20" />
            {/* Cardinal labels */}
            {DIRECTIONS.map(d => (
              <div key={d}
                className="absolute -translate-x-1/2 -translate-y-1/2 text-xs font-medium text-gold tracking-widest"
                style={{ left: `${positions[d].x}%`, top: `${positions[d].y}%` }}>
                {d}
              </div>
            ))}
            {/* Center compass */}
            <div className="absolute inset-0 grid place-items-center text-gold/70">
              <Compass className="h-16 w-16" strokeWidth={1} />
            </div>
            {/* Placed room dots */}
            {rooms.map((r, i) => {
              const p = positions[r.direction];
              const offset = (i % 3) * 6 - 6;
              return (
                <div key={r.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: `${p.x + offset}%`, top: `${p.y + offset * 0.6}%` }}>
                  <div className="h-3 w-3 rounded-full bg-gold ring-4 ring-gold/30" />
                  <span className="absolute left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap text-[10px] text-primary-foreground/90 bg-primary px-1.5 py-0.5 rounded">
                    {r.type}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar — add rooms list */}
        <div className="space-y-5">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-serif text-xl">Add a room</h3>
            <div className="mt-4 space-y-3">
              <Select value={type} onValueChange={(v) => setType(v as RoomType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{ROOM_TYPES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={direction} onValueChange={(v) => setDirection(v as Direction)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{DIRECTIONS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
              <Button onClick={addRoom} variant="outline" className="w-full"><Plus className="h-4 w-4" /> Add room</Button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-serif text-xl mb-3">Placed rooms ({rooms.length})</h3>
            <ul className="space-y-2 max-h-72 overflow-auto">
              {rooms.length === 0 && <li className="text-sm text-muted-foreground">No rooms added yet.</li>}
              {rooms.map(r => (
                <li key={r.id} className="flex items-center justify-between rounded-md bg-secondary/50 px-3 py-2 text-sm">
                  <span><span className="font-medium">{r.type}</span> · {r.direction}</span>
                  <button onClick={() => removeRoom(r.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                </li>
              ))}
            </ul>
          </div>

          <Button variant="hero" size="lg" className="w-full" onClick={analyse} disabled={rooms.length === 0 || saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />} Analyse my space
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Vastu;
