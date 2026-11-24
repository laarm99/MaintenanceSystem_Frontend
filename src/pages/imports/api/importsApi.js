import { get, getFile, postForm } from '../../../services/backend-requests';

export async function getImportDefinitions() {
    return await get('imports/definitions');
}

export async function downloadImportTemplate(type) {
    const response = await getFile(`imports/${type}/template`);
    const url = URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Plantilla_${type}.xlsx`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

/**
 * Uploads the Excel file. commit=false only validates; commit=true saves when there are no row errors.
 */
export async function uploadImport(type, file, commit) {
    const formData = new FormData();
    formData.append('file', file);
    return await postForm(`imports/${type}?commit=${commit}`, formData);
}
