import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '../../prisma/prismaClient.js';

async function createUser() {
  return prisma.user.create({
    data: { email: `stats-test-${Date.now()}@example.com`, name: 'Stats Test User' },
  });
}

import { getDashboardStats } from '../controllers/stats.controller.js';

describe('Dashboard Stats Timezone Fix', () => {
  let user: any;
  let subject: any;

  beforeAll(async () => {
    user = await createUser();
    subject = await prisma.subject.create({
      data: {
        name: `Stats-Subject-${Date.now()}`,
        userId: user.id,
      },
    });
  });

  afterAll(async () => {
    await prisma.subjectLog.deleteMany({ where: { subject: { userId: user.id } } });
    await prisma.subject.deleteMany({ where: { userId: user.id } });
    await prisma.user.delete({ where: { id: user.id } });
  });

  it('should include logs from today even if timezone causes dateStr not to exist in initial 21-day map', async () => {
    const now = new Date();

    await prisma.subjectLog.create({
      data: {
        subjectId: subject.id,
        startedAt: new Date(now.getTime() - 60 * 60 * 1000), // 1 hour ago
        endedAt: now,
      },
    });

    const req: any = {
      user: { id: user.id },
      query: {},
    };

    let resBody: any;
    let resStatusCode: number;

    await new Promise<void>((resolve, reject) => {
      const res: any = {
        status: function (code: number) {
          resStatusCode = code;
          return this;
        },
        json: function (data: any) {
          resBody = data;
          resolve();
          return this;
        },
      };

      getDashboardStats(req, res, (err: any) => {
        if (err) reject(err);
      });
    });

    expect(resStatusCode!).toBe(200);
    const focusTimeArray = resBody.data.focusTimeArray;

    const totalFocusTime = focusTimeArray.reduce(
      (acc: number, curr: any) => acc + curr.focusTimeSecs,
      0,
    );
    expect(totalFocusTime).toBeGreaterThanOrEqual(3600); // 1 hour in seconds

    expect(focusTimeArray.length).toBeGreaterThanOrEqual(21);
  });
});
