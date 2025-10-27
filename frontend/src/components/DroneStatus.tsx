import { Bot, BatteryFull, Fuel, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";

export function DroneStatus() {
  const [battery, setBattery] = useState(0);
  const [fuel, setFuel] = useState(0);
  const [integrity, setIntegrity] = useState(0);

  useEffect(() => {
    setBattery(Math.floor(Math.random() * (100 - 70 + 1)) + 70);
    setFuel(Math.floor(Math.random() * (100 - 50 + 1)) + 50);
    setIntegrity(Math.floor(Math.random() * (100 - 90 + 1)) + 90);
  }, []);

  return (
    <div className="col-span-1 space-y-3 border border-orange-400/30 p-3">
      <h4 className="text-orange-300 tracking-widest flex items-center gap-2">
        <Bot size={14} /> STATUS DO DRONE
      </h4>
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1">
          <BatteryFull size={12} /> BATERIA
        </span>
        <span className="font-mono text-orange-200">{battery}%</span>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1">
          <Fuel size={12} /> COMBUSTÍVEL
        </span>
        <span className="font-mono text-orange-200">{fuel}%</span>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1">
          <ShieldCheck size={12} /> INTEGRIDADE
        </span>
        <span className="font-mono text-orange-200">{integrity}%</span>
      </div>
    </div>
  );
}
