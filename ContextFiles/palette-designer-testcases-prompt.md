# Prompt for Claude Code: Generate QA Test Cases for Role **palette-designer**

You are Claude Code operating in a mono-workspace that contains these repositories:

- `palette-design-studio-app`
- `palette-design-studio-api`
- `palette-workspace-app`
- `palette-workspace-api`
-  `WorkCenterAPI`

## Goal

Create **QA-ready manual test cases** for the user role **`palette-designer`** by reading the code, routes, UI components, feature flags, RBAC/permissions, and API contracts across the repos.

The output must be **multiple Markdown files** (separate files per scenario area) containing test cases written in the style:

- `Verify that ...`

These test cases will be executed by QA engineers, so they must be specific, reproducible, and aligned to actual application behavior found in code.

Do **not** invent features. If expected behavior is unclear or ambiguous, include an explicit question in-line using the bracket style:
- `[WHAT IS EXPECTED THEN?]`
- `[IS THIS A VALID CASE?]`

---

## Working Rules (important)

1. **Derive tests from code**  
   Use actual implementation details found in the repos:
   - UI flows, routes, panels, widgets, and screen names
   - API endpoints, validations, error codes/messages
   - RBAC/role checks, feature flags, metadata configurations
   - Compliance flows and submission states

2. **Cite sources**  
   For each scenario file, just add code file name reference - not necessarily, only if required

3. **Keep the test-case phrasing consistent**  
   Each test case must start with **“Verify that …”** (matching the sample style).  
   You may add sub-bullets for:
   - Preconditions
   - Steps
   - Expected Results  
   …but the first line must be a “Verify that …” statement.

4. **Cover both UI and API behaviors**  
   Even if a scenario is UI-driven, include tests for underlying API behaviors when relevant (validation errors, permission errors, payload constraints, etc.).

5. **Role scope: palette-designer**  
   Focus on what a palette-designer can do, cannot do, and how the system behaves when the user lacks permission. Include negative/authorization tests.

---

## What to Generate (files + coverage)

Inside the folder C:/Work/ClaudeCodeManualTestCases/PaletteDesignerTestCase, create these separate Markdown files (use these exact file names unless you find an established naming convention in the repos):

1. `01-template-generation.md`
2. `02-editing-left-panels-and-layers.md`
3. `03-tags-panel-template-mode-and-business-rules.md`
4. `04-preview-mode-business-rules-text-nodes.md`
5. `05-preview-mode-business-rules-image-nodes.md`
6. `06-rules-panel-conditional-rules.md`
7. `07-compliance-finish-and-submit.md`
8. `08-post-submit-navigation-to-workspace-manage-templates.md`
9. `09-regression-areas-checklist.md`

If you discover the product organizes features differently, you may add more files, but do not merge the areas above into fewer files.

---

## Scenario Requirements (what each file must include)

### 1) `01-template-generation.md`
Include tests for template creation/generation flows including:

- Different template categories:
  - **Dieline categories**
  - **Non-dieline categories**
- Category-specific UI changes and validations
- Required metadata / configuration checks (if present)
- API validations for template creation (payload shape, required fields, failure states)
- Permission checks: palette-designer allowed vs disallowed actions

**Must include**:
- Verify generation succeeds with valid inputs for dieline
- Verify generation succeeds with valid inputs for non-dieline
- Verify correct defaults (sizes, bleed/crop settings, etc.) based on category (as supported by code)
- Verify behavior when required fields are missing
- Verify behavior when API returns an error (network, 4xx validation, 5xx)

---

### 2) `02-editing-left-panels-and-layers.md`
Cover editing via the left-side vertical widgets/panels, including:

- Adding and modifying:
  - text
  - media
  - elements
  - logos
- Layer ordering behavior in the **Layers panel on the right**:
  - order after add
  - order after bring forward/back
  - order after delete
  - lock/unlock/visibility (if present)
- Selection behavior between canvas and panels
- Undo/redo (if implemented)
- Persistence behavior (autosave/manual save, draft state) if supported

**Must include** tests that verify:
- Adding each element type results in a new layer entry
- Modifying properties updates the canvas and layer metadata consistently
- Layer order changes reflect visually and in the layers list
- Deleting elements updates layers list and canvas
- Error handling for media upload (size/type limits) if implemented

---

### 3) `03-tags-panel-template-mode-and-business-rules.md`
Cover **Tags panel** including:

- Toggling **template mode** on/off
- Adding **business rules**
- Behavior differences when template mode is enabled vs disabled
- Validation on business rules creation/edit
- How rules attach to “nodes” (as implemented)

**Must include**:
- Verify template mode toggle persists (per template/session) as implemented
- Verify business rules can be added/edited/removed
- Verify invalid rule configuration is blocked with correct error messaging
- Verify rules are stored and reloaded correctly

---

### 4) `04-preview-mode-business-rules-text-nodes.md`
Cover Preview Mode behavior for **text nodes**:

- Preview Mode allows palette-designer to behave like palette-user (as described)
- Business rules added for each node must reflect in preview mode
- Verify UI indicates preview mode state
- Verify what is editable vs locked in preview mode

**Must include**:
- Verify node-level business rules for text nodes are enforced in preview mode
- Verify rule violations show expected messaging/visual indicators
- Verify leaving preview mode restores designer editing capabilities

---

### 5) `05-preview-mode-business-rules-image-nodes.md`
Same as above, but explicitly for **image nodes**:

- Image replacement constraints
- Crop/bleed constraints if tied to rules
- File type/size constraints if defined
- Placeholder vs actual image handling
- Error states (invalid image, upload fail, rule violation)

---

### 6) `06-rules-panel-conditional-rules.md`
Cover **Rules panel** behavior:

- Rules format: “if X node changes then change Y and Z as follows…”
- Rule types supported (visibility, text transform, required, min/max, allowed values, etc. — only what code supports)
- Multiple rules interactions, precedence, conflicts
- Rule reflection in Preview Mode (must validate in preview)

**Must include**:
- Verify rule creation with valid references to X/Y/Z nodes
- Verify rule prevents saving/submitting if invalid (or clarify expected)
- Verify cyclic dependencies handling `[WHAT IS EXPECTED THEN?]` if unclear in code
- Verify conflict resolution when multiple rules target the same node `[WHAT IS EXPECTED THEN?]` if unclear

---

### 7) `07-compliance-finish-and-submit.md`
Cover the “Finish” flow and compliance:

- Clicking **Finish** runs template through compliance
- Compliance pane scenarios (pass/fail/warnings) as implemented
- Submitting template
- Error handling (compliance service down, timeouts, partial failures)
- UI messaging and resulting template status

**Must include** separate scenarios for:
- Compliance pass
- Compliance warnings (if supported)
- Compliance fail with actionable errors
- Submission blocked until issues resolved (if implemented)
- Submission success and backend state transition
- Retry behavior after fixing issues

---

### 8) `08-post-submit-navigation-to-workspace-manage-templates.md`
After submit:

- User navigated to **Manage Template** screen in `palette-workspace-app`
- Verify the submitted template appears with correct status/metadata
- Verify search/filter/sort behavior relevant to newly submitted template
- Verify access permissions for palette-designer in workspace context

Include any API checks that back this screen.

---

### 9) `09-regression-areas-checklist.md`
Add a regression checklist **tailored to palette-designer** that QA can reuse. Include explicit “Verify that …” tests (not just headings) for these areas:

- Download (single and multipage for dieline and non dieline) - pdf, jpg, png
- Checkout dropship
- Paid media flow
- Crop and bleed
- Workcenter
- Compliance
- Existing template with new delivery option
- New template with this option
- PoP Resize
- Cross Corp
- Duplicate template

If any item does not exist in code, mark it clearly:
- `[NOT FOUND IN CODEBASE — CONFIRM SCOPE]`

---

## Test Case Format Requirements (must follow)

Within each file:

1. Add a short header:
   - Feature/Scenario name
   - Role: palette-designer
   - Environments (if discoverable)
   - Key assumptions (only if needed)
2. Add “Test cases” section with a numbered list.  
   Each item must start with:  
   - `Verify that ...`

Example formatting (use this style):

- Verify that “Download via Email” option appears when enabled in metadata.
  - Preconditions: ...
  - Steps: ...
  - Expected: ...

Also include negative tests such as:
- Verify that when metadata does not contain “Download via Email” configuration — option should not appear.
- Verify behavior if file processing fails. `[WHAT IS EXPECTED THEN?]`

---

## Discovery Tasks (what you should inspect before writing tests)

Across the four repos, locate:

- Role definitions / RBAC checks for `palette-designer`
- Design Studio routes and panels:
  - template creation screens
  - left vertical widgets/panels (text/media/elements/logos)
  - layers panel behavior
  - tags panel + template mode
  - preview mode implementation
  - rules panel implementation
  - finish button -> compliance pane
- API endpoints for:
  - template create/update
  - nodes/elements CRUD
  - business rules CRUD
  - preview rendering / validation
  - compliance run + submission
- Workspace app:
  - manage templates screen route and data dependencies

If you find OpenAPI/Swagger specs, use them to derive request/response and error tests.

---

## Output Expectations

- Produce the Markdown files described above.
- Ensure tests are **actionable** and **product-accurate**.
- Include both **positive and negative** scenarios.
- Include **permission/authorization** tests for palette-designer boundaries.
- Include **API validation/error** tests where relevant.
- Clearly flag unknowns using bracket questions.

End result should be ready for QA to execute manually without needing to read code.
```

