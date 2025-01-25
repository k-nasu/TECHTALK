import Link from 'next/link'
import Image from 'next/image'
import useSWR from 'swr'
import { fetchTags } from '@/lib/api-client'

type Props = {
  currentTag?: string
}

const SkeletonTag = () => (
  <div className="flex flex-col items-center gap-2">
    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse" />
    <div className="w-16 h-4 rounded bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse" />
  </div>
)

const TagGrid = ({ currentTag }: Props) => {
  const { data: allTags, error } = useSWR('tags', fetchTags, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000,
    fallbackData: [],
  })

  if (error) {
    return (
      <div className="text-center py-8 text-gray-500">
        タグの読み込みに失敗しました
      </div>
    )
  }

  if (!allTags) {
    return (
      <div className="
        grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4
        h-[60vh] sm:h-[400px]
        overflow-y-auto custom-scrollbar
        relative pb-8
      ">
        {[...Array(24)].map((_, i) => (
          <SkeletonTag key={i} />
        ))}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </div>
    )
  }

  return (
    <div className="
      grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4
      h-[60vh] sm:h-[400px]
      overflow-y-auto custom-scrollbar
      relative pb-8
    ">
      {allTags
        .sort((a, b) => a.localeCompare(b, 'ja'))
        .map((tagName) => (
          <Link
            key={tagName}
            href={`/articles/tag/${tagName}/page/1`}
            className={`
              flex flex-col items-center gap-2 group
              ${tagName === currentTag ? 'opacity-50 pointer-events-none' : ''}
            `}
          >
            <div className="w-12 h-12 rounded-full bg-surface shadow-lg shadow-gray-200/50 flex items-center justify-center group-hover:shadow-gray-300/50 transition-all group-hover:-translate-y-0.5">
              <Image
                src={`/tag_images/${tagName}.svg`}
                width={24}
                height={24}
                alt=""
                className="w-6 h-6"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.parentElement?.classList.add('default-icon')
                }}
              />
            </div>
            <span className="text-sm text-secondary group-hover:text-primary text-center font-medium">
              {tagName}
            </span>
          </Link>
        ))}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </div>
  )
}

export default TagGrid
