import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import NavAdmin from './NavAdmin';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Trash2, 
  Upload,
  Image,
  Menu,
  X
} from 'lucide-react';

function CreateArticle() {
    const navigate = useNavigate();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001';
    const { state } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('create-article');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [title, setTitle] = useState('');
    const [introduction, setIntroduction] = useState('');
    const [content, setContent] = useState('');
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState('');
    const fileInputRef = useRef(null);

    const handleOpenFilePicker = () => {
        fileInputRef.current?.click();
    };

    const handleThumbnailSelected = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setThumbnailFile(file);
        const url = URL.createObjectURL(file);
        setThumbnailPreview(url);
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/posts/categories`);
                setCategories(res.data?.categories || []);
            } catch (err) {
                console.error('Failed to load categories', err);
            }
        };
        const fetchStatuses = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/posts/statuses`);
                setStatuses(res.data?.statuses || []);
            } catch (err) {
                console.error('Failed to load statuses', err);
            }
        };
        fetchCategories();
        fetchStatuses();
    }, [API_BASE_URL]);

    const resolveStatusId = (statusKey) => {
        const match = statuses.find(s => s.status === statusKey);
        return match ? match.id : undefined;
    };

    const submitArticle = async (statusKey) => {
        if (!title || !introduction || !content || !selectedCategory || !thumbnailFile) {
            toast.error('Missing fields', { description: 'Please fill all fields and upload a thumbnail.', position: 'bottom-right' });
            return;
        }

        const statusId = resolveStatusId(statusKey);
        if (!statusId) {
            toast.error('Status missing', { description: 'Could not resolve status id.', position: 'bottom-right' });
            return;
        }

        try {
            setSubmitting(true);
            const form = new FormData();
            form.append('imageFile', thumbnailFile);
            form.append('title', title);
            form.append('category_id', selectedCategory);
            form.append('description', introduction);
            form.append('content', content);
            form.append('status_id', String(statusId));

            await axios.post(`${API_BASE_URL}/posts`, form, {
                headers: { /* let browser set Content-Type boundary */ },
            });
            toast.success('Article saved', { description: statusKey === 'publish' ? 'Published successfully' : 'Saved as draft', position: 'bottom-right' });
            navigate('/admin');
        } catch (err) {
            console.error(err);
            toast.error('Failed to save', { description: err?.response?.data?.message || err.message, position: 'bottom-right' });
        } finally {
            setSubmitting(false);
        }
    };

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
        <div className="flex min-h-screen bg-gray-50">
            <NavAdmin 
                activeTab={activeTab}
                setActiveTab={handleTabChange}
                sidebarOpen={sidebarOpen}
                onNavigateHome={() => navigate('/')}
            />

            {/* Main Content */}
            <main className="flex-1 bg-[#EFEEEB] flex flex-col">
                {/* Mobile menu toggle */}
                <button 
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="mb-4 p-2 rounded-lg hover:bg-gray-100 lg:hidden"
                >
                    {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>

                {/* Header */}
                <div className="w-full flex justify-between items-center mb-6 border-b-2 border-gray-200 p-8">
                    <h3 className="text-2xl font-semibold text-[#26231E]">Create Article</h3>
                    <div className="flex gap-4">
                    <Button disabled={submitting} onClick={() => submitArticle('draft')} className="flex items-center gap-2 rounded-full bg-white text-[#26231E] border border-[#26231E] hover:bg-gray-50">
                        Save as draft
                    </Button>
                    <Button disabled={submitting} onClick={() => submitArticle('publish')} className="flex items-center gap-2 rounded-full bg-[#26231E] text-white hover:bg-[#1a1a1a]">
                        Save and publish
                    </Button>
                    </div>
                </div>
                
                <div className="px-8 py-3 flex-1 flex flex-col">
                    <div className="space-y-8 flex-1">
                        {/* Thumbnail Image Section */}
                        <div>
                            <p className="text-[#75716B] text-base font-medium mb-4">Thumbnail image</p>
                            <div className="flex gap-6 items-end">
                                <div className="w-80 h-48 bg-[#EFEEEB] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                                    {thumbnailPreview ? (
                                        <img src={thumbnailPreview} alt="thumbnail" className="w-full h-full object-cover" />
                                    ) : (
                                        <Image className="w-12 h-12 text-gray-400" />
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleThumbnailSelected}
                                />
                                <Button onClick={handleOpenFilePicker} className="flex items-center gap-2 bg-white text-[#26231E] font-medium text-base border border-[#26231E] hover:bg-gray-50 rounded-full w-64">
                                    <Upload className="w-4 h-4" />
                                    Upload thumbnail image
                                </Button>
                            </div>
                        </div>

                        {/* Category Section */}
                        <div>
                            <p className="text-[#75716B] text-base font-medium mb-4">Category</p>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="w-full max-w-md bg-white">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(cat => (
                                        <SelectItem key={cat.id} value={String(cat.id)}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Author Name Section */}
                        <div>
                            <p className="text-[#75716B] text-base font-medium mb-4">Author name</p>
                            <Input 
                                value={state?.user?.name || ''}
                                className="w-full max-w-md bg-[#EFEEEB] text-[#75716B]"
                                readOnly
                            />
                        </div>

                        {/* Title Section */}
                        <div>
                            <p className="text-[#75716B] text-base font-medium mb-4">Title</p>
                            <Input 
                                placeholder="Article title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-white"
                            />
                        </div>

                        {/* Introduction Section */}
                        <div>
                            <p className="text-[#75716B] text-base font-medium mb-4">Introduction (max 120 letters)</p>
                            <textarea 
                                placeholder="Introduction"
                                value={introduction}
                                onChange={(e) => setIntroduction(e.target.value)}
                                maxLength={120}
                                className="w-full h-24 p-3 border border-gray-300 rounded-md bg-white resize-none focus:outline-none focus:ring-2 focus:ring-[#26231E] focus:border-transparent"
                            />
                            <p className="text-sm text-gray-500 mt-1">{introduction.length}/120</p>
                        </div>

                        {/* Content Section */}
                        <div>
                            <p className="text-[#75716B] text-base font-medium mb-4">Content</p>
                            <textarea 
                                placeholder="Content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full h-64 p-3 border border-gray-300 rounded-md bg-white resize-y focus:outline-none focus:ring-2 focus:ring-[#26231E] focus:border-transparent"
                            />
                        </div>

                        <div>
                            <button className="flex items-center gap-2 text-black font-medium text-base underline">
                                <Trash2 className="w-5 h-5" />
                                Delete article
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default CreateArticle;

