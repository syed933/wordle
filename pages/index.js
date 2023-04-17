import Header from "@/components/Header";
import NewGame from "../components/NewGame";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between">
      <Header />
      <NewGame />
    </main>
  );
}
