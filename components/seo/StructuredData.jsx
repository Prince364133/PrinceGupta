// components/seo/StructuredData.jsx

/**
 * StructuredData component for rendering JSON-LD structured data
 * @param {Object} schema - The JSON-LD schema object
 */
export default function StructuredData({ schema }) {
    if (!schema) return null;

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(schema, null, 2)
            }}
        />
    );
}
