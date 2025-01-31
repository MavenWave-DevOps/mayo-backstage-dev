import React from 'react';
import { Entity } from '@backstage/catalog-model';
import { createDevApp } from '@backstage/dev-utils';
import { costinsightPlugin, BgcostinsightPage } from '../src/plugin';
import { costinsightApi, costinsightApiRef } from '../src';
import { TestApiProvider } from '@backstage/test-utils';
import { EntityProvider } from '@backstage/plugin-catalog-react';

const mockEntity: Entity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Compnent',
    metadata: {
        name: 'bigquery-Plugin-Invoked',
        description: 'backstage.io',
    },
    spec: {
        lifecycle: 'production',
        type: 'service',
        owner: 'user:guest',
    },
};

class MockcostInsightClient implements costinsightApi {
    async getHealth(): Promise<{ status: string; }> {
        return { status: 'OK' };
    }
    async getResponseData(): Promise<{ responsedata: [] }> {
        return { responsedata: [] };
    }

}

createDevApp()
    .registerPlugin(costinsightPlugin)
    .addPage({
        title: 'Plugin Page',
        path: '/bgcostinsight',
        element: (
            <TestApiProvider
                apis={[[costinsightApiRef, new MockcostInsightClient()]]} >

                <EntityProvider entity={mockEntity}>
                    <BgcostinsightPage />,
                </EntityProvider>
            </TestApiProvider>
        ),
    })
    .registerPlugin(costinsightPlugin)
    .render();
