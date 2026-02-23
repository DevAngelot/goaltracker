import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Goal = Tables<"goals">;
export type GoalInsert = TablesInsert<"goals">;
export type GoalUpdate = TablesUpdate<"goals">;

export function useGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGoals = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .order("deadline", { ascending: true });

    if (error) {
      toast.error("Erreur lors du chargement des objectifs");
    } else {
      setGoals(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGoals();
  }, [user]);

  const createGoal = async (goal: Omit<GoalInsert, "user_id">) => {
    if (!user) return;
    const { error } = await supabase.from("goals").insert({ ...goal, user_id: user.id });
    if (error) {
      toast.error("Erreur lors de la création");
    } else {
      toast.success("Objectif créé !");
      fetchGoals();
    }
  };

  const updateGoal = async (id: string, updates: GoalUpdate) => {
    const { error } = await supabase
      .from("goals")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      toast.error("Erreur lors de la mise à jour");
    } else {
      toast.success("Objectif mis à jour !");
      fetchGoals();
    }
  };

  const deleteGoal = async (id: string) => {
    const { error } = await supabase.from("goals").delete().eq("id", id);
    if (error) {
      toast.error("Erreur lors de la suppression");
    } else {
      toast.success("Objectif supprimé !");
      fetchGoals();
    }
  };

  const toggleAchieved = async (id: string, current: boolean) => {
    await updateGoal(id, { is_achieved: !current });
  };

  const stats = {
    total: goals.length,
    achieved: goals.filter((g) => g.is_achieved).length,
    pending: goals.filter((g) => !g.is_achieved).length,
    overdue: goals.filter((g) => !g.is_achieved && new Date(g.deadline) < new Date()).length,
    successRate: goals.length > 0
      ? Math.round((goals.filter((g) => g.is_achieved).length / goals.length) * 100)
      : 0,
  };

  return { goals, loading, createGoal, updateGoal, deleteGoal, toggleAchieved, stats, refetch: fetchGoals };
}
