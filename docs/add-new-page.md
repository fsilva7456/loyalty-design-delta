# Adding New Pages to the Workflow

## Overview
This document describes the standard process for adding new pages to the loyalty design workflow. The application follows a specific pattern for workflow steps using Next.js App Router and React components.

## Directory Structure
```
frontend/src/
├── components/
│   ├── StepForm/
│   │   ├── index.tsx                    # Main form switcher
│   │   ├── [Step]Form.tsx               # Step input form
│   │   └── [Step]Result.tsx             # Step results display
│   ├── StepNavigator/
│   │   └── index.tsx                    # Navigation between steps
│   └── ui/                              # Shared UI components
└── app/
    └── workflow/
        └── [id]/                        # Dynamic route for workflow
```

## Step-by-Step Process

1. **Create Form Component**
   - Create new file: `frontend/src/components/StepForm/[Step]Form.tsx`
   - Implement form using shared UI components
   - Connect to WorkflowContext for state management
   - Access previous step data via `previousStepResults`

2. **Create Result Component**
   - Create new file: `frontend/src/components/StepForm/[Step]Result.tsx`
   - Display step results and any generated recommendations
   - Include feedback mechanisms if needed

3. **Update Step Form Index**
   In `frontend/src/components/StepForm/index.tsx`:
   - Import new form and result components
   - Add case to `renderForm()` function
   - Add case to `renderResult()` function

4. **Add to Navigation Flow**
   In `frontend/src/components/StepNavigator/index.tsx`:
   - Add step to the workflow sequence
   - Update any navigation logic if needed

## Example Implementation

```typescript
// [Step]Form.tsx
export default function NewStepForm({ onSubmit, previousStepResults }) {
  // Form implementation
}

// [Step]Result.tsx
export default function NewStepResult({ result }) {
  // Result display implementation
}

// In StepForm/index.tsx
case 'new_step':
  return <NewStepForm 
    onSubmit={onSubmit}
    previousStepResults={previousStepResults}
  />;
```

## Best Practices
1. Use TypeScript interfaces for form and result data
2. Maintain consistency with existing UI components
3. Include proper error handling and loading states
4. Log important state changes and errors
5. Access workflow context for state management

## Testing
Before deploying:
1. Test form submission
2. Verify navigation flow
3. Check data persistence in workflow context
4. Test error scenarios
5. Verify mobile responsiveness