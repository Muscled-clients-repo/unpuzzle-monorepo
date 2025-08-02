"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { generateBreadcrumbSchema } from "./utils";

// ============= SEO Structured Data Component =============
interface StructuredDataProps {
  data: Record<string, any>;
}

export const SEOStructuredData: React.FC<StructuredDataProps> = ({ data }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
};

// ============= SEO Breadcrumb Component =============
interface BreadcrumbItem {
  name: string;
  url: string;
}

interface SEOBreadcrumbProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}

export const SEOBreadcrumb: React.FC<SEOBreadcrumbProps> = ({ 
  items, 
  showHome = true,
  className = "" 
}) => {
  const breadcrumbSchema = generateBreadcrumbSchema(items);

  return (
    <>
      <SEOStructuredData data={breadcrumbSchema} />
      <nav aria-label="Breadcrumb" className={`mb-4 ${className}`}>
        <ol className="flex items-center space-x-2 text-sm">
          {showHome && (
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
            </li>
          )}
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {(showHome || index > 0) && (
                <ChevronRight className="w-4 h-4 text-gray-400 mx-1" aria-hidden="true" />
              )}
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
};

export default SEOBreadcrumb;