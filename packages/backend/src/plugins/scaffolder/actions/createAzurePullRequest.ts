import {ScmIntegrationRegistry} from "@backstage/integration";
import { createTemplateAction } from "@backstage/plugin-scaffolder-node";
import {InputError} from "@backstage/errors";
import { createADOPullRequest} from "../helpers";
import * as GitInterfaces from "azure-devops-node-api/interfaces/GitInterfaces";

/**
 * Creates an `ado:repo:pr` Scaffolder action.
 *
 * @remarks
 *
 * This Scaffolder action will create a PR to a repository in Azure DevOps.
 *
 * @public
 */
export const createAzurePullRequest = (options: {
    integrations: ScmIntegrationRegistry;
}) => {
    const { integrations } = options;

    return createTemplateAction<{
        organization?: string;
        sourcePath?: string;
        targetPath?: string;
        title: string;
        repoId: string;
        project?: string;
        supportsIterations?: boolean;
        token?: string;
    }>({
        id: 'ado:repo:pr',
        description: 'Create a PR to a repository in Azure DevOps.',
        schema: {
            input: {
                required: [],
                type: 'object',
                properties: {
                    input: {
                        type: 'object',
                        required: ['repoId', 'title'],
                        properties: {
                            organization: {
                                title: 'Organization Name',
                                type: 'string',
                                description: 'The name of the organization in Azure DevOps.',
                            },
                            sourcePath: {
                                title: 'Source Branch',
                                type: 'string',
                                description: 'The branch to merge into the source.',
                            },
                            targetPath: {
                                title: 'Target Branch',
                                type: 'string',
                                description: "The branch to merge into (default: main).",
                            },
                            repoId: {
                                title: 'Remote Repo ID',
                                description: 'Repo ID of the pull request.',
                                type: 'string',
                            },
                            title: {
                                title: 'Title',
                                description: 'The title of the pull request.',
                                type: 'string',
                            },
                            project: {
                                title: 'ADO Project',
                                description: 'The Project in Azure DevOps.',
                                type: 'string',
                            },
                            supportsIterations: {
                                title: 'Supports Iterations',
                                description: 'Whether or not the PR supports interations.',
                                type: 'boolean',
                            },
                            token: {
                                title: 'Authenticatino Token',
                                type: 'string',
                                description: 'The token to use for authorization.',
                            },
                        }
                    },
                },
            },
        },
        async handler(ctx) {
            const { title, repoId, project, supportsIterations } = ctx.input;

            const sourcePath = `refs/heads/${ctx.input.sourcePath}` ?? `refs/heads/scaffolder`;
            const targetPath = `refs/heads/${ctx.input.targetPath}` ?? `refs/heads/main`;

            const host = 'dev.azure.com';
            const integrationConfig = integrations.azure.byHost(host);

            if (!integrationConfig) {
                throw new InputError(
                    `No matching integration configuration for host ${host}, please check your integrations config`
                );
            }

            if (!integrationConfig.config.token && !ctx.input.token) {
                throw new InputError(`No token provided for Azure Integration ${host}`);
            }

            const pullRequest: GitInterfaces.GitPullRequest = {
                sourceRefName: sourcePath,
                targetRefName: targetPath,
                title: title,
            } as GitInterfaces.GitPullRequest;

            const org = ctx.input.organization ?? 'notempty';
            const token = ctx.input.token ?? integrationConfig.config.token!;

            await createADOPullRequest({
                gitPullRequestToCreate: pullRequest,
                auth: { org, token },
                repoId: repoId,
                project: project,
                supportsIterations: supportsIterations,
            });
        },
    });
};
