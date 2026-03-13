# Module Structure Guide

This directory contains feature modules. Each module follows a consistent structure for maintainability and scalability.

## Module Structure

```
modules/
  {moduleName}/
    components/          # Module-specific components
      forms/            # Form components
      shared/           # Shared components within module
      {ModuleName}View.tsx        # Main view/container
      {ModuleName}Form.tsx        # Main form
      Create{ModuleName}.tsx      # Create page
      Update{ModuleName}.tsx      # Edit page
    hooks/              # Module-specific hooks
      use{ModuleName}.ts
      use{ModuleName}Form.ts
    services/           # Module-specific services
      {moduleName}Service.ts
    types/              # Module-specific types
      index.ts
    utils/              # Module-specific utilities
    index.ts            # Module barrel export
```

## Naming Conventions

- **Folders**: camelCase (e.g., `medicalApplication`)
- **Components**: PascalCase (e.g., `MedicalApplicationView.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useMedicalApplication.ts`)
- **Services**: camelCase with `Service` suffix (e.g., `medicalApplicationService.ts`)
- **Types**: PascalCase interfaces/types (e.g., `MedicalApplication`)

## Creating a New Module

1. Create the module folder under `src/modules/`
2. Add types in `types/index.ts`
3. Create the service in `services/`
4. Build form sections in `components/forms/`
5. Create the main form component
6. Create view/list components
7. Add routes in `App.tsx`
8. Export from module's `index.ts`

## Form Sections Pattern

Large forms should be split into logical sections:
- Each section is a separate component
- Sections use `FormCard` from `components/forms/shared`
- Sections receive `formik` instance as prop
- Sections handle their own field validation display

## Shared Resources

Use shared resources from:
- `src/components/ui/` - UI primitives (Button, Modal, Badge, etc.)
- `src/components/forms/shared/` - Form utilities (FormCard, getFieldError)
- `src/utils/formatting/` - Formatters (phone, NID, date)
- `src/services/api/` - API client
- `src/hooks/` - Global hooks (useAuth, useUserProfile)
