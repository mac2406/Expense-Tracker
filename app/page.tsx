import { redirect } from "next/navigation";

export default function RootPage() {
  // Seamless server-side redirect to dashboard
  redirect("/dashboard");
}
