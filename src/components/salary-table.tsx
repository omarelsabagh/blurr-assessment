import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { Pencil, Save } from 'lucide-react';

type SalaryRecord = {
  id: string;
  employee_id: string;
  name: string;
  basic_salary: number;
  bonus: number;
  deductible: number;
  month: number;
  year: number;
};

type SalaryTableProps = {
  employees: Array<{
    id: string;
    employee_id: string;
    name: string;
    basic_salary: number;
  }>;
};

export default function SalaryTable({ employees }: SalaryTableProps) {
  const [selectedMonth, setSelectedMonth] = useState(() => format(new Date(), 'yyyy-MM'));
  const [salaryRecords, setSalaryRecords] = useState<SalaryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingStates, setEditingStates] = useState<Record<string, boolean>>({});
  const [savingStates, setSavingStates] = useState<Record<string, boolean>>({});
  const [tempValues, setTempValues] = useState<Record<string, { bonus: number; deductible: number }>>({});

  // Generate months for the last 12 months
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return format(date, 'yyyy-MM');
  });

  useEffect(() => {
    fetchSalaryRecords();
  }, [selectedMonth]);

  const fetchSalaryRecords = async () => {
    try {
      const [year, month] = selectedMonth.split('-');
      const data = await fetch(`/api/salaries?year=${year}&month=${month}`);
      if (!data.ok) {
        throw new Error('Failed to fetch salary records');
      }
      const records = await data.json();
      setSalaryRecords(records);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching salary records:', error);
      setError('Failed to load salary records');
      setLoading(false);
    }
  };

  const handleEdit = (employeeId: string) => {
    const record = salaryRecords.find(r => r.employee_id === employeeId);
    if (!record) return;

    // Store current values in temp state
    setTempValues(prev => ({
      ...prev,
      [employeeId]: {
        bonus: record.bonus,
        deductible: record.deductible
      }
    }));
    setEditingStates(prev => ({ ...prev, [employeeId]: true }));
  };

  const handleCancel = (employeeId: string) => {
    // Restore original values
    setSalaryRecords(prev => prev.map(record => 
      record.employee_id === employeeId
        ? {
            ...record,
            bonus: tempValues[employeeId]?.bonus ?? record.bonus,
            deductible: tempValues[employeeId]?.deductible ?? record.deductible
          }
        : record
    ));
    setEditingStates(prev => ({ ...prev, [employeeId]: false }));
    setTempValues(prev => {
      const newState = { ...prev };
      delete newState[employeeId];
      return newState;
    });
  };

  const handleInputChange = (employeeId: string, field: 'bonus' | 'deductible', value: number) => {
    // Ensure value is a valid number, default to 0 if NaN
    const safeValue = isNaN(value) ? 0 : value;
    setSalaryRecords(prev => prev.map(record => 
      record.employee_id === employeeId
        ? { ...record, [field]: safeValue }
        : record
    ));
  };

  const handleSave = async (employeeId: string) => {
    const record = salaryRecords.find(r => r.employee_id === employeeId);
    if (!record) return;

    setSavingStates(prev => ({ ...prev, [employeeId]: true }));
    try {
      const [year, month] = selectedMonth.split('-');

      const res = await fetch('/api/salaries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee_id: employeeId,
          year: parseInt(year),
          month: parseInt(month),
          bonus: record.bonus,
          deductible: record.deductible
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Failed to save salary record:', errorData);
        throw new Error('Failed to save salary record');
      }
      
      setEditingStates(prev => ({ ...prev, [employeeId]: false }));
      setTempValues(prev => {
        const newState = { ...prev };
        delete newState[employeeId];
        return newState;
      });
    } catch (err) {
      console.error('Error saving salary:', err);
      setError('Could not save salary record');
      // Restore original values on error
      handleCancel(employeeId);
    } finally {
      setSavingStates(prev => ({ ...prev, [employeeId]: false }));
    }
  };

  // Initialize salary records for employees who don't have one for the selected month
  useEffect(() => {
    const existingEmployeeIds = new Set(salaryRecords.map(r => r.employee_id));
    const newRecords = employees
      .filter(emp => !existingEmployeeIds.has(emp.employee_id))
      .map(emp => ({
        id: '',
        employee_id: emp.employee_id,
        name: emp.name,
        basic_salary: emp.basic_salary,
        bonus: 0,
        deductible: 0,
        month: parseInt(selectedMonth.split('-')[1]),
        year: parseInt(selectedMonth.split('-')[0])
      }));

    if (newRecords.length > 0) {
      setSalaryRecords(prev => [...prev, ...newRecords]);
    }
  }, [employees, salaryRecords, selectedMonth]);

  const calculateTotal = (record: SalaryRecord) => {
    const basic = isNaN(record.basic_salary) ? 0 : record.basic_salary;
    const bonus = isNaN(record.bonus) ? 0 : record.bonus;
    const deductible = isNaN(record.deductible) ? 0 : record.deductible;
    return basic + bonus - deductible;
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Salary Details</CardTitle>
            <CardDescription>Manage employee salary records for the selected month</CardDescription>
          </div>
          <Select
            value={selectedMonth}
            onValueChange={setSelectedMonth}
          >
            <SelectTrigger className="w-[180px] cursor-pointer">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {months.map(month => (
                <SelectItem key={month} value={month} className="cursor-pointer">
                  {format(new Date(month + '-01'), 'MMMM yyyy')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading salary records...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Basic Salary</TableHead>
                <TableHead>Bonus</TableHead>
                <TableHead>Deductible</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salaryRecords.map((record) => {
                const isEditing = editingStates[record.employee_id];
                const isSaving = savingStates[record.employee_id];
                return (
                  <TableRow key={record.employee_id}>
                    <TableCell className="font-medium">{record.employee_id}</TableCell>
                    <TableCell>{record.name}</TableCell>
                    <TableCell>${record.basic_salary.toLocaleString()}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        value={record.bonus}
                        onChange={(e) => handleInputChange(record.employee_id, 'bonus', parseFloat(e.target.value) || 0)}
                        className="w-32"
                        disabled={!isEditing || isSaving}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        value={record.deductible}
                        onChange={(e) => handleInputChange(record.employee_id, 'deductible', parseFloat(e.target.value) || 0)}
                        className="w-32"
                        disabled={!isEditing || isSaving}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      ${calculateTotal(record).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSave(record.employee_id)}
                            disabled={isSaving}
                            className="cursor-pointer"
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancel(record.employee_id)}
                            disabled={isSaving}
                            className="cursor-pointer"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(record.employee_id)}
                          className="cursor-pointer"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
} 