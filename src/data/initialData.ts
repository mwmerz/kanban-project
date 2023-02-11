export type Task = {
  id: string;
  content: string;
};

export type Column = {
  id: string;
  title: string;
  taskIds: string[];
};

export type ColumnOrder = string[];

export type KanbanData = {
  tasks: { [key: string]: Task };
  columns: { [key: string]: Column };
  columnOrder: ColumnOrder;
};

export const initialData = {
  tasks: {
    "task-1": { id: "task-1", content: "Create Kanban" },
    "task-2": { id: "task-2", content: "Fix Kanban" },
    "task-3": { id: "task-3", content: "Use Kanban" },
    "task-4": { id: "task-4", content: "Delete Kanban" },
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "Todo List",
      taskIds: ["task-1", "task-2", "task-3", "task-4"],
    },
  },
  columnOrder: ["column-1"],
};
