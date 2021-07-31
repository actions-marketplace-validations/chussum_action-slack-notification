# Action Slack - GitHub Action
[![Project Status: Active – The project has reached a stable, usable state and is being actively developed.](https://www.repostatus.org/badges/latest/active.svg)](https://www.repostatus.org/#active)

A [GitHub Action](https://github.com/features/actions) to send a message to a Slack channel.

**Screenshot**

TODO

## Usage

You can use this action after any other action. Here is an example setup of this action:

1. Create a `.github/workflows/slack-workflow.yml` file in your GitHub repo.
2. Add the following code to the `slack-workflow.yml` file.

```yml
on: push
name: Slack Notification
jobs:
  slack:
    name: Slack Notification
    runs-on: ubuntu-latest
    steps:
      - name: Slack Notification
        if: always() # Pick up events even if the job fails or is canceled.
        uses: chussum/action-slack@v1
        with:
          status: ${{ jobs.status }}
          fields: repo,commit # selectable (default: repo,commit,action)
          hsah: a0d21a060c204103c02cc7f8b4b39ffbb2c2fc13 # optional, Github commit sha (will be display in fields (default. github ref))
          channel: general # optional, Override the slack integration's default channel.
          bot_name: Hello World Bot # optional, Override the slack integration's default name.
          success_text: Succeeded # optional, Slack message when succeeded.
          failure_text: Failed # optional, Slack message when succeeded.
          canceled_text: Canceled # optional, Slack message when succeeded.
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # required
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

3. Create `SLACK_WEBHOOK` secret using [GitHub Action's Secret](https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets#creating-encrypted-secrets-for-a-repository). You can [generate a Slack incoming webhook token from here](https://slack.com/apps/A0F7XDUAZ-incoming-webhooks).


## License

[MIT](LICENSE) © 2021 chussum
