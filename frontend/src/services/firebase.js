// Firebase Services for Tasks and Calendar Management
// TODO: Add Firebase configuration to .env

const FIREBASE_CONFIG = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// TODO: Initialize Firebase
// import { initializeApp } from 'firebase/app';
// import { getFirestore } from 'firebase/firestore';
// const app = initializeApp(FIREBASE_CONFIG);
// const db = getFirestore(app);

/**
 * Update task completion status
 * @param {string} taskId - Task ID
 * @param {boolean} isDone - Completion status
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Updated task
 */
export const updateTaskStatus = async (taskId, isDone, userId = 'default_user') => {
  try {
    if (!FIREBASE_CONFIG.apiKey) {
      console.warn('Firebase not configured, using local storage');
      return updateTaskStatusLocal(taskId, isDone);
    }

    // TODO: Replace with actual Firebase Firestore call
    /*
    const taskRef = doc(db, 'users', userId, 'tasks', taskId);
    await updateDoc(taskRef, {
      completed: isDone,
      completedAt: isDone ? new Date() : null,
      updatedAt: new Date()
    });
    */

    // For now, use local storage
    return updateTaskStatusLocal(taskId, isDone);
    
  } catch (error) {
    console.error('Error updating task status:', error);
    return updateTaskStatusLocal(taskId, isDone);
  }
};

/**
 * Get crop-specific tasks based on crop type, region, and date
 * @param {string} cropType - Type of crop
 * @param {string} region - Region/location
 * @param {Date} date - Date for tasks
 * @param {string} userId - User ID
 * @returns {Promise<Array>} List of tasks
 */
export const getCropTasks = async (cropType, region, date, userId = 'default_user') => {
  try {
    if (!FIREBASE_CONFIG.apiKey) {
      console.warn('Firebase not configured, using mock data');
      return getMockCropTasks(cropType, region, date);
    }

    // TODO: Replace with actual Firebase Firestore call
    /*
    const tasksRef = collection(db, 'users', userId, 'tasks');
    const q = query(
      tasksRef,
      where('cropType', '==', cropType),
      where('region', '==', region),
      where('date', '==', date.toISOString().split('T')[0]),
      orderBy('priority', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const tasks = [];
    querySnapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() });
    });
    return tasks;
    */

    // For now, use mock data
    return getMockCropTasks(cropType, region, date);
    
  } catch (error) {
    console.error('Error fetching crop tasks:', error);
    return getMockCropTasks(cropType, region, date);
  }
};

/**
 * Save user's farming calendar
 * @param {string} userId - User ID
 * @param {Object} calendarData - Calendar data
 * @returns {Promise<Object>} Saved calendar
 */
export const saveFarmingCalendar = async (userId, calendarData) => {
  try {
    if (!FIREBASE_CONFIG.apiKey) {
      console.warn('Firebase not configured, using local storage');
      return saveFarmingCalendarLocal(userId, calendarData);
    }

    // TODO: Replace with actual Firebase Firestore call
    /*
    const calendarRef = doc(db, 'users', userId, 'calendar', 'farming');
    await setDoc(calendarRef, {
      ...calendarData,
      updatedAt: new Date()
    });
    */

    // For now, use local storage
    return saveFarmingCalendarLocal(userId, calendarData);
    
  } catch (error) {
    console.error('Error saving farming calendar:', error);
    return saveFarmingCalendarLocal(userId, calendarData);
  }
};

/**
 * Get user's farming calendar
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Farming calendar
 */
export const getFarmingCalendar = async (userId = 'default_user') => {
  try {
    if (!FIREBASE_CONFIG.apiKey) {
      console.warn('Firebase not configured, using local storage');
      return getFarmingCalendarLocal(userId);
    }

    // TODO: Replace with actual Firebase Firestore call
    /*
    const calendarRef = doc(db, 'users', userId, 'calendar', 'farming');
    const docSnap = await getDoc(calendarRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    */

    // For now, use local storage
    return getFarmingCalendarLocal(userId);
    
  } catch (error) {
    console.error('Error fetching farming calendar:', error);
    return getFarmingCalendarLocal(userId);
  }
};

// Local storage fallback functions
const updateTaskStatusLocal = (taskId, isDone) => {
  const tasks = JSON.parse(localStorage.getItem('kisan_tasks') || '[]');
  const updatedTasks = tasks.map(task => 
    task.id === taskId ? { ...task, completed: isDone } : task
  );
  localStorage.setItem('kisan_tasks', JSON.stringify(updatedTasks));
  return updatedTasks.find(task => task.id === taskId);
};

const saveFarmingCalendarLocal = (userId, calendarData) => {
  localStorage.setItem(`kisan_calendar_${userId}`, JSON.stringify(calendarData));
  return calendarData;
};

const getFarmingCalendarLocal = (userId) => {
  const calendar = localStorage.getItem(`kisan_calendar_${userId}`);
  return calendar ? JSON.parse(calendar) : null;
};

/**
 * Mock crop tasks for development
 * @param {string} cropType - Type of crop
 * @param {string} region - Region
 * @param {Date} date - Date
 * @returns {Array} Mock tasks
 */
const getMockCropTasks = (cropType, region, date) => {
  const taskTemplates = {
    'tomato': [
      { title: 'Check for early blight', titleHindi: 'अर्ली ब्लाइट की जांच करें', priority: 'high', category: 'Disease Prevention' },
      { title: 'Water the plants', titleHindi: 'पौधों को पानी दें', priority: 'medium', category: 'Irrigation' },
      { title: 'Apply organic fertilizer', titleHindi: 'जैविक खाद डालें', priority: 'low', category: 'Fertilization' }
    ],
    'wheat': [
      { title: 'Monitor for rust disease', titleHindi: 'रस्ट रोग की निगरानी करें', priority: 'high', category: 'Disease Prevention' },
      { title: 'Check soil moisture', titleHindi: 'मिट्टी की नमी जांचें', priority: 'medium', category: 'Irrigation' },
      { title: 'Weed control', titleHindi: 'खरपतवार नियंत्रण', priority: 'medium', category: 'Maintenance' }
    ],
    'rice': [
      { title: 'Maintain water level', titleHindi: 'पानी का स्तर बनाए रखें', priority: 'high', category: 'Irrigation' },
      { title: 'Check for stem borer', titleHindi: 'स्टेम बोरर की जांच करें', priority: 'medium', category: 'Pest Control' },
      { title: 'Apply urea fertilizer', titleHindi: 'यूरिया खाद डालें', priority: 'low', category: 'Fertilization' }
    ]
  };

  const templates = taskTemplates[cropType.toLowerCase()] || taskTemplates['tomato'];
  
  return templates.map((template, index) => ({
    id: `task_${cropType}_${index}`,
    ...template,
    time: `${6 + index * 2}:00 AM`,
    completed: Math.random() > 0.5,
    date: date.toISOString().split('T')[0],
    cropType: cropType,
    region: region
  }));
};