interface HeaderProps {
  currentTime: Date;
}

export function Header({ currentTime }: HeaderProps) {
  return (
    <header className="mb-6 border-2 border-green-400 bg-black/80 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <h1 className="text-xl font-bold tracking-widest">
            DSIN - CODER CHALLENGE
          </h1>
        </div>
        <div className="flex items-center space-x-6">
          <div className="px-3 py-1 border border-green-400 bg-green-400/10 text-green-300 transition-all duration-200">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs tracking-wider">SISTEMAS ATIVOS</span>
            </div>
          </div>
          <div className="text-right border border-green-400 p-2 bg-black/60">
            <div className="text-green-300 text-lg tracking-wider">
              {currentTime.toLocaleTimeString("en-US", { hour12: false })}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
