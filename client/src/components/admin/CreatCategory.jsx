import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import NavAdmin from './NavAdmin';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { toast } from 'sonner';

function CreatCategory() {
    const navigate = useNavigate();
    const [sidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('create-category');
    const [categoryName, setCategoryName] = useState('');
    const [loading, setLoading] = useState(false);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001';

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

    // Handle create category
    const handleCreateCategory = async () => {
        // ตรวจสอบว่ากรอกชื่อ category หรือยัง
        if (!categoryName || categoryName.trim() === '') {
            toast.error('กรุณากรอกชื่อ category');
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            
            const response = await axios.post(
                `${API_BASE_URL}/posts/categories`,
                { name: categoryName },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 201) {
                toast.success('สร้าง category สำเร็จ!');
                setCategoryName(''); // ล้างข้อมูลในฟอร์ม
                setTimeout(() => {
                    navigate('/admin'); // กลับไปหน้า admin
                }, 1000);
            }
        } catch (error) {
            console.error('Error creating category:', error);
            
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('เกิดข้อผิดพลาดในการสร้าง category');
            }
        } finally {
            setLoading(false);
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
                        onClick={handleCreateCategory}
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save'}
                    </Button>
                </div>
            
                <div className="p-8 gap-4 flex flex-col">
                    <label htmlFor="category-name" className="text-[#75716B] text-base font-medium">Category name</label>
                    <Input 
                        type="text" 
                        placeholder="Category name" 
                        id="category-name" 
                        className="max-w-sm bg-[#FFFFFF]"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}

export default CreatCategory;

