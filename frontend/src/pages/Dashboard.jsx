import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await api.get('/tasks');
                // If member, filter to only show their assigned tasks or tasks from projects they belong to
                // For simplicity, we filter by assignee if MEMBER
                let allTasks = res.data;
                if (user.role === 'MEMBER') {
                    allTasks = allTasks.filter(t => t.assignee?.id === parseInt(user.id));
                }
                setTasks(allTasks);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [user]);

    if (loading) return <div>Loading dashboard...</div>;

    const stats = {
        total: tasks.length,
        todo: tasks.filter(t => t.status === 'TODO').length,
        inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
        done: tasks.filter(t => t.status === 'DONE').length,
        overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'DONE').length
    };

    return (
        <div>
            <h1 className="mb-4">Welcome back, {user.name}!</h1>
            
            <div className="grid grid-cols-4 mb-4">
                <div className="card text-center">
                    <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Total Tasks</div>
                    <h2>{stats.total}</h2>
                </div>
                <div className="card text-center" style={{ borderTop: '4px solid var(--primary)' }}>
                    <div className="flex items-center justify-center gap-2 text-muted mb-2"><FiClock /> In Progress</div>
                    <h2>{stats.inProgress}</h2>
                </div>
                <div className="card text-center" style={{ borderTop: '4px solid var(--secondary)' }}>
                    <div className="flex items-center justify-center gap-2 text-muted mb-2"><FiCheckCircle /> Completed</div>
                    <h2>{stats.done}</h2>
                </div>
                <div className="card text-center" style={{ borderTop: '4px solid var(--danger)' }}>
                    <div className="flex items-center justify-center gap-2 text-muted mb-2"><FiAlertCircle /> Overdue</div>
                    <h2>{stats.overdue}</h2>
                </div>
            </div>

            <div className="card mt-4">
                <h3 className="mb-4">Recent Overdue/Pending Tasks</h3>
                {tasks.length === 0 ? (
                    <div className="text-center text-muted py-4">No tasks found.</div>
                ) : (
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '0.75rem' }}>Task</th>
                                <th style={{ padding: '0.75rem' }}>Status</th>
                                <th style={{ padding: '0.75rem' }}>Due Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.filter(t => t.status !== 'DONE').slice(0, 5).map(task => (
                                <tr key={task.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '0.75rem' }}>{task.title}</td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <span className={`badge badge-${task.status === 'IN_PROGRESS' ? 'progress' : 'todo'}`}>
                                            {(task.status || 'TODO').replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td style={{ padding: '0.75rem', color: new Date(task.dueDate) < new Date() ? 'var(--danger)' : 'inherit' }}>
                                        {task.dueDate}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
