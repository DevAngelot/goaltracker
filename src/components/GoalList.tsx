import { useState } from "react";
import { format, isPast, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, CalendarDays } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import type { Goal } from "@/hooks/useGoals";

interface GoalListProps {
  goals: Goal[];
  onToggle: (id: string, current: boolean) => void;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
}

function getDeadlineStatus(deadline: string, isAchieved: boolean) {
  if (isAchieved) return { label: "Atteint", variant: "default" as const, className: "bg-success text-success-foreground" };
  const d = new Date(deadline);
  if (isPast(d)) return { label: "En retard", variant: "destructive" as const, className: "" };
  const days = differenceInDays(d, new Date());
  if (days <= 3) return { label: `${days}j restants`, variant: "outline" as const, className: "border-destructive text-destructive" };
  if (days <= 7) return { label: `${days}j restants`, variant: "outline" as const, className: "border-warning text-warning" };
  return { label: "En cours", variant: "secondary" as const, className: "" };
}

export function GoalList({ goals, onToggle, onEdit, onDelete }: GoalListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  if (goals.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
        <CalendarDays className="mb-4 h-12 w-12 text-muted-foreground/50" />
        <p className="text-lg font-medium text-muted-foreground">Aucun objectif pour le moment</p>
        <p className="mt-1 text-sm text-muted-foreground/70">Cliquez sur "Nouvel objectif" pour commencer</p>
      </motion.div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {goals.map((goal) => {
            const status = getDeadlineStatus(goal.deadline, goal.is_achieved);
            return (
              <motion.div
                key={goal.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`glass-card group flex items-start gap-4 rounded-xl p-4 transition-all hover:shadow-md ${goal.is_achieved ? "opacity-70" : ""}`}
              >
                <Checkbox
                  checked={goal.is_achieved}
                  onCheckedChange={() => onToggle(goal.id, goal.is_achieved)}
                  className="mt-1 h-5 w-5 rounded-full border-2 data-[state=checked]:bg-success data-[state=checked]:border-success"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`font-semibold text-foreground ${goal.is_achieved ? "line-through" : ""}`}>
                      {goal.title}
                    </h3>
                    <Badge className={status.className} variant={status.variant}>
                      {status.label}
                    </Badge>
                  </div>
                  {goal.description && (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{goal.description}</p>
                  )}
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      Échéance : {format(new Date(goal.deadline), "d MMMM yyyy", { locale: fr })}
                    </span>
                    {goal.start_date && (
                      <span>Début : {format(new Date(goal.start_date), "d MMM yyyy", { locale: fr })}</span>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(goal)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(goal.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cet objectif ?</AlertDialogTitle>
            <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={() => { if (deleteId) { onDelete(deleteId); setDeleteId(null); } }}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
