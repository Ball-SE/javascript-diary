import {
    AlertDialog as AlertDialogPrimitive,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    AlertDialogAction,
  } from "@/components/ui/alert-dialog";
import { Link } from "react-router-dom";

export function AlertDialog({ trigger }) {
    return (
        <AlertDialogPrimitive>
            <AlertDialogTrigger asChild>
                {trigger}
            </AlertDialogTrigger>
            <AlertDialogContent className="flex flex-col items-center justify-center">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-bold">Create an account to continue</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogAction><Link to="/signup">Create account</Link></AlertDialogAction>
                <AlertDialogFooter>
                    <AlertDialogDescription>
                        <p>Already have an account? <Link to="/login">Log in</Link></p>
                    </AlertDialogDescription>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialogPrimitive>
        
    )
}