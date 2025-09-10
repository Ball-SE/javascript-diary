import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

function Alert() {
  return (
    <AlertDialog>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create an account to continue</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogAction>Create account</AlertDialogAction>
        <AlertDialogFooter>
          <AlertDialogDescription>
            <p>
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </AlertDialogDescription>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
