import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import NavAdmin from './NavAdmin';
import CategoryManagement from './CategoryManagement';
import ProfileManagement from './ProfileManagement';
import NotiManagement from './NotiManagement';
import ResetPassManagement from './ResetPassManagement';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Menu,
  X
} from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

function AdminPanel() {
    const navigate = useNavigate();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001';
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('article');
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    
    // State สำหรับข้อมูลบทความ
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [statuses, setStatuses] = useState([]);
    
    // Force re-render when activeTab changes
    const handleTabChange = (newTab) => {
        setActiveTab(newTab);
    };

    // ดึงข้อมูลบทความจาก API
    const fetchArticles = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/posts`);
            console.log('Articles data:', response.data);
            
            if (response.data && response.data.posts) {
                // สร้าง categories และ statuses จากข้อมูลที่ได้
                const uniqueCategories = [...new Set(response.data.posts.map(post => post.category))];
                const uniqueStatuses = [...new Set(response.data.posts.map(post => post.status))];
                
                console.log('Unique categories:', uniqueCategories);
                console.log('Unique statuses:', uniqueStatuses);
                
                // สร้าง categories array
                const categoriesArray = uniqueCategories.map((category, index) => ({
                    id: index + 1,
                    name: category
                }));
                
                // สร้าง statuses array
                const statusesArray = uniqueStatuses.map((status, index) => ({
                    id: index + 1,
                    status: status
                }));
                
                setCategories(categoriesArray);
                setStatuses(statusesArray);
                
                const formattedArticles = response.data.posts.map(post => {
                    console.log('Processing post:', post);
                    
                    // ใช้ข้อมูลจริงจาก API
                    let statusText = 'Draft'; // default
                    if (post.status === 'publish') {
                        statusText = 'Published';
                    } else if (post.status === 'draft') {
                        statusText = 'Draft';
                    }
                    
                    return {
                        id: post.id,
                        title: post.title,
                        category: post.category || 'Unknown',
                        status: statusText
                    };
                });
                
                setArticles(formattedArticles);
            }
        } catch (error) {
            console.error('Error fetching articles:', error);
            setError('Failed to fetch articles: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // โหลดข้อมูลเมื่อ component mount
    useEffect(() => {
        if (activeTab === 'article') {
            fetchArticles();
        }
    }, [activeTab]);

    // กรองข้อมูลตาม search, category, และ status
    const filteredArticles = articles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || article.category.toLowerCase() === selectedCategory.toLowerCase();
        const matchesStatus = selectedStatus === 'all' || article.status.toLowerCase() === selectedStatus.toLowerCase();
        
        return matchesSearch && matchesCategory && matchesStatus;
    });

    // ฟังก์ชันลบบทความ (เรียกจาก dialog)
    const handleDeleteArticle = async (articleId) => {
        try {
            await axios.delete(`${API_BASE_URL}/posts/${articleId}`);
            toast.success('Deleted', { description: 'Article removed', position: 'bottom-right' });
            fetchArticles();
        } catch (error) {
            console.error('Error deleting article:', error);
            setError('Failed to delete article');
            toast.error('Delete failed', { description: error?.response?.data?.message || error.message, position: 'bottom-right' });
        }
    };

    const renderContent = () => {
        switch(activeTab) {
            case 'category':
                return <CategoryManagement />;
            case 'profile':
                return <ProfileManagement />;
            case 'notification':
                return <NotiManagement />;
            case 'reset':
                return <ResetPassManagement />;
            default:
                return (
                    <>
                        {/* Header */}
                        <div className="w-full flex justify-between items-center mb-6 border-b-2 border-gray-200 p-8">
                            <h3 className="text-2xl font-semibold text-[#26231E]">Article management</h3>
                            <Button 
                                className="flex items-center gap-2 rounded-full cursor-pointer"
                                onClick={() => navigate('/admin/create-article')}
                            >
                                <Plus className="w-4 h-4" />
                                Create article
                            </Button>
                        </div>

                        <div className="p-8 ">
                            {/* Error Message */}
                            {error && (
                                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                                    {error}
                                </div>
                            )}

                            {/* Debug Info removed */}

                            {/* Filters */}
                            <div className="flex gap-4 mb-6 justify-between">
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input 
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 bg-white"
                                    />
                                </div>
                                
                                <div className='flex gap-4'>
                                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                    <SelectTrigger className="w-[180px] bg-white">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        {statuses.map(status => (
                                            <SelectItem key={status.id} value={status.status}>
                                                {status.status === 'publish' ? 'Published' : 'Draft'}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger className="w-[180px] bg-white">
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {categories.map(category => (
                                            <SelectItem key={category.id} value={category.name.toLowerCase()}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                </div>
                                
                            </div>

                            {/* Loading State */}
                            {loading && (
                                <div className="flex justify-center items-center py-8">
                                    <div className="text-lg">Loading articles...</div>
                                </div>
                            )}

                            {/* Articles Table */}
                            {!loading && (
                                <div className="bg-white rounded-lg border-1 border-[#DAD6D1] overflow-hidden">
                                    <table className="w-full">
                                        <thead className="bg-[#F9F8F6] border-b-1 shadow-xl border-[#DAD6D1]">
                                            <tr>
                                                <th className="text-left px-6 py-3 text-base font-medium text-[#75716B] uppercase tracking-wider">
                                                    Article title
                                                </th>
                                                <th className="text-left px-6 py-3 text-base font-medium text-[#75716B] uppercase tracking-wider">
                                                    Category
                                                </th>
                                                <th className="text-left px-6 py-3 text-base font-medium text-[#75716B] uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="text-right px-6 py-3 text-base font-medium text-[#75716B] uppercase tracking-wider">
                                                    
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 border-[#DAD6D1]">
                                            {filteredArticles.length === 0 ? (
                                                <tr>
                                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                                        {searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all' 
                                                            ? 'No articles found matching your criteria' 
                                                            : 'No articles available'
                                                        }
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredArticles.map((article, index) => (
                                                    <tr key={article.id} className={`transition-colors ${
                                                        index % 2 === 0 ? 'bg-[#F9F8F6]' : 'bg-[#EFEEEB]'
                                                    }`}>
                                                        <td className="px-6 py-4 text-base font-medium text-[#43403B]">
                                                            {article.title}
                                                        </td>
                                                        <td className="px-6 py-4 text-base font-medium text-[#43403B]">
                                                            {article.category}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-base font-medium text-[#12B279]">
                                                                • {article.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex justify-end gap-2">
                                                                <button 
                                                                    className="p-1.5 rounded hover:bg-gray-100 transition-colors cursor-pointer"
                                                                    onClick={() => navigate(`/admin/edit-article/${article.id}`)}
                                                                >
                                                                    <Edit2 className="w-6 h-6 text-[#75716B]" />
                                                                </button>
                                                                <button 
                                                                    className="p-1.5 rounded hover:bg-gray-100 transition-colors cursor-pointer"
                                                                    onClick={() => { setDeleteId(article.id); setDeleteOpen(true); }}
                                                                >
                                                                    <Trash2 className="w-6 h-6 text-[#75716B]" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                            <AlertDialogContent className="flex flex-col items-center justify-center">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-2xl font-bold">Delete article</AlertDialogTitle>
                                    <AlertDialogDescription>Do you want to delete this article?</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="rounded-full cursor-pointer">Cancel</AlertDialogCancel>
                                    <AlertDialogAction className="rounded-full cursor-pointer" onClick={() => { if (deleteId) handleDeleteArticle(deleteId); setDeleteOpen(false); }}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </>
                );
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <NavAdmin 
                activeTab={activeTab}
                setActiveTab={handleTabChange}
                sidebarOpen={sidebarOpen}
                onNavigateHome={() => navigate('/')}
            />

            {/* Main Content */}
            <main className="flex-1 bg-[#EFEEEB]">
                {/* Mobile menu toggle */}
                <button 
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="mb-4 p-2 rounded-lg hover:bg-gray-100 lg:hidden"
                >
                    {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>

                {renderContent()}
            </main>
        </div>
    );
}

export default AdminPanel;