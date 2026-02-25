import { create } from 'zustand';

export type Branch = 'army' | 'navy' | 'airforce' | 'public';
export type ViewMode = 'soldier' | 'partner' | 'parent';
export type Rank = 'private' | 'private_first' | 'corporal' | 'sergeant';

interface RankInfo {
  key: Rank;
  label: string;
  monthsFromEnlistment: number; // months after enlistment to reach this rank
}

export const RANK_DATA: Record<Branch, RankInfo[]> = {
  army: [
    { key: 'private', label: '이병', monthsFromEnlistment: 0 },
    { key: 'private_first', label: '일병', monthsFromEnlistment: 2 },
    { key: 'corporal', label: '상병', monthsFromEnlistment: 8 },
    { key: 'sergeant', label: '병장', monthsFromEnlistment: 14 },
  ],
  navy: [
    { key: 'private', label: '이병', monthsFromEnlistment: 0 },
    { key: 'private_first', label: '일병', monthsFromEnlistment: 2 },
    { key: 'corporal', label: '상병', monthsFromEnlistment: 8 },
    { key: 'sergeant', label: '병장', monthsFromEnlistment: 14 },
  ],
  airforce: [
    { key: 'private', label: '이병', monthsFromEnlistment: 0 },
    { key: 'private_first', label: '일병', monthsFromEnlistment: 2 },
    { key: 'corporal', label: '상병', monthsFromEnlistment: 8 },
    { key: 'sergeant', label: '병장', monthsFromEnlistment: 14 },
  ],
  public: [
    { key: 'private', label: '소집해제 대기', monthsFromEnlistment: 0 },
    { key: 'sergeant', label: '소집해제', monthsFromEnlistment: 21 },
  ],
};

export const BRANCH_META: Record<Branch, { label: string; vehicle: string; icon: string; themeClass: string }> = {
  army: { label: '육군', vehicle: '지하철', icon: '🚇', themeClass: '' },
  navy: { label: '해군', vehicle: '군함', icon: '🚢', themeClass: 'theme-navy' },
  airforce: { label: '공군', vehicle: '전투기', icon: '✈️', themeClass: 'theme-airforce' },
  public: { label: '공익', vehicle: '버스', icon: '🚌', themeClass: 'theme-public' },
};

interface UserState {
  nickname: string;
  branch: Branch;
  enlistmentDate: string; // ISO date
  dischargeDate: string;
  viewMode: ViewMode;
  currentSkinId: string | null;
  setBranch: (b: Branch) => void;
  setDates: (enlistment: string, discharge: string) => void;
  setNickname: (n: string) => void;
  setViewMode: (m: ViewMode) => void;
  setCurrentSkin: (id: string | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  nickname: '용사',
  branch: 'army',
  enlistmentDate: '2024-06-01',
  dischargeDate: '2025-12-01',
  viewMode: 'soldier',
  currentSkinId: null,
  setBranch: (branch) => set({ branch }),
  setDates: (enlistmentDate, dischargeDate) => set({ enlistmentDate, dischargeDate }),
  setNickname: (nickname) => set({ nickname }),
  setViewMode: (viewMode) => set({ viewMode }),
  setCurrentSkin: (currentSkinId) => set({ currentSkinId }),
}));
