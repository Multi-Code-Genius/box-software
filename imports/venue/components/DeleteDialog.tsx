import { getAllGames, useGames } from "@/api/booking";
import { useDeleteVenue } from "@/api/vanue";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDashboardStore } from "@/store/dashboardStore";

function DeleteDialog({ isOpen, selectedGameId, onClose }: any) {
  if (!isOpen) return null;

  const { deleteVenueMutation } = useDeleteVenue();
  const { setSelectedGameId, setDashboardData } = useDashboardStore();

  const handleDelete = (id: string) => {
    if (!id) {
      console.error("No ID provided for deletion");
      return;
    }

    deleteVenueMutation(id);
    localStorage.removeItem("gameId");
    setSelectedGameId(undefined);
    setDashboardData(null);
  };

  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={onClose}>
        <AlertDialogTrigger asChild></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure ?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(selectedGameId);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default DeleteDialog;
