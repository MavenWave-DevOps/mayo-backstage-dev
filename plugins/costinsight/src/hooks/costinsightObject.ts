import { useEffect, useState } from 'react';
import { useApi } from '@backstage/core-plugin-api';
import { costinsightApiRef } from '../api/types';

export const costinsightObject = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [status, setStatus] = useState<string>('');
    const [error, setError] = useState<boolean>(false);

    const costinsightApi = useApi(costinsightApiRef);
    const getObjects = async () => {
        try {
            const health = await costinsightApi.getHealth();
            setStatus(health.status);
        } catch (e) {
            setError(true);
        } finally {
            setLoading(false);

        }
    }
    useEffect(() => {
        getObjects();
    });
    return {
        error,
        loading,
        status,
    }
}