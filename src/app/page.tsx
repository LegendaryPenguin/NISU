import Link from "next/link";

const PILLARS = [
  {
    emoji: "💪",
    title: "Fitness",
    desc: "Move your body every day",
    color: "from-blue-500 to-blue-600",
    bg: "bg-blue-50",
  },
  {
    emoji: "🥗",
    title: "Fuel",
    desc: "Eat clean, stay hydrated",
    color: "from-emerald-500 to-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    emoji: "🧠",
    title: "Skill",
    desc: "Build something new",
    color: "from-violet-500 to-violet-600",
    bg: "bg-violet-50",
  },
  {
    emoji: "🌙",
    title: "Reset",
    desc: "Recharge your mind",
    color: "from-amber-500 to-amber-600",
    bg: "bg-amber-50",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-3">
          <span className="bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 bg-clip-text text-transparent">
            NISU
          </span>
        </h1>
        <p className="text-lg text-gray-500 mb-2 font-medium">
          Your Summer Life Operating System
        </p>
        <p className="text-sm text-gray-400 mb-10 max-w-sm mx-auto">
          Stay consistent with your goals, routines, fitness, fuel, skills, and
          mindset — all in one place.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-10">
          {PILLARS.map((p) => (
            <div
              key={p.title}
              className={`${p.bg} rounded-2xl p-4 text-left`}
            >
              <span className="text-2xl">{p.emoji}</span>
              <p className="text-sm font-bold text-gray-800 mt-2">{p.title}</p>
              <p className="text-xs text-gray-500">{p.desc}</p>
            </div>
          ))}
        </div>

        <Link
          href="/daily"
          className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white text-sm font-bold px-8 py-3.5 rounded-full hover:bg-gray-800 transition-all duration-200 shadow-lg shadow-gray-900/20"
        >
          Open Daily Routine →
        </Link>
      </div>
    </div>
  );
}
