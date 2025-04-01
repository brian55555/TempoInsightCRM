import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
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
  businessId = "",
  tasks: initialTasks = [],
}: TasksTabProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch tasks from Supabase
  useEffect(() => {
    const fetchTasks = async () => {
      if (!businessId) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("tasks")
          .select("*")
          .eq("business_id", businessId)
          .order("due_date");

        if (error) throw error;

        // Transform the data to match our Task interface
        const transformedData = data.map((task) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          dueDate: task.due_date,
          priority: task.priority as "low" | "medium" | "high",
          status: task.status as "pending" | "in-progress" | "completed",
          assignedTo: task.assigned_to,
        }));

        setTasks(transformedData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [businessId]);

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

  const handleAddTask = async () => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .insert({
          title: newTask.title,
          description: newTask.description,
          due_date: newTask.dueDate,
          priority: newTask.priority,
          status: newTask.status,
          assigned_to: newTask.assignedTo,
          business_id: businessId,
        })
        .select()
        .single();

      if (error) throw error;

      // Add the new task to our state
      const taskToAdd: Task = {
        id: data.id,
        title: data.title,
        description: data.description,
        dueDate: data.due_date,
        priority: data.priority as "low" | "medium" | "high",
        status: data.status as "pending" | "in-progress" | "completed",
        assignedTo: data.assigned_to,
      };

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
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleEditTask = async () => {
    if (editingTask) {
      try {
        const { error } = await supabase
          .from("tasks")
          .update({
            title: editingTask.title,
            description: editingTask.description,
            due_date: editingTask.dueDate,
            priority: editingTask.priority,
            status: editingTask.status,
            assigned_to: editingTask.assignedTo,
          })
          .eq("id", editingTask.id);

        if (error) throw error;

        // Update the task in our state
        setTasks(
          tasks.map((task) =>
            task.id === editingTask.id ? editingTask : task,
          ),
        );
        setEditingTask(null);
        setIsEditDialogOpen(false);
      } catch (error) {
        console.error("Error editing task:", error);
      }
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", id);

      if (error) throw error;

      // Remove the task from our state
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleToggleStatus = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const newStatus = task.status === "completed" ? "pending" : "completed";

    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      // Update the task status in our state
      setTasks(
        tasks.map((task) => {
          if (task.id === id) {
            return {
              ...task,
              status: newStatus,
            };
          }
          return task;
        }),
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    }
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
