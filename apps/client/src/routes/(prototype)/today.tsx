// PROTOTYPE. Verdict: A, with each project group drawn as a card. B and C stay for the record.

import { useCallback, useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';

import PrototypeSwitcher from '@/components/prototype/prototype-switcher';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import {
  addDays,
  formatDay,
  type Project,
  SEED_PROJECTS,
  SEED_TODOS,
  TODAY,
  TODAY_VARIANTS,
  type Todo,
  todosForDay,
} from './today-model';

interface VariantProps {
  projects: Array<Project>;
  todos: Array<Todo>;
  viewedDay: string;
  onViewDay: (day: string) => void;
  onComplete: (id: string) => void;
  onReopen: (id: string) => void;
  onAdd: (title: string, projectId: string, plannedDay: string | null) => void;
  onPlan: (id: string, plannedDay: string | null) => void;
}

const shiftDay = (day: string, amount: number) => {
  const next = addDays(day, amount);
  return next < TODAY ? TODAY : next;
};

const DayNav = ({
  viewedDay,
  onViewDay,
  isHero = false,
}: {
  viewedDay: string;
  onViewDay: (day: string) => void;
  isHero?: boolean;
}) => (
  <div className='flex items-center gap-3'>
    <button
      type='button'
      className={cn(buttonVariants({ variant: 'outline', size: 'icon' }))}
      aria-label='Previous day'
      disabled={viewedDay <= TODAY}
      onClick={() => {
        onViewDay(shiftDay(viewedDay, -1));
      }}>
      ←
    </button>
    <div className={isHero ? 'text-center' : ''}>
      <p className='text-sm text-muted-foreground'>
        {viewedDay === TODAY ? 'Today' : 'Upcoming'}
      </p>
      <p
        className={isHero ? 'text-3xl font-semibold' : 'text-lg font-semibold'}>
        {formatDay(viewedDay)}
      </p>
    </div>
    <button
      type='button'
      className={cn(buttonVariants({ variant: 'outline', size: 'icon' }))}
      aria-label='Next day'
      onClick={() => {
        onViewDay(shiftDay(viewedDay, 1));
      }}>
      →
    </button>
  </div>
);

const AddForm = ({
  projects,
  projectId,
  plannedDay,
  onAdd,
  className,
}: {
  projects: Array<Project>;
  projectId?: string;
  plannedDay: string | null;
  onAdd: VariantProps['onAdd'];
  className?: string;
}) => {
  const [title, setTitle] = useState('');
  const [chosenProjectId, setChosenProjectId] = useState(
    projectId ?? projects[0]?.id ?? ''
  );

  return (
    <form
      className={cn('flex flex-wrap items-center gap-2', className)}
      onSubmit={(event) => {
        event.preventDefault();
        onAdd(title, projectId ?? chosenProjectId, plannedDay);
        setTitle('');
      }}>
      <label className='min-w-48 flex-1'>
        <span className='sr-only'>Todo title</span>
        <input
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
          placeholder='Add a todo'
          className='h-9 w-full rounded-md border bg-transparent px-3 text-sm'
        />
      </label>
      {!projectId && (
        <label>
          <span className='sr-only'>Project</span>
          <select
            value={chosenProjectId}
            onChange={(event) => {
              setChosenProjectId(event.target.value);
            }}
            className='h-9 rounded-md border bg-transparent px-2 text-sm'>
            {projects.map((project) => (
              <option
                key={project.id}
                value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </label>
      )}
      <button
        type='submit'
        className={cn(buttonVariants({ size: 'sm' }))}>
        Add
      </button>
    </form>
  );
};

const PlanControls = ({
  todo,
  onPlan,
}: {
  todo: Todo;
  onPlan: VariantProps['onPlan'];
}) => (
  <div className='flex items-center gap-2'>
    {!!todo.plannedDay && todo.plannedDay < TODAY && (
      <span className='text-xs text-muted-foreground'>
        From {formatDay(todo.plannedDay)}
      </span>
    )}
    <input
      type='date'
      aria-label={`Planned day for ${todo.title}`}
      value={todo.plannedDay ?? ''}
      className='h-8 rounded-md border bg-transparent px-2 text-sm'
      onChange={(event) => {
        if (event.target.value) onPlan(todo.id, event.target.value);
      }}
    />
    <button
      type='button'
      className='text-sm text-muted-foreground underline-offset-4 hover:underline'
      onClick={() => {
        onPlan(todo.id, null);
      }}>
      Clear
    </button>
  </div>
);

const TodoCheck = ({
  todo,
  isDone = false,
  onToggle,
}: {
  todo: Todo;
  isDone?: boolean;
  onToggle: () => void;
}) => (
  <label className='flex min-w-0 flex-1 items-center gap-3'>
    <input
      type='checkbox'
      checked={isDone}
      aria-label={isDone ? `Reopen ${todo.title}` : `Complete ${todo.title}`}
      onChange={onToggle}
    />
    <span
      className={cn(
        'truncate',
        isDone && 'text-muted-foreground line-through'
      )}>
      {todo.title}
    </span>
  </label>
);

const VariantA = ({
  projects,
  todos,
  viewedDay,
  onViewDay,
  onComplete,
  onReopen,
  onAdd,
  onPlan,
}: VariantProps) => {
  const [projectId, setProjectId] = useState<string | null>(null);
  const project = projects.find((item) => item.id === projectId);
  const dayTodos = todosForDay(todos, viewedDay, TODAY);

  return (
    <div className='flex min-h-screen'>
      <aside className='flex w-56 shrink-0 flex-col gap-4 border-r bg-sidebar p-4 text-sidebar-foreground'>
        <button
          type='button'
          className={cn(
            'rounded-md px-3 py-2 text-left text-sm',
            !projectId && 'bg-sidebar-accent'
          )}
          onClick={() => {
            setProjectId(null);
          }}>
          Today
        </button>
        <div className='flex flex-col gap-1'>
          <p className='px-3 text-xs text-muted-foreground'>Projects</p>
          {projects.map((item) => (
            <button
              key={item.id}
              type='button'
              className={cn(
                'rounded-md px-3 py-2 text-left text-sm',
                projectId === item.id && 'bg-sidebar-accent'
              )}
              onClick={() => {
                setProjectId(item.id);
              }}>
              {item.name}
            </button>
          ))}
        </div>
        <p className='mt-auto rounded-md border px-3 py-2 text-sm'>Thomas C</p>
      </aside>
      <main className='flex min-w-0 flex-1 flex-col gap-6 p-8 pb-28'>
        {project ? (
          <>
            <h1 className='text-xl font-semibold'>Todos for {project.name}</h1>
            <AddForm
              projects={projects}
              projectId={project.id}
              plannedDay={null}
              onAdd={onAdd}
            />
            <section className='flex flex-col gap-2'>
              <h2 className='text-sm font-medium'>Open</h2>
              {todos
                .filter(
                  (todo) => todo.projectId === project.id && !todo.isCompleted
                )
                .map((todo) => (
                  <div
                    key={todo.id}
                    className='flex flex-wrap items-center justify-between gap-3 rounded-md border px-3 py-2'>
                    <TodoCheck
                      todo={todo}
                      onToggle={() => {
                        onComplete(todo.id);
                      }}
                    />
                    <PlanControls
                      todo={todo}
                      onPlan={onPlan}
                    />
                  </div>
                ))}
            </section>
            <section className='flex flex-col gap-2'>
              <h2 className='text-sm font-medium'>Completed</h2>
              {todos
                .filter(
                  (todo) => todo.projectId === project.id && todo.isCompleted
                )
                .map((todo) => (
                  <div
                    key={todo.id}
                    className='rounded-md border px-3 py-2'>
                    <TodoCheck
                      todo={todo}
                      isDone
                      onToggle={() => {
                        onReopen(todo.id);
                      }}
                    />
                  </div>
                ))}
            </section>
          </>
        ) : (
          <>
            <div className='flex flex-wrap items-center justify-between gap-4'>
              <h1 className='text-xl font-semibold'>Today</h1>
              <DayNav
                viewedDay={viewedDay}
                onViewDay={onViewDay}
              />
            </div>
            <AddForm
              projects={projects}
              plannedDay={viewedDay}
              onAdd={onAdd}
            />
            {projects.map((item) => {
              const items = dayTodos.filter(
                (todo) => todo.projectId === item.id
              );
              if (!items.length) return null;
              return (
                <section
                  key={item.id}
                  className='flex flex-col gap-3 rounded-md border p-3'>
                  <h2 className='font-medium'>{item.name}</h2>
                  {items.map((todo) => (
                    <div
                      key={todo.id}
                      className='flex flex-wrap items-center justify-between gap-3 border-t pt-3'>
                      <TodoCheck
                        todo={todo}
                        onToggle={() => {
                          onComplete(todo.id);
                        }}
                      />
                      <PlanControls
                        todo={todo}
                        onPlan={onPlan}
                      />
                    </div>
                  ))}
                </section>
              );
            })}
            {!dayTodos.length && (
              <p className='text-sm text-muted-foreground'>Nothing planned.</p>
            )}
          </>
        )}
      </main>
    </div>
  );
};

const VariantB = ({
  projects,
  todos,
  viewedDay,
  onViewDay,
  onComplete,
  onAdd,
  onPlan,
}: VariantProps) => {
  const dayTodos = todosForDay(todos, viewedDay, TODAY);

  return (
    <main className='flex min-h-screen flex-col gap-8 p-8 pb-28'>
      <div className='flex justify-center'>
        <DayNav
          viewedDay={viewedDay}
          onViewDay={onViewDay}
          isHero
        />
      </div>
      <div className='grid items-start gap-4 md:grid-cols-4'>
        {projects.map((project) => {
          const items = dayTodos.filter(
            (todo) => todo.projectId === project.id
          );
          return (
            <section
              key={project.id}
              className='flex flex-col gap-3 rounded-md border p-3'>
              <h2 className='font-medium'>{project.name}</h2>
              {items.map((todo) => (
                <div
                  key={todo.id}
                  className='flex flex-col gap-2 border-t pt-3'>
                  <TodoCheck
                    todo={todo}
                    onToggle={() => {
                      onComplete(todo.id);
                    }}
                  />
                  <PlanControls
                    todo={todo}
                    onPlan={onPlan}
                  />
                </div>
              ))}
              {!items.length && (
                <p className='text-sm text-muted-foreground'>
                  Nothing this day.
                </p>
              )}
              <AddForm
                projects={projects}
                projectId={project.id}
                plannedDay={viewedDay}
                onAdd={onAdd}
                className='flex-col items-stretch'
              />
            </section>
          );
        })}
      </div>
    </main>
  );
};

const VariantC = ({
  projects,
  todos,
  viewedDay,
  onViewDay,
  onComplete,
  onAdd,
  onPlan,
}: VariantProps) => {
  const dayTodos = todosForDay(todos, viewedDay, TODAY);
  const ordered = projects.flatMap((project) =>
    dayTodos
      .filter((todo) => todo.projectId === project.id)
      .map((todo) => ({ todo, project }))
  );

  return (
    <main className='mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-8 p-8 pb-28'>
      <DayNav
        viewedDay={viewedDay}
        onViewDay={onViewDay}
        isHero
      />
      <AddForm
        projects={projects}
        plannedDay={viewedDay}
        onAdd={onAdd}
        className='[&_input]:h-12 [&_input]:text-base'
      />
      <ul className='flex flex-col'>
        {ordered.map(({ todo, project }) => (
          <li
            key={todo.id}
            className='flex flex-wrap items-center justify-between gap-3 border-b py-3'>
            <div className='flex min-w-0 flex-1 flex-col gap-1'>
              <TodoCheck
                todo={todo}
                onToggle={() => {
                  onComplete(todo.id);
                }}
              />
              <span className='pl-7 text-sm text-muted-foreground'>
                {project.name}
              </span>
            </div>
            <PlanControls
              todo={todo}
              onPlan={onPlan}
            />
          </li>
        ))}
      </ul>
      {!ordered.length && (
        <p className='text-sm text-muted-foreground'>Nothing planned.</p>
      )}
    </main>
  );
};

const VARIANTS = {
  A: VariantA,
  B: VariantB,
  C: VariantC,
} as const;

const PrototypeToday = () => {
  const search = useSearch({ from: '/prototype/today' });
  const navigate = useNavigate();
  const variant = search.variant ?? 'A';
  const [projects] = useState(SEED_PROJECTS);
  const [todos, setTodos] = useState(SEED_TODOS);
  const [viewedDay, setViewedDay] = useState(TODAY);
  const onSelect = useCallback(
    async (id: string) => {
      const next = TODAY_VARIANTS.find((item) => item.id === id)?.id ?? 'A';
      await navigate({
        to: '/prototype/today',
        search: { variant: next },
        replace: true,
      });
    },
    [navigate]
  );

  const onComplete = (id: string) => {
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: true, plannedDay: null } : todo
      )
    );
  };
  const onReopen = (id: string) => {
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id
          ? { ...todo, isCompleted: false, plannedDay: TODAY }
          : todo
      )
    );
  };
  const onAdd = (
    title: string,
    projectId: string,
    plannedDay: string | null
  ) => {
    const trimmed = title.trim();
    if (!trimmed || !projectId) return;
    setTodos((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        title: trimmed,
        projectId,
        plannedDay,
        isCompleted: false,
      },
    ]);
  };
  const onPlan = (id: string, plannedDay: string | null) => {
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id && !todo.isCompleted ? { ...todo, plannedDay } : todo
      )
    );
  };

  const Active = VARIANTS[variant];

  return (
    <>
      <Active
        projects={projects}
        todos={todos}
        viewedDay={viewedDay}
        onViewDay={setViewedDay}
        onComplete={onComplete}
        onReopen={onReopen}
        onAdd={onAdd}
        onPlan={onPlan}
      />
      {!import.meta.env.PROD && (
        <details
          open
          className='mx-4 mb-24 max-h-48 overflow-auto rounded-md border bg-background p-3'>
          <summary className='cursor-pointer text-sm'>State</summary>
          <pre className='mt-2 text-[10px] leading-tight'>
            {JSON.stringify(
              { viewedDay, today: TODAY, projects, todos },
              null,
              2
            )}
          </pre>
        </details>
      )}
      <PrototypeSwitcher
        variants={TODAY_VARIANTS}
        current={variant}
        onSelect={onSelect}
      />
    </>
  );
};

export default PrototypeToday;
