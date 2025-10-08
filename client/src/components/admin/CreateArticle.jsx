import { useState } from 'react';
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
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('create-article');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [title, setTitle] = useState('');
    const [introduction, setIntroduction] = useState('');
    const [content, setContent] = useState('');

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
            <main className="flex-1 bg-[#EFEEEB]">
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
                    <Button className="flex items-center gap-2 rounded-full bg-white text-[#26231E] border border-[#26231E] hover:bg-gray-50">
                        Save as draft
                    </Button>
                    <Button className="flex items-center gap-2 rounded-full bg-[#26231E] text-white hover:bg-[#1a1a1a]">
                        Save and publish
                    </Button>
                    </div>
                </div>
                
                <div className="px-8 py-3">
                    <div className="space-y-8">
                        {/* Thumbnail Image Section */}
                        <div>
                            <p className="text-[#75716B] text-base font-medium mb-4">Thumbnail image</p>
                            <div className="flex gap-6 items-end">
                                <div className="w-80 h-48 bg-[#EFEEEB] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                                    <Image className="w-12 h-12 text-gray-400" />
                                </div>
                                <Button className="flex items-center gap-2 bg-white text-[#26231E] font-medium text-base border border-[#26231E] hover:bg-gray-50 rounded-full w-64">
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
                                    <SelectItem value="cat">Cat</SelectItem>
                                    <SelectItem value="general">General</SelectItem>
                                    <SelectItem value="inspiration">Inspiration</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Author Name Section */}
                        <div>
                            <p className="text-[#75716B] text-base font-medium mb-4">Author name</p>
                            <Input 
                                value="Thompson P." 
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

