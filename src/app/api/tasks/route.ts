import { NextRequest, NextResponse } from 'next/server';
import { TaskService } from '@/services/task.service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId') || undefined;

    const tasks = await TaskService.getTasks(projectId);
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { title, description, priority, status, project_id, assigned_to } = data;

    if (!title || !project_id) {
      return NextResponse.json(
        { error: 'Title and project_id are required' },
        { status: 400 }
      );
    }

    const task = await TaskService.createTask({
      title,
      description,
      priority,
      status,
      project_id,
      assigned_to,
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
} 