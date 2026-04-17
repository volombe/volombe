import { redirect } from "next/navigation";

// Redirige la route Next.js "/" vers le vrai site statique
export default function HomePage() {
  redirect("/index.html");
}
