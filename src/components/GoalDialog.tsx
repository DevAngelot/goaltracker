import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { Goal } from "@/hooks/useGoals";

interface GoalDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description?: string; start_date?: string; deadline: string }) => Promise<void>;
  goal?: Goal | null;
}

export function GoalDialog({ open, onClose, onSubmit, goal }: GoalDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [deadline, setDeadline] = useState<Date | undefined>();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (goal) {
      setTitle(goal.title);
      setDescription(goal.description || "");
      setStartDate(goal.start_date ? new Date(goal.start_date) : undefined);
      setDeadline(new Date(goal.deadline));
    } else {
      setTitle("");
      setDescription("");
      setStartDate(undefined);
      setDeadline(undefined);
    }
  }, [goal, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deadline) return;
    setSubmitting(true);
    await onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      start_date: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
      deadline: format(deadline, "yyyy-MM-dd"),
    });
    setSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{goal ? "Modifier l'objectif" : "Nouvel objectif"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="goal-title">Titre *</Label>
            <Input id="goal-title" value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={200} placeholder="Ex: Lire 12 livres cette année" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="goal-desc">Description</Label>
            <Textarea id="goal-desc" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={1000} placeholder="Détails de votre objectif..." rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date de début</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "dd/MM/yyyy") : "Optionnel"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} locale={fr} className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Date limite *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !deadline && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deadline ? format(deadline, "dd/MM/yyyy") : "Requis"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={deadline} onSelect={setDeadline} locale={fr} className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
            <Button type="submit" className="gradient-primary text-primary-foreground" disabled={submitting || !title.trim() || !deadline}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {goal ? "Enregistrer" : "Créer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
