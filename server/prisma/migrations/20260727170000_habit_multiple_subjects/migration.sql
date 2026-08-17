CREATE TABLE "_HabitToSubject" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_HabitToSubject_AB_pkey" PRIMARY KEY ("A","B")
);

CREATE INDEX "_HabitToSubject_B_index" ON "_HabitToSubject"("B");

ALTER TABLE "_HabitToSubject" ADD CONSTRAINT "_HabitToSubject_A_fkey" FOREIGN KEY ("A") REFERENCES "Habit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_HabitToSubject" ADD CONSTRAINT "_HabitToSubject_B_fkey" FOREIGN KEY ("B") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "_HabitToSubject" ("A", "B")
SELECT "id", "subjectId" FROM "Habit" WHERE "subjectId" IS NOT NULL;

ALTER TABLE "Habit" DROP CONSTRAINT "Habit_subjectId_fkey";

ALTER TABLE "Habit" DROP COLUMN "subjectId";
