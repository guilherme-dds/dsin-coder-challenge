import { useState, useEffect } from "react";
import type { Sighting } from "../App";
import { Analise } from "./Analise";
import { DroneStatus } from "./DroneStatus";
import { TargetInfo } from "./TargetInfo";
import { CombatStrategy } from "./CombatStrategy";

const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://dsin-coder-challenge.onrender.com";

interface CapturaPanelProps {
  selectedDuck: Sighting | null;
  setSelectedDuck: (duck: Sighting | null) => void;
}

export function CapturaPanel({
  selectedDuck,
  setSelectedDuck,
}: CapturaPanelProps) {
  const [duckSightings, setDuckSightings] = useState<Sighting[]>([]);

  useEffect(() => {
    const fetchDucks = async () => {
      try {
        const response = await fetch(`${API_URL}/patos`);
        if (!response.ok) {
          throw new Error("Falha ao buscar patos catalogados.");
        }
        const data: Sighting[] = await response.json();
        setDuckSightings(
          data.sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )
        );
      } catch (error) {
        console.error(error);
      }
    };
    fetchDucks();
  }, []);

  const getWeakPoints = (duck: Sighting["duck"] | undefined): string => {
    if (!duck) return "N/A";

    const points = new Set<string>();

    if (duck.mutations > 5) points.add("Instabilidade genética");
    if (duck.weightG > 5000) points.add("Lento devido ao peso");
    if (duck.status === "em transe")
      points.add("Vulnerável a ataques furtivos");
    if (duck.status === "hibernação profunda")
      points.add("Totalmente vulnerável");
    if (duck.heartRateBpm && duck.heartRateBpm < 20)
      points.add("Metabolismo baixo");

    return points.size > 0
      ? Array.from(points).join(", ")
      : "Nenhum ponto fraco óbvio detectado";
  };

  return (
    <>
      <div className="border-2 border-green-400 bg-black/60 p-4 max-h-80 overflow-y-auto">
        <div className="text-green-400 text-sm tracking-wider mb-4 border-b border-green-400 pb-2">
          ANÁLISE DO ALVO (MISSÃO 2)
        </div>
        <div className="space-y-2">
          {duckSightings.length > 0 ? (
            duckSightings.map((sighting) => (
              <div
                key={sighting.id}
                onClick={() => setSelectedDuck(sighting)}
                className={`p-2 border transition-colors cursor-pointer ${
                  selectedDuck?.id === sighting.id
                    ? "bg-green-400/20 border-green-400"
                    : "border-green-400/30 hover:bg-green-400/10"
                }`}
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono">
                    ID: {sighting.id.slice(0, 8)}...
                  </span>
                  <span className="text-green-300/70">
                    {new Date(sighting.timestamp).toLocaleString()}
                  </span>
                </div>
                {selectedDuck?.id === sighting.id && (
                  <Analise selectedDuck={sighting} />
                )}
              </div>
            ))
          ) : (
            <p className="text-xs text-green-300/70">
              Nenhum espécime catalogado encontrado.
            </p>
          )}
        </div>
      </div>

      <div className="border-2 border-orange-400 bg-black/60 p-4">
        <div className="text-orange-300 text-sm tracking-wider mb-4 border-b border-orange-400 pb-2">
          CONTROLE DO DRONE DE CAPTURA (MISSÃO 3)
        </div>
        <div className="grid grid-cols-3 gap-4">
          <DroneStatus />
          <TargetInfo
            selectedDuck={selectedDuck}
            getWeakPoints={getWeakPoints}
          />
          <CombatStrategy
            selectedDuck={selectedDuck}
            getWeakPoints={getWeakPoints}
          />
        </div>
      </div>
    </>
  );
}
