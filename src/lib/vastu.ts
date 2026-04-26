// Vastu rules (simplified, traditional guidance for the 8 directions)
export const DIRECTIONS = ["N","NE","E","SE","S","SW","W","NW"] as const;
export type Direction = typeof DIRECTIONS[number];

export const ROOM_TYPES = [
  "Entrance","Living Room","Kitchen","Master Bedroom","Bedroom","Pooja Room",
  "Bathroom","Study","Dining","Storage",
] as const;
export type RoomType = typeof ROOM_TYPES[number];

const RULES: Record<RoomType, { ideal: Direction[]; avoid: Direction[]; note: string }> = {
  "Entrance": { ideal:["N","E","NE"], avoid:["SW"], note:"East and North entrances welcome prosperity and clarity." },
  "Living Room": { ideal:["N","E","NE"], avoid:["SW"], note:"Open, lighter rooms thrive in the north-east quadrant." },
  "Kitchen": { ideal:["SE"], avoid:["NE","N","SW"], note:"South-east is ruled by Agni — ideal for the cooking flame." },
  "Master Bedroom": { ideal:["SW"], avoid:["NE","SE"], note:"South-west grounds the head of the household." },
  "Bedroom": { ideal:["S","W","NW"], avoid:["NE","SE"], note:"West suits children; NW suits guests." },
  "Pooja Room": { ideal:["NE","E","N"], avoid:["S","SW"], note:"Ishan kona (NE) holds the highest sattva." },
  "Bathroom": { ideal:["NW","W"], avoid:["NE","SE","SW"], note:"Keep wet areas away from the NE energy hub." },
  "Study": { ideal:["NE","E","N"], avoid:["SW"], note:"Face east while studying for sharper focus." },
  "Dining": { ideal:["W","E"], avoid:["SW"], note:"Face east while eating; avoid eating in SW." },
  "Storage": { ideal:["SW","S","W"], avoid:["NE"], note:"Heavy storage anchors the SW." },
};

export type PlacedRoom = { id: string; type: RoomType; direction: Direction };

export interface VastuFinding {
  room: PlacedRoom;
  status: "ideal" | "neutral" | "avoid";
  message: string;
}

export interface VastuResult {
  score: number; // 0-100
  findings: VastuFinding[];
  summary: string;
}

export function analyseVastu(rooms: PlacedRoom[]): VastuResult {
  if (rooms.length === 0) {
    return { score: 0, findings: [], summary: "Place rooms on the compass to see your analysis." };
  }
  const findings: VastuFinding[] = rooms.map(r => {
    const rule = RULES[r.type];
    if (rule.ideal.includes(r.direction)) {
      return { room: r, status: "ideal", message: `${r.type} in ${r.direction} — ${rule.note}` };
    }
    if (rule.avoid.includes(r.direction)) {
      return { room: r, status: "avoid", message: `${r.type} in ${r.direction} is discouraged. Ideal: ${rule.ideal.join(", ")}.` };
    }
    return { room: r, status: "neutral", message: `${r.type} in ${r.direction} is acceptable. Ideal: ${rule.ideal.join(", ")}.` };
  });
  const ideal = findings.filter(f => f.status === "ideal").length;
  const avoid = findings.filter(f => f.status === "avoid").length;
  const score = Math.max(0, Math.round(((ideal - avoid) / rooms.length) * 50 + 50));
  const summary =
    score >= 80 ? "Excellent — your space honours Vastu beautifully." :
    score >= 60 ? "Good foundation with a few easy improvements." :
    score >= 40 ? "Mixed — several rooms could be relocated or remedied." :
    "Significant adjustments recommended for a harmonious flow.";
  return { score, findings, summary };
}
