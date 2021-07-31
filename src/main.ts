import * as core from '@actions/core';
import { Slack, Status } from './slack';

async function run() {
  try {
    const botName = core.getInput('bot_name');
    const channel = core.getInput('channel');
    const status = core.getInput('status', { required: true }).toLowerCase() as Status;
    const gitHubBaseUrl = core.getInput('github_base_url');
    const hash = core.getInput('hash');
    const fields = core.getInput('fields');

    core.debug(`bot_name: ${botName}`);
    core.debug(`channel: ${channel}`);
    core.debug(`status: ${status}`);
    core.debug(`github_base_url: ${gitHubBaseUrl}`);

    const slack = new Slack({ botName, channel, gitHubBaseUrl, hash, fields });
    const text = slackText(status);

    await slack.sendMessage(status, text);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

const slackText = (status: Status) => {
  const successText = core.getMultilineInput('success_text').join('\n');
  const failureText = core.getMultilineInput('failure_text').join('\n');
  const canceledText = core.getMultilineInput('canceled_text').join('\n');

  core.debug(`success_text: ${successText}`);
  core.debug(`failure_text: ${failureText}`);
  core.debug(`canceled_text: ${canceledText}`);

  switch (status) {
    case Status.SUCCEEDED:
      return successText;
    case Status.FAILED:
      return failureText;
    case Status.CANCELED:
      return canceledText;
    default:
      throw new Error('You can specify success or failure or canceled');
  }
};

run();
