import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Image } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

function ProfileManagement() {
    const { state, uploadProfilePicture, updateProfile } = useAuth();
    const user = state?.user;

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [bio, setBio] = useState('');
    const [username, setUsername] = useState('');
    const [profilePic, setProfilePic] = useState('');
    const fileInputRef = useRef(null);
    const [saving, setSaving] = useState(false);

    const handleOpenFilePicker = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelected = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const result = await uploadProfilePicture(file);
        if (result?.success) {
            setProfilePic(result.profilePic);
        }
        // reset so selecting the same file again still triggers change
        event.target.value = '';
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const result = await updateProfile({ name, username, bio });
            if (result?.success) {
                toast.success('Saved profile', {
                    description: 'Your profile has been successfully updated',
                    position: 'bottom-right'
                });
            } else if (result?.error) {
                toast.error('Failed to save', {
                    description: result.error,
                    position: 'bottom-right'
                });
            }
        } catch (err) {
            toast.error('Failed to save', {
                description: err?.message || 'Unexpected error',
                position: 'bottom-right'
            });
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setUsername(user.username || '');
            setEmail(user.email || '');
            setProfilePic(user.profilePic || '');
            setBio(user.bio || '');
        }
    }, [user]);
    
    return (
        <>
            {/* Header */}
            <div className="w-full flex justify-between items-center mb-6 border-b-2 border-gray-200 p-8">
                <h3 className="text-2xl font-semibold text-[#26231E]">Profile Management</h3>
                <Button onClick={handleSave} disabled={saving || state?.loading} className="flex items-center gap-2 rounded-full bg-[#26231E] text-white hover:bg-[#1a1a1a]">
                    Save
                </Button>
            </div>
            
            <div className="px-8 py-3">
                <div className="space-y-8">
                    {/* Profile Picture Section */}
                    <div>
                        <p className="text-[#75716B] text-base font-medium mb-4">Profile Picture</p>
                        <div className="flex gap-6 items-center">
                            <div className="w-32 h-32 bg-[#EFEEEB] border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                                {profilePic ? (
                                    <img src={profilePic} alt="profile" className="w-full h-full object-cover" />
                                ) : (
                                    <Image className="w-12 h-12 text-gray-400" />
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileSelected}
                            />
                            <Button onClick={handleOpenFilePicker} className="flex items-center w-fit gap-2 bg-[#FFFFFF] text-[#26231E] font-medium text-base border border-[#26231E] hover:bg-gray-50 rounded-full">
                                <Upload className="w-4 h-4" />
                                Upload profile picture
                            </Button>
                        </div>
                    </div>

                    {/* Name Section */}
                    <div>
                        <p className="text-[#75716B] text-base font-medium mb-4">Name</p>
                        <Input 
                            placeholder="Your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full max-w-md bg-white"
                        />
                    </div>

                    {/*Username Section */}
                    <div>
                        <p className="text-[#75716B] text-base font-medium mb-4">Username</p>
                        <Input 
                            placeholder="Your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full max-w-md bg-white"
                        />
                    </div>

                    {/* Email Section */}
                    <div>
                        <p className="text-[#75716B] text-base font-medium mb-4">Email</p>
                        <Input
                            type="email"
                            placeholder="Your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full max-w-md bg-white"
                        />
                    </div>

                    {/* Bio Section */}
                    <div>
                        <p className="text-[#75716B] text-base font-medium mb-4">Bio</p>
                        <textarea 
                            placeholder="Tell us about yourself"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full h-32 p-3 border border-gray-300 rounded-md bg-white resize-y focus:outline-none focus:ring-2 focus:ring-[#26231E] focus:border-transparent"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProfileManagement;
