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
import { useVenueStore } from "@/store/venueStore";

function DeleteDialog({ isOpen, selectedvenueId, onClose }: any) {
  if (!isOpen) return null;

  const { deleteVenueMutation } = useDeleteVenue();
  const { setDashboardData } = useDashboardStore();
  const { setSelectedvenueId } = useVenueStore();

  const handleDelete = (id: string) => {
    if (!id) {
      console.error("No ID provided for deletion");
      return;
    }

    deleteVenueMutation(id);
    localStorage.removeItem("venueId");
    setSelectedvenueId(null);
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
                handleDelete(selectedvenueId);
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
