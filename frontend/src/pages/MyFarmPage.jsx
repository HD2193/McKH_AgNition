import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle, Circle } from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation';
import { mockAdvice, mockTasks } from '../data/mockData';

const MyFarmPage = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState(mockTasks);

  const toggleTask = (taskId) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const monthNamesHindi = [
    'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
    'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
  ];

  const days = generateCalendarDays();

  return (
    <div className="kisan-container">
      {/* Header */}
      <div className="kisan-header">
        <button onClick={() => navigate('/')} className="mr-4">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1>My Farm</h1>
        <div className="text-sm">मेरा खेत</div>
      </div>

      {/* Today's Advice */}
      <div className="px-4 mb-6">
        <h3 className="text-lg font-semibold text-green-800 mb-4">
          Today's Advice
          <span className="block text-sm text-gray-600 font-normal">आज की सलाह</span>
        </h3>
        
        <div className="space-y-4">
          {mockAdvice.map((advice) => (
            <div key={advice.id} className="bg-white rounded-xl p-4 shadow-md">
              <div className="flex items-start gap-3">
                <div className="text-3xl">{advice.image}</div>
                <div className="flex-1">
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${
                    advice.priority === 'high' ? 'bg-red-100 text-red-800' :
                    advice.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {advice.category} • {advice.categoryHindi}
                  </div>
                  
                  <h4 className="font-semibold text-green-800 mb-1">{advice.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{advice.titleHindi}</p>
                  <p className="text-sm text-gray-700 mb-1">{advice.description}</p>
                  <p className="text-xs text-gray-500">{advice.descriptionHindi}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar */}
      <div className="px-4 mb-6">
        <h3 className="text-lg font-semibold text-green-800 mb-4">
          Upcoming Tasks
          <span className="block text-sm text-gray-600 font-normal">आने वाले कार्य</span>
        </h3>
        
        <div className="kisan-calendar">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <h4 className="font-semibold text-green-800">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h4>
              <p className="text-sm text-gray-600">{monthNamesHindi[currentDate.getMonth()]}</p>
            </div>
            
            <button 
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          {/* Calendar Days Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <div key={index} className="text-center text-sm font-medium text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => (
              <div
                key={index}
                className={`text-center p-2 rounded-lg text-sm ${
                  day === null ? '' :
                  isToday(day) ? 'bg-green-600 text-white font-bold' :
                  'hover:bg-gray-100 cursor-pointer'
                }`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Tasks */}
      <div className="px-4 mb-20">
        <h3 className="text-lg font-semibold text-green-800 mb-4">
          Daily Tasks
          <span className="block text-sm text-gray-600 font-normal">दैनिक कार्य</span>
        </h3>
        
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="kisan-task-item">
              <button
                onClick={() => toggleTask(task.id)}
                className="kisan-task-checkbox"
              >
                {task.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
              </button>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.category}
                  </span>
                  <span className="text-xs text-gray-500">{task.time}</span>
                </div>
                
                <h4 className={`kisan-task-text ${task.completed ? 'line-through opacity-60' : ''}`}>
                  {task.title}
                </h4>
                <p className={`text-sm text-gray-600 ${task.completed ? 'line-through opacity-60' : ''}`}>
                  {task.titleHindi}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default MyFarmPage;