interface SliderFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
}

export function SliderField({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "px",
  onChange,
}: SliderFieldProps) {
  const display = step < 1 ? value.toFixed(2) : String(value);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <label className="text-xs font-medium text-gray-300">{label}</label>
        <span className="text-xs font-mono text-gray-500 tabular-nums">
          {display}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1 rounded-full accent-sky-500 cursor-pointer"
      />
    </div>
  );
}
