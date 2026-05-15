type SummaryCardProps = {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  tone?: "teal" | "blue" | "amber" | "slate";
};

const tones = {
  teal: "from-teal-500 to-emerald-600",
  blue: "from-cyan-500 to-blue-700",
  amber: "from-amber-400 to-orange-600",
  slate: "from-slate-600 to-slate-950",
};

export function SummaryCard({ title, value, subtitle, icon, tone = "teal" }: SummaryCardProps) {
  return (
    <section className="glass-card rounded-3xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <p className="mt-3 text-2xl font-black text-slate-950">{value}</p>
          <p className="mt-2 text-xs text-slate-500">{subtitle}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${tones[tone]} text-xl text-white shadow-lg`}>
          {icon}
        </div>
      </div>
    </section>
  );
}
