export type Task = {
  id: string;
  name: string;
  description: string;
  dateCreated: number;
  status: "Open" | "Closed";
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

export const initialData: KanbanData = {
  tasks: {
    "task-1": {
      id: "task-1",
      name: "Create Kanban",
      description: "We should create the kanban",
      dateCreated: 1676109636394,
      status: "Closed",
    },
    "task-2": {
      id: "task-2",
      name: "Fix Kanban",
      description: "Fix whatever is wrong with the kanban",
      dateCreated: 1676109636394,
      status: "Open",
    },
    "task-3": {
      id: "task-3",
      name: "Use Kanban",
      description: "Use the Kanban until we cannot",
      dateCreated: 1676109636394,
      status: "Open",
    },
    "task-4": {
      id: "task-4",
      name: "Delete Kanban",
      description: "Delete the kanban.",
      dateCreated: 1676109636394,
      status: "Open",
    },
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "Inbox",
      taskIds: ["task-1", "task-2", "task-3", "task-4"],
    },
    "column-2": {
      id: "column-2",
      title: "Todo List",
      taskIds: [],
    },
  },
  columnOrder: ["column-1", "column-2"],
};
