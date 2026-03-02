import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useGoals, Goal } from "@/hooks/useGoals";
import { StatsCards } from "@/components/StatsCards";
import { GoalList } from "@/components/GoalList";
import { GoalDialog } from "@/components/GoalDialog";
import { Button } from "@/components/ui/button";
import { Target, Plus, LogOut, Loader2, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { goals, loading, createGoal, updateGoal, deleteGoal, toggleAchieved, stats } = useGoals();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  const handleSubmit = async (data: { title: string; description?: string; start_date?: string; deadline: string }) => {
    if (editingGoal) {
      await updateGoal(editingGoal.id, data);
    } else {
      await createGoal(data);
    }
  };

  const openEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingGoal(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary">
              <Target className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">GoalTracker</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">{user.email}</span>
            <Button variant="ghost" size="icon" onClick={signOut} title="Se déconnecter">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-5xl px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Bonjour 
          </h1>
          <p className="mt-1 text-muted-foreground">
            {stats.total === 0
              ? "Commencez par créer votre premier objectif"
              : `Vous avez ${stats.pending} objectif${stats.pending > 1 ? "s" : ""} en cours`}
          </p>
        </motion.div>

        {/* Stats */}
        {stats.total > 0 && (
          <div className="mb-8">
            <StatsCards {...stats} />
            {/* Success rate bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 glass-card rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Taux de réussite</span>
                </div>
                <span className="text-sm font-bold text-primary">{stats.successRate}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-secondary">
                <motion.div
                  className="h-2 rounded-full gradient-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.successRate}%` }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
              </div>
            </motion.div>
          </div>
        )}

        {/* Goals header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Mes objectifs</h2>
          <Button onClick={() => setDialogOpen(true)} className="gradient-primary text-primary-foreground">
            <Plus className="mr-2 h-4 w-4" />
            Nouvel objectif
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <GoalList goals={goals} onToggle={toggleAchieved} onEdit={openEdit} onDelete={deleteGoal} />
        )}
      </main>

      <GoalDialog open={dialogOpen} onClose={closeDialog} onSubmit={handleSubmit} goal={editingGoal} />
    </div>
  );
};

export default Dashboard;
