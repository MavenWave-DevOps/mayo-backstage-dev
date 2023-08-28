import { createApiRef } from "@backstage/core-plugin-api";

export interface costinsightApi {
    getHealth(): Promise<{ status: string; }>;
}

export const costinsightApiRef = createApiRef<costinsightApi>({
    id: 'plugin.bigqueryapi.service',
});