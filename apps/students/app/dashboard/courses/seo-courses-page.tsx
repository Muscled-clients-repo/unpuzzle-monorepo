import CoursesListingClient from "./courses-listing-client";

export { coursesMetadata as metadata } from "./courses-metadata";

export default function CoursesPage() {
  return (
    <CoursesListingClient />
  );
}