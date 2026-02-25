import { Branch, RANK_DATA, Rank } from '@/stores/userStore';

export function getProgressPercent(enlistment: string, discharge: string): number {
  const now = new Date().getTime();
  const start = new Date(enlistment).getTime();
  const end = new Date(discharge).getTime();
  if (now <= start) return 0;
  if (now >= end) return 100;
  return Math.round(((now - start) / (end - start)) * 10000) / 100;
}

export function getDaysRemaining(discharge: string): number {
  const now = new Date();
  const end = new Date(discharge);
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function getDaysServed(enlistment: string): number {
  const now = new Date();
  const start = new Date(enlistment);
  const diff = now.getTime() - start.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

export function getCurrentRank(branch: Branch, enlistment: string): { current: typeof RANK_DATA.army[0]; next: typeof RANK_DATA.army[0] | null } {
  const ranks = RANK_DATA[branch];
  const now = new Date();
  const start = new Date(enlistment);
  const monthsServed = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());

  let current = ranks[0];
  let next: typeof ranks[0] | null = ranks.length > 1 ? ranks[1] : null;

  for (let i = ranks.length - 1; i >= 0; i--) {
    if (monthsServed >= ranks[i].monthsFromEnlistment) {
      current = ranks[i];
      next = i < ranks.length - 1 ? ranks[i + 1] : null;
      break;
    }
  }

  return { current, next };
}

export function getRankStations(branch: Branch, enlistment: string, discharge: string) {
  const ranks = RANK_DATA[branch];
  const start = new Date(enlistment);
  const end = new Date(discharge);
  const totalMs = end.getTime() - start.getTime();

  return ranks.map((rank) => {
    const rankDate = new Date(start);
    rankDate.setMonth(rankDate.getMonth() + rank.monthsFromEnlistment);
    const posPercent = Math.min(100, ((rankDate.getTime() - start.getTime()) / totalMs) * 100);
    const isPassed = new Date() >= rankDate;
    return {
      ...rank,
      date: rankDate,
      posPercent,
      isPassed,
    };
  });
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}
