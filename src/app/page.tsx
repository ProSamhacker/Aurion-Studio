import React, { useState, useEffect } from 'react';
import { Video, Wand2, Search, Plus, LayoutTemplate, Settings, FolderOpen, Home, UserCircle, MoreVertical, Play, Trash2, Edit2 } from 'lucide-react';

// Project Management
interface Project {
  id: string;
  name: string;
  thumbnail: string;
  lastEdited: Date;
  duration: number;
  videoUrl?: string;
  script?: string;
  audioUrl?: string;
  captions?: any[];
}

const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [newProjectName, setNewProjectName] = useState('');

  // Load projects from localStorage
  useEffect(() => {
    const loadProjects = () => {
      const savedProjects = localStorage.getItem('aura-projects');
      if (savedProjects) {
        const parsed = JSON.parse(savedProjects);
        setProjects(parsed.map((p: any) => ({
          ...p,
          lastEdited: new Date(p.lastEdited)
        })));
      }
    };
    loadProjects();
  }, []);

  const handleCreateNew = () => {
    const newProject: Project = {
      id: Math.random().toString(36).substring(7),
      name: `Untitled Project ${projects.length + 1}`,
      thumbnail: '',
      lastEdited: new Date(),
      duration: 0
    };
    
    const updatedProjects = [newProject, ...projects];
    setProjects(updatedProjects);
    localStorage.setItem('aura-projects', JSON.stringify(updatedProjects));
    
    // Navigate to project (in real app, use router)
    window.location.href = `/project/${newProject.id}`;
  };

  const handleOpenProject = (projectId: string) => {
    window.location.href = `/project/${projectId}`;
  };

  const handleDeleteProject = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this project? This cannot be undone.')) {
      const updatedProjects = projects.filter(p => p.id !== projectId);
      setProjects(updatedProjects);
      localStorage.setItem('aura-projects', JSON.stringify(updatedProjects));
      
      // Also delete project-specific data
      localStorage.removeItem(`aura-project-${projectId}`);
    }
  };

  const handleRenameProject = (projectId: string, newName: string) => {
    const updatedProjects = projects.map(p => 
      p.id === projectId ? { ...p, name: newName } : p
    );
    setProjects(updatedProjects);
    localStorage.setItem('aura-projects', JSON.stringify(updatedProjects));
    setEditingProject(null);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (hours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <div className="flex h-screen bg-[#0E0E0E] text-white font-sans">
      
      {/* Sidebar */}
      <div className="w-64 border-r border-[#1f1f1f] flex flex-col p-4 shrink-0">
        <div className="flex items-center gap-2 mb-8 px-2 text-purple-500 font-bold text-xl tracking-wider">
          <Video className="w-6 h-6" /> AURA
        </div>

        <nav className="space-y-1 flex-1">
          <SidebarItem icon={Home} label="Home" active />
          <SidebarItem icon={LayoutTemplate} label="Templates" />
          <SidebarItem icon={FolderOpen} label="Folders" />
          <SidebarItem icon={Settings} label="Settings" />
        </nav>

        <div className="mt-auto pt-4 border-t border-[#1f1f1f]">
          <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-lg w-full transition">
            <UserCircle className="w-5 h-5" />
            <span>My Account</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        
        {/* Header */}
        <header className="h-16 border-b border-[#1f1f1f] flex items-center justify-between px-8 sticky top-0 bg-[#0E0E0E]/80 backdrop-blur-md z-10">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search projects..." 
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-1.5 rounded-full text-xs font-bold hover:opacity-90 transition">
              Upgrade Plan
            </button>
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs border border-purple-500/30">
              S
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-8 max-w-7xl mx-auto space-y-10">
          
          {/* Welcome Section */}
          <div>
            <h1 className="text-3xl font-bold mb-6">Good to see you again</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Create Button */}
              <button 
                onClick={handleCreateNew}
                className="group relative h-48 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-700 p-6 flex flex-col justify-between overflow-hidden hover:scale-[1.01] transition-all duration-300 shadow-2xl shadow-purple-900/20"
              >
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 group-hover:bg-white text-white group-hover:text-purple-600 transition-colors">
                    <Plus className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Create a new video</h2>
                  <p className="text-purple-100/80 mt-1">Start from scratch</p>
                </div>
                <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
              </button>

              {/* AI Button */}
              <button 
                onClick={handleCreateNew}
                className="group relative h-48 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] hover:border-purple-500/50 p-6 flex flex-col justify-between overflow-hidden hover:scale-[1.01] transition-all duration-300"
              >
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mb-4 text-purple-400">
                    <Wand2 className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Create with AI</h2>
                  <p className="text-gray-400 mt-1">Auto-compose using your own media</p>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Projects */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Your videos</h2>
              {projects.length > 0 && (
                <span className="text-sm text-gray-500">{projects.length} projects</span>
              )}
            </div>

            {projects.length === 0 ? (
              <div className="text-center py-16 text-gray-600">
                <Video className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="text-sm">No projects yet. Create your first video!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {projects.map((project) => (
                  <div key={project.id} className="group cursor-pointer">
                    <div 
                      onClick={() => handleOpenProject(project.id)}
                      className="aspect-video bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] group-hover:border-purple-500/50 overflow-hidden relative mb-3 transition"
                    >
                      {project.thumbnail ? (
                        <img src={project.thumbnail} alt={project.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-blue-900/20">
                          <Video className="w-8 h-8 text-gray-600" />
                        </div>
                      )}
                      
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition backdrop-blur-sm">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition">
                          <Play className="w-4 h-4 text-black ml-0.5" />
                        </div>
                      </div>
                      
                      {project.duration > 0 && (
                        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded text-xs text-white">
                          {Math.floor(project.duration / 60)}:{(Math.floor(project.duration % 60)).toString().padStart(2, '0')}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-start justify-between px-1">
                      <div className="flex-1 min-w-0">
                        {editingProject === project.id ? (
                          <input
                            type="text"
                            defaultValue={project.name}
                            autoFocus
                            onBlur={(e) => handleRenameProject(project.id, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleRenameProject(project.id, e.currentTarget.value);
                              }
                              if (e.key === 'Escape') {
                                setEditingProject(null);
                              }
                            }}
                            className="w-full bg-[#1a1a1a] text-sm text-white px-2 py-1 rounded border border-purple-500 focus:outline-none"
                          />
                        ) : (
                          <>
                            <h3 className="font-medium text-sm text-gray-200 group-hover:text-purple-400 transition truncate">
                              {project.name}
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Edited {formatDate(project.lastEdited)}
                            </p>
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingProject(project.id);
                          }}
                          className="p-1 text-gray-500 hover:text-white hover:bg-[#1a1a1a] rounded transition"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteProject(project.id, e)}
                          className="p-1 text-gray-500 hover:text-red-400 hover:bg-[#1a1a1a] rounded transition"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

function SidebarItem({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
      active 
        ? 'bg-purple-600/10 text-purple-400 border border-purple-500/10' 
        : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
    }`}>
      <Icon className={`w-5 h-5 ${active ? 'text-purple-400' : 'text-gray-500'}`} />
      {label}
    </button>
  );
}

export default Dashboard;