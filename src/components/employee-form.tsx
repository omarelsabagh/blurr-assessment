import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';

type EmployeeFormData = Omit<Employee, 'id'> & { id?: string };

export type Employee = {
  id: string;
  employee_id: string;
  name: string;
  position: string;
  department: string;
  status: string;
  joining_date: string;
  basic_salary: number;
  created_at?: string;
  updated_at?: string;
};

type EmployeeFormProps = {
  employee?: Employee;
  onSuccess: () => void;
};

export default function EmployeeForm({ employee, onSuccess }: EmployeeFormProps) {
  const [formData, setFormData] = useState<EmployeeFormData>(() => ({
    id: employee?.id || '',
    employee_id: employee?.employee_id || '',
    name: employee?.name || '',
    position: employee?.position || '',
    department: employee?.department || '',
    status: employee?.status || 'Active',
    joining_date: employee?.joining_date || format(new Date(), 'yyyy-MM-dd'),
    basic_salary: employee?.basic_salary || 0,
  }));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = employee?.id ? `/api/employees/${employee.id}` : '/api/employees';
      const method = employee?.id ? 'PUT' : 'POST';

      // Create request data without id for new employees
      const requestData = employee?.id 
        ? formData 
        : {
            employee_id: formData.employee_id,
            name: formData.name,
            position: formData.position,
            department: formData.department,
            status: formData.status,
            joining_date: formData.joining_date,
            basic_salary: formData.basic_salary,
          };

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Could not save employee');
      }

      onSuccess();
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
            value={formData.employee_id}
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
          value={formData.name}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Position</label>
        <input
          name="position"
          value={formData.position}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Department</label>
        <input
          name="department"
          value={formData.department}
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
          value={formData.joining_date}
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
          value={formData.basic_salary}
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
          value={formData.status}
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
        className="cursor-pointer"
      >
        {loading ? 'Saving...' : employee ? 'Update Employee' : 'Add Employee'}
      </Button>
    </form>
  );
} 