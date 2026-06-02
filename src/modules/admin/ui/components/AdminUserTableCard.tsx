import { IconSettings, IconUser, IconCash } from "@tabler/icons-react";
import { Switch } from "../../../../components/ui/switch";
import ButtonComponent from "../../../../components/ui/ButtonComponent";

interface AdminUserTableCardProps {
  id: string | number;
  username: string;
  email: string;
  role: "CUSTOMER" | "SELLER" | "ADMIN";
  status: boolean;
  onStatusChange?: (newStatus: boolean) => void;
  onEdit?: () => void;
}

export default function AdminUserTableCard({
  id,
  username,
  email,
  role,
  status,
  onStatusChange,
  onEdit,
}: AdminUserTableCardProps) {
  const getRoleIcon = () => {
    switch (role) {
      case "CUSTOMER":
        return <IconUser size={16} className="text-contrast-secondary" />;
      case "SELLER":
        return <IconCash size={16} className="text-contrast-main" />;
      default:
        return <IconSettings size={16} className="text-main" />;
    }
  };

  return (
    <div
      className="flex items-center justify-between w-full bg-white border border-main-dark/10 rounded-2xl px-6 py-3 
      shadow-sm hover:shadow-md hover:border-main-dark/30 transition-all duration-300 font-quicksand"
    >
      {/* ID */}
      <p className="w-24 text-sm text-gray-500 font-medium select-none">{id}</p>

      {/* Username */}
      <p className="w-40 text-gray-800 font-semibold truncate">@{username}</p>

      {/* Email */}
      <p className="w-56 text-gray-600 truncate">{email}</p>

      {/* Role */}
      <div className="w-32 flex items-center gap-2 text-gray-700 font-medium">
        {getRoleIcon()}
        <span className="capitalize">{role.toLowerCase()}</span>
      </div>

      {/* Status Switch */}
      <div className="w-24 flex justify-center">
        <Switch
          checked={status}
          onCheckedChange={(checked) => onStatusChange?.(checked)}
        />
      </div>

      {/* Edit Button */}
      <div className="w-16 flex justify-center">
        <ButtonComponent
          icon={<IconSettings size={18} />}
          style="text-main hover:text-white hover:bg-main-dark bg-main/10 rounded-full p-2 transition-all duration-300"
          onClick={onEdit}
        />
      </div>
    </div>
  );
}
