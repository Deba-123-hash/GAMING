export default function PlayerStats({ stats }) {
  const entries = [
    { key: 'pace', label: 'PAC' },
    { key: 'shooting', label: 'SHO' },
    { key: 'passing', label: 'PAS' },
    { key: 'dribbling', label: 'DRI' },
    { key: 'defending', label: 'DEF' },
    { key: 'physical', label: 'PHY' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {entries.map((stat) => {
        const value = stats?.[stat.key] ?? 0;
        return (
          <div key={stat.key} className="rounded-lg border border-white/10 bg-[#0b0e11] p-3">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-[#a3aeb8]">{stat.label}</span>
              <span className="font-bold text-[#b8ff2c]">{value}</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-[#b8ff2c]" style={{ width: `${value}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
