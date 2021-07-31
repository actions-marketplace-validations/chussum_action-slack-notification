import { context } from '@actions/github';
import { Octokit } from './slack';

export interface AttachmentField {
  title: string;
  value: string;
  short: boolean;
}

interface FieldProps {
  fields: string;
  gitHubBaseUrl: string;
  hash: string;
  octokit: Octokit;
}

export class Field {
  private fields: string[];
  private gitHubBaseUrl: string;
  private hash: string;
  private octokit: Octokit;

  constructor({ fields, gitHubBaseUrl, hash, octokit }: FieldProps) {
    this.fields = fields.replace(/ /g, '').split(',');
    this.octokit = octokit;
    this.gitHubBaseUrl = gitHubBaseUrl;
    this.hash = hash;
  }

  includes(field: string) {
    return this.fields.includes(field) || this.fields.includes('all');
  }

  filterField<T extends Array<AttachmentField | undefined>, D extends undefined>(array: T, diff: D) {
    return array.filter((item) => item !== diff) as Exclude<T extends { [K in keyof T]: infer U } ? U : never, D>[];
  }

  async attachments(): Promise<AttachmentField[]> {
    return this.filterField(
      [
        this.includes('repo') ? createAttachment('Repository', await this.repo()) : undefined,
        this.includes('commit') ? createAttachment('Commit', await this.commit()) : undefined,
        this.includes('action') ? createAttachment('GitHub Actions', await this.actions()) : undefined,
      ],
      undefined,
    );
  }

  private async repo(): Promise<string> {
    const { owner, repo } = context.repo;

    const value = `<${this.gitHubBaseUrl}/${owner}/${repo}|${owner}/${repo}>`;
    return value;
  }

  private async commit(): Promise<string> {
    const { sha } = context;
    const { owner, repo } = context.repo;
    const hash = this.hash || sha;

    const value = `<${this.gitHubBaseUrl}/${owner}/${repo}/commit/${hash}|${hash.slice(0, 8)}>`;
    return value;
  }

  private async actions() {
    const { owner, repo } = context.repo;
    const { sha } = context;

    return `<https://github.com/${owner}/${repo}/commit/${sha}/checks|${context.workflow}>`;
  }
}

function createAttachment(title: string, value: string, short?: boolean): AttachmentField | undefined {
  if (short === undefined) short = true;
  return { title, value, short };
}
