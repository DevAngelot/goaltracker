import { Target, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

interface StatsProps {
  total: number;
  achieved: number;
  pending: number;
  overdue: number;
  successRate: number;
}

const cards = [
  { key: "total", label: "Total", icon: Target, colorClass: "text-primary" },
  { key: "achieved", label: "Atteints", icon: CheckCircle2, colorClass: "text-success" },
  { key: "pending", label: "En cours", icon: Clock, colorClass: "text-warning" },
  { key: "overdue", label: "En retard", icon: AlertTriangle, colorClass: "text-destructive" },
] as const;

export function StatsCards(props: StatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="glass-card rounded-xl p-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
              <p className="mt-1 text-3xl font-bold text-foreground">
                {props[card.key]}
              </p>
            </div>
            <card.icon className={`h-8 w-8 ${card.colorClass} opacity-80`} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
