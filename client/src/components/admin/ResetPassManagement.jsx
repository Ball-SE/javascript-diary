import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function ResetPassManagement() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    return (
        <>
            {/* Header */}
            <div className="w-full flex justify-between items-center mb-6 border-b-2 border-gray-200 p-8">
                <h3 className="text-2xl font-semibold text-[#26231E]">Reset Password</h3>
                <Button className="flex items-center gap-2 rounded-full bg-[#26231E] text-white hover:bg-[#1a1a1a]">
                    Reset password
                </Button>
            </div>
            
            <div className="px-8 py-3">
                <div className="space-y-8 max-w-md">
                    {/* Current Password Section */}
                    <div>
                        <p className="text-[#75716B] text-base font-medium mb-4">Current Password</p>
                        <Input 
                            type="password"
                            placeholder="Enter current password"
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
                            placeholder="Enter new password"
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
