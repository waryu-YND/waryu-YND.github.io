import { createSignal } from "solid-js";

export default function App() {
  const [count, setCount] = createSignal(0);

  return (
    <>
      <button
        onclick={() => {
          setCount((i) => i + 1);
        }}
      >
        {count()}
      </button>
    </>
  );
}
