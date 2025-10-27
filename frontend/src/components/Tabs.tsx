interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Tabs({ activeTab, setActiveTab }: TabsProps) {
  return (
    <div className="flex space-x-1 border-b-2 border-green-400 mb-4">
      <button
        onClick={() => setActiveTab("CATALOGAÇÃO")}
        className={`px-4 py-1 text-xs tracking-wider transition-colors ${
          activeTab === "CATALOGAÇÃO"
            ? "bg-green-400 text-black"
            : "hover:bg-green-400/10"
        }`}
      >
        CATALOGAÇÃO
      </button>
      <button
        onClick={() => setActiveTab("CAPTURA")}
        className={`px-4 py-1 text-xs tracking-wider transition-colors ${
          activeTab === "CAPTURA"
            ? "bg-green-400 text-black"
            : "hover:bg-green-400/10"
        }`}
      >
        CAPTURA
      </button>
    </div>
  );
}
