import { Metadata } from "next";

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
}

export function generateSEOMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords,
    image = "/assets/logo.png",
    url = "/",
    type = "website",
  } = config;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url,
      type,
      siteName: "Unpuzzle",
      locale: "en_US",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description.substring(0, 160),
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Unpuzzle",
    description: "Interactive educational platform that makes learning engaging through puzzle-based content",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://unpuzzle.com",
    logo: {
      "@type": "ImageObject",
      url: `${process.env.NEXT_PUBLIC_APP_URL || "https://unpuzzle.com"}/assets/logo.png`,
    },
    sameAs: [
      "https://twitter.com/unpuzzle",
      "https://www.linkedin.com/company/unpuzzle",
      "https://www.facebook.com/unpuzzle",
    ],
  };
}

export function generateCourseSchema(course: {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price?: number;
  rating?: number;
  studentsCount?: number;
  duration?: string;
  level?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${process.env.NEXT_PUBLIC_APP_URL || "https://unpuzzle.com"}/courses/${course.id}`,
    name: course.title,
    description: course.description,
    provider: {
      "@type": "Organization",
      name: "Unpuzzle",
      sameAs: process.env.NEXT_PUBLIC_APP_URL || "https://unpuzzle.com",
    },
    instructor: {
      "@type": "Person",
      name: course.instructor,
    },
    ...(course.price && {
      offers: {
        "@type": "Offer",
        price: course.price,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
    }),
    ...(course.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: course.rating,
        bestRating: "5",
        worstRating: "1",
        ratingCount: course.studentsCount || 1,
      },
    }),
    ...(course.duration && { duration: course.duration }),
    ...(course.level && { educationalLevel: course.level }),
    courseMode: "online",
    educationalCredentialAwarded: "Certificate of Completion",
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${process.env.NEXT_PUBLIC_APP_URL || "https://unpuzzle.com"}${item.url}`,
    })),
  };
}

export function generateVideoSchema(video: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration: string;
  contentUrl: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.name,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl,
    uploadDate: video.uploadDate,
    duration: video.duration,
    contentUrl: video.contentUrl,
    embedUrl: video.contentUrl,
    publisher: {
      "@type": "Organization",
      name: "Unpuzzle",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_APP_URL || "https://unpuzzle.com"}/assets/logo.png`,
      },
    },
  };
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}