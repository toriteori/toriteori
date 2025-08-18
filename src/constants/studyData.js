export const lessons = [
  {
    id: 1,
    title: "컴포넌트 기초",
    content: "React 컴포넌트의 기본 구조를 배워봅시다.",
    code: `function MyComponent() {
  return <h1>안녕하세요!</h1>;
}`,
    category: "기초",
  },
  {
    id: 2,
    title: "State와 Props",
    content: "컴포넌트의 상태와 속성을 이해해봅시다.",
    code: `const [count, setCount] = useState(0);
// count는 상태값, setCount는 상태 변경 함수`,
    category: "기초",
  },
  {
    id: 3,
    title: "이벤트 핸들링",
    content: "사용자 상호작용을 처리하는 방법을 배워봅시다.",
    code: `<button onClick={() => alert('클릭!')}>
  클릭하세요
</button>`,
    category: "중급",
  },
  {
    id: 4,
    title: "조건부 렌더링",
    content: "조건에 따라 다른 내용을 보여주는 방법을 배워봅시다.",
    code: `{isVisible && <p>보이는 텍스트</p>}
{isLoggedIn ? <UserProfile /> : <LoginForm />}`,
    category: "중급",
  },
  {
    id: 5,
    title: "리스트 렌더링",
    content: "배열 데이터를 화면에 표시하는 방법을 배워봅시다.",
    code: `{items.map((item, index) => (
  <li key={index}>{item}</li>
))}`,
    category: "중급",
  },
  {
    id: 6,
    title: "useEffect 훅",
    content: "컴포넌트 생명주기와 사이드 이펙트를 관리합니다.",
    code: `useEffect(() => {
  // 컴포넌트가 마운트될 때 실행
  return () => {
    // 컴포넌트가 언마운트될 때 실행
  };
}, []);`,
    category: "고급",
  },
];

export const categories = [
  { id: "all", name: "전체" },
  { id: "basic", name: "기초" },
  { id: "intermediate", name: "중급" },
  { id: "advanced", name: "고급" },
];
