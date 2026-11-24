import { useCallback, useEffect, useState } from 'react';
import { App } from 'antd';
import { useTranslation } from 'react-i18next';
import { getApiError } from '../utils/apiError';

/**
 * Loads a list from an async function and exposes a reload callback.
 */
export default function useRemoteList(loader) {
    const { t } = useTranslation();
    const { message } = App.useApp();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const reload = useCallback(async () => {
        setLoading(true);
        try {
            setData(await loader());
        } catch (error) {
            message.error(getApiError(error, t('crud.loadError')).message);
        } finally {
            setLoading(false);
        }
    }, [loader, message, t]);

    useEffect(() => {
        reload();
    }, [reload]);

    return { data, loading, reload };
}