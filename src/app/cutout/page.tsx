import { CutoutStudio } from "@/components/cutout/cutout-studio";

export const metadata = { title: "Cutout Character Studio" };

export default function CutoutPage() {
  return (
    <main className="cutout-page">
      <div className="cutout-shell">
        <CutoutStudio />
      </div>
    </main>
  );
}
