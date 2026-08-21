# K-FAN PLANNER — 공식 웹사이트 v0.1 (골격)

이관서 KFAN_WEB_HANDOVER(클레어, 2026-08-21) §7 「지금 시작 가능한 것」 범위의 구현입니다.

## 구성

```
index.html              홈 (제품 소개 + 공연장 5 카드 + 축제 스트립 + 앱 CTA)
venues/*.html           공연장 5곳 — 가이드 8섹션 골격("guide in progress") + 숙소·볼거리·먹거리(실데이터)
venues/seoul-arena.html 서울아레나 선점 페이지 (검증 사실만: 2027 개관·1.8만석+·창동)
checklist.html          체크리스트 골격 (원고 대기)
privacy.html            처리방침 자리 (클레어 HTML 수신 후 교체)
assets/kfan.css/.js     A.P 다크 토큰 · 데이터 소비 · 공유 버튼
data/kfan_data.json     8/21 샘플 (파이프라인 산출물 사본)
```

## 원칙 준수 상태

아이돌 이름·사진 0 / 일정 DB 없음 / 서버·계정·쿠키·애널리틱스 없음 / 티켓 언급은 "판매 안 함" 고지뿐 / KTO 출처 + 면책 표기 / **더미 가이드 본문 없음** — 8섹션은 "guide in progress" 상태로 클레어 원고를 기다립니다.

## 나중에 바꿀 지점 (주석으로 표시돼 있음)

1. **데이터 URL** — 각 html `<body data-src="...">`. 지금은 동봉 샘플. 클레어의 게시 URL 확정 시 절대 URL로 교체
2. **어필리에이트 태그** — assets/kfan.js 상단 `AGODA_CID` / `KLOOK_AID` (8/25 수신 예정, 그때까지 일반 링크)
3. **가이드 본문** — 클레어 원고(md/JSON) 수신 시 8섹션에 주입 (렌더만, 사실관계 수정 금지)
4. **앱 배지·스토어 링크** — 지금은 "launching soon" 배지만 (가짜 링크 없음)
5. **이름·로고** — "K-FAN PLANNER (working title)". 네이밍 확정 시 일괄 치환
6. **sitemap.xml** — 도메인 확정 후 생성 (절대 URL 필요)

## 배포

정적 파일 그대로 GitHub Pages에 올리면 됩니다. 빌드 과정 없음.
이미지가 http://tong.visitkorea.or.kr 로 오는 건은 JS에서 https로 승격해 혼합콘텐츠를 방지합니다.

※ gen_kfan.py(파이프라인)는 이 사이트에 포함하지 않습니다 — 키가 들어 있으므로 공개 레포에 절대 커밋 금지.
