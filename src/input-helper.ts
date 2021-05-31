import * as core from '@actions/core'
import * as fsHelper from './fs-helper'
import * as github from '@actions/github'
import * as path from 'path'
import {IGitSourceSettings} from './git-source-settings'
import * as yaml from 'js-yaml'

export function getInputs(): IGitSourceSettings[] {
  var repositoriesSettingsList = new Array<IGitSourceSettings>()
  var repositories =
    core.getInput('repositories') || '- ' + process.env['GITHUB_REPOSITORY']
  core.debug(`Repositories = '${repositories}'`)
  //var repositoriesList = repositories.split("\n")
  var repositoriesYaml = yaml.safeLoad(repositories)
  core.debug(`Repositories List = '${repositoriesYaml}'`)

  for (let repo of repositoriesYaml) {
    var result = ({} as unknown) as IGitSourceSettings
    core.debug(`Downloading repo = '${repo}'`)
    // GitHub workspace
    let githubWorkspacePath = process.env['GITHUB_WORKSPACE']
    if (!githubWorkspacePath) {
      throw new Error('GITHUB_WORKSPACE not defined')
    }
    githubWorkspacePath = path.resolve(githubWorkspacePath)
    core.debug(`GITHUB_WORKSPACE = '${githubWorkspacePath}'`)
    fsHelper.directoryExistsSync(githubWorkspacePath, true)

    // Qualified repository
    var ref = ''
    if (repo.includes('@')) {
      var qualifiedRepository = repo.split('@')[0]
      ref = repo.split('@')[1]
    } else {
      var qualifiedRepository = repo
    }

    core.debug(`qualified repository = '${qualifiedRepository}'`)
    var splitRepository = qualifiedRepository.split('/')
    if (
      splitRepository.length !== 2 ||
      !splitRepository[0] ||
      !splitRepository[1]
    ) {
      throw new Error(
        `Invalid repository '${qualifiedRepository}'. Expected format {owner}/{repo}.`
      )
    }
    result.repositoryOwner = splitRepository[0]
    result.repositoryName = splitRepository[1]

    // Repository path
    var parentRepositoryPath = core.getInput('path') || '.'
    if(!parentRepositoryPath.endsWith("/")){
      parentRepositoryPath = parentRepositoryPath + "/"
    }
    result.repositoryPath = parentRepositoryPath + splitRepository[1]
    result.repositoryPath = path.resolve(
      githubWorkspacePath,
      result.repositoryPath
    )
    if (
      !(result.repositoryPath + path.sep).startsWith(
        githubWorkspacePath + path.sep
      )
    ) {
      throw new Error(
        `Repository path '${result.repositoryPath}' is not under '${githubWorkspacePath}'`
      )
    }
    core.debug(`Custom Repository Path: '${result.repositoryPath}'`)

    // Workflow repository?
    if (ref === '') {
      var isWorkflowRepository =
        qualifiedRepository.toUpperCase() ===
        `${github.context.repo.owner}/${github.context.repo.repo}`.toUpperCase()

      // Source branch, source version
      result.ref = core.getInput('ref')
      if (!result.ref) {
        if (isWorkflowRepository) {
          result.ref = github.context.ref
          result.commit = github.context.sha

          // Some events have an unqualifed ref. For example when a PR is merged (pull_request closed event),
          // the ref is unqualifed like "main" instead of "refs/heads/main".
          if (result.commit && result.ref && !result.ref.startsWith('refs/')) {
            result.ref = `refs/heads/${result.ref}`
          }
        }
      }
      // SHA?
      else if (result.ref.match(/^[0-9a-fA-F]{40}$/)) {
        result.commit = result.ref
        result.ref = ''
      }
    } else {
      result.ref = ref
    }
    core.debug(`ref = '${result.ref}'`)
    core.debug(`commit = '${result.commit}'`)

    // Clean
    result.clean = (core.getInput('clean') || 'true').toUpperCase() === 'TRUE'
    core.debug(`clean = ${result.clean}`)

    // Fetch depth
    result.fetchDepth = Math.floor(Number(core.getInput('fetch-depth') || '1'))
    if (isNaN(result.fetchDepth) || result.fetchDepth < 0) {
      result.fetchDepth = 0
    }
    core.debug(`fetch depth = ${result.fetchDepth}`)

    // LFS
    result.lfs = (core.getInput('lfs') || 'false').toUpperCase() === 'TRUE'
    core.debug(`lfs = ${result.lfs}`)

    // Submodules
    result.submodules = false
    result.nestedSubmodules = false
    var submodulesString = (core.getInput('submodules') || '').toUpperCase()
    if (submodulesString == 'RECURSIVE') {
      result.submodules = true
      result.nestedSubmodules = true
    } else if (submodulesString == 'TRUE') {
      result.submodules = true
    }
    core.debug(`submodules = ${result.submodules}`)
    core.debug(`recursive submodules = ${result.nestedSubmodules}`)

    // Auth token
    result.authToken = core.getInput('token', {required: true})

    // SSH
    result.sshKey = core.getInput('ssh-key')
    result.sshKnownHosts = core.getInput('ssh-known-hosts')
    result.sshStrict =
      (core.getInput('ssh-strict') || 'true').toUpperCase() === 'TRUE'

    // Persist credentials
    result.persistCredentials =
      (core.getInput('persist-credentials') || 'false').toUpperCase() === 'TRUE'

    repositoriesSettingsList.push(result)
  }
  return repositoriesSettingsList
}
