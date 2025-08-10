import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PersonalInfo } from "@/features/optimization/types";
import { User } from "lucide-react";

export const ProfileOverview = ({
  personal_info,
}: {
  personal_info?: PersonalInfo;
}) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Candidate Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">{personal_info?.name}</h3>
            <p className="text-gray-600">
              {personal_info?.email} • {personal_info?.phone}
            </p>
          </div>
          <p className="text-sm text-gray-700">{personal_info?.summary}</p>
        </div>
      </CardContent>
    </Card>
  );
};
