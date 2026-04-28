import { motion } from "framer-motion";

export default function ScoreMeter({ score = 0 }) {
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const progress = (score / 10) * circumference;

  const getColor = () => {
    if (score <= 3) return "#ef4444"; // red
    if (score <= 6) return "#f59e0b"; // yellow
    if (score <= 8) return "#3b82f6"; // blue
    return "#22c55e"; // green
  };

  const getLabel = () => {
    if (score <= 3) return "Poor";
    if (score <= 6) return "Average";
    if (score <= 8) return "Good";
    return "Excellent";
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-[120px] h-[120px]">
        {/* Background circle */}
        <svg height="120" width="120">
          <circle
            stroke="#1f2937"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx="60"
            cy="60"
          />

          {/* Progress circle */}
          <motion.circle
            stroke={getColor()}
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            r={normalizedRadius}
            cx="60"
            cy="60"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1 }}
          />
        </svg>

        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold">{score}</span>
          <span className="text-xs text-gray-400">/10</span>
        </div>
      </div>

      {/* Label */}
      <div className="mt-2 text-sm font-medium" style={{ color: getColor() }}>
        {getLabel()}
      </div>
    </div>
  );
}
