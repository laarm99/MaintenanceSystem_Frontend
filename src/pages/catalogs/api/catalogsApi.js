import { get } from '../../../services/backend-requests';
import { createCrudApi } from '../../../services/crudApi';

export const sitesApi = createCrudApi('catalogs/sites');
export const plantsApi = createCrudApi('catalogs/plants');
export const areasApi = createCrudApi('catalogs/areas');
export const equipmentTypesApi = createCrudApi('catalogs/equipment-types');
export const proceduresApi = createCrudApi('catalogs/procedures');
export const nonWorkingDaysApi = createCrudApi('catalogs/non-working-days');
export const equipmentApi = createCrudApi('equipment');

export const getAccounts = async () => (await get('lookups/accounts')).data;