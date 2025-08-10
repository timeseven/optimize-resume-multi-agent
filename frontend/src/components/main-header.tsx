"use client";

import { Button } from "@/components/ui/button";
import { useSignout } from "@/features/auth/hooks/useAuthApiHooks";
import useSelectionStore from "@/stores/useSelectionStore";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const MainHeader = () => {
  const { resetSelection } = useSelectionStore();
  const navigate = useRouter();
  const { mutateAsync: signout } = useSignout();
  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Resume Optimization
            </h1>
            <p className="text-gray-600">
              Select a resume and job description to start optimization
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate.push("/history")}>
              View History
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                try {
                  await signout();
                  resetSelection();
                  navigate.push("/signin");
                } catch (error) {
                  toast.error(`Signout failed: ${error}`);
                }
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
