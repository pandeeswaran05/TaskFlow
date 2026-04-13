import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../Context/Authcontext';
import { useToast } from '../../Context/ToastContext';

import StatsRow from './Stats';
import TaskTable from './Table';
import Toolbar from './Tools';
import Modal from '../model/Model';
import ProfilePanel from '../panals/Profile';
import SettingsPanel from '../panals/Settings';
import Header from '../navbar/Navbar';

import {
  getTasksAPI,
  createTaskAPI,
  updateTaskAPI,
  deleteTaskAPI,
} from '../../utils/Api';

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [allTasks, setAllTasks] = useState([]);
  const [statsTasks, setStatsTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [activeTab, setActiveTab] = useState('');

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);

  // Panels
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // 🔄 Fetch filtered tasks
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (filterCategory) params.category = filterCategory;
      if (filterStatus) params.status = filterStatus;
      if (filterPriority) params.priority = filterPriority;

      const res = await getTasksAPI(params);
      setAllTasks(res.data);
    } catch (err) {
      console.error('Failed to load tasks', err);
      toast('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [search, filterCategory, filterStatus, filterPriority, toast]);

  // 📊 Fetch stats data
  const fetchStats = useCallback(async () => {
    try {
      const res = await getTasksAPI();
      setStatsTasks(res.data);
    } catch (err) {
      console.error('Failed to load stats', err);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, fetchTasks]);

  useEffect(() => {
    if (user) fetchStats();
  }, [user, allTasks.length, fetchStats]);

  // 🧠 Tabs logic
  const handleTabChange = (val) => {
    setActiveTab(val);

    const categoryOptions = ['Development', 'Design', 'Testing', 'Research'];
    const statusOptions = ['Pending', 'In Progress', 'Completed'];

    if (val === '') {
      setFilterCategory('');
      setFilterStatus('');
    } else if (categoryOptions.includes(val)) {
      setFilterCategory(val);
      setFilterStatus('');
    } else if (statusOptions.includes(val)) {
      setFilterStatus(val);
      setFilterCategory('');
    }
  };

  // ✏️ Modal handlers
  const handleOpenModal = (task = null) => {
    setEditTask(task);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditTask(null);
  };

  // 💾 Save task
  const handleSaveTask = async (formData) => {
    try {
      if (editTask) {
        await updateTaskAPI(editTask.id || editTask._id, formData);
        toast('Task updated! ✓');
      } else {
        await createTaskAPI(formData);
        toast('Task created! ✓');
      }

      handleCloseModal();
      fetchTasks();
    } catch (err) {
      toast(err.response?.data?.error || 'Failed to save task');
      throw err;
    }
  };

  // ❌ Delete task
  const handleDeleteTask = async (task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) return;

    try {
      await deleteTaskAPI(task.id || task._id);
      toast('Task deleted!');
      fetchTasks();
    } catch {
      toast('Failed to delete task');
    }
  };

  return (
    <>
      <Header
        onEnrollStudent={() => handleOpenModal()} // you can rename this prop later
        onOpenProfile={() => setProfileOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <div className="container">
        <StatsRow tasks={statsTasks} />

        <Toolbar
          search={search}
          onSearch={setSearch}
          filterCategory={filterCategory}
          onFilterCategory={(v) => {
            setFilterCategory(v);
            setActiveTab(v || '');
          }}
          filterStatus={filterStatus}
          onStatusChange={(v) => {
            setFilterStatus(v);
            setActiveTab(v || '');
          }}
          priority={filterPriority}
          onPriorityChange={(v) => {
            setFilterPriority(v);
            setActiveTab(v || '');
          }}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        <TaskTable
          tasks={allTasks}
          onEdit={handleOpenModal}
          onDelete={handleDeleteTask}
          loading={loading}
        />

        <div className="mini-footer">
          <span>Developed by Pandeeswaran</span>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        editTask={editTask}
      />

      <ProfilePanel
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
      />

      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
};

export default Dashboard;