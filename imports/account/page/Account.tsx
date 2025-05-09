import {
  Pencil,
  Building2,
  Users,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";

const Account = () => {
  return (
    <div className="w-full h-[100vh] flex flex-col justify-center items-center">
      <div className="w-[30%] h-full  rounded shadow-lg p-10">
        <div className=" p-4 rounded shadow">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">Account</h1>
            <Pencil className="w-5 h-5 cursor-pointer" />
          </div>

          <div className="mb-6 space-y-1">
            <div className="text-gray-700 font-medium">Username</div>
            <div className="text-gray-500">+1234567890</div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-2 cursor-pointer hover:text-slate-600">
            <Building2 className="w-5 h-5" />
            <p>Venue Manage</p>
          </div>

          <div className="flex items-center gap-2 cursor-pointer hover:text-slate-600">
            <Users className="w-5 h-5" />
            <p>Customers</p>
          </div>

          <div className="flex items-center gap-2 cursor-pointer hover:text-slate-600">
            <Settings className="w-5 h-5" />
            <p>Settings</p>
          </div>

          <div className="flex items-center gap-2 cursor-pointer hover:text-slate-600">
            <HelpCircle className="w-5 h-5" />
            <p>Help</p>
          </div>

          <div className="flex items-center gap-2  cursor-pointer hover:text-slate-600">
            <LogOut className="w-5 h-5" />
            <p>Logout</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
