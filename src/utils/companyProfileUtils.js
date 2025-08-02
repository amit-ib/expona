// Extracts the file name from a URL
export function extractFileName(url) {
    if (!url || typeof url !== 'string') return '';
    const path = url.split('?')[0];
    return path.substring(path.lastIndexOf('/') + 1);
}

// Returns supporting files for a given docName from supportingDocs
export function getSupportingFiles(supportingDocs, docName) {
    if (!supportingDocs || !supportingDocs.data || !Array.isArray(supportingDocs.data.data)) return [];
    const docs = docName
        ? supportingDocs.data.data.filter(doc => doc.doc_name === docName)
        : supportingDocs.data.data;
    return docs.map(doc => ({
        name: extractFileName(doc.doc_path),
        url: doc.doc_path,
        docID: doc.doc_id,
        docTitle: doc.doc_name,
        date: doc.uploaded_date ? new Date(doc.uploaded_date).toLocaleDateString() : ''
    }));
}

// Utility to filter out files with specified text in a given property
export function filterFilesByText(files, property, textsToExclude) {
    if (!Array.isArray(files)) return [];
    const excludeArr = Array.isArray(textsToExclude) ? textsToExclude : [textsToExclude];
    return files.filter(file => {
        const value = file[property];
        if (typeof value !== 'string') return true;
        return !excludeArr.some(text => value.includes(text));
    });
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
