# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ergou Code is a fork of Claude Code that supports custom Anthropic-compatible API endpoints and OpenAI format conversion. The codebase was reconstructed from source maps and further modified to enable self-hosted/proxy/relay usage patterns.

Key differences from upstream:
- Configuration directory is `~/.ergou` (isolated from original Claude Code's `~/.claude`)
- Supports custom API base URLs and API keys via `src/utils/customApiStorage.ts`
- OpenAI Chat Completions ↔ Anthropic Messages protocol conversion (experimental)
- Command name is `ergou` (not `claude`)

## Build & Development Commands

```bash
bun install           # Install dependencies
bun run dev           # Start CLI interactively
bun run start         # Alias for dev
bun run version       # Print version info
bun link              # Register as global command 'ergou'
```

No automated test suite is configured. Test by running the CLI and exercising changed paths.

## Architecture

**Entry Flow:**
`src/bootstrap-entry.ts` → `src/entrypoints/cli.tsx` → `src/main.tsx`

The CLI entrypoint handles fast-path routes (--version, --dump-system-prompt, daemon modes, bridge mode, etc.) before loading the full application.

**Core Directories:**
- `src/tools/` — Each tool is its own directory (BashTool, FileReadTool, FileEditTool, etc.). Tools implement the tool interface from `src/Tool.ts`.
- `src/services/` — API client (`api/client.ts`), MCP integration, analytics, OAuth, rate limiting.
- `src/components/` — React/Ink TUI components for the interactive CLI interface.
- `src/utils/` — Utilities including auth, custom API storage, model management, config.
- `src/commands/` — CLI subcommand handlers.
- `src/hooks/` — React hooks for state management.
- `src/constants/` — Prompts, OAuth config, feature flags.

**Custom API Integration:**
- `src/utils/customApiStorage.ts` — Persists custom endpoint config (provider, baseURL, apiKey, model)
- `src/services/api/client.ts` — Creates Anthropic SDK client; reads custom storage and environment variables

**Environment Variables for Custom Endpoints:**
- `ERGOU_API_KEY` — Direct API key for custom endpoints
- `ANTHROPIC_BASE_URL` — Custom API base URL
- `ANTHROPIC_CUSTOM_HEADERS` — Custom headers (newline-separated, "Name: Value" format)
- `CLAUDE_CODE_COMPATIBLE_API_PROVIDER` — Set to 'openai' for OpenAI format conversion

## Coding Style

TypeScript-first with ESM imports. Many files omit semicolons, use single quotes, and prefer descriptive camelCase. React components use PascalCase. Match surrounding file style exactly.

Imports marked with stability warnings should not be reordered.

## Restoration Context

This is a reconstructed source tree with two layers of history:
1. Original restoration from source maps (with shim/fallback patterns)
2. Ergou Code modifications for custom API support

When adding workarounds for missing modules, document them clearly.