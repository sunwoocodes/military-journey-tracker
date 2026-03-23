import React, { useMemo } from 'react';
import { differenceInCalendarDays, parseISO, isValid } from 'date-fns';
import { useUserStore, FriendInfo, RANK_DATA } from '@/stores/userStore';
import { JourneyRoute } from './home/JourneyRoute';

interface ServiceCardProps {
    user?: boolean;
    friend?: FriendInfo;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ user, friend }) => {
    const storeUser = useUserStore();

    // Decide which data source to use
    const data = user ? {
        nickname: storeUser.nickname,
        branch: storeUser.branch,
        enlistmentDate: storeUser.enlistmentDate,
        dischargeDate: storeUser.dischargeDate,
        profilePic: storeUser.profilePic,
    } : friend!;

    if (!data) return null;

    const today = new Date();

    // Safe parsing
    const enlistment = parseISO(data.enlistmentDate);
    const discharge = parseISO(data.dischargeDate);

    const isValidDates = isValid(enlistment) && isValid(discharge);

    // Calculations
    const totalDays = isValidDates ? differenceInCalendarDays(discharge, enlistment) + 1 : 0;
    const servedDays = isValidDates ? Math.max(0, differenceInCalendarDays(today, enlistment)) : 0;
    const remainingDays = isValidDates ? Math.max(0, differenceInCalendarDays(discharge, today)) : 0;

    // Calculate highly accurate percentage based on seconds so the timer works continuously down to the wire
    const totalSeconds = isValidDates ? (discharge.getTime() - enlistment.getTime()) / 1000 : 0;
    const servedSeconds = isValidDates ? Math.max(0, (today.getTime() - enlistment.getTime()) / 1000) : 0;
    const percent = totalSeconds > 0 ? Math.min(100, Math.max(0, (servedSeconds / totalSeconds) * 100)) : 0;

    // Derive Rank
    const rankData = RANK_DATA[data.branch] || RANK_DATA['army'];
    let currentRank = rankData[0];
    let nextRank = null;
    // Simple logic based on months (rough estimation for UI demo)
    const servedMonths = Math.floor(servedDays / 30);

    for (let i = 0; i < rankData.length; i++) {
        if (servedMonths >= rankData[i].monthsFromEnlistment) {
            currentRank = rankData[i];
            if (i + 1 < rankData.length) {
                nextRank = rankData[i + 1];
            } else {
                nextRank = null;
            }
        }
    }

    const daysToNextRank = nextRank
        ? Math.max(0, (nextRank.monthsFromEnlistment * 30) - servedDays)
        : 0;

    return (
        <div className="w-full glass-panel p-5 mt-auto mb-4 animate-[slideUp_0.8s_ease-out] flex-shrink-0">

            {/* Profile Header */}
            <div className="flex items-center space-x-4 mb-4 pb-4 border-b border-gray-300/40">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden glass shadow-md border-2 border-white/50">
                    {data.profilePic ? (
                        <img src={data.profilePic} alt="profile" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 font-bold">
                            {data.nickname.charAt(0)}
                        </div>
                    )}
                </div>
                <div>
                    <h2 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                        {data.nickname}
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-800 text-white shadow-sm">
                            {currentRank.label}
                        </span>
                    </h2>
                    <p className="text-sm font-semibold text-gray-600 mt-0.5">
                        {data.enlistmentDate} ~ {data.dischargeDate}
                    </p>
                </div>
            </div>

            {/* Digital Dashboard for Stats (Light/Glass Theme) */}
            <div className="glass p-2 rounded-2xl mb-4 shadow-sm border border-white/60 relative z-0">
                <div className="grid grid-cols-2 gap-2 relative z-10">
                    {/* Total Days */}
                    <div className="bg-white/40 p-3 rounded-xl flex flex-col items-center justify-center text-center border border-white/50 shadow-inner">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">전체 복무일</span>
                        <div className="flex items-baseline space-x-1">
                            <span className="text-2xl font-mono font-bold text-slate-700 tracking-wider">
                                {totalDays.toString().padStart(3, '0')}
                            </span>
                            <span className="text-xs text-slate-500 font-bold">일</span>
                        </div>
                    </div>

                    {/* Served Days */}
                    <div className="bg-white/40 p-3 rounded-xl flex flex-col items-center justify-center text-center border border-white/50 shadow-inner">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">입대 후</span>
                        <div className="flex items-baseline space-x-1">
                            <span className="text-2xl font-mono font-bold text-blue-600 tracking-wider">
                                +{servedDays.toString().padStart(3, '0')}
                            </span>
                            <span className="text-xs text-blue-400 font-bold">일</span>
                        </div>
                    </div>

                    {/* Remaining Days */}
                    <div className="col-span-2 bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-xl flex flex-col items-center justify-center text-center border border-blue-400/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] overflow-hidden relative mt-1">
                        {/* Subtle inner highlight */}
                        <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/10 rounded-t-xl pointer-events-none"></div>
                        <span className="text-[11px] font-bold text-blue-100 uppercase tracking-widest mb-1 z-10">전역까지 남은 일수</span>
                        <div className="text-[3rem] font-mono font-black text-white drop-shadow-md tracking-[0.1em] z-10 leading-none py-1 tabular-nums">
                            D-{remainingDays.toString().padStart(3, '0')}
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Diagram (JourneyRoute) */}
            <div className="mb-5">
                <div className="flex justify-between text-xs font-bold text-gray-600 mb-1.5 px-1">
                    <span>복무율</span>
                    <span className="text-gray-900">{percent.toFixed(1)}%</span>
                </div>
                <JourneyRoute
                    branch={data.branch}
                    percent={percent}
                    enlistmentDate={data.enlistmentDate}
                    dischargeDate={data.dischargeDate}
                />
            </div>

            {/* Next Rank Info */}
            {nextRank ? (
                <div className="flex items-center justify-between glass p-3 rounded-xl border border-white/50">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-500">다음 진급 ({nextRank.label})</span>
                        <span className="text-sm font-extrabold text-gray-800 mt-0.5">남은 시간 약 {daysToNextRank}일</span>
                    </div>
                    {/* Simple Split Flap visual representation for days */}
                    <div className="flex space-x-0.5">
                        {daysToNextRank.toString().padStart(3, '0').split('').map((d, i) => (
                            <div key={i} className="split-flap w-5 h-7 text-xs sm:w-6 sm:h-8 sm:text-sm">{d}</div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center glass p-3 rounded-xl border border-white/50">
                    <span className="text-sm font-extrabold text-gray-800">모든 진급 완료 🎉</span>
                </div>
            )}

        </div>
    );
};

export default ServiceCard;
