/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { useUpdateHabit, HabitDifficulty, Habit } from '@/hooks/useHabits';
import { toast } from 'sonner';
import { DIFFICULTY_OPTIONS } from './constants';

interface EditHabitDialogProps {
  habit: Habit | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  subjects?: { id: number; name: string; color?: string; deleted?: boolean }[];
}

export function EditHabitDialog({ habit, isOpen, onOpenChange, subjects }: EditHabitDialogProps) {
  const updateHabit = useUpdateHabit();

  const [editName, setEditName] = useState('');
  const [editDifficulty, setEditDifficulty] = useState<HabitDifficulty>('MID');
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<number[]>([]);
  const [editAutoCompleteMins, setEditAutoCompleteMins] = useState<string>('');
  const [editBadDayPlan, setEditBadDayPlan] = useState('');

  const activeSubjects = useMemo(() => subjects?.filter((s) => !s.deleted) ?? [], [subjects]);

  useEffect(() => {
    if (habit && isOpen) {
      setEditName(habit.name);
      setEditDifficulty((habit.difficulty as HabitDifficulty) || 'MID');
      setSelectedSubjectIds(habit.subjects?.map((s) => s.id) ?? []);
      setEditAutoCompleteMins(
        habit.autoCompleteTime ? String(Math.floor(habit.autoCompleteTime / 60)) : '',
      );
      setEditBadDayPlan(habit.badDayPlan || '');
    }
  }, [habit, isOpen]);

  const toggleSubject = (id: number) => {
    setSelectedSubjectIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!habit || !editName.trim()) return;

    updateHabit.mutate(
      {
        id: habit.id,
        name: editName.trim(),
        difficulty: editDifficulty,
        subjectIds: selectedSubjectIds,
        badDayPlan: editBadDayPlan.trim() || null,
        autoCompleteTime:
          selectedSubjectIds.length > 0 && editAutoCompleteMins
            ? Math.max(1, parseInt(editAutoCompleteMins)) * 60
            : null,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          toast.success('Habit updated');
        },
        onError: () => toast.error('Failed to update habit'),
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle>Edit Habit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleEditSubmit} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Habit Name
            </Label>
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Habit name"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Difficulty
            </Label>
            <div className="flex gap-2">
              {DIFFICULTY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setEditDifficulty(opt.value)}
                  className={`flex-1 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                    editDifficulty === opt.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-muted-foreground/20 bg-muted/20 text-muted-foreground hover:bg-muted/40'
                  }`}
                >
                  <span className={editDifficulty === opt.value ? '' : opt.color}>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Linked Subjects
              <span className="ml-1 normal-case font-normal text-muted-foreground/60">
                (optional)
              </span>
            </Label>
            {activeSubjects.length === 0 ? (
              <p className="text-xs text-muted-foreground">No active subjects available.</p>
            ) : (
              <div className="grid grid-cols-1 gap-2 max-h-36 overflow-y-auto">
                {activeSubjects.map((s) => {
                  const isChecked = selectedSubjectIds.includes(s.id);
                  return (
                    <label
                      key={s.id}
                      className={cn(
                        'flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors',
                        isChecked
                          ? 'border-primary bg-primary/10'
                          : 'bg-muted/10 hover:bg-muted/30 border-muted-foreground/10',
                      )}
                    >
                      <Checkbox checked={isChecked} onCheckedChange={() => toggleSubject(s.id)} />
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: s.color || '#f97316' }}
                        />
                        <span className="text-sm font-medium leading-none truncate">{s.name}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {selectedSubjectIds.length > 0 && (
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Auto-Complete Time (mins)
              </Label>
              <Input
                type="number"
                min="1"
                placeholder="e.g. 2 (fallback to subject goal if empty)"
                value={editAutoCompleteMins}
                onChange={(e) => setEditAutoCompleteMins(e.target.value)}
              />
            </div>
          )}

          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-xs text-primary/90 mt-2 leading-relaxed">
            <strong>Pro Tip:</strong>
            {` On days when you have zero energy, complete a minimum baseline (e.g., "Do 1 pushup") to keep your streak alive. The goal is to never throw up a zero.`}
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Bad Day Plan <span className="normal-case opacity-70">(Optional)</span>
            </Label>
            <Input
              placeholder="e.g. Do 1 pushup"
              value={editBadDayPlan}
              onChange={(e) => setEditBadDayPlan(e.target.value)}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0 mt-1">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateHabit.isPending || !editName.trim()}>
              {updateHabit.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
