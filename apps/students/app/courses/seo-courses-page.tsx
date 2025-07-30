import CoursesListingClient from "./courses-listing-client";
import SEOBreadcrumb from "../components/shared/seo-breadcrumb";

export { coursesMetadata as metadata } from "./courses-metadata";

export default function CoursesPage() {
  const breadcrumbItems = [
    { name: "Courses", url: "/courses" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <SEOBreadcrumb items={breadcrumbItems} />
      </div>
      <CoursesListingClient />
    </div>
  );
}