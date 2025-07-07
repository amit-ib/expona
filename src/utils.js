// Utility to extract Company_ID from user object
export function getCompanyIdFromUser(user) {
    if (user && Array.isArray(user.company_profile) && user.company_profile.length > 0) {
        const companyId = user.company_profile[0].Company_ID;
        if (companyId) {
            localStorage.setItem('company_id', companyId);
        }
        return companyId;
    }
    return undefined;
}

// Markdown components for react-markdown
export const markdownComponents = {
    p: ({ node, ...props }) => (
        <p className="mb-5" {...props} />
    ),
    ul: ({ node, ...props }) => {
        const depth = node?.position?.start?.column || 0;
        const isNested = depth > 2;
        return (
            <ul
                className={
                    isNested
                        ? "list-disc ml-8 mb-4 text-sm mt-3 space-y-1"
                        : "list-disc ml-5 mb-5 text-sm space-y-1"
                }
                {...props}
            />
        );
    },
    ol: ({ node, ...props }) => (
        <ul className="list-decimal" {...props} />
    ),
    h1: ({ node, ...props }) => (
        <h1 className="text-2xl font-bold" {...props} />
    ),
    a: ({ node, ...props }) => (
        <a className="text-white underline" {...props} />
    ),
}; 