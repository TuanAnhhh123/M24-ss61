import { useEffect, useState } from 'react';
import './Todolist.css';
import axios from 'axios';

interface Jobs {
  id: number;
  name: string;
  status: string;
}

export default function Todolist() {
  const [jobs, setJobs] = useState<Jobs[]>([]);
  const [newJobName, setNewJobName] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    axios.get("http://localhost:8080/jobs")
      .then(response => {
        console.log("giá trị trả về", response);
        setJobs(response.data);
      })
      .catch(err => console.log(err));
  }, []);

  const addJob = () => {
    if (newJobName.trim()) {
      const newJob = { id: Date.now(), name: newJobName, status: 'in-progress' };
      axios.post("http://localhost:8080/jobs", newJob)
        .then(response => {
          setJobs([...jobs, newJob]);
          setNewJobName('');
        })
        .catch(err => console.log(err));
    }
  };

  const toggleJobStatus = (id: number) => {
    const updatedJobs = jobs.map(job =>
      job.id === id ? { ...job, status: job.status === 'completed' ? 'in-progress' : 'completed' } : job
    );
    setJobs(updatedJobs);

    const jobToUpdate = updatedJobs.find(job => job.id === id);
    axios.put(`http://localhost:8080/jobs/${id}`, jobToUpdate)
      .catch(err => console.log(err));
  };

  const deleteJob = (id: number) => {
    setJobs(jobs.filter(job => job.id !== id));
    axios.delete(`http://localhost:8080/jobs/${id}`)
      .catch(err => console.log(err));
  };

  const filteredJobs = jobs.filter(job => {
    if (filter === 'all') return true;
    return job.status === filter;
  });

  return (
    <div className="todolist">
      <h1>Quản lí công việc</h1>
      <input
        type="text"
        placeholder="Nhập tên công việc"
        value={newJobName}
        onChange={(e) => setNewJobName(e.target.value)}
      /><br />
      <button onClick={addJob}>Thêm công việc</button>
      <div className="filter-buttons">
        <button onClick={() => setFilter('all')}>Tất cả</button>
        <button onClick={() => setFilter('completed')}>Hoàn thành</button>
        <button onClick={() => setFilter('in-progress')}>Đang thực hiện</button>
      </div>
      <ul>
        {filteredJobs.map(job => (
          <li key={job.id}>
            <input
              type="checkbox"
              checked={job.status === 'completed'}
              onChange={() => toggleJobStatus(job.id)}
            />
            {job.name}
            <button className="edit">Sửa</button>
            <button className="delete" onClick={() => deleteJob(job.id)}>Xóa</button>
          </li>
        ))}
      </ul>
      <div className="delete-buttons">
        <button onClick={() => setJobs(jobs.filter(job => job.status !== 'completed'))}>
          Xóa công việc hoàn thành
        </button>
        <button onClick={() => setJobs([])}>
          Xóa tất cả công việc
        </button>
      </div>
    </div>
  );
}
