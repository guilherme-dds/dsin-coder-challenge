import { Target } from "lucide-react";
import type { Sighting } from "../App";

interface TargetInfoProps {
  selectedDuck: Sighting | null;
  getWeakPoints: (duck: Sighting["duck"] | undefined) => string;
}

export function TargetInfo({ selectedDuck, getWeakPoints }: TargetInfoProps) {
  return (
    <div className="col-span-2 space-y-3 border border-orange-400/30 p-3">
      <h4 className="text-orange-300 tracking-widest flex items-center gap-2">
        <Target size={14} /> INFORMAÇÕES DO ALVO
      </h4>
      {selectedDuck ? (
        <div className="text-xs space-y-1">
          <p>
            ID:{" "}
            <span className="font-mono text-orange-200">
              {selectedDuck.id?.slice(0, 8)}
            </span>
          </p>
          <p>
            Status:{" "}
            <span className="font-mono text-orange-200">
              {selectedDuck.duck?.status}
            </span>
          </p>
          <p>
            Pontos Fracos Detectados:{" "}
            <span className="font-mono text-orange-200">
              {getWeakPoints(selectedDuck.duck)}
            </span>
          </p>
        </div>
      ) : (
        <p className="text-xs text-orange-400/70">
          Aguardando seleção de alvo...
        </p>
      )}
    </div>
  );
}
