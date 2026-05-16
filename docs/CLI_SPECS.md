# Agent Swarm CLI Specifications

This document defines the machine-readable, robust CLI capabilities for the `@my-org/agent-swarm` library.

## Command Tree

### `agent-swarm pull <skill-id>`
Fetches a specific semantic skill from remote and provisions it locally.
* **Arguments:** 
  * `skill-id` (string): The remote ID/slug of the skill.
* **Options:**
  * `-d, --dir <path>`: Override target output directory. Default: `./skills`.
  * `--no-sync-agents`: Disable auto-updating the AGENTS.md instruction file.
  * `--json`: Output operations as strictly typed JSON objects.

### `agent-swarm sync`
Synchronizes the core registry (all skills) into the local environment via dynamic GitHub ingestion and Promise.allSettled concurrency.
* **Options:**
  * `--sync-agents`: Auto-update the AGENTS.md instruction file with all skills.
  * `--json`: Outputs total synced, operation status, and array of file outputs.

### `agent-swarm list`
Displays a directory of approved skills from the remote API endpoint.
* **Options:**
  * `--json`: JSON payload containing `count` and detailed `skills` map.

### `agent-swarm audit`
Checks local skills by performing a hash-based diff mapping.
* **Options:**
  * `--json`: JSON payload indicating `filesCount` and detailed local `results`.

### `agent-swarm demo`
Runs a localized Swarm diagnostic payload mapping.
* **Options:**
  * `--json`: Outputs deterministic success boolean and error trace data.

## JSON Outputs
Using `--json` guarantees non-interactive, predictable schema output for agentic workflows, avoiding ANSI strings or console clutter. 
