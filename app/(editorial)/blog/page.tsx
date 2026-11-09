import { BlogListingPage, listingMetadata } from '@/components/editorial/BlogListingPage';

export const generateMetadata = () => listingMetadata('All', 1);

const BlogPage = () => <BlogListingPage category="All" page={1} />;
export default BlogPage;
