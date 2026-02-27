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

export interface FriendInfo {
  id: string;
  nickname: string;
  branch: Branch;
  enlistmentDate: string;
  dischargeDate: string;
  profilePic?: string;
}

interface UserState {
  nickname: string;
  branch: Branch;
  enlistmentDate: string; // ISO date
  dischargeDate: string;
  viewMode: ViewMode;
  currentSkinId: string | null;
  profilePic?: string;
  friends: FriendInfo[];

  setBranch: (b: Branch) => void;
  setDates: (enlistment: string, discharge: string) => void;
  setNickname: (n: string) => void;
  setViewMode: (m: ViewMode) => void;
  setCurrentSkin: (id: string | null) => void;
  setProfilePic: (url: string) => void;
  addFriend: (f: FriendInfo) => void;
  removeFriend: (id: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  nickname: '권선우',
  branch: 'army',
  enlistmentDate: '2024-06-01',
  dischargeDate: '2025-12-01',
  viewMode: 'soldier',
  currentSkinId: null,
  profilePic: 'https://i.pravatar.cc/150?u=sunwoo',
  friends: [
    {
      id: 'f1',
      nickname: '김동기',
      branch: 'airforce',
      enlistmentDate: '2024-03-15',
      dischargeDate: '2025-12-14',
      profilePic: 'https://i.pravatar.cc/150?u=donggi'
    },
    {
      id: 'f2',
      nickname: '이해군',
      branch: 'navy',
      enlistmentDate: '2023-10-01',
      dischargeDate: '2025-06-30',
      profilePic: 'https://i.pravatar.cc/150?u=haegun'
    }
  ],
  setBranch: (branch) => set({ branch }),
  setDates: (enlistmentDate, dischargeDate) => set({ enlistmentDate, dischargeDate }),
  setNickname: (nickname) => set({ nickname }),
  setViewMode: (viewMode) => set({ viewMode }),
  setCurrentSkin: (currentSkinId) => set({ currentSkinId }),
  setProfilePic: (profilePic) => set({ profilePic }),
  addFriend: (f) => set((s) => ({ friends: [...s.friends, f] })),
  removeFriend: (id) => set((s) => ({ friends: s.friends.filter(f => f.id !== id) })),
}));
