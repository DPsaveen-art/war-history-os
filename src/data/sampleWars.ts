import { War } from "@/types/war";

export const sampleWars: War[] = [
  {
    id: "ww2",
    title: "World War II",
    alternateNames: ["Second World War"],
    startYear: 1939,
    endYear: 1945,
    era: "20th Century",
    region: "Global",
    summary:
      "A global war involving most of the world's nations, fought between 1939 and 1945.",
    background:
      "The war emerged from unresolved tensions after World War I, economic instability, militarism, and expansionist regimes.",
    deepCauses: [
      "Treaty of Versailles resentment",
      "Rise of fascism",
      "Economic instability",
      "Expansionist nationalism"
    ],
    immediateCauses: [
      "German aggression in Europe",
      "Failure of appeasement"
    ],
    triggerEvent: "Germany invaded Poland in 1939.",
    belligerents: ["Allied Powers", "Axis Powers"],
    leaders: ["Winston Churchill", "Franklin D. Roosevelt", "Joseph Stalin", "Adolf Hitler"],
    majorBattles: ["Battle of Stalingrad", "D-Day", "Battle of Midway"],
    turningPoints: ["Stalingrad", "Midway", "Normandy landings"],
    outcome: "Allied victory.",
    consequences: [
      "Massive human loss",
      "Creation of the United Nations",
      "Rise of the United States and Soviet Union",
      "Beginning of the Cold War"
    ],
    lessons: [
      "Unchecked authoritarianism can lead to catastrophe",
      "Global alliances shape outcomes",
      "Economic collapse can fuel extremism"
    ],
    tags: ["global", "modern war", "20th century", "fascism"],
    sources: ["Britannica", "History textbooks", "Public archives"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];