import { del, get, post, put } from './backend-requests';

/**
 * Standard REST client for a CrudControllerBase endpoint (GET, POST, PUT {id}, DELETE {id}).
 */
export function createCrudApi(baseUrl) {
    return {
        list: async () => (await get(baseUrl)).data,
        create: async (body) => (await post(baseUrl, body)).data,
        update: async (id, body) => (await put(`${baseUrl}/${id}`, body)).data,
        remove: async (id) => (await del(`${baseUrl}/${id}`)).data,
    };
}