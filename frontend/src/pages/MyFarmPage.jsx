import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation';
import { mockAdvice } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';
import { updateTaskStatus, getCropTasks } from '../services/firebase';
import { speakTextInLanguage } from '../services/voice';

const MyFarmPage = () => {
  const navigate = useNavigate();
  const { translate, getLanguageCode } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, [currentDate]);

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      // TODO: Get actual user crop type and region
      const cropType = 'tomato';
      const region = 'Maharashtra';
      
      const cropTasks = await getCropTasks(cropType, region, currentDate);
      setTasks(cropTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTask = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      const newStatus = !task.completed;
      
      // Update in Firebase
      await updateTaskStatus(taskId, newStatus);
      
      // Update local state
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, completed: newStatus } : task
        )
      );
      
      // Speak confirmation
      const confirmationText = newStatus ? 
        translate('farm.taskCompleted') : 
        translate('farm.taskUncompleted');
      await speakTextInLanguage(confirmationText, getLanguageCode());
      
    } catch (error) {
      console.error('Error updating task:', error);
    }
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

  const days = generateCalendarDays();

  return (
    <div className="kisan-container">
      {/* Header */}
      <div className="kisan-header">
        <button onClick={() => navigate('/')} className="mr-4">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1>{translate('farm.myFarm')}</h1>
        <div className="text-sm">🌾</div>
      </div>

      {/* Today's Advice */}
      <div className="px-4 mb-6">
        <h3 className="text-lg font-semibold text-green-800 mb-4">
          {translate('farm.todaysAdvice')}
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
                    {advice.category}
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
          {translate('farm.upcomingTasks')}
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
          {translate('farm.dailyTasks')}
        </h3>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
            <p className="text-gray-600">{translate('system.pleaseWait')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="kisan-task-item">
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                    task.completed 
                      ? 'bg-green-600 border-green-600 text-white' 
                      : 'bg-white border-gray-300 hover:border-green-400'
                  }`}
                >
                  {task.completed && <Check className="w-4 h-4" />}
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
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default MyFarmPage;