import Link from 'next/link'
import { CATEGORY_INFO } from '@/constants/categories'

const CategoryList = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(CATEGORY_INFO).map(([key, { name, icon }]) => (
        <Link
          key={key}
          href={`/categories/${key}`}
          className="p-6 border rounded-xl hover:shadow-lg transition-shadow bg-white group"
        >
          <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
            {icon}
          </div>
          <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
        </Link>
      ))}
    </div>
  )
}

export default CategoryList
