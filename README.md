# 🤠 PR Extract Issues

![](https://img.shields.io/github/workflow/status/actions-cool/pr-extract-issues/CI?style=flat-square)
[![](https://img.shields.io/badge/marketplace-pr--extract--issues-blueviolet?style=flat-square)](https://github.com/marketplace/actions/pr-extract-issues)
[![](https://img.shields.io/github/v/release/actions-cool/pr-extract-issues?style=flat-square&color=orange)](https://github.com/actions-cool/pr-extract-issues/releases)

## How to use?

```yml
name: PR Extract Issues

on:
  pull_request:
    types: [opened, edited, synchronize]

jobs:
  extract:
    runs-on: ubuntu-latest
    steps:
      - uses: actions-cool/pr-extract-issues@v1.0.0
        with:
          way: 'commit'
          issues-labels: 'l1, l2'
          issues-comment: |
            HI。这个 issue: ${number} 已经被修复了。
          issues-close: true
```

### Input

| Name | Desc | Type | Required |
| -- | -- | -- | -- |
| token | GitHub token | string | ✖ |
| way | The way to query issues. Options: `title` `body` `commit` | string | ✔ |
| issues-labels | Extra labels on issues | string | ✖ |
| issues-comment | Extra comment on issues | string | ✖ |
| issues-close | Extra close issues | string | ✖ |

- `title`: The PR title. Will only match like
  - fix: fix other #123 #456 #789
    - Get: 123 456 789
  - refctore: use other #222 #333#44
    - Get: 222 33344
  - So you should start with a space # and end with a space
- `body`：The PR body
  - Like: https://github.com/actions-cool/pr-extract-issues/pull/4
  - Branch whole line display with # start
- `commit`: Like `title`
- `issues-labels`: Support multiple, need to be separated by comma
- `issues-comment`: `${number}` will be replaced with the current issue number
- `issues-close`: Whether close issue

### Output

- `issues`: Get issues numbers

## ⚡ Feedback

You are very welcome to try it out and put forward your comments. You can use the following methods:

- Report bugs or consult with [Issue](https://github.com/actions-cool/pr-extract-issues/issues)
- Submit [Pull Request](https://github.com/actions-cool/pr-extract-issues/pulls) to improve the code of `pr-extract-issues`

也欢迎加入 钉钉交流群

![](https://github.com/actions-cool/resources/blob/main/dingding.jpeg?raw=true)

## Changelog

[CHANGELOG](./CHANGELOG.md)

## LICENSE

[MIT](./LICENSE)
