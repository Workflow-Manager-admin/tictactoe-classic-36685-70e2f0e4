import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

// Import the new TicTacToeClassic component
import TicTacToeClassic from "../components/tictactoe/TicTacToeClassic";

// PUBLIC_INTERFACE
export default component$(() => {
  return (
    <>
      <TicTacToeClassic />
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
