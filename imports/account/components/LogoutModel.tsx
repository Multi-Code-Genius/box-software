import { Button } from "@/components/ui/button";

export const LogoutConfirmModal = ({ onConfirm, onCancel }: any) => (
  <div className="fixed inset-0 z-40 flex items-center justify-center w-[100vw] h-[100vh]">
    <div className="absolute inset-0 bg-[rgba(0,0,0,0.5)] z-40 w-full" />

    <div className="relative bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-80 z-50 space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold ">Confirm Logout</h2>
        <p className="text-sm">Are you sure you want to log out?</p>
      </div>
      <div className="flex justify-end gap-2">
        <Button
          onClick={onCancel}
          className="px-4 py-2 bg-white text-black border hover:text-white hover:bg-black rounded"
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          className="px-4 py-2 text-white rounded hover:bg-white hover:text-black border"
        >
          Logout
        </Button>
      </div>
    </div>
  </div>
);
