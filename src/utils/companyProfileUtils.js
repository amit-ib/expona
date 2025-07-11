// Extracts the file name from a URL
export function extractFileName(url) {
    if (!url || typeof url !== 'string') return '';
    const path = url.split('?')[0];
    return path.substring(path.lastIndexOf('/') + 1);
}

// Returns supporting files for a given docName from supportingDocs
export function getSupportingFiles(supportingDocs, docName) {
    if (!supportingDocs || !Array.isArray(supportingDocs.data)) return [];
    return supportingDocs.data
        .filter(doc => doc.doc_name === docName)
        .map(doc => ({
            name: extractFileName(doc.doc_path),
            url: doc.doc_path,
            date: doc.uploaded_date ? new Date(doc.uploaded_date).toLocaleDateString() : ''
        }));
}

// Document section definitions for DRY rendering
export const documentSections = [
    {
        label: "Certificate of Incorporation",
        description: "Official document proving your company's legal existence",
        docName: "Certificate_of_Incorporation"
    },
    {
        label: "GST Registration Certificate",
        description: "Document with GST Details",
        docName: "GST_Registration_Certificate"
    }
    // Add more document types here as needed
]; 