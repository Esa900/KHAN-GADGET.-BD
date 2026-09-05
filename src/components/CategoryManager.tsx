import React, { useState } from 'react';
import { 
  FolderTree, Plus, Edit2, Trash2, Search, AlertCircle, 
  Check, RotateCcw, Package, Layers, Sparkles, X, ArrowRight
} from 'lucide-react';
import { Product } from '../types';

interface CategoryManagerProps {
  categories: string[];
  products: Product[];
  onAddCategory?: (categoryName: string) => Promise<boolean> | void;
  onDeleteCategory?: (categoryName: string) => Promise<boolean> | void;
  onRenameCategory?: (oldName: string, newName: string) => Promise<boolean> | void;
  onViewCategoryProducts: (categoryName: string) => void;
}

const POPULAR_CATEGORY_SUGGESTIONS = [
  'Earbuds & TWS',
  'Smartwatches & Bands',
  'Fast Chargers & GaN',
  'Power Banks',
  'Phone Cases & Covers',
  'Tempered Glass & Protectors',
  'Car Mounts & Chargers',
  'Gaming Triggers & Coolers',
  'Selfie Sticks & Gimbals',
  'Wireless Microphones',
  'Bluetooth Speakers',
  'OTG, Hubs & Cables',
  'Camera Lens Protectors',
  'Tablet & iPad Accessories'
];

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  products,
  onAddCategory,
  onDeleteCategory,
  onRenameCategory,
  onViewCategoryProducts
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Add Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [addError, setAddError] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Rename Modal State
  const [categoryToRename, setCategoryToRename] = useState<string | null>(null);
  const [renameInput, setRenameInput] = useState('');
  const [renameError, setRenameError] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);

  // Delete Modal State
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter categories by search
  const filteredCategories = categories.filter(c => 
    c.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate product counts per category
  const categoryStats = React.useMemo(() => {
    const counts: Record<string, number> = {};
    categories.forEach(cat => {
      counts[cat] = 0;
    });
    
    products.forEach(p => {
      if (counts[p.category] !== undefined) {
        counts[p.category] += 1;
      } else {
        // Uncategorized or custom
        counts[p.category] = (counts[p.category] || 0) + 1;
      }
    });

    // Find top category
    let topCat = '';
    let maxCount = -1;
    Object.entries(counts).forEach(([cat, cnt]) => {
      if (cnt > maxCount) {
        maxCount = cnt;
        topCat = cat;
      }
    });

    return { counts, topCat, maxCount };
  }, [categories, products]);

  // Handle Adding Category
  const handleCreateCategory = async (nameToAdd?: string) => {
    const targetName = (nameToAdd || newCatName).trim();
    if (!targetName) {
      setAddError('Please type a category name.');
      return;
    }

    if (categories.some(c => c.toLowerCase() === targetName.toLowerCase())) {
      setAddError(`"${targetName}" already exists in the store.`);
      return;
    }

    setAddError('');
    setIsAdding(true);
    try {
      if (onAddCategory) {
        await onAddCategory(targetName);
      }
      setNewCatName('');
      setIsAddModalOpen(false);
    } catch (err) {
      setAddError('Failed to add category. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  // Handle Renaming Category
  const handleConfirmRename = async () => {
    if (!categoryToRename) return;
    const trimmed = renameInput.trim();
    if (!trimmed) {
      setRenameError('Category name cannot be blank.');
      return;
    }

    if (trimmed.toLowerCase() === categoryToRename.toLowerCase()) {
      setCategoryToRename(null);
      return;
    }

    if (categories.some(c => c.toLowerCase() === trimmed.toLowerCase() && c.toLowerCase() !== categoryToRename.toLowerCase())) {
      setRenameError(`Another category named "${trimmed}" already exists.`);
      return;
    }

    setRenameError('');
    setIsRenaming(true);
    try {
      if (onRenameCategory) {
        await onRenameCategory(categoryToRename, trimmed);
      }
      setCategoryToRename(null);
      setRenameInput('');
    } catch (err) {
      setRenameError('Failed to rename category.');
    } finally {
      setIsRenaming(false);
    }
  };

  // Handle Deleting Category
  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);
    try {
      if (onDeleteCategory) {
        await onDeleteCategory(categoryToDelete);
      }
      setCategoryToDelete(null);
    } catch (err) {
      console.error('Failed to delete category:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header & Controls Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#f85606] flex items-center justify-center">
              <FolderTree className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-gray-900 flex items-center gap-2">
                Category Management
                <span className="text-[10px] bg-orange-100 text-[#f85606] font-bold px-2 py-0.5 rounded-full">
                  {categories.length} Categories
                </span>
              </h2>
              <p className="text-[11px] text-gray-500">
                নতুন ক্যাটেগরি যোগ করুন, নাম পরিবর্তন করুন অথবা স্টোর থেকে ডিলিট করুন
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search bar */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search category name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:bg-white"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Add Category button */}
          <button
            type="button"
            onClick={() => {
              setNewCatName('');
              setAddError('');
              setIsAddModalOpen(true);
            }}
            className="px-3.5 py-1.5 bg-[#f85606] hover:bg-[#e04a00] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Categories</span>
            <span className="text-lg font-black text-gray-900">{categories.length}</span>
            <span className="text-[10px] text-gray-500 block">Active in storefront navigation</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Products Listed</span>
            <span className="text-lg font-black text-gray-900">{products.length} Items</span>
            <span className="text-[10px] text-emerald-600 font-medium block">Across all categories</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Top Category</span>
            <span className="text-sm font-black text-gray-900 truncate block">
              {categoryStats.topCat || 'None'}
            </span>
            <span className="text-[10px] text-blue-600 font-medium block">
              {categoryStats.maxCount > 0 ? `${categoryStats.maxCount} products registered` : 'No products yet'}
            </span>
          </div>
        </div>
      </div>

      {/* Category List Cards & Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="p-3.5 bg-gray-50/80 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            All Categories ({filteredCategories.length})
          </h3>
          <span className="text-[11px] text-gray-400">
            Click &ldquo;View Products&rdquo; to filter items by that category
          </span>
        </div>

        {filteredCategories.length === 0 ? (
          <div className="p-10 text-center">
            <FolderTree className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-gray-700">No categories found matching &ldquo;{searchQuery}&rdquo;</p>
            <p className="text-[11px] text-gray-400 mt-1">Try another search or add a new category.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setIsAddModalOpen(true);
              }}
              className="mt-3 px-3 py-1.5 bg-[#f85606] text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add &ldquo;{searchQuery}&rdquo; as Category</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredCategories.map((category, index) => {
              const productCount = categoryStats.counts[category] || 0;
              return (
                <div 
                  key={category} 
                  className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/80 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#f85606] font-bold text-xs flex items-center justify-center shrink-0 border border-orange-100">
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-gray-900 truncate">
                          {category}
                        </span>
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                          Active
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Visible on customer header, sidebar and product upload
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    {/* Product count badge & link */}
                    <button
                      type="button"
                      onClick={() => onViewCategoryProducts(category)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer group"
                      title="View all products under this category"
                    >
                      <Package className="w-3.5 h-3.5 text-slate-500 group-hover:text-orange-600" />
                      <span>{productCount} {productCount === 1 ? 'Product' : 'Products'}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition" />
                    </button>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setCategoryToRename(category);
                          setRenameInput(category);
                          setRenameError('');
                        }}
                        className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                        title="Rename Category"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setCategoryToDelete(category)}
                        className="p-1.5 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL 1: Add New Category */}
      {isAddModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white">
                  <FolderTree className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">নতুন ক্যাটেগরি যোগ করুন</h3>
                  <p className="text-[10px] text-slate-400">Add New Store Category</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateCategory();
              }} 
              className="p-5 space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Category Name (ক্যাটেগরির নাম) *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Wireless Microphones / TWS Earbuds"
                  value={newCatName}
                  onChange={(e) => {
                    setNewCatName(e.target.value);
                    if (addError) setAddError('');
                  }}
                  className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
                {addError && (
                  <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{addError}</span>
                  </p>
                )}
                <p className="text-[11px] text-gray-400 mt-1">
                  এই ক্যাটেগরি সাথে সাথে ওয়েবসাইট ও অ্যাডমিন প্যানেলে শো করবে।
                </p>
              </div>

              {/* Quick Presets / Suggestions */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  পপুলার সাজেশন থেকে বেছে নিন (Quick Suggestions):
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {POPULAR_CATEGORY_SUGGESTIONS.map((preset) => {
                    const exists = categories.some(c => c.toLowerCase() === preset.toLowerCase());
                    return (
                      <button
                        key={preset}
                        type="button"
                        disabled={exists}
                        onClick={() => {
                          setNewCatName(preset);
                          if (addError) setAddError('');
                        }}
                        className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition cursor-pointer flex items-center gap-1 ${
                          exists 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                            : newCatName === preset
                              ? 'bg-orange-500 text-white font-bold'
                              : 'bg-gray-100 hover:bg-orange-100 text-gray-700 hover:text-[#f85606]'
                        }`}
                      >
                        <span>{preset}</span>
                        {exists && <span className="text-[9px]">(added)</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdding || !newCatName.trim()}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#f85606] hover:bg-[#e04a00] rounded-lg transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isAdding ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Create Category</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Rename Category */}
      {categoryToRename && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setCategoryToRename(null)}
        >
          <div 
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">ক্যাটেগরির নাম পরিবর্তন</h3>
                  <p className="text-[10px] text-slate-400">Rename & Update Assigned Products</p>
                </div>
              </div>
              <button 
                onClick={() => setCategoryToRename(null)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleConfirmRename();
              }}
              className="p-5 space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Current Name: <span className="text-gray-900 font-bold">{categoryToRename}</span>
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={renameInput}
                  onChange={(e) => {
                    setRenameInput(e.target.value);
                    if (renameError) setRenameError('');
                  }}
                  className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="New category title..."
                />
                {renameError && (
                  <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{renameError}</span>
                  </p>
                )}
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">স্বয়ংক্রিয় প্রোডাক্ট আপডেট:</p>
                  <p className="text-[11px] text-blue-700 mt-0.5">
                    এই ক্যাটেগরিতে থাকা সকল প্রোডাক্টের ক্যাটেগরি স্বয়ংক্রিয়ভাবে নতুন নামে আপডেট ও ক্লাউডে সিঙ্ক হয়ে যাবে।
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCategoryToRename(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRenaming || !renameInput.trim()}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isRenaming ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Renaming...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Delete Category Confirmation */}
      {categoryToDelete && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setCategoryToDelete(null)}
        >
          <div 
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 border border-gray-100 text-center animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="font-bold text-gray-900 text-base mb-1">ক্যাটেগরি ডিলিট করতে চান?</h3>
            <p className="text-xs text-gray-600 mb-3">
              Are you sure you want to remove <strong className="text-gray-900">&ldquo;{categoryToDelete}&rdquo;</strong> from store categories?
            </p>

            {(categoryStats.counts[categoryToDelete] || 0) > 0 && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-left text-xs text-amber-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">সতর্কবার্তা:</span> এই ক্যাটেগরির অধীনে বর্তমানে{' '}
                  <strong>{categoryStats.counts[categoryToDelete]}টি প্রোডাক্ট</strong> রয়েছে। ক্যাটেগরি ডিলিট করলেও প্রোডাক্টগুলো ইনভেন্টরিতে সুরক্ষিত থাকবে।
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="flex-1 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="flex-1 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Yes, Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
