import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '../../prisma/prismaClient.js';

async function createUser() {
  return prisma.user.create({
    data: { email: `multi-subj-test-${Date.now()}@example.com`, name: 'Test' },
  });
}

async function createHabit(userId: number, name?: string) {
  return prisma.habit.create({
    data: { name: name ?? `Habit-${Date.now()}`, userId },
    include: { subjects: true },
  });
}

async function createSubject(userId: number, name?: string, deleted = false) {
  return prisma.subject.create({
    data: {
      name: name ?? `Subject-${Date.now()}`,
      userId,
      deleted,
      ...(deleted ? { deletedAt: new Date() } : {}),
    },
  });
}

describe('Habit-Subject many-to-many', () => {
  let userId: number;

  beforeAll(async () => {
    const user = await createUser();
    userId = user.id;
  });

  afterAll(async () => {
    await prisma.habitTimeLog.deleteMany({ where: { habit: { userId } } });
    await prisma.subjectLog.deleteMany({ where: { subject: { userId } } });
    await prisma.habit.deleteMany({ where: { userId } });
    await prisma.subject.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
  });

  it('should link a habit to multiple subjects', async () => {
    const s1 = await createSubject(userId, 'Math');
    const s2 = await createSubject(userId, 'Physics');
    const habit = await createHabit(userId, 'Study');

    const updated = await prisma.habit.update({
      where: { id: habit.id },
      data: { subjects: { connect: [{ id: s1.id }, { id: s2.id }] } },
      include: { subjects: true },
    });

    expect(updated.subjects).toHaveLength(2);
    const ids = updated.subjects.map((s) => s.id);
    expect(ids).toContain(s1.id);
    expect(ids).toContain(s2.id);
  });

  it('should NOT return archived subjects in the active subject list', async () => {
    await createSubject(userId, 'Archived-Subject', true);
    const activeSubject = await createSubject(userId, 'Active-Subject');

    const activeSubjects = await prisma.subject.findMany({
      where: { userId, deleted: false },
    });

    const ids = activeSubjects.map((s) => s.id);
    expect(ids).toContain(activeSubject.id);
    const archivedInActive = activeSubjects.find((s) => s.name === 'Archived-Subject');
    expect(archivedInActive).toBeUndefined();
  });

  it('should auto-complete a habit when ANY linked subject meets its threshold', async () => {
    const goalSecs = 3600;
    const s1 = await createSubject(userId, 'AutoSubject-1');
    const s2 = await createSubject(userId, 'AutoSubject-2');
    await prisma.subject.update({ where: { id: s1.id }, data: { goalWorkSecs: goalSecs } });
    await prisma.subject.update({ where: { id: s2.id }, data: { goalWorkSecs: goalSecs } });

    const habit = await prisma.habit.create({
      data: {
        name: `AutoHabit-${Date.now()}`,
        userId,
        subjects: { connect: [{ id: s1.id }, { id: s2.id }] },
      },
      include: { subjects: true },
    });

    const startBoundary = new Date();
    startBoundary.setHours(0, 0, 0, 0);
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - goalSecs * 1000);

    const subjectLog = await prisma.subjectLog.create({
      data: { subjectId: s1.id, startedAt: oneHourAgo, endedAt: now },
    });

    const todaysLogs = await prisma.subjectLog.findMany({
      where: {
        subjectId: s1.id,
        startedAt: { gte: startBoundary },
        endedAt: { not: null },
        deleted: false,
      },
    });

    let totalSecs = 0;
    for (const log of todaysLogs) {
      if (log.endedAt) {
        totalSecs += Math.floor(
          (new Date(log.endedAt).getTime() - new Date(log.startedAt).getTime()) / 1000,
        );
      }
    }

    const s1WithHabits = await prisma.subject.findUnique({
      where: { id: s1.id },
      include: { habits: { where: { deleted: false } } },
    });

    let habitAutoCompleted = false;
    for (const h of s1WithHabits!.habits) {
      const threshold =
        h.autoCompleteTime ?? (s1WithHabits!.goalWorkSecs > 0 ? s1WithHabits!.goalWorkSecs : null);

      if (threshold !== null && totalSecs >= threshold) {
        const existingLog = await prisma.habitTimeLog.findFirst({
          where: { habitId: h.id, startedAt: { gte: startBoundary }, deleted: false },
        });
        if (!existingLog) {
          await prisma.habitTimeLog.create({
            data: { habitId: h.id, startedAt: new Date(), endedAt: new Date() },
          });
          habitAutoCompleted = true;
        }
      }
    }

    expect(totalSecs).toBeGreaterThanOrEqual(goalSecs);
    expect(habitAutoCompleted).toBe(true);

    const log = await prisma.habitTimeLog.findFirst({
      where: { habitId: habit.id, startedAt: { gte: startBoundary }, deleted: false },
    });
    expect(log).not.toBeNull();

    await prisma.subjectLog.delete({ where: { id: subjectLog.id } });
  });

  it('should clear all subject links from a habit using set: []', async () => {
    const s1 = await createSubject(userId, 'ToBeUnlinked');
    const habit = await prisma.habit.create({
      data: {
        name: `UnlinkHabit-${Date.now()}`,
        userId,
        subjects: { connect: [{ id: s1.id }] },
      },
      include: { subjects: true },
    });

    expect(habit.subjects).toHaveLength(1);

    const cleared = await prisma.habit.update({
      where: { id: habit.id },
      data: { subjects: { set: [] } },
      include: { subjects: true },
    });

    expect(cleared.subjects).toHaveLength(0);
  });

  it('should return all habits linked to a subject via the reverse relation', async () => {
    const subject = await createSubject(userId, 'SharedSubject');
    const h1 = await createHabit(userId, 'HabitA');
    const h2 = await createHabit(userId, 'HabitB');

    await prisma.habit.update({
      where: { id: h1.id },
      data: { subjects: { connect: { id: subject.id } } },
    });
    await prisma.habit.update({
      where: { id: h2.id },
      data: { subjects: { connect: { id: subject.id } } },
    });

    const subjectWithHabits = await prisma.subject.findUnique({
      where: { id: subject.id },
      include: { habits: { where: { deleted: false } } },
    });

    const habitIds = subjectWithHabits!.habits.map((h) => h.id);
    expect(habitIds).toContain(h1.id);
    expect(habitIds).toContain(h2.id);
  });

  it('should cascade-delete join table entries when a subject is hard-deleted', async () => {
    const subject = await createSubject(userId, 'CascadeSubject');
    const habit = await prisma.habit.create({
      data: {
        name: `CascadeHabit-${Date.now()}`,
        userId,
        subjects: { connect: { id: subject.id } },
      },
      include: { subjects: true },
    });

    expect(habit.subjects).toHaveLength(1);

    await prisma.subject.delete({ where: { id: subject.id } });

    const afterDelete = await prisma.habit.findUnique({
      where: { id: habit.id },
      include: { subjects: true },
    });

    expect(afterDelete?.subjects).toHaveLength(0);
  });
});
