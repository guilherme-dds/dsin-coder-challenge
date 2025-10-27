import { useState, useEffect } from "react";
import { Shield } from "lucide-react";
import type { Sighting } from "../App";

interface CombatStrategyProps {
  selectedDuck: Sighting | null;
  getWeakPoints: (duck: Sighting["duck"] | undefined) => string;
}

export function CombatStrategy({
  selectedDuck,
  getWeakPoints,
}: CombatStrategyProps) {
  const [defenseSystemMessage, setDefenseSystemMessage] = useState<
    string | null
  >(null);
  const [isDefenseActive, setIsDefenseActive] = useState(false);
  const [attackSystemMessage, setAttackSystemMessage] = useState<string | null>(
    null
  );

  useEffect(() => {
    setIsDefenseActive(false);
    setDefenseSystemMessage(null);
    setAttackSystemMessage(null);
  }, [selectedDuck]);

  const getAttackStrategy = (duck: Sighting["duck"] | undefined): string => {
    if (!duck) return "Aguardando dados do alvo...";

    if (duck.status === "hibernação profunda" || duck.status === "em transe") {
      return ">> ALVO INCAPACITADO. RECOMENDADO: CAPTURA DIRETA COM REDE DE CONTENÇÃO DE ENERGIA.";
    }

    const weakPoints = getWeakPoints(duck).toLowerCase();

    if (weakPoints.includes("eletromagnéticos")) {
      return ">> PONTO FRACO ELETROMAGNÉTICO. RECOMENDADO: DISPARAR PEM E CAPTURAR.";
    }

    if (duck.heightCm > 100) {
      return ">> ALVO GRANDE. RECOMENDADO: ATAQUE AÉREO COM PROJÉTIL (PEDRA) PARA ATORDOAR.";
    }

    if (duck.weightG < 1000) {
      return ">> ALVO LEVE. RECOMENDADO: USAR VENDAVAL DO DRONE PARA DESESTABILIZAR E CAPTURAR COM REDE.";
    }

    return ">> ALVO PADRÃO. RECOMENDADO: REDE DE CONTENÇÃO SIMPLES.";
  };

  const getDefenseStrategy = (duck: Sighting["duck"] | undefined): string => {
    if (!duck) return "Aguardando dados do alvo...";

    if (duck.status === "desperto" && !duck.superpower?.name) {
      return ">> ALVO DESPERTO SEM PODER APARENTE. MANTER DISTÂNCIA E USAR DEFESAS PADRÃO.";
    }

    if (duck.superpower?.name) {
      return `>> SUPER-PODER DETECTADO: ${duck.superpower.name.toUpperCase()}. ATIVAR SISTEMA GERADOR DE DEFESAS ALEATÓRIAS.`;
    }

    return ">> SEM AMEAÇA IMEDIATA DETECTADA. PROCEDIMENTO PADRÃO.";
  };

  const getSpecificDefense = (powerName: string): string | null => {
    const superpowerContextDefenses: { [key: string]: string[] } = {
      lasers: [
        "Ativando superfície espelhada no drone.",
        "Gerando cortina de fumaça densa.",
      ],
      elétrico: [
        "Aterrando o drone com para-raios de emergência.",
        "Ativando isolamento de borracha sintética.",
      ],
      natureza: [
        "Iniciando protocolo 'Sal Grosso'. Dispersando cloreto de sódio em área.",
        "Ativando modo 'Não pise na grama'.",
      ],
      brigadeiros: [
        "Ativando aspirador de doces de alta potência.",
        "Liberando exército de formigas para conter a ameaça doce.",
      ],
      teleporte: [
        "Ativando âncora quântica para prender o alvo no espaço-tempo local.",
        "Inundando a área com flutuações de probabilidade para dificultar o foco do teleporte.",
      ],
      sônico: [
        "Emitindo ruído branco em frequência de cancelamento.",
        "Ativando modo 'Fone com cancelamento de ruído' para o drone.",
      ],
    };

    const lowerCasePowerName = powerName.toLowerCase();
    const matchingKey = Object.keys(superpowerContextDefenses).find((key) =>
      lowerCasePowerName.includes(key)
    );
    return matchingKey
      ? superpowerContextDefenses[matchingKey][
          Math.floor(
            Math.random() * superpowerContextDefenses[matchingKey].length
          )
        ]
      : null;
  };

  const handleActivateDefenseSystem = () => {
    if (!selectedDuck?.duck.superpower) return;

    const defenses = [
      "Ativando canhão de confete sônico. Frequência ajustada para irritação máxima.",
      "Liberando enxame de borboletas holográficas para distração visual.",
      "Sistema 'Paradoxo do Pão com Manteiga': acoplando pão com manteiga nas costas do drone. Aterrissagem forçada iminente.",
      "Injetando 500cc de cafeína pura no sistema de irrigação local. Alvo pode ficar hiperativo ou ter uma epifania.",
      "Transmitindo loop de 10 horas de 'Baby Shark' em frequência subsônica.",
      "Ativando modo 'Imposto de Renda'. Alvo ficará paralisado de confusão e medo.",
      "Liberando boletos falsos na área. Causa pânico e desorientação.",
    ];

    const powerName = selectedDuck.duck.superpower.name;
    let defenseToUse = getSpecificDefense(powerName);

    if (!defenseToUse) {
      defenseToUse = defenses[Math.floor(Math.random() * defenses.length)];
    }

    setDefenseSystemMessage(`> SISTEMA DE DEFESA ATIVADO: ${defenseToUse}`);
    setIsDefenseActive(true);
  };

  const getDefenseButtonTooltip = (): string | undefined => {
    if (isDefenseActive) {
      return "O sistema de defesa já foi ativado para este alvo.";
    }
    if (!selectedDuck) {
      return "Selecione um alvo para ativar os sistemas de defesa.";
    }
    if (
      selectedDuck.duck?.status !== "desperto" ||
      !selectedDuck.duck?.superpower?.name
    ) {
      return "O alvo não possui um super-poder detectado. Defesa não é necessária.";
    }
    return "Ativar sistema de defesa contra o super-poder do alvo.";
  };

  const handleActivateAttackSystem = () => {
    if (!selectedDuck) return;

    const strategy = getAttackStrategy(selectedDuck.duck);
    let attackMessage = "Nenhuma ação de ataque executada.";

    if (strategy.includes("CAPTURA DIRETA")) {
      attackMessage =
        "Iniciando captura direta com rede de contenção de energia...";
    } else if (strategy.includes("PEM")) {
      attackMessage =
        "Disparando pulso eletromagnético (PEM)... Alvo atordoado.";
    } else if (strategy.includes("PROJÉTIL (PEDRA)")) {
      attackMessage =
        "Lançando projétil (pedra) de alta velocidade... Alvo atordoado.";
    } else if (strategy.includes("VENDAVAL DO DRONE")) {
      attackMessage =
        "Ativando modo vendaval para desestabilizar... Rede lançada.";
    } else if (strategy.includes("REDE DE CONTENÇÃO SIMPLES")) {
      attackMessage = "Lançando rede de contenção simples...";
    }

    setAttackSystemMessage(`> ATAQUE EXECUTADO: ${attackMessage}`);
  };

  return (
    <div className="col-span-3 border border-red-400/50 p-3">
      <h4 className="text-red-300 tracking-widest mb-2 flex items-center gap-2">
        <Shield size={14} /> ESTRATÉGIA DE COMBATE
      </h4>
      {selectedDuck ? (
        <div className="text-xs text-red-200 font-mono space-y-1">
          <p className="font-bold"> ESTRATÉGIA DE ATAQUE:</p>
          <p className="pl-2">{getAttackStrategy(selectedDuck.duck)}</p>
          <p className="font-bold mt-2"> ESTRATÉGIA DE DEFESA:</p>
          <p className="pl-2">{getDefenseStrategy(selectedDuck.duck)}</p>
        </div>
      ) : (
        <p className="text-xs text-red-400/70">
          Aguardando seleção de alvo para calcular estratégia...
        </p>
      )}
      <div className="mt-3 flex space-x-2">
        <button
          onClick={handleActivateAttackSystem}
          disabled={!selectedDuck}
          className="flex-1 border border-red-400 bg-red-400/10 text-red-300 p-2 hover:bg-red-400/20 transition-colors tracking-wider text-xs disabled:opacity-50 disabled:cursor-not-allowed"
        >
          INICIAR ATAQUE
        </button>
        <button
          onClick={handleActivateDefenseSystem}
          disabled={!selectedDuck?.duck?.superpower?.name || isDefenseActive}
          title={getDefenseButtonTooltip()}
          className="flex-1 border border-orange-400 bg-orange-400/10 text-orange-300 p-2 hover:bg-orange-400/20 transition-colors tracking-wider text-xs disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ATIVAR DEFESA
        </button>
      </div>
      {attackSystemMessage && (
        <p className="text-xs text-red-300 mt-2 animate-pulse">
          {attackSystemMessage}
        </p>
      )}
      {defenseSystemMessage && (
        <p className="text-xs text-orange-300 mt-2 animate-pulse">
          {defenseSystemMessage}
        </p>
      )}
    </div>
  );
}
