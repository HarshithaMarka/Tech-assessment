import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

const ProjectsPage = () => {
    const { user } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newProject, setNewProject] = useState({ projectName: '', description: '' });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await api.get('/projects');
            setProjects(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/projects', newProject);
            setNewProject({ projectName: '', description: '' });
            fetchProjects();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/projects/${id}`);
            fetchProjects();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div>Loading projects...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1>Projects</h1>
            </div>

            {user.role === 'ADMIN' && (
                <div className="card mb-4">
                    <h3>Create New Project</h3>
                    <form onSubmit={handleCreate} className="flex gap-4 mt-4">
                        <input
                            type="text"
                            placeholder="Project Name"
                            className="form-input"
                            value={newProject.projectName}
                            onChange={e => setNewProject({ ...newProject, projectName: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            className="form-input"
                            value={newProject.description}
                            onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                            required
                        />
                        <button type="submit" className="btn btn-primary flex items-center gap-2" style={{ whiteSpace: 'nowrap' }}>
                            <FiPlus /> Create
                        </button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-3">
                {projects.map(project => (
                    <div key={project.id} className="card flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h3 style={{ margin: 0 }}>{project.projectName}</h3>
                                {user.role === 'ADMIN' && (
                                    <button onClick={() => handleDelete(project.id)} className="btn btn-danger" style={{ padding: '0.25rem 0.5rem' }}>
                                        <FiTrash2 />
                                    </button>
                                )}
                            </div>
                            <p className="text-muted">{project.description}</p>
                        </div>
                        <div className="mt-4">
                            <span className="badge badge-progress">
                                {project.tasks?.length || 0} Tasks
                            </span>
                        </div>
                    </div>
                ))}
                {projects.length === 0 && <div className="text-muted">No projects available.</div>}
            </div>
        </div>
    );
};

export default ProjectsPage;
