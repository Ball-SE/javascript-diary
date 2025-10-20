import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { 
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

function ResetPassManagement() {
    const { resetPassword, state } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [open, setOpen] = useState(false);

    const canSubmit = currentPassword && newPassword && confirmPassword && newPassword === confirmPassword;

    const handleConfirmReset = async () => {
        const res = await resetPassword(currentPassword, newPassword);
        if (res?.success) {
            toast.success('Password reset', { description: 'Your password has been updated', position: 'bottom-right' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } else if (res?.error) {
            toast.error('Reset failed', { description: res.error, position: 'bottom-right' });
        }
        setOpen(false);
    }

    return (
        <>
            {/* Header */}
            <div className="w-full flex justify-between items-center mb-6 border-b-2 border-gray-200 p-8">
                <h3 className="text-2xl font-semibold text-[#26231E]">Reset Password</h3>
                <AlertDialog open={open} onOpenChange={setOpen}>
                    <AlertDialogTrigger asChild>
                        <Button disabled={!canSubmit || state?.loading} className="flex items-center gap-2 rounded-full bg-[#26231E] text-white hover:bg-[#1a1a1a]">
                            Reset password
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="flex flex-col items-center justify-center">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-2xl font-bold">Reset password</AlertDialogTitle>
                            <AlertDialogDescription>Do you want to reset your password?</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleConfirmReset} className="rounded-full">Reset</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            
            <div className="px-8 py-3">
                <div className="space-y-8 max-w-md">
                    {/* Current Password Section */}
                    <div>
                        <p className="text-[#75716B] text-base font-medium mb-4">Current Password</p>
                        <Input 
                            type="password"
                            placeholder="Current password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full bg-white"
                        />
                    </div>

                    {/* New Password Section */}
                    <div>
                        <p className="text-[#75716B] text-base font-medium mb-4">New Password</p>
                        <Input 
                            type="password"
                            placeholder="New password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full bg-white"
                        />
                    </div>

                    {/* Confirm Password Section */}
                    <div>
                        <p className="text-[#75716B] text-base font-medium mb-4">Confirm New Password</p>
                        <Input 
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-white"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default ResetPassManagement;
