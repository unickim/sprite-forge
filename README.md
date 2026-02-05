# SpriteForge

Unity 게임 개발을 위한 웹 기반 픽셀 아트 및 스프라이트 에디터

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)

## 주요 기능

### 드로잉 도구
| 도구 | 단축키 | 설명 |
|------|--------|------|
| Select | V | 영역 선택 |
| Move | M | 선택 영역 이동 |
| Pencil | B | 픽셀 단위 드로잉 |
| Eraser | E | 픽셀 지우기 |
| Fill | G | 채우기 도구 |
| Eyedropper | I | 색상 추출 |
| Line | L | 직선 그리기 |
| Rectangle | R | 사각형 그리기 |
| Ellipse | O | 타원 그리기 |
| Magic Wand | W | 유사 색상 선택 |

### 캔버스
- 1x ~ 32x 줌
- 픽셀 그리드 오버레이
- 투명 배경 체커보드 표시
- 패닝 (마우스 휠 클릭 또는 Alt+클릭)

### 레이어 시스템
- 다중 레이어 지원
- 레이어 표시/숨김
- 레이어 잠금
- 투명도 조절 (0-100%)
- 레이어 순서 변경, 복제, 삭제

### 애니메이션 타임라인
- 프레임 단위 애니메이션
- 프레임별 지속 시간 설정 (ms)
- FPS 조절 (1-60)
- 재생/일시정지/스텝 컨트롤

### 내보내기
- **PNG** - 단일 프레임 내보내기
- **Spritesheet** - 모든 프레임을 가로 스트립으로 내보내기
- **Unity Data** - Unity 연동용 JSON 메타데이터

## 키보드 단축키

| 단축키 | 동작 |
|--------|------|
| Ctrl+Z | 실행 취소 |
| Ctrl+Y / Ctrl+Shift+Z | 다시 실행 |
| [ | 브러시 크기 감소 |
| ] | 브러시 크기 증가 |

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

## 기술 스택

- **Framework**: Next.js 16.0.10
- **UI Library**: React 19.2.0
- **Styling**: Tailwind CSS 4.x
- **UI Components**: shadcn/ui (Radix UI)
- **Icons**: Lucide React
- **Language**: TypeScript 5.x

## 프로젝트 구조

```
├── app/                    # Next.js App Router
│   ├── globals.css         # 전역 스타일
│   ├── layout.tsx          # 루트 레이아웃
│   └── page.tsx            # 메인 페이지
├── components/
│   ├── sprite-editor/      # 스프라이트 에디터 컴포넌트
│   │   ├── sprite-editor.tsx   # 메인 에디터
│   │   ├── canvas.tsx          # 드로잉 캔버스
│   │   ├── toolbar.tsx         # 도구 팔레트
│   │   ├── layers-panel.tsx    # 레이어 관리
│   │   ├── color-picker.tsx    # 색상 선택
│   │   └── timeline.tsx        # 애니메이션 타임라인
│   └── ui/                 # shadcn/ui 컴포넌트
└── lib/                    # 유틸리티
```

## Unity 연동

### 내보내기 JSON 형식
```json
{
  "name": "sprite",
  "width": 64,
  "height": 64,
  "frames": [
    { "index": 0, "duration": 100 },
    { "index": 1, "duration": 100 }
  ],
  "fps": 12,
  "totalDuration": 200
}
```

## 라이선스

MIT License
