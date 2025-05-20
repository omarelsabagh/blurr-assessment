"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ProjectForm } from "@/components/project-form";
import { useProjects } from "@/hooks/use-projects";
import { Project } from "@/types";

export function ProjectList() {
  const router = useRouter();
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const {
    projects,
    loading,
    error,
    fetchProjects,
    addProject,
    updateProject,
    deleteProject,
  } = useProjects();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleAddProject = async (project: Partial<Project>) => {
    try {
      await addProject(project);
      setShowProjectForm(false);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleEditProject = async (project: Partial<Project>) => {
    if (!editingProject?.id) return;
    try {
      await updateProject(editingProject.id, project);
      setEditingProject(null);
      setShowProjectForm(false);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProject(projectId);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button
          onClick={() => {
            setEditingProject(null);
            setShowProjectForm(true);
          }}
          className="cursor-pointer"
        >
          Add Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push(`/projects/${project.id}`)}
          >
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">{project.description}</p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingProject(project);
                    setShowProjectForm(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProject(project.id);
                  }}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={showProjectForm}
        onClose={() => {
          setShowProjectForm(false);
          setEditingProject(null);
        }}
        title={editingProject ? "Edit Project" : "Add Project"}
      >
        <ProjectForm
          project={editingProject}
          onSubmit={editingProject ? handleEditProject : handleAddProject}
          onCancel={() => {
            setShowProjectForm(false);
            setEditingProject(null);
          }}
        />
      </Modal>
    </div>
  );
} 