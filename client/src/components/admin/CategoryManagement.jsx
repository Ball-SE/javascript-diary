import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Plus, Trash2, Search, Edit2 } from "lucide-react";
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
} from "@/components/ui/alert-dialog";

function CategoryManagement() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:4001";

  // Fetch categories from Supabase via backend API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_BASE_URL}/posts/categories`);
        setCategories(response.data.categories);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [API_BASE_URL]);

  // Filter categories based on search query
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle delete category
  const handleDeleteCategory = async (categoryId) => {
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/posts/categories/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(categories.filter((cat) => cat.id !== categoryId));
      setCategoryToDelete(null);
    } catch (err) {
      console.error("Error deleting category:", err);
      alert("Failed to delete category");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle delete button click
  const handleDeleteClick = (categoryId) => {
    setCategoryToDelete(categoryId);
  };

  // Handle edit category
  const handleEditCategory = (categoryId) => {
    // Navigate to edit page with categoryId in URL
    navigate(`/admin/edit-category/${categoryId}`);
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-64">
        <div className="text-lg">Loading categories...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex justify-center items-center h-64">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-6 border-b-2 border-gray-200 p-8">
        <h3 className="text-2xl font-semibold text-[#26231E]">
          Category management
        </h3>
        <Button
          className="flex items-center gap-2 rounded-full cursor-pointer"
          onClick={() => navigate("/admin/create-category")}
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

        {/* Categories Table */}
        <div className="bg-white rounded-lg border-1 border-[#DAD6D1] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#F9F8F6] border-b-1 shadow-xl border-[#DAD6D1]">
              <tr>
                <th className="text-left px-6 py-3 text-base font-medium text-[#75716B] uppercase tracking-wider">
                  Category
                </th>
                <th className="text-right px-6 py-3 text-base font-medium text-[#75716B] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 border-[#DAD6D1]">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td
                    colSpan="2"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    {searchQuery
                      ? "No categories found matching your search."
                      : "No categories available."}
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category, index) => (
                  <tr
                    key={category.id}
                    className={`transition-colors ${
                      index % 2 === 0 ? "bg-[#F9F8F6]" : "bg-[#EFEEEB]"
                    }`}
                  >
                    <td className="px-6 py-4 text-base font-medium text-[#43403B]">
                      {category.name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          className="p-1.5 rounded hover:bg-gray-100 transition-colors"
                          onClick={() => handleEditCategory(category.id)}
                        >
                          <Edit2 className="w-6 h-6 text-[#75716B]" />
                        </button>
                        <button
                          className="p-1.5 rounded hover:bg-gray-100 transition-colors"
                          onClick={() => handleDeleteClick(category.id)}
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
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!categoryToDelete} onOpenChange={() => setCategoryToDelete(null)}>
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
              onClick={() => handleDeleteCategory(categoryToDelete)}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteLoading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default CategoryManagement;
