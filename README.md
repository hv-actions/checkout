<p align="center">
  <a href="https://github.com/hv-actions/checkout"><img alt="GitHub Actions status" src="https://github.com/hv-actions/checkout/workflows/test-local/badge.svg"></a>
</p>

# Hitachi Vantara Checkout V1


Note: This Action is an improved version based on Github Checkout V2 to allow checking out multiple repositories at once.

This action checks-out your repositories under `$GITHUB_WORKSPACE`, so your workflow can access it.

Only a single commit is fetched by default, for the ref/SHA that triggered the workflow. Set `fetch-depth: 0` to fetch all history for all branches and tags. Refer [here](https://help.github.com/en/articles/events-that-trigger-workflows) to learn which commit `$GITHUB_SHA` points to for different events.

The auth token is persisted in the local git config. This enables your scripts to run authenticated git commands. The token is removed during post-job cleanup. Set `persist-credentials: false` to opt-out.

When Git 2.18 or higher is not in your PATH, falls back to the REST API to download the files.

# What's new compared to Github Checkout V2

- Checkout multiple repositories into the given path or $GITHUB_WORKSPACE
- Takes the list in YAML format.

Refer [here](https://github.com/actions/checkout/blob/v2/README.md) for Github Checkout V2 documentation.

# Usage

<!-- start usage -->
```yaml
- uses: actions/checkout@v2
  with:
    # List of Repository names with owner to checkout. For example, - actions/checkout
    # - actions/slack-action
    # Default: ${{ github.repository }}
    repositories: ''

    # The branch, tag or SHA to checkout. When checking out the repository that
    # triggered a workflow, this defaults to the reference or SHA for that event.
    # Otherwise, uses the default branch.
    ref: ''

    # Personal access token (PAT) used to fetch the repository. The PAT is configured
    # with the local git config, which enables your scripts to run authenticated git
    # commands. The post-job step removes the PAT.
    #
    # We recommend using a service account with the least permissions necessary. Also
    # when generating a new PAT, select the least scopes necessary.
    #
    # [Learn more about creating and using encrypted secrets](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets)
    #
    # Default: ${{ github.token }}
    token: ''

    # SSH key used to fetch the repository. The SSH key is configured with the local
    # git config, which enables your scripts to run authenticated git commands. The
    # post-job step removes the SSH key.
    #
    # We recommend using a service account with the least permissions necessary.
    #
    # [Learn more about creating and using encrypted secrets](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets)
    ssh-key: ''

    # Known hosts in addition to the user and global host key database. The public SSH
    # keys for a host may be obtained using the utility `ssh-keyscan`. For example,
    # `ssh-keyscan github.com`. The public key for github.com is always implicitly
    # added.
    ssh-known-hosts: ''

    # Whether to perform strict host key checking. When true, adds the options
    # `StrictHostKeyChecking=yes` and `CheckHostIP=no` to the SSH command line. Use
    # the input `ssh-known-hosts` to configure additional hosts.
    # Default: true
    ssh-strict: ''

    # Whether to configure the token or SSH key with the local git config
    # Default: true
    persist-credentials: ''

    # Relative path under $GITHUB_WORKSPACE to place the repository
    path: ''

    # Whether to execute `git clean -ffdx && git reset --hard HEAD` before fetching
    # Default: true
    clean: ''

    # Number of commits to fetch. 0 indicates all history for all branches and tags.
    # Default: 1
    fetch-depth: ''

    # Whether to download Git-LFS files
    # Default: false
    lfs: ''

    # Whether to checkout submodules: `true` to checkout submodules or `recursive` to
    # recursively checkout submodules.
    #
    # When the `ssh-key` input is not provided, SSH URLs beginning with
    # `git@github.com:` are converted to HTTPS.
    #
    # Default: false
    submodules: ''
```
<!-- end usage -->

# Scenarios

- [Hitachi Vantara Checkout V1](#hitachi-vantara-checkout-v1)
- [What's new compared to Github Checkout V2](#whats-new-compared-to-github-checkout-v2)
- [Usage](#usage)
- [Scenarios](#scenarios)
  - [Checkout multiple repos (at once)](#checkout-multiple-repos-at-once)
  - [Fetch all history for all tags and branches](#fetch-all-history-for-all-tags-and-branches)
  - [Checkout a different branch](#checkout-a-different-branch)
  - [Checkout HEAD^](#checkout-head)
  - [Checkout multiple repos (side by side)](#checkout-multiple-repos-side-by-side)
  - [Checkout multiple repos (nested)](#checkout-multiple-repos-nested)
  - [Checkout multiple repos (private)](#checkout-multiple-repos-private)
  - [Checkout pull request HEAD commit instead of merge commit](#checkout-pull-request-head-commit-instead-of-merge-commit)
  - [Checkout pull request on closed event](#checkout-pull-request-on-closed-event)
  - [Push a commit using the built-in token](#push-a-commit-using-the-built-in-token)
- [License](#license)

## Checkout multiple repos (at once)

```yaml
- name: Checkout
  uses: hv-actions/checkout@v1
  with:
    repositories: |
      - hv-actions/action-1
      - hv-actions/action-2
    path: main
```

## Fetch all history for all tags and branches

```yaml
- uses: hv-actions/checkout@v1
  with:
    fetch-depth: 0
```

## Checkout a different branch

```yaml
- uses: hv-actions/checkout@v1
  with:
    ref: my-branch
```

## Checkout HEAD^

```yaml
- uses: hv-actions/checkout@v1
  with:
    fetch-depth: 2
- run: git checkout HEAD^
```

## Checkout multiple repos (side by side)

```yaml
- name: Checkout
  uses: hv-actions/checkout@v1
  with:
    path: main

- name: Checkout tools repo
  uses: hv-actions/checkout@v1
  with:
    repositories: |
      - my-org/my-tools
    path: my-tools
```

## Checkout multiple repos (nested)

```yaml
- name: Checkout
  uses: hv-actions/checkout@v1

- name: Checkout tools repo
  uses: hv-actions/checkout@v1
  with:
    repositories: |
      - my-org/my-tools
    path: my-tools
```

## Checkout multiple repos (private)

```yaml
- name: Checkout
  uses: hv-actions/checkout@v1
  with:
    path: main

- name: Checkout private tools
  uses: hv-actions/checkout@v1
  with:
    repositories: |
      - my-org/my-private-tools
    token: ${{ secrets.GitHub_PAT }} # `GitHub_PAT` is a secret that contains your PAT
    path: my-tools
```

> - `${{ github.token }}` is scoped to the current repository, so if you want to checkout a different repository that is private you will need to provide your own [PAT](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line).


## Checkout pull request HEAD commit instead of merge commit

```yaml
- uses: hv-actions/checkout@v1
  with:
    ref: ${{ github.event.pull_request.head.sha }}
```

## Checkout pull request on closed event

```yaml
on:
  pull_request:
    branches: [main]
    types: [opened, synchronize, closed]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: hv-actions/checkout@v1
```

## Push a commit using the built-in token

```yaml
on: push
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: hv-actions/checkout@v1
      - run: |
          date > generated.txt
          git config user.name github-actions
          git config user.email github-actions@github.com
          git add .
          git commit -m "generated"
          git push
```

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
