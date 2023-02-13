export type Task = {
  id: string;
  name: string;
  description: string;
  dateCreated: number;
  status: "Open" | "Closed";
  archived: boolean;
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
  tasks: {},
  columns: {
    "column-1": {
      id: "column-1",
      title: "Inbox",
      taskIds: [],
    },
  },
  columnOrder: ["column-1"],
};
