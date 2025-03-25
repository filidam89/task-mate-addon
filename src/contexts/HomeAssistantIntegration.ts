
import { Task } from "./TaskContext";

// Home Assistant integration functions
export const saveTasksToHomeAssistant = async (tasks: Task[]): Promise<boolean> => {
  try {
    const response = await fetch('/api/hassio/services/persistent_notification/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'TaskMate Update',
        message: `Updated tasks: ${tasks.length} tasks in system`,
        notification_id: 'taskmate_update'
      }),
    });
    
    // Also save to Home Assistant storage
    await fetch('/api/hassio/services/input_text/set_value', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        entity_id: 'input_text.taskmate_data',
        value: JSON.stringify(tasks)
      }),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Failed to save tasks to Home Assistant:', error);
    return false;
  }
};

export const loadTasksFromHomeAssistant = async (): Promise<Task[] | null> => {
  try {
    const response = await fetch('/api/hassio/states/input_text.taskmate_data');
    if (response.ok) {
      const data = await response.json();
      if (data && data.state) {
        return JSON.parse(data.state);
      }
    }
    return null;
  } catch (error) {
    console.error('Failed to load tasks from Home Assistant:', error);
    return null;
  }
};

// Function to create the necessary entities in Home Assistant if they don't exist
export const setupHomeAssistantEntities = async (): Promise<void> => {
  try {
    // Check if our storage entity exists
    const response = await fetch('/api/hassio/states/input_text.taskmate_data');
    
    // If it doesn't exist, create it
    if (!response.ok) {
      await fetch('/api/hassio/services/input_text/set_value', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entity_id: 'input_text.taskmate_data',
          value: '[]'
        }),
      });
    }
  } catch (error) {
    console.error('Failed to setup Home Assistant entities:', error);
  }
};
