[![Build and Test](https://github.com/hv-actions/checkout/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/hv-actions/checkout/actions/workflows/test.yml)

# Hitachi Vantara Checkout v2


Note: This Action is an improved version based on Github Checkout V2 to allow checking out multiple repositories at once.

# What's new compared to Github Checkout V2

- Checkout multiple repositories into the given path or $GITHUB_WORKSPACE/repository-name
- Takes the list in YAML format.

Refer [here](https://github.com/actions/checkout/blob/v2/README.md) for Github Checkout V2 documentation.

# Usage

<!-- start usage -->
```yaml
- uses: hv-actions/checkout@v2
  with:
    # List of Repository names with owner to checkout. For example, - actions/checkout
    # - actions/slack-action
    # Default: - ${{ github.repository }}

    repositories: |
      - hv-actions/slack-action@v1
      - hv-actions/aws-action

    # The branch, tag or SHA to checkout. When checking out the repository that
    # triggered a workflow, this defaults to the reference or SHA for that event.
    # Otherwise, uses the default branch.
    # Avoided if used '@' in the repositories section otherwise uses default branch 
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

- [Hitachi Vantara Checkout v2](#hitachi-vantara-checkout-v2)
- [What's new compared to Github Checkout V2](#whats-new-compared-to-github-checkout-v2)
- [Usage](#usage)
- [Scenarios](#scenarios)
  - [Checkout multiple repos (at once)](#checkout-multiple-repos-at-once)
- [License](#license)

## Checkout multiple repos (at once)

```yaml
- name: Checkout
  uses: hv-actions/checkout@v2
  with:
    repositories: |
      - hv-actions/action-1
      - hv-actions/action-2
    path: main
```



# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
