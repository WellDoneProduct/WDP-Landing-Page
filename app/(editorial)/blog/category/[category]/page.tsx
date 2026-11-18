import { BlogListingPage, categoryParams, listingMetadata } from '@/components/editorial/BlogListingPage';

type Props = { params: Promise<{ category: string }> };

export const dynamicParams = false;
export const generateStaticParams = categoryParams;
export const generateMetadata = async ({ params }: Props) => listingMetadata((await params).category, 1);

const BlogCategoryPage = async ({ params }: Props) => <BlogListingPage category={(await params).category} page={1} />;
export default BlogCategoryPage;
