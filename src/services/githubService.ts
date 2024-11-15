import { Octokit } from '@octokit/rest';

interface ProjectsResponse {
  organization: {
    projectsV2: {
      nodes: Array<{
        id: string;
        title: string;
        number: number;
      }>;
    };
  };
}

interface ProjectColumnsResponse {
  node: {
    fields: {
      nodes: Array<{
        id: string;
        name: string;
      }>;
    };
  };
}

export class GitHubService {
  private octokit: Octokit;

  constructor(token: string) {
    this.octokit = new Octokit({
      auth: token
    });
  }

  async getProjects(org: string) {
    const response = await this.octokit.graphql<ProjectsResponse>(`
      query($org: String!) {
        organization(login: $org) {
          projectsV2(first: 20) {
            nodes {
              id
              title
              number
            }
          }
        }
      }
    `, {
      org
    });

    return response.organization.projectsV2.nodes;
  }

  async getProjectColumns(projectId: string) {
    const response = await this.octokit.graphql<ProjectColumnsResponse>(`
      query($projectId: ID!) {
        node(id: $projectId) {
          ... on ProjectV2 {
            fields(first: 20) {
              nodes {
                ... on ProjectV2Field {
                  id
                  name
                }
              }
            }
          }
        }
      }
    `, {
      projectId
    });

    return response.node.fields.nodes;
  }
}