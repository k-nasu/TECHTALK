import { Client } from '@notionhq/client'

const client = new Client({
  auth: process.env.NOTION_SECRET_TOKEN,
});

const getPageMetaData = (post: any) => {
  const getTags = (tags: any) => {
    const allTags = tags?.map((tag: any) => {
      return tag.name;
    });

    return allTags;
  };

  return {
    id: post.id,
    title: post.properties.Name.title[0]?.plain_text || null,
    description: post.properties.Description.rich_text[0]?.plain_text || null,
    updated_on: post.properties.Updated_on.date?.start || null,
    slug: post.properties.Slug.rich_text[0]?.plain_text || null,
    tags: post.properties.Tags.multi_select ? getTags(post.properties.Tags.multi_select) : null,
  }
};

export const getAllPosts = async () => {
  const posts = await client.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    page_size: 100,
  });

  const allPosts = posts.results;

  return allPosts.map((post => {
    return getPageMetaData(post);
  }))
};
