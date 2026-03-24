import React, { useMemo, useState, useEffect } from 'react';
import { differenceInSeconds, parseISO, addMinutes } from 'date-fns';
import { Branch } from '@/stores/userStore';
import { MockRoute, getRandomMockRoute } from '@/lib/mockRoutes';
import { MapPin, Flag, Clock } from 'lucide-react';
import { TrainVehicle, ShipVehicle, PlaneVehicle, BusVehicle } from './AnimatedVehicles';

interface JourneyRouteProps {
    branch: Branch;
    percent: number; // 0 to 100
    enlistmentDate: string; // ISO date string required to calc real time remaining
    dischargeDate: string; // ISO date string required to calc real time remaining
}

const getIconForBranch = (branch: Branch, className: string = "") => {
    switch (branch) {
        case 'army':
            return <TrainVehicle className={className} />;
        case 'navy':
            return <ShipVehicle className={className} />;
        case 'airforce':
            return <PlaneVehicle className={className} />;
        case 'public':
            return <BusVehicle className={className} />;
        default:
            return <TrainVehicle className={className} />;
    }
};

const getThemeColorClass = (branch: Branch) => {
    switch (branch) {
        case 'army': return 'text-green-700 bg-green-100 border-green-300';
        case 'navy': return 'text-blue-700 bg-blue-100 border-blue-300';
        case 'airforce': return 'text-sky-600 bg-sky-100 border-sky-300';
        case 'public': return 'text-amber-600 bg-amber-100 border-amber-300';
        default: return 'text-gray-700 bg-gray-100 border-gray-300';
    }
};

const getBarColorClass = (branch: Branch) => {
    switch (branch) {
        case 'army': return 'bg-green-600';
        case 'navy': return 'bg-blue-600';
        case 'airforce': return 'bg-sky-500';
        case 'public': return 'bg-amber-500';
        default: return 'bg-gray-600';
    }
};

const getVehicleColorClass = (branch: Branch) => {
    switch (branch) {
        case 'army': return 'text-green-800 bg-white border-green-500';
        case 'navy': return 'text-blue-800 bg-white border-blue-500';
        case 'airforce': return 'text-sky-700 bg-white border-sky-400';
        case 'public': return 'text-amber-700 bg-white border-amber-500';
        default: return 'text-gray-800 bg-white border-gray-500';
    }
};

const renderTrackBackground = (branch: Branch, percent: number, barColor: string) => {
    if (branch === 'navy') {
        return (
            <div className="absolute top-1/2 left-2 right-2 h-6 -translate-y-1/2 overflow-hidden rounded-full">
                <div
                    className="absolute top-0 left-0 h-full transition-all duration-1000 ease-out flex items-end overflow-hidden"
                    style={{ width: `${percent}%` }}
                >
                    <div className="w-[1000px] h-3 bg-blue-500/80 animate-wave-bg"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 16' preserveAspectRatio='none'%3E%3Cpath d='M0 8 Q10 0 20 8 T40 8 L40 16 L0 16 Z' fill='%2360a5fa' opacity='0.5'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'repeat-x',
                            backgroundSize: '40px 100%'
                        }}
                    ></div>
                </div>
                {/* Outline for the whole track */}
                <div className="absolute bottom-1 w-full h-[1px] bg-blue-300/50"></div>
            </div>
        );
    }
    if (branch === 'army') {
        return (
            <div className="absolute top-1/2 left-2 right-2 h-2 rounded-sm -translate-y-1/2 overflow-hidden border-y border-gray-400/50 bg-gray-200/50">
                <div className="absolute inset-0 w-full h-full" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(0,0,0,0.15) 4px, rgba(0,0,0,0.15) 6px)' }}></div>
                <div
                    className={`absolute top-0 left-0 h-full ${barColor} transition-all duration-1000 ease-out opacity-80`}
                    style={{ width: `${percent}%` }}
                ></div>
            </div>
        );
    }
    if (branch === 'airforce') {
        return (
            <div className="absolute top-1/2 left-2 right-2 h-[2px] -translate-y-1/2">
                <div className="absolute inset-0 w-full h-full border-t border-dashed border-gray-400"></div>
                <div
                    className="absolute top-0 left-0 h-full transition-all duration-1000 ease-out border-t-[3px] border-dashed border-sky-500 drop-shadow-sm"
                    style={{ width: `${percent}%` }}
                ></div>
            </div>
        );
    }
    if (branch === 'public') {
        return (
            <div className="absolute top-1/2 left-2 right-2 h-3 bg-gray-400 rounded-sm -translate-y-1/2 overflow-hidden shadow-inner">
                <div className="absolute top-1/2 left-0 w-full h-[1px] -translate-y-1/2" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #fff, #fff 6px, transparent 6px, transparent 12px)' }}></div>
                <div
                    className="absolute top-0 left-0 h-full bg-amber-500/60 mix-blend-multiply transition-all duration-1000 ease-out"
                    style={{ width: `${percent}%` }}
                ></div>
            </div>
        );
    }

    return (
        <div className="absolute top-1/2 left-2 right-2 h-1.5 bg-gray-300/50 rounded-full -translate-y-1/2 overflow-hidden">
            <div
                className={`absolute top-0 left-0 h-full ${barColor} shadow-inner transition-all duration-1000 ease-out`}
                style={{ width: `${percent}%` }}
            >
                <div className="absolute inset-0 bg-white/30 w-full animate-pulse"></div>
            </div>
        </div>
    );
};


export const JourneyRoute: React.FC<JourneyRouteProps> = ({ branch, percent, enlistmentDate, dischargeDate }) => {
    // In a real app, this route would be fetched based on user's selected stations
    const route = useMemo(() => getRandomMockRoute(branch), [branch]);

    // Map nodes to percentages on the timeline (0 to 100)
    const mappedNodes = useMemo(() => {
        return route.nodes.map(node => ({
            ...node,
            positionPercent: route.totalTimeMinutes === 0
                ? 0
                : (node.timeFromStartMinutes / route.totalTimeMinutes) * 100
        }));
    }, [route]);

    // Find current segment (current node -> next node)
    const currentSegment = useMemo(() => {
        if (percent >= 100) return { current: mappedNodes[mappedNodes.length - 1], next: null };
        if (percent <= 0) return { current: null, next: mappedNodes[0] };

        let current = mappedNodes[0];
        let next = mappedNodes[1] || null;

        for (let i = 0; i < mappedNodes.length - 1; i++) {
            if (percent >= mappedNodes[i].positionPercent && percent < mappedNodes[i + 1].positionPercent) {
                current = mappedNodes[i];
                next = mappedNodes[i + 1];
                break;
            }
        }
        return { current, next };
    }, [mappedNodes, percent]);

    // Real-time Countdown Logic
    const [timeRemainingText, setTimeRemainingText] = useState<string>('');

    useEffect(() => {
        if (!currentSegment.next || percent >= 100 || percent <= 0) {
            setTimeRemainingText('');
            return;
        }

        const enlistment = parseISO(enlistmentDate);
        const discharge = parseISO(dischargeDate);
        const totalDurationSeconds = differenceInSeconds(discharge, enlistment);

        // When will they reach the next node?
        // next.positionPercent means they need to complete what % of total service?
        const secondsToNextNodeFromStart = totalDurationSeconds * (currentSegment.next.positionPercent / 100);
        const nextNodeRealTime = new Date(enlistment.getTime() + (secondsToNextNodeFromStart * 1000));

        const updateTimer = () => {
            const now = new Date();
            const diffInSeconds = differenceInSeconds(nextNodeRealTime, now);

            if (diffInSeconds <= 0) {
                setTimeRemainingText('곧 도착합니다!');
                return;
            }

            const totalHours = Math.floor(diffInSeconds / 3600);
            const minutes = Math.floor((diffInSeconds % 3600) / 60);
            const seconds = diffInSeconds % 60;

            setTimeRemainingText(`${totalHours > 0 ? `${totalHours}시간 ` : ''}${minutes}분 ${seconds}초 남음`);
        };

        updateTimer();
        const intervalId = setInterval(updateTimer, 1000);
        return () => clearInterval(intervalId);
    }, [currentSegment.next, enlistmentDate, dischargeDate, percent]);

    const themeColor = getThemeColorClass(branch);
    const barColor = getBarColorClass(branch);
    const vehicleColor = getVehicleColorClass(branch);

    return (
        <div className="w-full mt-4 bg-white/40 rounded-2xl p-4 border border-white/60 shadow-sm relative overflow-hidden backdrop-blur-md">

            {/* Route Status Text */}
            <div className="mb-4 flex flex-col">
                <div className="flex justify-between items-end mb-1">
                    <div className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                        <MapPin size={10} /> 실시간 여정 진행도
                    </div>
                    {timeRemainingText && (
                        <div className="text-[10px] font-extrabold text-blue-600 animate-pulse flex items-center gap-1 bg-blue-50 px-1.5 py-0.5 rounded shadow-sm border border-blue-100">
                            <Clock size={10} /> {timeRemainingText}
                        </div>
                    )}
                </div>
                <div className="text-sm font-bold text-gray-800 break-keep leading-relaxed">
                    {percent >= 100 ? (
                        <span className="flex items-center gap-1 text-green-700"><Flag size={14} /> 무사히 전역지에 도착했습니다!</span>
                    ) : percent <= 0 ? (
                        <span>여정을 준비 중입니다.</span>
                    ) : currentSegment.current && currentSegment.next ? (
                        <span>
                            현재 <span className={`px-1.5 py-0.5 rounded-md ${themeColor} mx-0.5 text-xs inline-block`}>{currentSegment.current.name}</span>을 지나
                            <span className={`px-1.5 py-0.5 rounded-md ${themeColor} mx-0.5 text-xs inline-block`}>{currentSegment.next.name}</span>으로 가고 있습니다.
                        </span>
                    ) : (
                        <span>여정 진행 중...</span>
                    )}
                </div>
            </div>

            {/* Diagram Timeline */}
            <div className="relative h-12 w-full mt-6 mb-2 px-2">

                {/* Branch-Specific Background Track */}
                {renderTrackBackground(branch, percent, barColor)}

                {/* Nodes (Stations) */}
                {mappedNodes.map((node, i) => {
                    const isCompleted = percent >= node.positionPercent;
                    const isFirst = i === 0;
                    const isLast = i === mappedNodes.length - 1;

                    return (
                        <div
                            key={i}
                            className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
                            style={{ left: `calc(${node.positionPercent}% + ${isFirst ? '8px' : isLast ? '-8px' : '0px'})`, transform: 'translate(-50%, -50%)' }}
                        >
                            <div className={`w-3 h-3 rounded-full border-2 transition-colors duration-500 ${isCompleted ? barColor + ' border-white shadow-sm' : 'bg-white border-gray-300'}`} />

                            {/* Show names only for first, last, current, or next to avoid clutter when there are many nodes (like Navy/AirForce). */}
                            {(mappedNodes.length <= 4 || isFirst || isLast || node === currentSegment.current || node === currentSegment.next) && (
                                <div className={`absolute top-4 text-[9px] font-bold whitespace-nowrap transition-colors ${node === currentSegment.current || node === currentSegment.next ? 'text-blue-600 scale-110 drop-shadow-sm' :
                                    isCompleted ? 'text-gray-800' : 'text-gray-400'
                                    }`}>
                                    {node.name}
                                </div>
                            )}
                        </div>
                    )
                })}

                {/* Free-Floating Vehicle SVG */}
                <div
                    className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-1000 ease-out z-10 drop-shadow-lg"
                    style={{
                        left: `calc(${percent}% + ${percent < 50 ? '8px' : percent > 50 ? '-8px' : '0px'})`,
                        marginTop: branch === 'navy' ? '-8px' : branch === 'airforce' ? '-10px' : '-16px',
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    {getIconForBranch(branch)}
                </div>
            </div>
        </div>
    );
};
