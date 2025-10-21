import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import NavAdmin from './NavAdmin';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { toast } from 'sonner';
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
} from '@/components/ui/alert-dialog';

function EditCategory() {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('create-category');
    const [categoryName, setCategoryName] = useState('');
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [categoryId, setCategoryId] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001';

    // Check if we're in edit mode and fetch category data
    useEffect(() => {
        const fetchCategoryData = async () => {
            // Check if we have category data from location state
            if (location.state?.category) {
                const category = location.state.category;
                setCategoryName(category.name);
                setCategoryId(category.id);
                setIsEditMode(true);
            } 
            // If we have categoryId from URL params, fetch from API
            else if (location.pathname.includes('/edit-category/')) {
                const categoryId = location.pathname.split('/edit-category/')[1];
                if (categoryId) {
                    try {
                        setLoading(true);
                        const token = localStorage.getItem('token');
                        const response = await axios.get(
                            `${API_BASE_URL}/posts/categories/${categoryId}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );
                        
                        if (response.data) {
                            setCategoryName(response.data.name);
                            setCategoryId(response.data.id);
                            setIsEditMode(true);
                        }
                    } catch (error) {
                        console.error('Error fetching category:', error);
                        toast.error('ไม่สามารถโหลดข้อมูล category ได้');
                        navigate('/admin');
                    } finally {
                        setLoading(false);
                    }
                }
            }
            // If we're on create-category page but have categoryId in URL, fetch data
            else if (location.pathname.includes('/create-category/')) {
                const categoryId = location.pathname.split('/create-category/')[1];
                if (categoryId) {
                    try {
                        setLoading(true);
                        const token = localStorage.getItem('token');
                        const response = await axios.get(
                            `${API_BASE_URL}/posts/categories/${categoryId}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );
                        
                        if (response.data) {
                            setCategoryName(response.data.name);
                            setCategoryId(response.data.id);
                            setIsEditMode(true);
                        }
                    } catch (error) {
                        console.error('Error fetching category:', error);
                        toast.error('ไม่สามารถโหลดข้อมูล category ได้');
                        navigate('/admin');
                    } finally {
                        setLoading(false);
                    }
                }
            }
        };

        fetchCategoryData();
    }, [location.state, location.pathname, API_BASE_URL, navigate]);

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

    // Handle create or update category
    const handleSaveCategory = async () => {
        // ตรวจสอบว่ากรอกชื่อ category หรือยัง
        if (!categoryName || categoryName.trim() === '') {
            toast.error('กรุณากรอกชื่อ category');
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            
            let response;
            if (isEditMode) {
                // Update existing category
                response = await axios.put(
                    `${API_BASE_URL}/posts/categories/${categoryId}`,
                    { name: categoryName },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            } else {
                // Create new category
                response = await axios.post(
                    `${API_BASE_URL}/posts/categories`,
                    { name: categoryName },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            }

            if (response.status === 200 || response.status === 201) {
                toast.success(isEditMode ? 'แก้ไข category สำเร็จ!' : 'สร้าง category สำเร็จ!');
                setCategoryName(''); // ล้างข้อมูลในฟอร์ม
                setTimeout(() => {
                    navigate('/admin'); // กลับไปหน้า admin
                }, 1000);
            }
        } catch (error) {
            console.error('Error saving category:', error);
            
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(isEditMode ? 'เกิดข้อผิดพลาดในการแก้ไข category' : 'เกิดข้อผิดพลาดในการสร้าง category');
            }
        } finally {
            setLoading(false);
        }
    };

    // Handle delete category
    const handleDeleteCategory = async () => {
        if (!categoryId) return;

        setDeleteLoading(true);

        try {
            const token = localStorage.getItem('token');
            
            const response = await axios.delete(
                `${API_BASE_URL}/posts/categories/${categoryId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                toast.success('ลบ category สำเร็จ!');
                setTimeout(() => {
                    navigate('/admin'); // กลับไปหน้า admin
                }, 1000);
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('เกิดข้อผิดพลาดในการลบ category');
            }
        } finally {
            setDeleteLoading(false);
        }
    };


    // Show loading state while fetching category data
    if (loading && isEditMode) {
        return (
            <div className="flex h-screen bg-gray-50">
                <NavAdmin 
                    activeTab={activeTab}
                    setActiveTab={handleTabChange}
                    sidebarOpen={sidebarOpen}
                    onNavigateHome={() => navigate('/')}
                />
                <div className="flex-1 overflow-auto flex items-center justify-center">
                    <div className="text-lg">กำลังโหลดข้อมูล category...</div>
                </div>
            </div>
        );
    }

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
                <h3 className="text-2xl font-semibold text-[#26231E]">
                    {isEditMode ? 'Edit category' : 'Create category'}
                </h3>
                    <div className="flex gap-2">
                        {isEditMode && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button 
                                        variant="destructive"
                                        className="flex items-center gap-2 rounded-full cursor-pointer"
                                    >
                                        Delete
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete category</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Do you want to delete this category?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction 
                                            onClick={handleDeleteCategory}
                                            disabled={deleteLoading}
                                            className="bg-red-600 hover:bg-red-700"
                                        >
                                            {deleteLoading ? 'Deleting...' : 'Delete'}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                        <Button 
                            className="flex items-center gap-2 rounded-full cursor-pointer"
                            onClick={handleSaveCategory}
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
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

export default EditCategory;

