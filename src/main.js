const core = require('@actions/core');
const { Octokit } = require('@octokit/rest');
const github = require('@actions/github');
const { dealStringToArr } = require('actions-util');

// **********************************************************
const token = core.getInput('token');
const octokit = new Octokit({ auth: `token ${token}` });
const context = github.context;

const outEventErr = `This Action only support "pull_request" "pull_request_target"！`;

async function run() {
  try {
    const { owner, repo } = context.repo;
    if (context.eventName === 'pull_request_target' || context.eventName === 'pull_request') {
      const title = context.payload.pull_request.title;
      const body = context.payload.pull_request.body;
      const number = context.payload.pull_request.number;

      let issues = [];
      const way = core.getInput('way');
      if (way === 'title') {
        let arr = title.split(' ');
        arr.forEach(it => {
          if (it.startsWith('#')) {
            issues.push(it.replace('#', ''));
          }
        });
      } else if (way === 'body') {
        let arr = body.split('\n');
        arr.forEach(it => {
          if (it.startsWith('#')) {
            issues.push(it.replace('#', '').replace('\n', ''));
          }
        });
      } else if (way === 'commit') {
        const { data: commits } = await octokit.pulls.listCommits({
          owner,
          repo,
          pull_number: number,
          // 一般不会超过 100 个 commit 吧，😌 不想分页了，暂时保留
          per_page: 100,
        });
        commits.forEach(commit => {
          let message = commit.commit.message;
          let messageArr = message.split(' ');
          messageArr.forEach(it => {
            if (it.startsWith('#')) {
              issues.push(it.replace('#', ''));
            }
          });
        });
      } else {
        core.setFailed('Wrong way!');
      }

      core.info(`[Action: Query Issues][${issues}]`);
      core.setOutput('issues', issues);

      const labels = core.getInput('issues-labels');
      const comment = core.getInput('issues-comment');
      const close = core.getInput('issues-close');

      if (!labels && !comment && !close) {
        return false;
      }

      for await (let issue of issues) {
        if (labels) {
          await octokit.issues.addLabels({
            owner,
            repo,
            issue_number: issue,
            labels: dealStringToArr(labels),
          });
          core.info(`Actions: [add-labels][${issue}][${labels}] success!`);
        }
        if (comment) {
          comment.replace('${number}', `#${issue}`);
          await octokit.issues.createComment({
            owner,
            repo,
            issue_number: issue,
            comment,
          });
          core.info(`Actions: [create-comment][${issue}][${comment}] success!`);
        }
        if (close == 'true') {
          await octokit.issues.update({
            owner,
            repo,
            issue_number: issue,
            state: 'closed',
          });
          core.info(`Actions: [close-issue][${issue}] success!`);
        }
      }
    } else {
      core.setFailed(outEventErr);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
