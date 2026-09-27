import type { ProjectStatus, TaskStatus, HealthIndicator, BlockerType, BlockerSeverity, BlockerStatus } from '../types'
import { isManager, isTeamLead, isDeveloper } from './permissions'
import { todayStr } from './reminderEngine'
import { actionScore, UPDATE_VERBS, RAISE_VERBS, RESOLVE_VERBS, SUBMIT_VERBS } from './chatbotIntent'
import { enumField, percentField, optionalTextField, textField, editableProjectField, visibleProjectField, openBlockerField, myTaskField } from './chatbotFields'
import { type ActionSpec, PROJECT_STATUSES, HEALTH_STATES, BLOCKER_TYPES, BLOCKER_SEVERITIES, BLOCKER_STATUSES, TASK_STATUSES } from './chatbotActionTypes'

export const OPS_ACTIONS: ActionSpec[] = [
  {
    id: 'updateProjectStatus',
    description: "update a project's status (for projects you own)",
    match: (q) => actionScore(q, UPDATE_VERBS, [['project', 1], ['status', 1], ['health', 1]]),
    allow: (u) => isManager(u) || isTeamLead(u),
    fields: [
      editableProjectField('projectId', 'Which project?'),
      enumField('status', `What's the new status? (${PROJECT_STATUSES.join(' / ')})`, [...PROJECT_STATUSES]),
      enumField('healthIndicator', `What's the health indicator? (${HEALTH_STATES.join(' / ')})`, [...HEALTH_STATES]),
      percentField('completionPercentage', "What's the completion percentage now? (0-100)"),
      optionalTextField('comments', 'Any comments to add? (or say "skip")'),
    ],
    summarize: (c, ctx) => `Update "${ctx.projects.find((p) => p.id === c.projectId)?.name}": status → ${c.status}, health → ${c.healthIndicator}, completion → ${c.completionPercentage}%${c.comments ? `, comment: "${c.comments}"` : ''}.`,
    execute: (c, ctx) => {
      ctx.updateProject(c.projectId, {
        status: c.status as ProjectStatus,
        healthIndicator: c.healthIndicator as HealthIndicator,
        completionPercentage: Number(c.completionPercentage),
        ...(c.comments ? { comments: c.comments } : {}),
      })
      return `Done — status updated.`
    },
  },
  {
    id: 'raiseBlocker',
    description: 'raise a blocker on a project',
    match: (q) => actionScore(q, RAISE_VERBS, [['blocker', 2], ['issue', 2], ['impediment', 2], ['blocked', 2]]),
    allow: () => true,
    fields: [
      visibleProjectField('projectId', 'Which project is this blocker on?'),
      enumField('blockerType', `What type of blocker? (${BLOCKER_TYPES.join(' / ')})`, [...BLOCKER_TYPES]),
      enumField('severity', `How severe? (${BLOCKER_SEVERITIES.join(' / ')})`, [...BLOCKER_SEVERITIES]),
      textField('description', 'Describe the blocker.'),
    ],
    summarize: (c, ctx) => `Raise ${c.severity} ${c.blockerType} blocker on "${ctx.projects.find((p) => p.id === c.projectId)?.name}": "${c.description}".`,
    execute: (c, ctx) => {
      const project = ctx.projects.find((p) => p.id === c.projectId)!
      ctx.addBlocker({
        projectId: project.id, projectName: project.name, blockerType: c.blockerType as BlockerType,
        severity: c.severity as BlockerSeverity, description: c.description, raisedBy: ctx.currentUser.name,
        raisedDate: todayStr(), assignedOwner: ctx.currentUser.name, eta: '', resolutionNotes: '', status: 'Open',
      })
      return `Done — blocker raised on "${project.name}".`
    },
  },
  {
    id: 'resolveBlocker',
    description: 'update or resolve an open blocker',
    match: (q) => actionScore(q, RESOLVE_VERBS, [['blocker', 2], ['issue', 2]]),
    allow: () => true,
    fields: [
      openBlockerField('blockerId', 'Which blocker?'),
      enumField('status', `What's the new status? (${BLOCKER_STATUSES.join(' / ')})`, [...BLOCKER_STATUSES]),
      optionalTextField('resolutionNotes', 'Any resolution notes? (or say "skip")'),
    ],
    summarize: (c, ctx) => `Update blocker on "${ctx.blockers.find((b) => b.id === c.blockerId)?.projectName}" → ${c.status}.`,
    execute: (c, ctx) => {
      ctx.updateBlocker(c.blockerId, { status: c.status as BlockerStatus, ...(c.resolutionNotes ? { resolutionNotes: c.resolutionNotes } : {}) })
      return `Done — blocker updated to ${c.status}.`
    },
  },
  {
    id: 'submitDailyUpdate',
    description: "submit today's update on one of your tasks",
    match: (q) => actionScore(q, SUBMIT_VERBS, [['task', 1], ['my update', 2], ['daily update', 2], ["today's update", 2], ['my progress', 2]]),
    allow: isDeveloper,
    fields: [
      myTaskField('taskId', 'Which task is this update for?'),
      enumField('status', `What's the task status now? (${TASK_STATUSES.join(' / ')})`, [...TASK_STATUSES]),
      optionalTextField('note', 'Any note for today? (or say "skip")'),
    ],
    summarize: (c, ctx) => `Log today's update on "${ctx.tasks.find((t) => t.id === c.taskId)?.title}": ${c.status}${c.note ? ` — "${c.note}"` : ''}.`,
    execute: (c, ctx) => {
      const today = todayStr()
      const existing = ctx.getDailyUpdate(ctx.currentUser.id, today)
      const entries = (existing?.entries ?? []).filter((e) => e.taskId !== c.taskId)
      entries.push({ taskId: c.taskId, status: c.status as TaskStatus, note: c.note })
      ctx.submitDailyUpdate(ctx.currentUser.id, today, entries, existing?.overallNote)
      return `Done — today's update is submitted.`
    },
  },
]
