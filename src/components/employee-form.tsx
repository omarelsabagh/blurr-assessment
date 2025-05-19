import { useState } from 'react';
import { Button } from "@/components/ui/button";

export type Employee = {
  id?: string;
  employee_id: string;
  name: string;
  position: string;
  department: string;
  status: string;
  joining_date: string;
  basic_salary: number;
};

type EmployeeFormProps = {
  employee?: Employee;
  onSuccess?: () => void;
};

export default function EmployeeForm({ employee, onSuccess }: EmployeeFormProps) {
  const [form, setForm] = useState<Employee>({
    employee_id: employee?.employee_id || '',
    name: employee?.name || '',
    position: employee?.position || '',
    department: employee?.department || '',
    status: employee?.status || 'Active',
    joining_date: employee?.joining_date || new Date().toISOString().split('T')[0],
    basic_salary: employee?.basic_salary || 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        employee?.id ? `/api/employees/${employee.id}` : '/api/employees',
        {
          method: employee?.id ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...form,
            ...(employee?.id ? { employee_id: form.employee_id } : {}),
            joining_date: new Date(form.joining_date).toISOString(),
          }),
        }
      );
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || data.details || 'Failed to save employee');
      }
      
      if (onSuccess) onSuccess();
      setForm({
        employee_id: '',
        name: '',
        position: '',
        department: '',
        status: 'Active',
        joining_date: new Date().toISOString().split('T')[0],
        basic_salary: 0,
      });
    } catch (err) {
      console.error('Error saving employee:', err);
      setError(err instanceof Error ? err.message : 'Could not save employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {employee?.employee_id && (
        <div>
          <label className="block text-sm font-medium mb-1">Employee ID</label>
          <input
            value={form.employee_id}
            className="w-full border rounded px-3 py-2 bg-gray-50"
            disabled
            readOnly
          />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Position</label>
        <input
          name="position"
          value={form.position}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Department</label>
        <input
          name="department"
          value={form.department}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Joining Date</label>
        <input
          type="date"
          name="joining_date"
          value={form.joining_date}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Basic Salary</label>
        <input
          type="number"
          name="basic_salary"
          value={form.basic_salary}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
          min="0"
          step="0.01"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="Active">Active</option>
          <option value="On Leave">On Leave</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Button
        type="submit"
        disabled={loading}
      >
        {loading ? 'Saving...' : employee ? 'Update Employee' : 'Add Employee'}
      </Button>
    </form>
  );
} 