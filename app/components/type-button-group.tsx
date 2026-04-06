interface TypeButtonGroupProps<T extends string> {
  options: T[];
  value: T;
  onChange: (v: T) => void;
}

export function TypeButtonGroup<T extends string>({
  options,
  value,
  onChange,
}: TypeButtonGroupProps<T>) {
  return (
    <div className="grid grid-cols-2 gap-1">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
            value === opt
              ? "bg-sky-600 text-white shadow-sm"
              : "bg-gray-900 text-gray-400 hover:text-gray-200 hover:bg-gray-800"
          }`}>
          {opt}
        </button>
      ))}
    </div>
  );
}
