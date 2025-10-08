import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { 
  Plus,
  Trash2, 
  Search,
  Edit2
} from 'lucide-react';

function CategoryManagement() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const categories = [
        {
            id: 1,
            category: 'Cat'
        },
        {
            id: 2,
            category: 'Inspiration'
        },
        {
            id: 3,
            category: 'General'
        }
    ];

    return (
        <>
            {/* Header */}
            <div className="w-full flex justify-between items-center mb-6 border-b-2 border-gray-200 p-8">
                <h3 className="text-2xl font-semibold text-[#26231E]">Category management</h3>
                    <Button 
                        className="flex items-center gap-2 rounded-full cursor-pointer"
                        onClick={() => navigate('/admin/create-category')}
                    >
                    <Plus className="w-4 h-4" />
                        Create category
                    </Button>
            </div>
            
                <div className="p-8 ">
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
                            </div>

                            {/* Articles Table */}
                            <div className="bg-white rounded-lg border-1 border-[#DAD6D1] overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-[#F9F8F6] border-b-1 shadow-xl border-[#DAD6D1]">
                                        <tr>
                                            <th className="text-left px-6 py-3 text-base font-medium text-[#75716B] uppercase tracking-wider">
                                                Category
                                            </th>
                                            <th className="text-right px-6 py-3 text-base font-medium text-[#75716B] uppercase tracking-wider">
                                                
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200  border-[#DAD6D1]">
                                        {categories.map((category, index) => (
                                            <tr key={category.id} className={`transition-colors ${
                                                index % 2 === 0 ? 'bg-[#F9F8F6]' : 'bg-[#EFEEEB]'
                                            }`}>
                                                <td className="px-6 py-4 text-base font-medium text-[#43403B]">
                                                    {category.category}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-end gap-2">
                                                        <button className="p-1.5 rounded hover:bg-gray-100 transition-colors">
                                                            <Edit2 className="w-6 h-6 text-[#75716B]" />
                                                        </button>
                                                        <button className="p-1.5 rounded hover:bg-gray-100 transition-colors">
                                                            <Trash2 className="w-6 h-6 text-[#75716B]" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
        </>
    );
}

export default CategoryManagement;

