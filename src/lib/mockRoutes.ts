import { Branch } from '../stores/userStore';

export interface RouteNode {
    name: string;
    timeFromStartMinutes: number; // Cumulative time in minutes from the active duty start
}

export interface MockRoute {
    id: string;
    branch: Branch;
    startStation: string;
    endStation: string;
    totalTimeMinutes: number;
    nodes: RouteNode[];
}

export const MOCK_ROUTES: MockRoute[] = [
    {
        id: 'army_route_1',
        branch: 'army',
        startStation: '양평역',
        endStation: '가산디지털단지역',
        totalTimeMinutes: 90, // Total 1h 30m
        nodes: [
            { name: '양평역', timeFromStartMinutes: 0 },
            { name: '청량리역', timeFromStartMinutes: 44 },
            { name: '용산역', timeFromStartMinutes: 63 },
            { name: '노량진역', timeFromStartMinutes: 70 },
            { name: '가산디지털단지역', timeFromStartMinutes: 90 },
        ]
    },
    {
        id: 'airforce_route_1',
        branch: 'airforce',
        startStation: '제15특수임무비행단(성남)',
        endStation: '제1전투비행단(광주)',
        totalTimeMinutes: 60, // Total 1 hour flight
        nodes: [
            { name: '제15비행단(이륙)', timeFromStartMinutes: 0 },
            { name: '경기남부 상공', timeFromStartMinutes: 10 },
            { name: '수원기지 관제탑 교신', timeFromStartMinutes: 18 },
            { name: '충청도 진입상공', timeFromStartMinutes: 30 },
            { name: '서해안 해안선 비행', timeFromStartMinutes: 42 },
            { name: '전라도 진입상공', timeFromStartMinutes: 52 },
            { name: '제1전비(착륙)', timeFromStartMinutes: 60 },
        ]
    },
    {
        id: 'navy_route_1',
        branch: 'navy',
        startStation: '진해 해군기지',
        endStation: '평택 제2함대',
        totalTimeMinutes: 1440, // Total 24 hours
        nodes: [
            { name: '진해 제8전단(출항)', timeFromStartMinutes: 0 },
            { name: '거제도 앞바다', timeFromStartMinutes: 120 },
            { name: '충무공이순신함 조우', timeFromStartMinutes: 300 },
            { name: '제주 남방해역', timeFromStartMinutes: 480 },
            { name: '이어도 종합해양과학기지 인근', timeFromStartMinutes: 720 },
            { name: '추자도 인근 해역', timeFromStartMinutes: 900 },
            { name: '서해안 NLL경비구역 진입', timeFromStartMinutes: 1100 },
            { name: '격렬비열도', timeFromStartMinutes: 1250 },
            { name: '인천대교 뷰포인트', timeFromStartMinutes: 1380 },
            { name: '평택 제2함대(입항)', timeFromStartMinutes: 1440 },
        ]
    },
    {
        id: 'public_route_1',
        branch: 'public',
        startStation: '서울시청 구청교통과',
        endStation: '신림역 3번출구',
        totalTimeMinutes: 50, // Total 50 minutes
        nodes: [
            { name: '서울시청 구청교통과', timeFromStartMinutes: 0 },
            { name: '충정로역', timeFromStartMinutes: 15 },
            { name: '홍대입구역', timeFromStartMinutes: 30 },
            { name: '신림역 3번출구', timeFromStartMinutes: 50 },
        ]
    }
];

// Helper to get a random mock route for a specific branch
export const getRandomMockRoute = (branch: Branch): MockRoute => {
    const branchRoutes = MOCK_ROUTES.filter(r => r.branch === branch);
    if (branchRoutes.length > 0) {
        return branchRoutes[Math.floor(Math.random() * branchRoutes.length)];
    }
    return MOCK_ROUTES[0];
};
