# Personal workspace

Each person keeps their own private work. The app opens on today. A project holds every todo filed in it, whether or not that todo is planned onto a day.

## Language

**User**:
A person who signs in. A user owns exactly one workspace.
_Avoid_: Account, member

**Workspace**:
The private work of one user. No other user can see or change it.
_Avoid_: Account, team, organisation

**Project**:
A named list of todos in a workspace. Projects form a flat list. The user creates them, names them, and orders them. A project holds all of its todos.
_Avoid_: Client, folder, tag, area

**Todo**:
A single named piece of work. It belongs to exactly one project. It is open or completed.
_Avoid_: Task, item, issue, subtask

**Open**:
Not completed. An open todo is planned onto at most one day, or onto no day at all.
_Avoid_: Active, pending

**Completed**:
Done. A completed todo stays in its project and is planned onto no day.
_Avoid_: Archived, cancelled

**Day**:
A calendar date an open todo can be planned onto. There is no due date.
_Avoid_: Deadline, schedule, dashboard

**Today**:
The current day. The app opens on today.
_Avoid_: Dashboard
