import RootPage from "@/components/admin/RootPage";

interface PageProps {
  params: Promise<{ locale: string; segment: string }>;
}

const AdminCatchAllPage = async ({ params }: PageProps) => {

    const { segment } = await params;

    // Log the params for debugging
    console.log("Params:", segment);

    return (
        // <RootPage config={params} segment={Array.isArray(segment) ? segment.join('/') : segment || ''} />
        <h2>Admin Catch-All Page</h2>
    );
};

export default AdminCatchAllPage;