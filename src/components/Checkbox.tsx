"use client";

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  label: string;
  sublabel?: string;
  disabled?: boolean;
  accentColor?: string;
}

export default function Checkbox({
  checked,
  onChange,
  label,
  sublabel,
  disabled = false,
  accentColor = "bg-[var(--nisu-coral)]",
}: CheckboxProps) {
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      className={`nisu-checkbox-press nisu-focus-ring flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-[background-color,transform] duration-[var(--nisu-motion-fast)] ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-black/[0.03] cursor-pointer"
      } ${checked ? "bg-black/[0.02]" : ""}`}
    >
      <div
        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-[background-color,border-color] duration-[var(--nisu-motion-fast)] ${
          checked
            ? `${accentColor} border-transparent`
            : "border-gray-300 bg-white"
        }`}
      >
        {checked && (
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>
      <div className="flex flex-col">
        <span
          className={`text-sm font-medium transition-[color,text-decoration-color] duration-[var(--nisu-motion-fast)] ${
            checked ? "line-through text-gray-400" : "text-gray-700"
          }`}
        >
          {label}
        </span>
        {sublabel && (
          <span className="text-xs nisu-text-muted">{sublabel}</span>
        )}
      </div>
    </button>
  );
}
