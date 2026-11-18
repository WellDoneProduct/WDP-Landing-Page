import { BlogListingPage, listingMetadata, pageParams, parsePage } from '@/components/editorial/BlogListingPage';

type Props = { params: Promise<{ category: string; page: string }> };

export const dynamicParams = false;
// Runs once per category from the parent segment's generateStaticParams.
export const generateStaticParams = ({ params }: { params: { category: string } }) => pageParams(params.category);
export const generateMetadata = async ({ params }: Props) => {
  const { category, page } = await params;
  return listingMetadata(category, parsePage(page));
};

const BlogCategoryPagedPage = async ({ params }: Props) => {
  const { category, page } = await params;
  return <BlogListingPage category={category} page={parsePage(page)} />;
};
export default BlogCategoryPagedPage;
