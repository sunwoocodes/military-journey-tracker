import { motion } from 'framer-motion';
import { User, Calendar, Shield, Palette, Eye } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { useUserStore, BRANCH_META, Branch, ViewMode } from '@/stores/userStore';
import { getCurrentRank, formatDate } from '@/lib/journeyUtils';

export default function ProfilePage() {
  const { nickname, branch, enlistmentDate, dischargeDate, viewMode, setBranch, setNickname, setDates, setViewMode } = useUserStore();
  const { current } = getCurrentRank(branch, enlistmentDate);

  const branches: Branch[] = ['army', 'navy', 'airforce', 'public'];
  const viewModes: { key: ViewMode; label: string; icon: string }[] = [
    { key: 'soldier', label: '장병', icon: '🪖' },
    { key: 'partner', label: '곰신', icon: '💕' },
    { key: 'parent', label: '부모님', icon: '👨‍👩‍👦' },
  ];

  return (
    <AppLayout>
      <div className="space-y-4 p-4">
        <h2 className="title-korean text-lg text-foreground">
          <User className="inline mr-1 text-primary" size={20} /> 내 정보
        </h2>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="led-panel p-5 text-center"
        >
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-3xl">
            {BRANCH_META[branch].icon}
          </div>
          <h3 className="text-lg font-bold text-foreground">{nickname}</h3>
          <p className="text-sm text-muted-foreground">
            {BRANCH_META[branch].label} · {current.label}
          </p>
        </motion.div>

        {/* Branch Selection */}
        <div className="led-panel p-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={14} className="text-accent" />
            <span className="text-xs font-medium text-foreground">군별 선택</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {branches.map((b) => (
              <button
                key={b}
                onClick={() => setBranch(b)}
                className={`rounded-lg p-2 text-center transition-all ${
                  branch === b
                    ? 'bg-primary/20 border border-primary'
                    : 'bg-muted hover:bg-muted/80 border border-transparent'
                }`}
              >
                <div className="text-xl">{BRANCH_META[b].icon}</div>
                <p className="text-[10px] mt-1 text-foreground">{BRANCH_META[b].label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* View Mode */}
        <div className="led-panel p-4">
          <div className="flex items-center gap-2 mb-3">
            <Eye size={14} className="text-accent" />
            <span className="text-xs font-medium text-foreground">보기 모드</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {viewModes.map((m) => (
              <button
                key={m.key}
                onClick={() => setViewMode(m.key)}
                className={`rounded-lg p-3 text-center transition-all ${
                  viewMode === m.key
                    ? 'bg-primary/20 border border-primary'
                    : 'bg-muted hover:bg-muted/80 border border-transparent'
                }`}
              >
                <div className="text-lg">{m.icon}</div>
                <p className="text-[10px] mt-1 text-foreground">{m.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Dates */}
        <div className="led-panel p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={14} className="text-accent" />
            <span className="text-xs font-medium text-foreground">복무 기간</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-muted-foreground">입대일</label>
              <input
                type="date"
                value={enlistmentDate}
                onChange={(e) => setDates(e.target.value, dischargeDate)}
                className="mt-1 w-full rounded-md border border-border bg-muted px-3 py-2 font-mono text-xs text-foreground"
              />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground">전역일</label>
              <input
                type="date"
                value={dischargeDate}
                onChange={(e) => setDates(enlistmentDate, e.target.value)}
                className="mt-1 w-full rounded-md border border-border bg-muted px-3 py-2 font-mono text-xs text-foreground"
              />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
