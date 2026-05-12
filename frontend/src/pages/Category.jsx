import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ToolCard from '../components/ui/ToolCard';
import { getCategoryById, getToolsByCategory, categories } from '../data/tools';

export default function Category() {
  const { categoryId } = useParams();
  const category = getCategoryById(categoryId);
  const toolsList = getToolsByCategory(categoryId);

  if (!category) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <p className="text-6xl mb-4">🔍</p>
        <h1 className="text-2xl font-bold text-white font-[Space_Grotesk] mb-2">Category Not Found</h1>
        <p className="text-[#8888aa] mb-6">This category doesn't exist.</p>
        <Link to="/" className="btn-primary px-6 py-3 rounded-xl no-underline"><span>Back to Home</span></Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-[#8888aa] hover:text-white transition-colors mb-8 no-underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to all tools
      </Link>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{category.emoji}</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white font-[Space_Grotesk]">
            {category.name}
          </h1>
        </div>
        <p className="text-[#8888aa] text-base">
          {toolsList.length} tools available in this category
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
        {toolsList.map((tool, i) => (
          <ToolCard key={tool.id} tool={tool} index={i} />
        ))}
      </div>

      {/* Other Categories */}
      <div className="border-t border-[#1e1e32] pt-10">
        <h2 className="text-lg font-semibold text-white font-[Space_Grotesk] mb-5">
          Other Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {categories.filter(c => c.id !== categoryId).map(cat => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              className="flex items-center gap-2 p-3 rounded-xl bg-[#13131f] border border-[#1e1e32] hover:border-[#00d4ff44]
                text-sm text-[#8888aa] hover:text-white transition-all no-underline"
            >
              <span>{cat.emoji}</span>
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
