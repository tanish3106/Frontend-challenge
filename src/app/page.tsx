/**
 * PAGE — Server Component: fetches Supabase data and renders the dashboard.
 */

import { getCourses } from "@/lib/data";
import {
  Sidebar,
  DashboardGrid,
  DashboardError,
} from "@/components/Dashboard";

/**
 * Home page — loads courses on the server, then shows sidebar + Bento grid.
 * If Supabase fails, shows DashboardError instead.
 */
export default async function HomePage() {
  try {
    const courses = await getCourses();

    return (
      <div className="flex min-h-screen flex-col md:flex-row pb-16 md:pb-0">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <DashboardGrid courses={courses} />
        </main>
      </div>
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return (
      <div className="min-h-screen flex items-center justify-center">
        <DashboardError message={message} />
      </div>
    );
  }
}
