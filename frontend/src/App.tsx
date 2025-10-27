import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Tabs } from "./components/Tabs";
import { CatalogacaoForm } from "./components/CatalogacaoForm";
import { CapturaPanel } from "./components/CapturaPanel";

export interface Sighting {
  id: string;
  timestamp: string;
  captureAnalysis: {
    operationalCost: number;
    riskLevel: number;
    militaryPower: string;
    knowledgeGain: number;
  };
  duck: {
    heightCm: number;
    weightG: number;
    mutations: number;
    status: string;
    heartRateBpm?: number;
    superpower?: {
      name: string;
      description: string;
      classifications: string[];
    };
  };
}

export default function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const [activeTab, setActiveTab] = useState("CATALOGAÇÃO");
  const [selectedDuck, setSelectedDuck] = useState<Sighting | null>(null);

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono overflow-y-auto relative nostromo-interface">
      <div className="fixed inset-0 pointer-events-none z-50">
        <div
          className="w-full h-full opacity-10"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              #0041FF 2px,
              #0041FF 4px
            )`,
          }}
        />
      </div>

      <div className="fixed inset-0 bg-green-400/5 pointer-events-none animate-pulse z-40" />

      <div
        className="fixed inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,65,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,65,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative z-10 p-4">
        <Header currentTime={currentTime} />
        <div className="grid grid-cols-12 gap-4">
          <main className="col-span-12 space-y-4 pb-8">
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

            {activeTab === "CATALOGAÇÃO" && <CatalogacaoForm />}

            {activeTab === "CAPTURA" && (
              <>
                <CapturaPanel
                  selectedDuck={selectedDuck}
                  setSelectedDuck={setSelectedDuck}
                />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
