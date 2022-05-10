# 어딨지? 프로젝트

### 구현 결과(구현 내용 중 일부 자세한 영상 업로드 예정)

Click [here]()
<img src="https://user-images.githubusercontent.com/74299317/165021765-075f0a3e-fc34-43b8-a0c2-93c2f9b83bba.PNG" width="300" height="400"/>
<img src="https://user-images.githubusercontent.com/74299317/165021802-a1ee56c5-2a41-461d-8a82-e073d7889c72.PNG" width="300" height="400"/>
<img src="https://user-images.githubusercontent.com/74299317/165021795-e814ab78-ed02-434c-bc7d-a570e52dfd0e.PNG" width="300" height="400"/>
<img src="https://user-images.githubusercontent.com/74299317/165021798-397be22f-b044-4bef-bccf-546d02578b1e.PNG" width="300" height="400"/>
<img src="https://user-images.githubusercontent.com/74299317/165021834-b61d3ac0-0b06-4c02-9f51-e096c920eb5b.PNG" width="300" height="400"/>

🏠

### 🔥프로젝트 소개

분실물 찾기 서비스. 사이트 홈에 지도를 통해 분실물과 습득물 목록을 한 번에 확인 할 수 있습니다. 잃어버리거나 주운 물건에 대해 게시글을 작성하고, 댓글 대댓글을 달 수 있습니다. 또한 채팅기능을 지원합니다.

<br/>

---

### 💻Skill

<img src="https://img.shields.io/badge/react-61DAFB?style=flat-square&logo=react&logoColor=black"> <img src="https://img.shields.io/badge/typescript-3178C6?style=flat-square&logo=typescript&logoColor=black">
<img src="https://img.shields.io/badge/swr-blue?style=flat-square&logo=swr&logoColor=white">
<img src="https://img.shields.io/badge/nextJs-000000?style=flat-square&logo=next.Js&logoColor=white">  
<img src="https://img.shields.io/badge/tailwindCss-06B6D4?style=flat-square&logo=tailwindCss&logoColor=white">
<img src="https://img.shields.io/badge/fontawesome-339AF0?style=flat-square&logo=fontawesome&logoColor=white">

---

### ⭐️구현 기능

> 구현한 것

- 지도 관련 기능(카카오 map api사용) -지도 위에 분실물/습득물 목록 표시. 클릭 시 info window 띄움.
  info window의 링크를 통해 게시물 페이지로 이동 -현재 위치 불러오기 -현재 위치 기준으로 지하철,마트,편의점 등등의 카테고리 선택 시 해
  당 장소들을 거리순으로 불러옴 -검색 키워드 기반 장소 검색. -지도 클릭 시 마커 띄우기. 클릭 좌표를 주소로 변환 -지도 확대/축소
- 게시글 목록 pagination
- 로그인/회원가입
- 게시물 crud
- 게시물 목록 페이지네이션 지원
- 댓글/대댓글 작성
- 사용자 리뷰 작성
- 이외 prisma를 통한 db query문법들 작성

  > 구현 예정

- 채팅 기능
- 모든 필요한 페이지에 페이지네이션 지원(ex.댓글)
- 반응형

---

### 📁프로젝트 구조

```
📦find-my
 ┣ 📂components
 ┃ ┣ 📂auth
 ┃ ┣ 📂Comment
 ┃ ┃ ┣ 📂create
 ┃ ┃ ┣ 📂Edit
 ┃ ┣ 📂Map
 ┃ ┃
 ┃ ┣ 📂Post
 ┃ ┣ 📜layout.tsx
 ┃ ┣ 📜MessageInput.tsx
 ┃ ┣ 📜SearchInput.tsx
 ┃ ┣ 📜ServiceLogo.tsx
 ┃ ┣ 📜SquareMessageInput.tsx
 ┃ ┗ 📜UploadButton.tsx
 ┣ 📂libs
 ┃ ┣ 📂back
 ┃ ┃ ┣ 📜client.ts
 ┃ ┃ ┣ 📜protectedHandler.tsx
 ┃ ┃ ┗ 📜session.ts
 ┃ ┗ 📂front
 ┃ ┃ ┣ 📂hooks
 ┃ ┃ ┃ ┣ 📜useMutation.tsx
 ┃ ┃ ┃ ┣ 📜useSearch.ts
 ┃ ┃ ┃ ┗ 📜useUser.ts
 ┃ ┃ ┣ 📜cfImage.ts
 ┃ ┃ ┣ 📜displayTime.ts
 ┃ ┃ ┣ 📜location.ts
 ┃ ┃ ┗ 📜utils.ts
 ┣ 📂pages
 ┃ ┣ 📂api
 ┃ ┃ ┣ 📂founds
 ┃ ┃ ┃ ┗ 📜index.ts
 ┃ ┃ ┣ 📂losts
 ┃ ┃ ┃ ┗ 📜index.ts
 ┃ ┃ ┣ 📂posts
 ┃ ┃ ┃ ┣ 📂search
 ┃ ┃ ┃ ┃ ┣ 📂founds
 ┃ ┃ ┃ ┃ ┃ ┗ 📜[searchTerm].ts
 ┃ ┃ ┃ ┃ ┣ 📂losts
 ┃ ┃ ┃ ┃ ┃ ┗ 📜[searchTerm].ts
 ┃ ┃ ┃ ┃ ┗ 📜[searchTerm].ts
 ┃ ┃ ┃ ┣ 📂[id]
 ┃ ┃ ┃ ┃ ┣ 📂comments
 ┃ ┃ ┃ ┃ ┃ ┣ 📂[commentId]
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂recomments
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜[reCommentId].ts
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜index.ts
 ┃ ┃ ┃ ┃ ┃ ┗ 📜index.ts
 ┃ ┃ ┃ ┃ ┗ 📜index.ts
 ┃ ┃ ┃ ┗ 📜index.tsx
 ┃ ┃ ┣ 📂users
 ┃ ┃ ┃ ┣ 📂me
 ┃ ┃ ┃ ┃ ┣ 📂scraps
 ┃ ┃ ┃ ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┃ ┃ ┃ ┗ 📜[id].ts
 ┃ ┃ ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┃ ┃ ┣ 📜posts.ts
 ┃ ┃ ┃ ┃ ┗ 📜reviews.ts
 ┃ ┃ ┃ ┣ 📂[id]
 ┃ ┃ ┃ ┃ ┣ 📂reviews
 ┃ ┃ ┃ ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┃ ┃ ┃ ┗ 📜[reviewId].ts
 ┃ ┃ ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┃ ┃ ┗ 📜posts.ts
 ┃ ┃ ┃ ┣ 📜login.tsx
 ┃ ┃ ┃ ┗ 📜signup.tsx
 ┃ ┃ ┗ 📜files.ts
 ┃ ┣ 📂chats
 ┃ ┃ ┣ 📜index.tsx
 ┃ ┃ ┗ 📜[id].tsx
 ┃ ┣ 📂founds
 ┃ ┃ ┣ 📂[id]
 ┃ ┃ ┃ ┣ 📜edit.tsx
 ┃ ┃ ┃ ┗ 📜index.tsx
 ┃ ┃ ┣ 📜index.tsx
 ┃ ┃ ┣ 📜search.tsx
 ┃ ┃ ┗ 📜upload.tsx
 ┃ ┣ 📂losts
 ┃ ┃ ┣ 📂[id]
 ┃ ┃ ┃ ┣ 📜edit.tsx
 ┃ ┃ ┃ ┗ 📜index.tsx
 ┃ ┃ ┣ 📜index.tsx
 ┃ ┃ ┣ 📜search.tsx
 ┃ ┃ ┗ 📜upload.tsx
 ┃ ┣ 📂profile
 ┃ ┃ ┣ 📜edit.tsx
 ┃ ┃ ┣ 📜found.tsx
 ┃ ┃ ┣ 📜index.tsx
 ┃ ┃ ┣ 📜lost.tsx
 ┃ ┃ ┗ 📜userReview.tsx
 ┃ ┣ 📂users
 ┃ ┃ ┗ 📂[id]
 ┃ ┃ ┃ ┣ 📂reviews
 ┃ ┃ ┃ ┃ ┣ 📂[reviewId]
 ┃ ┃ ┃ ┃ ┃ ┗ 📜edit.tsx
 ┃ ┃ ┃ ┃ ┗ 📜write.tsx
 ┃ ┃ ┃ ┗ 📜index.tsx
 ┃ ┣ 📜404.tsx
 ┃ ┣ 📜index.tsx
 ┃ ┣ 📜login.tsx
 ┃ ┣ 📜NavBar.tsx
 ┃ ┣ 📜signup.tsx
 ┃ ┗ 📜_app.tsx
 ┣ 📂prisma
 ┃ ┣ 📜schema.prisma
 ┃ ┗ 📜seed.ts
 ┣ 📂public
 ┃ ┣ 📂images
 ┣ 📂styles
 ┃ ┣ 📜globals.css
 ┃ ┗ 📜Home.module.css
 ┣ 📂typeDefs
 ┃ ┗ 📜post.ts
 ┗  ...
```

---

### 👨‍💻 프로젝트 경험 정리

> #### 디자인 시스템(storybook)

> #### cypress

> #### typescript

기존 진행했던 프로젝트에 비해 큰 프로젝트를 진행하
다 보니 타입스크립트의 이점이 강력하게 느껴졌습니다. 서버에서 오
는 데이터와 클라이언트에서 보내는 데이터를 명확하게 정의 할 수
있다는 점에서 에러가 발생할 확률을 낮추고 작업효율을 올릴 수 있
었습니다. 타입에 대해 any를 사용해 에러를 피하는 것은 굉장히 나
쁜 코드라 생각해, 필요한 경우 generic 표현을 사용했습니다. 예를
들어 굉장이 빈번히 일어나는 데이터 삭제,추가,수정의 반복적인
mutation 작성을 피하기 위해 모든 파일에서 사용할 수 있는
useMutation이라는 커스텀 훅을 만들 었는데 서버에서 오는 결과
data의 타입을 하나의 타입으로 특정 할 수 없어 단순히 any보다는
generic 표현을 통해 안정성을 높이고자 했습니다.

<br/>
<br/>

> #### 📜tailwind css

다른 리액트 프로젝트들에서는 styled-component만
을 사용하다 tailwindCSS를 처음 적용해 보았습니다. 스타일을 적용
하기 위해서 축약되어 있는 className들을 어느 정도 익혀야 했지
만 적응하고 나서는 작업속도가 styled-component를 사용했을 때 보
다 훨씬 빨라졌음을 느꼈습니다. 따로 스타일을 정의할 필요 없이 바
로 태그위에 짧은 코드로 스타일을 적용 할 수 있기 때문입니다. 향
후 프로젝트에서 팀원들이 동의한다면 적극 도입하고 싶습니다.

<br/>
<br/>

---

###

---

### Getting Started

```

```

---
