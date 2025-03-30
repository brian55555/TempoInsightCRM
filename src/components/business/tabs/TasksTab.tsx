import React, { useState } from "react";
import {
  PlusCircle,
  Calendar,
  Clock,
  Edit,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed";
  assignedTo?: string;
}

interface TasksTabProps {
  businessId?: string;
  tasks?: Task[];
}

const TasksTab = ({
  businessId = "123",
  tasks: initialTasks,
}: TasksTabProps) => {
  const [tasks, setTasks] = useState<Task[]>(
    initialTasks || [
      {
        id: "1",
        title: "Schedule initial meeting",
        description: "Set up a call to discuss partnership opportunities",
        dueDate: "2023-06-15",
        priority: "high",
        status: "completed",
        assignedTo: "John Doe",
      },
      {
        id: "2",
        title: "Send proposal document",
        description:
          "Prepare and send the business proposal with pricing details",
        dueDate: "2023-06-20",
        priority: "medium",
        status: "in-progress",
        assignedTo: "Jane Smith",
      },
      {
        id: "3",
        title: "Follow up on contract",
        description: "Check status of contract review by legal team",
        dueDate: "2023-06-25",
        priority: "low",
        status: "pending",
        assignedTo: "Mike Johnson",
      },
    ],
  );

  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    status: "pending",
    assignedTo: "",
  });

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleAddTask = () => {
    const taskToAdd = {
      ...newTask,
      id: Date.now().toString(),
    } as Task;

    setTasks([...tasks, taskToAdd]);
    setNewTask({
      title: "",
      description: "",
      dueDate: "",
      priority: "medium",
      status: "pending",
      assignedTo: "",
    });
    setIsAddDialogOpen(false);
  };

  const handleEditTask = () => {
    if (editingTask) {
      setTasks(
        tasks.map((task) => (task.id === editingTask.id ? editingTask : task)),
      );
      setEditingTask(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            status: task.status === "completed" ? "pending" : "completed",
          };
        }
        return task;
      }),
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-orange-500";
      case "low":
        return "text-green-500";
      default:
        return "";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "";
    }
  };

  return (
    <div className="w-full p-4 bg-white rounded-md shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title">Title</label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  placeholder="Task title"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="description">Description</label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  placeholder="Task description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="dueDate">Due Date</label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) =>
                      setNewTask({ ...newTask, dueDate: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="priority">Priority</label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value) =>
                      setNewTask({
                        ...newTask,
                        priority: value as "low" | "medium" | "high",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <label htmlFor="assignedTo">Assigned To</label>
                <Input
                  id="assignedTo"
                  value={newTask.assignedTo}
                  onChange={(e) =>
                    setNewTask({ ...newTask, assignedTo: e.target.value })
                  }
                  placeholder="Assignee name"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddTask}>Add Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No tasks found. Create a new task to get started.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 border rounded-lg ${task.status === "completed" ? "bg-gray-50" : "bg-white"}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.status === "completed"}
                    onCheckedChange={() => handleToggleStatus(task.id)}
                  />
                  <div className="space-y-1">
                    <h3
                      className={`font-medium ${task.status === "completed" ? "line-through text-gray-500" : ""}`}
                    >
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-600">{task.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="inline-flex items-center text-xs gap-1">
                        <Calendar className="h-3 w-3" />
                        {task.dueDate
                          ? format(new Date(task.dueDate), "MMM d, yyyy")
                          : "No due date"}
                      </span>
                      <span
                        className={`inline-flex items-center text-xs gap-1 ${getPriorityColor(task.priority)}`}
                      >
                        <Clock className="h-3 w-3" />
                        {task.priority.charAt(0).toUpperCase() +
                          task.priority.slice(1)}{" "}
                        Priority
                      </span>
                      {task.assignedTo && (
                        <span className="inline-flex items-center text-xs gap-1">
                          <span className="h-4 w-4 rounded-full bg-gray-200 flex items-center justify-center text-[10px]">
                            {task.assignedTo.charAt(0)}
                          </span>
                          {task.assignedTo}
                        </span>
                      )}
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${getStatusBadgeColor(task.status)}`}
                      >
                        {task.status === "completed"
                          ? "Completed"
                          : task.status === "in-progress"
                            ? "In Progress"
                            : "Pending"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingTask(task);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Task Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="edit-title">Title</label>
                <Input
                  id="edit-title"
                  value={editingTask.title}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, title: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-description">Description</label>
                <Textarea
                  id="edit-description"
                  value={editingTask.description}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="edit-dueDate">Due Date</label>
                  <Input
                    id="edit-dueDate"
                    type="date"
                    value={editingTask.dueDate}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        dueDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="edit-priority">Priority</label>
                  <Select
                    value={editingTask.priority}
                    onValueChange={(value) =>
                      setEditingTask({
                        ...editingTask,
                        priority: value as "low" | "medium" | "high",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-status">Status</label>
                <Select
                  value={editingTask.status}
                  onValueChange={(value) =>
                    setEditingTask({
                      ...editingTask,
                      status: value as "pending" | "in-progress" | "completed",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-assignedTo">Assigned To</label>
                <Input
                  id="edit-assignedTo"
                  value={editingTask.assignedTo || ""}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      assignedTo: e.target.value,
                    })
                  }
                  placeholder="Assignee name"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditTask}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TasksTab;
