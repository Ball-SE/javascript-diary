import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import NavAdmin from './NavAdmin';
import { Input } from '@/components/ui/input';

function CreatCategory() {
    const navigate = useNavigate();
    const [sidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('create-category');

    // Handle tab navigation
    const handleTabChange = (newTab) => {
        setActiveTab(newTab);
        switch(newTab) {
            case 'article':
                navigate('/admin');
                break;
            case 'category':
                navigate('/admin');
                break;
            case 'profile':
                navigate('/admin');
                break;
            case 'notification':
                navigate('/admin');
                break;
            case 'reset':
                navigate('/admin');
                break;
            default:
                break;
        }
    };


    return (
        <div className="flex h-screen bg-gray-50">
            <NavAdmin 
                activeTab={activeTab}
                setActiveTab={handleTabChange}
                sidebarOpen={sidebarOpen}
                onNavigateHome={() => navigate('/')}
            />
            <div className="flex-1 overflow-auto">
                {/* Header */}
                <div className="w-full flex justify-between items-center mb-6 border-b-2 border-gray-200 p-8">
                <h3 className="text-2xl font-semibold text-[#26231E]">Create category</h3>
                    <Button 
                        className="flex items-center gap-2 rounded-full cursor-pointer"
                        onClick={() => navigate('/admin')}
                    >
                        Save
                    </Button>
                </div>
            
                <div className="p-8 gap-4 flex flex-col">
                    <label htmlFor="category-name" className="text-[#75716B] text-base font-medium">Category name</label>
                    <Input type="text" placeholder="Category name" id="category-name" className="max-w-sm bg-[#FFFFFF]" />
                </div>
            </div>
        </div>
    );
}

export default CreatCategory;

