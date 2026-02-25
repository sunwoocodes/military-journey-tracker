import { motion } from 'framer-motion';
import { useUserStore, BRANCH_META } from '@/stores/userStore';
import { getProgressPercent, getDaysRemaining, getDaysServed, getCurrentRank, getRankStations, formatDate } from '@/lib/journeyUtils';

export default function JourneyBoard() {
  const { branch, enlistmentDate, dischargeDate, nickname } = useUserStore();
  const meta = BRANCH_META[branch];
  const progress = getProgressPercent(enlistmentDate, dischargeDate);
  const daysLeft = getDaysRemaining(dischargeDate);
  const daysServed = getDaysServed(enlistmentDate);
  const { current, next } = getCurrentRank(branch, enlistmentDate);
  const stations = getRankStations(branch, enlistmentDate, dischargeDate);

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="led-panel p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{meta.label} · {meta.vehicle}</p>
            <h1 className="title-korean text-xl text-foreground">
              {meta.icon} 밀리트레인
            </h1>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">탑승자</p>
            <p className="font-medium text-foreground">{nickname} {current.label}</p>
          </div>
        </div>
      </div>

      {/* Main Progress Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="led-panel overflow-hidden"
      >
        {/* LED Header Bar */}
        <div className="bg-muted/50 px-4 py-2 flex items-center justify-between">
          <span className="font-mono text-xs text-muted-foreground">운행 정보</span>
          <span className="font-mono text-xs text-led-green led-text-green animate-pulse-glow">
            ● 정상 운행
          </span>
        </div>

        {/* Progress Number */}
        <div className="px-4 py-6 text-center">
          <p className="text-xs text-muted-foreground mb-1">전역까지의 여정</p>
          <div className="font-mono text-6xl font-bold led-text text-primary tracking-wider">
            {progress.toFixed(2)}
            <span className="text-2xl">%</span>
          </div>
          <div className="mt-3 flex justify-center gap-6 text-sm">
            <div>
              <span className="text-muted-foreground">복무</span>
              <span className="ml-1 font-mono text-foreground">{daysServed}일</span>
            </div>
            <div className="text-primary">
              <span className="text-muted-foreground">잔여</span>
              <span className="ml-1 font-mono led-text">{daysLeft}일</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-4 pb-2">
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-accent to-primary"
            />
          </div>
        </div>

        {/* Station Line */}
        <div className="px-4 py-4">
          <div className="relative">
            {/* Track line */}
            <div className="absolute top-3 left-2 right-2 h-0.5 bg-muted" />
            <div
              className="absolute top-3 left-2 h-0.5 bg-primary transition-all duration-1000"
              style={{ width: `${Math.min(progress, 98)}%` }}
            />

            {/* Stations */}
            <div className="relative flex justify-between">
              {stations.map((station, i) => {
                const isLast = i === stations.length - 1;
                const isCurrent = station.isPassed && (i === stations.length - 1 || !stations[i + 1].isPassed);
                return (
                  <div key={station.key} className="flex flex-col items-center" style={{ width: isLast ? 'auto' : undefined }}>
                    <div
                      className={`station-dot ${
                        station.isPassed
                          ? isCurrent
                            ? 'border-primary bg-primary text-primary'
                            : 'border-station-passed bg-station-passed text-station-passed'
                          : 'border-station-future bg-background text-station-future'
                      }`}
                    >
                      {isCurrent && (
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-primary"
                          animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </div>
                    <span className={`mt-2 text-[10px] font-medium ${station.isPassed ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {station.label}
                    </span>
                    <span className="text-[9px] text-muted-foreground">
                      {formatDate(station.date)}
                    </span>
                  </div>
                );
              })}
              {/* Discharge station */}
              <div className="flex flex-col items-center">
                <div className="station-dot border-led-orange bg-background text-led-orange" />
                <span className="mt-2 text-[10px] font-bold text-primary">전역</span>
                <span className="text-[9px] text-muted-foreground">{formatDate(dischargeDate)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Station Info */}
        {next && (
          <div className="border-t border-border px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground">다음 정거장</p>
              <p className="font-mono text-sm text-foreground">{next.label} 진급</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground">남은 시간</p>
              <p className="font-mono text-sm text-primary led-text">
                {(() => {
                  const rankDate = new Date(enlistmentDate);
                  rankDate.setMonth(rankDate.getMonth() + next.monthsFromEnlistment);
                  const diff = rankDate.getTime() - Date.now();
                  const days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
                  return `${days}일`;
                })()}
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Vehicle Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="led-panel p-4 text-center"
      >
        <motion.div
          className="text-5xl animate-train-move inline-block"
          aria-label={meta.vehicle}
        >
          {meta.icon}
        </motion.div>
        <p className="mt-2 text-xs text-muted-foreground">
          {nickname} {current.label}의 {meta.vehicle}이(가) 전역을 향해 달리고 있습니다
        </p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="led-panel p-3 text-center">
          <p className="text-[10px] text-muted-foreground">입대일</p>
          <p className="font-mono text-sm text-foreground">{formatDate(enlistmentDate)}</p>
        </div>
        <div className="led-panel p-3 text-center">
          <p className="text-[10px] text-muted-foreground">전역일</p>
          <p className="font-mono text-sm text-primary led-text">{formatDate(dischargeDate)}</p>
        </div>
      </div>
    </div>
  );
}
