# Antigravity Interaction Rules
- **Zero Option Modals**: Do NOT call `ask_question` or present multiple-choice interactive option modals. The user prefers full automation.
- **Autonomous Decision Making**: When multiple options, implementations, or designs exist, autonomously select the optimal and most standard solution and implement it directly. Do not ask the user to pick an option.
- **Full Automation**: Execute commands, create/edit files, and verify changes proactively.
- **Concise Responses**: Keep explanations brief and clear.

# Workspace & Codebase Operations (100% Mandatory)
- **Always Auto-Graphify First**: For ANY task (coding, tooling, scripts, configs, documentation, debugging, or analyzing), ALWAYS automatically generate or update `graphify` on the current root working directory (`folder root`) immediately as the first action. Do NOT wait for code-specific tasks or explicit user prompts.
- **Navigate & Read via Graphify**: Always use the generated `graphify-out/` (knowledge graph, `GRAPH_REPORT.md`, community clusters, node paths) to deeply understand the workspace, locate files, trace dependencies, and read/inspect the system before and while making changes.

# UI/UX, Frontend & Icon Standards (100% Mandatory)
- **High Taste & Craftsmanship**: Every frontend, web, mobile, or interface task must 100% apply the principles of `ui-ux-pro-max`, `design-taste-frontend` (tasteskill v2 anti-slop art direction), and `impeccable`. No generic, sloppy, or bland AI-generated interfaces. Enforce intentional typography, distinctive palettes, spatial rhythm, micro-interactions, and accessible contrast.
- **Strict Icon Ecosystem & Zero AI Slop (100% Enforced)**:
  - **Phase 1 - Project Audit First**: Before adding or modifying any icon in UI, code, markdown, documentation, or slides, **ALWAYS inspect what icon system the current project is already using** (e.g. check `package.json`, `assets/icons/`, or imports like `@radix-ui/react-icons`, `lucide-react`, `phosphor-react`, `@tabler/icons-react`, `@heroicons/react`). If the project already uses a specific icon library, **100% MUST follow and use that exact icon system** for complete codebase consistency.
  - **Phase 2 - Default to Radix Icons**: If the project does not specify an icon library, **100% MUST default to Radix Icons** (using official SVG files from `assets/icons/` or `@radix-ui/react-icons`), or clean professional vector libraries like Lucide / Phosphor.
  - **STRICTLY PROHIBITED (Zero Tolerance)**:
    - **Never use AI-generated/hallucinated ad-hoc SVG icon slop** (generic distorted shapes, unstandardized paths).
    - **Never use emojis as UI icons** (no rockets, lightbulbs, brains, packages, etc.) in interfaces, buttons, menus, markdown headers, or technical documentation.
- **Thorough Testing & Visual Inspection**:
  - After completing any code implementation, perform rigorous testing across edge cases.
  - For any UI/UX or frontend changes: **MUST capture rendered screenshots** (via browser snapshot, headless dev server, or visual validator tools), inspect the visual output directly, critique visual hierarchy, spacing, typography, and contrast, and proactively fix any flaws before concluding.

# Strict Mermaid Diagram Standards (Zero Render Errors)
- **Only Use Supported Diagram Types (100% Enforced)**: Antigravity and markdown renderers ONLY support the following diagram headers:
  - `flowchart TD` / `flowchart LR` / `graph TD` / `graph LR` (Flowcharts & Graphs)
  - `sequenceDiagram` (Sequence Diagrams)
  - `stateDiagram-v2` or `stateDiagram` (State Diagrams)
  - `classDiagram` (Class Diagrams)
  - `erDiagram` (Entity-Relationship Diagrams)
  - `xychart-beta` (XY Charts)
  - `pie` (Pie Charts)
- **STRICTLY PROHIBITED (Zero Tolerance)**:
  - **Tuyệt đối KHÔNG dùng các header không được hỗ trợ**: CẤM dùng `mindmap`, `gitGraph`, `gantt`, `quadrantChart`, `journey`, `timeline`, `sankey-beta`, `block-beta`, `packet-beta`, `architecture-beta`. Việc dùng các header này sẽ gây lỗi crash render: `Failed to render Mermaid diagram: Invalid mermaid header`.
- **Giải pháp thay thế chuẩn hóa**:
  - Muốn vẽ sơ đồ tư duy (mindmap): **BẮT BUỘC dùng `flowchart TD` hoặc `flowchart LR`** dạng cây phân nhánh (tree layout), hoặc danh sách Markdown phân cấp (bullet points).
  - Muốn vẽ tiến độ / lộ trình / dòng thời gian (timeline / gantt): **Dùng `flowchart LR`** hoặc Bảng Markdown (Markdown tables).
- **Cú pháp an toàn (Syntax Safety)**:
  - Luôn bọc nhãn node có ký tự đặc biệt (ngoặc tròn `()`, ngoặc vuông `[]`, ngoặc nhọn `{}`, nháy kép `"`, slash `/`, phẩy `,`) trong dấu ngoặc kép: ví dụ `id["Label (Extra Info)"]` thay vì `id[Label (Extra Info)]`.
  - Không nhúng mã HTML thô (`<br>`, `<b>`, `<span>`) vào bên trong nhãn node.

# Backup & Repository Push Standards (100% Full Self-Contained)
- **Always Full Standalone Backup**: Whenever pushing or backing up skills, rules, dotfiles, or configurations to Git repositories:
  - **100% MUST backup FULL files and directories** (dereference every symlink into complete, standalone local copies).
  - Never push shallow symlinks or empty links pointing to external sources that could be deleted or made private in the future.
  - Every script, asset, template, and reference document must be committed in full so the repository is 100% autonomous, durable, and functional on any new system without external dependencies.
