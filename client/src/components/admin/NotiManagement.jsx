import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function NotiManagement() {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');

    return (
        <>
            {/* Header */}
            <div className="w-full flex justify-between items-center mb-6 border-b-2 border-gray-200 p-8">
                <h3 className="text-2xl font-semibold text-[#26231E]">Notification Management</h3>
                <div className="flex gap-4">
                <Button className="flex items-center gap-2 rounded-full bg-white text-[#26231E] border border-[#26231E] hover:bg-gray-50">
                    Save as draft
                </Button>
                <Button className="flex items-center gap-2 rounded-full bg-[#26231E] text-white hover:bg-[#1a1a1a]">
                    Send notification
                </Button>
                </div>
            </div>
            
            <div className="px-8 py-3">
                <div className="space-y-8">
                    {/* Title Section */}
                    <div>
                        <p className="text-[#75716B] text-base font-medium mb-4">Notification Title</p>
                        <Input 
                            placeholder="Enter notification title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-white"
                        />
                    </div>

                    {/* Message Section */}
                    <div>
                        <p className="text-[#75716B] text-base font-medium mb-4">Message</p>
                        <textarea 
                            placeholder="Enter notification message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full h-64 p-3 border border-gray-300 rounded-md bg-white resize-y focus:outline-none focus:ring-2 focus:ring-[#26231E] focus:border-transparent"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default NotiManagement;
