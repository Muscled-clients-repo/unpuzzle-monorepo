import Link from "next/link";
import { ChevronRight } from "lucide-react";
import SEOStructuredData from "./seo-structured-data";
import { generateBreadcrumbSchema } from "../../utils/seo.utils";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface SEOBreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function SEOBreadcrumb({ items }: SEOBreadcrumbProps) {
  const breadcrumbSchema = generateBreadcrumbSchema(items);

  return (
    <>
      <SEOStructuredData data={breadcrumbSchema} />
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              Home
            </Link>
          </li>
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
              {index === items.length - 1 ? (
                <span className="text-gray-900 font-medium">{item.name}</span>
              ) : (
                <Link href={item.url} className="text-gray-500 hover:text-gray-700">
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}