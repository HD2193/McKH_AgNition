import json
import os
from typing import Dict, Any, List, Optional
from datetime import datetime, date, timedelta
from models.task import Task, TaskCreate, TaskUpdate

class TaskService:
    def __init__(self, db):
        self.db = db
        
    async def create_task(self, task_data: TaskCreate) -> Task:
        """
        Create a new task
        """
        try:
            task = Task(**task_data.dict())
            task_dict = task.dict()
            
            # Insert into database
            result = await self.db.tasks.insert_one(task_dict)
            task_dict['_id'] = str(result.inserted_id)
            
            return Task(**task_dict)
            
        except Exception as e:
            print(f"Error creating task: {str(e)}")
            raise
    
    async def get_tasks(self, user_id: str, date_filter: Optional[date] = None) -> List[Task]:
        """
        Get tasks for a user, optionally filtered by date
        """
        try:
            query = {"user_id": user_id}
            
            if date_filter:
                query["due_date"] = date_filter.isoformat()
            
            cursor = self.db.tasks.find(query)
            tasks = []
            
            async for task_doc in cursor:
                task_doc['id'] = str(task_doc.pop('_id'))
                tasks.append(Task(**task_doc))
            
            return tasks
            
        except Exception as e:
            print(f"Error fetching tasks: {str(e)}")
            return []
    
    async def update_task(self, task_id: str, task_data: TaskUpdate) -> Optional[Task]:
        """
        Update a task
        """
        try:
            # Prepare update data
            update_data = {k: v for k, v in task_data.dict().items() if v is not None}
            update_data['updated_at'] = datetime.utcnow()
            
            # Update completion timestamp if marking as completed
            if task_data.completed is True:
                update_data['completed_at'] = datetime.utcnow()
            elif task_data.completed is False:
                update_data['completed_at'] = None
            
            # Update in database
            result = await self.db.tasks.update_one(
                {"id": task_id},
                {"$set": update_data}
            )
            
            if result.modified_count > 0:
                # Fetch and return updated task
                task_doc = await self.db.tasks.find_one({"id": task_id})
                if task_doc:
                    task_doc['id'] = str(task_doc.pop('_id'))
                    return Task(**task_doc)
            
            return None
            
        except Exception as e:
            print(f"Error updating task: {str(e)}")
            return None
    
    async def delete_task(self, task_id: str) -> bool:
        """
        Delete a task
        """
        try:
            result = await self.db.tasks.delete_one({"id": task_id})
            return result.deleted_count > 0
            
        except Exception as e:
            print(f"Error deleting task: {str(e)}")
            return False
    
    async def generate_crop_tasks(self, user_id: str, crop_type: str, region: str, target_date: date, language: str = "hi") -> List[Task]:
        """
        Generate crop-specific tasks for a given date
        """
        try:
            # Get existing tasks for the date
            existing_tasks = await self.get_tasks(user_id, target_date)
            
            # Generate new tasks if none exist
            if not existing_tasks:
                task_templates = self._get_task_templates(crop_type, region, language)
                
                for template in task_templates:
                    task_data = TaskCreate(
                        user_id=user_id,
                        title=template["title"],
                        title_hindi=template["title_hindi"],
                        description=template.get("description", ""),
                        description_hindi=template.get("description_hindi", ""),
                        category=template["category"],
                        priority=template["priority"],
                        crop_type=crop_type,
                        due_date=target_date,
                        due_time=template.get("due_time", "08:00")
                    )
                    
                    await self.create_task(task_data)
                
                # Fetch the newly created tasks
                existing_tasks = await self.get_tasks(user_id, target_date)
            
            return existing_tasks
            
        except Exception as e:
            print(f"Error generating crop tasks: {str(e)}")
            return []
    
    def _get_task_templates(self, crop_type: str, region: str, language: str) -> List[Dict]:
        """
        Get task templates based on crop type and region
        """
        # Base task templates by crop type
        task_templates = {
            'tomato': [
                {
                    "title": "Check for early blight symptoms",
                    "title_hindi": "अर्ली ब्लाइट के लक्षण देखें",
                    "description": "Inspect leaves for brown spots and yellowing",
                    "description_hindi": "पत्तियों पर भूरे धब्बे और पीलापन की जांच करें",
                    "category": "Disease Prevention",
                    "priority": "high",
                    "due_time": "07:00"
                },
                {
                    "title": "Water the plants",
                    "title_hindi": "पौधों को पानी दें",
                    "description": "Provide adequate water based on soil moisture",
                    "description_hindi": "मिट्टी की नमी के आधार पर पर्याप्त पानी दें",
                    "category": "Irrigation",
                    "priority": "medium",
                    "due_time": "08:00"
                },
                {
                    "title": "Apply organic fertilizer",
                    "title_hindi": "जैविक खाद डालें",
                    "description": "Apply compost or organic fertilizer around plants",
                    "description_hindi": "पौधों के चारों ओर कंपोस्ट या जैविक खाद डालें",
                    "category": "Fertilization",
                    "priority": "low",
                    "due_time": "16:00"
                }
            ],
            'wheat': [
                {
                    "title": "Monitor for rust disease",
                    "title_hindi": "रस्ट रोग की निगरानी करें",
                    "description": "Check for orange or brown rust spots on leaves",
                    "description_hindi": "पत्तियों पर नारंगी या भूरे रंग के रस्ट धब्बे देखें",
                    "category": "Disease Prevention",
                    "priority": "high",
                    "due_time": "07:00"
                },
                {
                    "title": "Check soil moisture",
                    "title_hindi": "मिट्टी की नमी जांचें",
                    "description": "Ensure adequate moisture for grain development",
                    "description_hindi": "अनाज के विकास के लिए पर्याप्त नमी सुनिश्चित करें",
                    "category": "Irrigation",
                    "priority": "medium",
                    "due_time": "08:00"
                },
                {
                    "title": "Weed control",
                    "title_hindi": "खरपतवार नियंत्रण",
                    "description": "Remove weeds that compete with wheat plants",
                    "description_hindi": "गेहूं के पौधों से प्रतिस्पर्धा करने वाले खरपतवार हटाएं",
                    "category": "Maintenance",
                    "priority": "medium",
                    "due_time": "09:00"
                }
            ],
            'rice': [
                {
                    "title": "Maintain water level",
                    "title_hindi": "पानी का स्तर बनाए रखें",
                    "description": "Ensure 2-3 inches of water in paddy fields",
                    "description_hindi": "धान के खेतों में 2-3 इंच पानी सुनिश्चित करें",
                    "category": "Irrigation",
                    "priority": "high",
                    "due_time": "07:00"
                },
                {
                    "title": "Check for stem borer",
                    "title_hindi": "स्टेम बोरर की जांच करें",
                    "description": "Look for dead hearts in rice plants",
                    "description_hindi": "धान के पौधों में मृत हृदय की तलाश करें",
                    "category": "Pest Control",
                    "priority": "medium",
                    "due_time": "08:00"
                },
                {
                    "title": "Apply urea fertilizer",
                    "title_hindi": "यूरिया खाद डालें",
                    "description": "Apply urea for nitrogen nutrition",
                    "description_hindi": "नाइट्रोजन पोषण के लिए यूरिया डालें",
                    "category": "Fertilization",
                    "priority": "low",
                    "due_time": "16:00"
                }
            ]
        }
        
        # Get templates for the crop, default to tomato if not found
        templates = task_templates.get(crop_type.lower(), task_templates['tomato'])
        
        # TODO: Customize based on region and season
        # For now, return the base templates
        return templates