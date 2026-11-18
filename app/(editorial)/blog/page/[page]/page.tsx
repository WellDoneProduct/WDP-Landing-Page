import { BlogListingPage, listingMetadata, pageParams, parsePage } from '@/components/editorial/BlogListingPage';

type Props = { params: Promise<{ page: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => pageParams('All');
export const generateMetadata = async ({ params }: Props) => listingMetadata('All', parsePage((await params).page));

const BlogPagedPage = async ({ params }: Props) => <BlogListingPage category="All" page={parsePage((await params).page)} />;
export default BlogPagedPage;
