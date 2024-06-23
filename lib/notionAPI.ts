import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md';
import { PAGE_SIZE } from '@/constants/constants'

const database_id = process.env.NOTION_DATABASE_ID!;
const client = new Client({ auth: process.env.NOTION_SECRET_TOKEN });
const n2m = new NotionToMarkdown({ notionClient: client })

const getPageMetaData = (post: any) => {
  const getTags = (tags: any) => {
    const allTags = tags?.map((tag: any) => {
      return tag.name;
    });

    return allTags;
  };

  return {
    id: post.id,
    title: post.properties.Title.title[0].plain_text,
    description: post.properties.Description.rich_text[0]?.plain_text || null,
    updated_on: post.properties.Updated_on.date?.start || null,
    slug: post.properties.Slug.rich_text[0].plain_text,
    tags: post.properties.Tags.multi_select ? getTags(post.properties.Tags.multi_select) : null,
  }
};

// 記事一覧取得
export const getAllPosts = async () => {
  const posts = await client.databases.query({
    database_id: database_id,
    page_size: 100,
    sorts: [
      {
        property: "Updated_on",
        direction: "descending",
      }
    ],
    filter: {
      and: [
        {
          property: "Slug",
          formula: {
            string: {
              is_not_empty: true
            }
          }
        },
        {
          property: "Title",
          formula: {
            string: {
              is_not_empty: true
            }
          }
        },
        {
          property: "Published",
          checkbox: {
            equals: true
          }
        }
      ]
    }
  });

  const allPosts = posts.results;

  return allPosts.map((post => {
    return getPageMetaData(post);
  }))
};

// 記事一部取得
export const getSinglePost = async (slug: string) => {
  const res = await client.databases.query({
    database_id: database_id,
    filter: {
      property: "Slug",
      formula: {
        string: {
          equals: slug,
        }
      }
    }
  })

  const page = res.results[0]
  const metadata = getPageMetaData(page)
  const mdBlocks = await n2m.pageToMarkdown(page.id)
  const mdString = n2m.toMarkdownString(mdBlocks)

  return {
    metadata,
    markdown: mdString.parent || null
  }
}

export const getPostsForTopPage = async (pageSize: number) => {
  const allPosts = await getAllPosts()
  const initialPosts = allPosts.slice(0, pageSize)

  return initialPosts
}

export const getPostsByPage = async (page: number) => {
  const allPosts = await getAllPosts();

  const startIndex = (page - 1) * PAGE_SIZE
  const endIndex = startIndex + PAGE_SIZE

  return allPosts.slice(startIndex, endIndex)
}

export const getPageNumber = async () => {
  const allPosts = await getAllPosts()

  return Math.floor(allPosts.length / PAGE_SIZE) + (allPosts.length % PAGE_SIZE > 0 ? 1 : 0)
}
