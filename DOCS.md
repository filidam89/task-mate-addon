
# TaskMate Home Assistant Add-on

## Installation

1. Add our repository to your Home Assistant instance:
   - Go to Settings -> Add-ons -> Add-on Store
   - Click the menu in the top right and select "Repositories"
   - Add the URL: `https://github.com/yourusername/hassio-taskmate`
   - Click "Add"

2. Find and install the "TaskMate" add-on from the store.
3. Start the add-on.
4. Configure Home Assistant integration:
   - Add the following to your `configuration.yaml`:

```yaml
input_text:
  taskmate_data:
    name: TaskMate Data Storage
    max: 51200  # Maximum length to store task data
```

5. Restart Home Assistant to apply changes.
6. Access TaskMate from your Home Assistant sidebar.

## Usage

- Create, edit, and manage tasks directly from your Home Assistant instance
- Assign tasks to different people
- Set recurring tasks with custom frequencies
- Tasks will automatically sync with Home Assistant

## Configuration

No additional configuration is required for basic functionality.

## Support

For issues and feature requests, please open an issue on our GitHub repository.
