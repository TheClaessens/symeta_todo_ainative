// PROTOTYPE. In-memory model for "what should today look like?" on /prototype/today.

export interface Project {
  id: string;
  name: string;
}

export interface Todo {
  id: string;
  title: string;
  projectId: string;
  plannedDay: string | null;
  isCompleted: boolean;
}

export interface TodayVariant {
  id: 'A' | 'B' | 'C';
  name: string;
}

export const TODAY_VARIANTS: Array<TodayVariant> = [
  { id: 'A', name: 'Grouped cards' },
  { id: 'B', name: 'Project columns' },
  { id: 'C', name: 'Flat agenda' },
];

export const toIso = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

const parseIso = (iso: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/u.exec(iso);
  if (!match) throw new Error(`Bad day: ${iso}`);
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
};

export const addDays = (iso: string, amount: number) => {
  const date = parseIso(iso);
  date.setDate(date.getDate() + amount);
  return toIso(date);
};

export const formatDay = (iso: string) =>
  parseIso(iso).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });

export const TODAY = toIso(new Date());

export const SEED_PROJECTS: Array<Project> = [
  { id: 'symeta', name: 'Symeta' },
  { id: 'faktion', name: 'Faktion' },
  { id: 'colruyt', name: 'Colruyt Group' },
  { id: 'personal', name: 'Personal' },
];

export const SEED_TODOS: Array<Todo> = [
  {
    id: 'drive',
    title: 'Clean up hard drive',
    projectId: 'symeta',
    plannedDay: TODAY,
    isCompleted: false,
  },
  {
    id: 'contract',
    title: 'Review contract',
    projectId: 'symeta',
    plannedDay: addDays(TODAY, -2),
    isCompleted: false,
  },
  {
    id: 'workshop',
    title: 'Create workshop presentation',
    projectId: 'faktion',
    plannedDay: TODAY,
    isCompleted: false,
  },
  {
    id: 'invoice',
    title: 'Send invoice',
    projectId: 'faktion',
    plannedDay: addDays(TODAY, 3),
    isCompleted: false,
  },
  {
    id: 'status',
    title: 'Prepare status update',
    projectId: 'colruyt',
    plannedDay: TODAY,
    isCompleted: false,
  },
  {
    id: 'gift',
    title: 'Buy a birthday gift',
    projectId: 'personal',
    plannedDay: null,
    isCompleted: false,
  },
  {
    id: 'wireframe',
    title: 'Todo wireframe',
    projectId: 'symeta',
    plannedDay: null,
    isCompleted: true,
  },
  {
    id: 'email',
    title: 'Send out email',
    projectId: 'faktion',
    plannedDay: null,
    isCompleted: true,
  },
];

export const todosForDay = (todos: Array<Todo>, day: string, today: string) =>
  todos.filter((todo) => {
    if (todo.isCompleted || !todo.plannedDay) return false;
    if (day === today) return todo.plannedDay <= day;
    return todo.plannedDay === day;
  });

const demo = () => {
  const today = '2026-10-05';
  const todos: Array<Todo> = [
    {
      id: 'earlier',
      title: 'Earlier',
      projectId: 'p',
      plannedDay: '2026-10-03',
      isCompleted: false,
    },
    {
      id: 'today',
      title: 'Today',
      projectId: 'p',
      plannedDay: today,
      isCompleted: false,
    },
    {
      id: 'future',
      title: 'Future',
      projectId: 'p',
      plannedDay: '2026-10-08',
      isCompleted: false,
    },
    {
      id: 'loose',
      title: 'Loose',
      projectId: 'p',
      plannedDay: null,
      isCompleted: false,
    },
    {
      id: 'done',
      title: 'Done',
      projectId: 'p',
      plannedDay: today,
      isCompleted: true,
    },
  ];
  const onToday = todosForDay(todos, today, today).map((todo) => todo.id);
  const onFuture = todosForDay(todos, '2026-10-08', today).map(
    (todo) => todo.id
  );
  if (onToday.join() !== 'earlier,today') {
    throw new Error(`today filter: ${onToday.join()}`);
  }
  if (onFuture.join() !== 'future') {
    throw new Error(`future filter: ${onFuture.join()}`);
  }
};

demo();
