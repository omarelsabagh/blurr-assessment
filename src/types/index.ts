export interface Project {
  id: string;
  title: string;
  description?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  status: "backlog" | "todo" | "in_progress" | "completed";
  project_id: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: string;
  employee_id: string;
  name: string;
  position: string;
  department: string;
  status: string;
  joining_date: string;
  basic_salary: number;
  created_at: string;
  updated_at: string;
} 