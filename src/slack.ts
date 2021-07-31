import * as core from '@actions/core';
import { context, getOctokit } from '@actions/github';
import { GitHub } from '@actions/github/lib/utils';
import { IncomingWebhook, IncomingWebhookSendArguments } from '@slack/webhook';
import { Field } from './fields';

export enum Status {
  SUCCEEDED = 'success',
  FAILED = 'failure',
  CANCELED = 'cancelled',
}

export type Octokit = InstanceType<typeof GitHub>;

interface SlackProps {
  botName: string;
  channel: string;
  gitHubBaseUrl: string;
  hash: string;
  fields: string;
}

export class Slack {
  private botName: string;
  private channel: string;
  private fields: Field;
  private gitHubBaseUrl: string;
  private hash: string;
  private octokit: Octokit;
  private webhook: IncomingWebhook;

  constructor({ botName, channel, gitHubBaseUrl, hash, fields }: SlackProps) {
    if (process.env.GITHUB_TOKEN === undefined) {
      throw new Error('Specify secrets.GITHUB_TOKEN');
    }
    if (process.env.SLACK_WEBHOOK_URL === undefined) {
      throw new Error('Specify secrets.SLACK_WEBHOOK_URL');
    }
    this.botName = botName;
    this.channel = channel;
    this.gitHubBaseUrl = gitHubBaseUrl;
    this.hash = hash;
    this.octokit = getOctokit(process.env.GITHUB_TOKEN);
    this.webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);
    this.fields = new Field({
      fields: fields === '' ? 'repo,commit,action' : fields,
      gitHubBaseUrl: this.gitHubBaseUrl,
      hash: this.hash,
      octokit: this.octokit,
    });
  }

  public async sendMessage(status: Status, text: string) {
    const color = this.statusColor(status);
    const payload = {
      username: this.botName || undefined,
      channel: this.channel || undefined,
      text: text,
      attachments: [
        {
          color: color,
          // fields: await this.fields2(),
          fields: await this.fields.attachments(),
        },
      ],
    };

    this.send(payload);
  }

  public async send(payload: string | IncomingWebhookSendArguments) {
    core.debug(JSON.stringify(context, null, 2));
    await this.webhook.send(payload);
    core.debug('send message');
  }

  private statusColor(status: Status) {
    switch (status) {
      case Status.SUCCEEDED:
        return 'good';
      case Status.FAILED:
        return 'danger';
      case Status.CANCELED:
        return 'warning';
      default:
        throw new Error('The status must be success or failure or canceled');
    }
  }
}
