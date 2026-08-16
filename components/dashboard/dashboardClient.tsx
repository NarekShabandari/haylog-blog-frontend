"use client";

import { useAuth } from "@/hooks/queries/useAuth";
import { PenLine, Sparkles } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { TabButton } from "../ui/tabButton";
import { DashboardSkeleton } from "./dashboardSkeleton";
import { GenerateForm } from "./generateForm";
import { ManualForm } from "./manualForm";
import { RecentPosts } from "./recentPosts";

type Tab = "generate" | "manual";

export function DashboardClient() {
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("generate");
  if (authLoading) return <DashboardSkeleton />;
  if (!isLoggedIn) {
    redirect("/en/login");
  }

  return (
    <div className="min-h-screen bg-(--bg)">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <span className="font-mono text-[10px] font-bold tracking-widest uppercase text-accent">
            Dashboard
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-muted mt-1 ">
            Post Manager
          </h1>
          <p className="text-sm text-muted mt-1">
            Generate with AI or write manually
          </p>
        </div>
        <div className="flex gap-2 mb-8 border-b border-border">
          <TabButton
            active={activeTab === "generate"}
            onClick={() => setActiveTab("generate")}
            icon={<Sparkles size={14} />}
            label="AI Generate"
          />
          <TabButton
            active={activeTab === "manual"}
            onClick={() => setActiveTab("manual")}
            icon={<PenLine size={14} />}
            label="Write Manually"
            deactive
          />
        </div>
        <div className="grid grid-cols1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {activeTab === "generate" ? <GenerateForm /> : <ManualForm />}
          </div>
          <div>
            <RecentPosts />
          </div>
        </div>
      </div>
    </div>
  );
}
