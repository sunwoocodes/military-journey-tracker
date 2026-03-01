# 🪖 MiliTrain (Military Journey Tracker)

**MiliTrain**은 대한민국 국군 장병 및 보충역(공익)의 복무 여정을 지루한 퍼센트(%)나 D-Day 숫자가 아닌, **동적이고 시각적인 재미를 주는 다중 테마 노선도(Journey Route)**로 표현하는 웹 애플리케이션입니다. 육군, 해군, 공군, 사회복무요원의 각 특성에 맞춘 고품질 애니메이션 UI를 제공합니다.

---

## 🛠️ Tech Stack & Open Source Libraries

본 프로젝트는 최신 트렌드의 프론트엔드 생태계와 안정적인 오픈소스 라이브러리들을 조합하여 구성되었습니다.

### ⚡ Core Framework & Build Tool
- **[React 18](https://react.dev/)**: 사용자 인터페이스를 구축하기 위한 핵심 라이브러리
- **[TypeScript](https://www.typescriptlang.org/)**: 정적 타이핑을 통한 높은 코드 안정성과 DX(Developer Experience) 제공
- **[Vite](https://vitejs.dev/)**: 매우 빠른 HMR(Hot Module Replacement)과 빌드 성능을 자랑하는 차세대 빌드 툴

### 🎨 UI / Styling / Animation
- **[Tailwind CSS](https://tailwindcss.com/)**: 유틸리티 우선(Utility-first) 방식의 유연하고 빠른 CSS 스타일링
- **[Framer Motion](https://www.framer.com/motion/)**: 복잡한 UI 트랜지션 및 부드러운 애니메이션 구현
- **[Radix UI](https://www.radix-ui.com/)**: 접근성(a11y)이 뛰어난 Headless UI 컴포넌트 기반 (shadcn/ui에 사용됨)
- **[Lucide React](https://lucide.dev/)**: 깔끔하고 일관성 있는 SVG 아이콘 팩
- **[Embla Carousel](https://www.embla-carousel.com/)**: 부드럽고 가벼운 터치/스와이프 지원 캐러셀 슬라이더

### 🧠 State Management & Data Fetching
- **[Zustand](https://zustand-demo.pmnd.rs/)**: 작고 직관적인 보일러플레이트 없는 전역 상태 관리
- **[React Query (TanStack)](https://tanstack.com/query/latest)**: 서버 상태 동기화 및 캐싱 (추후 백엔드 API/오픈 API 연동 시 활용)

### ⚙️ Utilities & Routing
- **[React Router DOM](https://reactrouter.com/)**: SPA(Single Page Application) 내비게이션 및 라우팅
- **[date-fns](https://date-fns.org/)**: 가볍고 모듈화된 강력한 날짜/시간 포맷팅 및 계산 유틸리티 (`differenceInCalendarDays`, `differenceInSeconds` 등 활용)
- **[clsx](https://github.com/lukeed/clsx) & [tailwind-merge](https://github.com/dcastil/tailwind-merge)**: 동적인 Tailwind 클래스 결합 및 충돌 해결

---

## 🏗️ Architecture & Data Flow (구조도)

아래 다이어그램은 MiliTrain 앱 내에서 오픈소스 라이브러리들이 어떻게 유기적으로 연결되어 동작하는지를 나타냅니다.

```mermaid
graph TD
    subgraph Client App
        direction TB
        
        Router[React Router DOM<br/>SPA Navigation]
        
        subgraph Pages
            IndexPage[Index.tsx<br/>Home Dashboard]
            ForumPage[Forum / Calendar<br/>(Future Scope)]
        end
        
        subgraph Components Layer
            ServiceCard[ServiceCard.tsx<br/>Logic & D-Day Calc]
            JourneyRoute[JourneyRoute.tsx<br/>Real-time Timer]
            Vehicles[AnimatedVehicles.tsx<br/>Framer Motion / SVG]
            SharedUI[shadcn/ui Components<br/>Radix UI + Tailwind]
        end
        
        subgraph State Layer
            ZustandStore[(Zustand Store<br/>useUserStore.ts)]
            ReactQuery[[React Query<br/>Server State/API Cache]]
        end
        
        subgraph Utilities
            DateFNS{date-fns<br/>Time Math}
            MockData[(mockRoutes.ts<br/>Local JSON)]
        end
    end

    %% Connections
    Router --> Pages
    IndexPage --> ServiceCard
    ServiceCard --> JourneyRoute
    JourneyRoute --> Vehicles
    
    Pages --> SharedUI
    
    %% State connections
    ServiceCard <--> ZustandStore
    IndexPage <--> ZustandStore
    
    %% Util connections
    ServiceCard --> DateFNS
    JourneyRoute --> DateFNS
    JourneyRoute <--> MockData
    
    %% Future external connection
    ReactQuery -.->|Fetch Real Transport Data| ExternalAPI((Public Traffic API))
    
    classDef react fill:#61dafb,stroke:#333,stroke-width:2px,color:#000
    classDef state fill:#f9a826,stroke:#333,stroke-width:2px,color:#000
    classDef util fill:#4caf50,stroke:#333,stroke-width:2px,color:#fff
    classDef ui fill:#38bdf8,stroke:#333,stroke-width:2px,color:#fff
    
    class IndexPage,ServiceCard,JourneyRoute,Vehicles react
    class ZustandStore,ReactQuery state
    class DateFNS,MockData util
    class SharedUI,Router ui
```

### 🔍 다이어그램 요약
1. **Zustand**는 사용자의 병과(육/해/공/공익), 입대일, 전역일 등의 글로벌 상태를 관리합니다.
2. **React Router**를 통해 접근한 메인 대시보드는 **ServiceCard**를 렌더링하며, 여기서 **date-fns**를 이용해 진급 및 총 복무일 퍼센티지를 연산합니다.
3. 시각적으로 핵심인 **JourneyRoute** 컴포넌트는 **mockRoutes**에서 해당 병과의 노선 데이터를 불러오고, 초 단위 실시간 랜더링 루프를 통해 남은 시간(HH:MM:SS)을 표시합니다.
4. **AnimatedVehicles**는 Tailwind와 프레임 모션을 결합하여 실감 나는 부품 애니메이션(바퀴, 연기, 파도)을 담당합니다.
5. 추후 **React Query**가 적용되어 공공 API 서버로부터 스케줄을 패칭해 오면, Mock 데이터 부분을 100% Real 데이터로 교체할 수 있는 유연한 아키텍처를 가집니다.
