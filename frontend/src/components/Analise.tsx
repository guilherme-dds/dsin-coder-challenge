import { BookOpen, DollarSign, ShieldAlert, Sword } from "lucide-react";
import type { Sighting } from "../App";

interface AnaliseProps {
  selectedDuck: Sighting | null;
}

export function Analise({ selectedDuck }: AnaliseProps) {
  if (!selectedDuck) {
    return null;
  }

  return (
    <div className="mt-3 pt-3 border-t border-green-400/20 text-xs">
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 font-mono">
        <p className="flex items-center gap-2">
          <DollarSign size={12} className="text-green-400/70" />
          <span className="text-green-300/80">Custo operacional:</span>
          <span className="text-green-200">
            {selectedDuck.captureAnalysis?.operationalCost.toFixed(2) ?? "N/A"}{" "}
            créditos
          </span>
        </p>
        <p className="flex items-center gap-2">
          <ShieldAlert size={12} className="text-green-400/70" />
          <span className="text-green-300/80">Risco:</span>
          <span className="text-green-200">
            {selectedDuck.captureAnalysis?.riskLevel.toFixed(0) ?? "N/A"}%
          </span>
        </p>
        <p className="flex items-center gap-2">
          <Sword size={12} className="text-green-400/70" />
          <span className="text-green-300/80">Poderio militar necessário:</span>
          <span className="text-green-200">
            {selectedDuck.captureAnalysis?.militaryPower ?? "N/A"}
          </span>
        </p>
        <p className="flex items-center gap-2">
          <BookOpen size={12} className="text-green-400/70" />
          <span className="text-green-300/80">Ganho científico:</span>
          <span className="text-green-200">
            {selectedDuck.captureAnalysis?.knowledgeGain ?? "N/A"} pontos
          </span>
        </p>
      </div>
    </div>
  );
}
