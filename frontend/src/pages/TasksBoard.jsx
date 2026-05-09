import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

const TasksBoard = () => {
    const { user } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [newTask, setNewTask] = useState({ title: '', description: '', status: 'TODO', priority: 'MEDIUM', dueDate: '', projectId: '', assigneeId: '' });
    
    useEffect(() => {
        fetchTasks();
        fetchProjects();
        if (user.role === 'ADMIN') {
            fetchUsers();
        }
    }, [user]);

    const fetchTasks = async () => {
        try {
            const res = await api.get('/tasks');
            let allTasks = res.data;
            if (user.role === 'MEMBER') {
                allTasks = allTasks.filter(t => t.assignee?.id === parseInt(user.id));
            }
            setTasks(allTasks);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchProjects = async () => {
        try {
            const res = await api.get('/projects');
            setProjects(res.data);
            if (res.data.length > 0) {
                setNewTask(prev => ({ ...prev, projectId: res.data[0].id }));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const taskPayload = { ...newTask };
            if (user.role === 'MEMBER') {
                taskPayload.assigneeId = user.id;
            }
            await api.post('/tasks', taskPayload);
            setNewTask({ ...newTask, title: '', description: '', dueDate: '', assigneeId: '' });
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await api.put(`/tasks/${taskId}`, { status: newStatus });
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/tasks/${id}`);
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const renderColumn = (status, title) => {
        const columnTasks = tasks.filter(t => t.status === status);
        return (
            <div className="card" style={{ background: 'var(--bg-color)' }}>
                <h3 className="mb-4 text-center">{title} ({columnTasks.length})</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {columnTasks.map(task => (
                        <div key={task.id} className="card" style={{ padding: '1rem' }}>
                            <h4>{task.title}</h4>
                            <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>{task.description}</p>
                            
                            <div className="flex justify-between items-center mb-2">
                                <span className={`badge badge-${task.priority === 'HIGH' ? 'danger' : 'progress'}`}>{task.priority}</span>
                                <span style={{ fontSize: '0.75rem', color: new Date(task.dueDate) < new Date() ? 'var(--danger)' : 'var(--text-muted)' }}>
                                    {task.dueDate}
                                </span>
                            </div>

                            {task.project && (
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                    Project: {task.project.projectName}
                                </div>
                            )}

                            <div className="mt-4 flex gap-2">
                                <select 
                                    className="form-select" 
                                    style={{ padding: '0.25rem', fontSize: '0.875rem' }}
                                    value={task.status}
                                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                >
                                    <option value="TODO">To Do</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="DONE">Done</option>
                                </select>

                                {user.role === 'ADMIN' && (
                                    <button className="btn btn-danger" style={{ padding: '0.25rem 0.5rem' }} onClick={() => handleDelete(task.id)}>
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {columnTasks.length === 0 && <div className="text-center text-muted py-4">No tasks</div>}
                </div>
            </div>
        );
    };

    return (
        <div>
            <h1 className="mb-4">Task Board</h1>

            <div className="card mb-4">
                <h3>Create New Task</h3>
                    <form onSubmit={handleCreate} className="grid grid-cols-3 mt-4 gap-4">
                        <input type="text" placeholder="Task Title" className="form-input" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} required />
                        <input type="text" placeholder="Description" className="form-input" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} required />
                        <input type="date" className="form-input" value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} required />
                        
                        <select className="form-select" value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}>
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                        </select>

                        <select className="form-select" value={newTask.projectId} onChange={e => setNewTask({...newTask, projectId: e.target.value})} required>
                            <option value="" disabled>Select Project</option>
                            {projects.map(p => <option key={p.id} value={p.id}>{p.projectName}</option>)}
                        </select>

                        {user.role === 'ADMIN' && (
                            <select className="form-select" value={newTask.assigneeId} onChange={e => setNewTask({...newTask, assigneeId: e.target.value})}>
                                <option value="" disabled>Assign to Team Member</option>
                                {users.filter(u => u.role === 'MEMBER').map(u => (
                                    <option key={u.id} value={u.id}>{u.name}</option>
                                ))}
                            </select>
                        )}

                        <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 3' }}>Create Task</button>
                    </form>
                </div>

            <div className="grid grid-cols-3">
                {renderColumn('TODO', 'To Do')}
                {renderColumn('IN_PROGRESS', 'In Progress')}
                {renderColumn('DONE', 'Done')}
            </div>
        </div>
    );
};

export default TasksBoard;
