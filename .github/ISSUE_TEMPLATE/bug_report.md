---
name: Bug Report
about: Report a bug in the Task Management App (mobile, web, backend, or CI pipeline)
title: "[BUG] <short description>"
labels: bug
assignees: "@dukuzejean09"
---

## Description
Provide a clear and concise description of the problem in the Task Management App.

Examples:
- “Tasks are not loading on the dashboard.”
- “User cannot update task status.”
- “Pipeline fails when running integration tests.”

---

## Steps to Reproduce
Describe how the bug happens step-by-step.

1. Go to "My Tasks"
2. Click on a task
3. Try to update the status to "Completed"
4. Error appears

---

## Expected Behavior
Explain what *should* have happened.

Example:
- “Task status should update and show a success message.”

---

## Actual Behavior
Explain what *actually* happened.

Example:
- “Update fails and returns a 500 server error.”

---

## Environment
- **Platform**: (Web / Android / iOS)
- **Branch**:
- **Commit SHA**:
- **Backend Environment**: (development / staging / production)
- **Device/OS**: (e.g., Android 13, Windows 11, iPhone 15)
- **App version** (if mobile):

---

## Screenshots / Logs
If applicable, add screenshots or relevant log output.

---

## Impact
Choose one:
- High (blocks core functionality)
- Medium (affects some features)
- Low (minor UI/UX issue)

---

## Additional Context
Add any other details that might help developers:
- API response body
- Console errors
- Network request details
- Recent changes made before the bug occurred
