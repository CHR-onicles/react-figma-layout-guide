export const MARGIN_UNITS = ["px", "%", "vw", "vh", "rem"] as const;
export type MarginUnit = (typeof MARGIN_UNITS)[number];

interface MarginFieldProps {
  label: string;
  value: number;
  unit: MarginUnit;
  onValueChange: (v: number) => void;
  onUnitChange: (u: MarginUnit) => void;
}

export function MarginField({
  label,
  value,
  unit,
  onValueChange,
  onUnitChange,
}: MarginFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center gap-2 min-w-0">
        <label className="text-xs font-medium text-gray-300 shrink-0">
          {label}
        </label>
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-xs font-mono text-gray-500 tabular-nums">
            {value}
          </span>
          <select
            value={unit}
            aria-label={`${label} unit`}
            onChange={e => onUnitChange(e.target.value as MarginUnit)}
            className="max-w-22 text-xs font-mono bg-gray-800 text-gray-300 rounded border border-gray-700 px-1.5 py-0.5 cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-500">
            {MARGIN_UNITS.map(u => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={90}
        step={5}
        value={value}
        onChange={e => onValueChange(Number(e.target.value))}
        className="w-full h-1 rounded-full accent-sky-500 cursor-pointer"
      />
    </div>
  );
}
