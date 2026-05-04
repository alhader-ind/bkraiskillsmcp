export interface MemoryEntry<T = any> {
  value: T;
  updatedBy: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export class MemoryManager {
  private globalState: Map<string, MemoryEntry>;
  private agentStates: Map<string, Map<string, MemoryEntry>>;

  constructor(initialData?: Record<string, any>) {
    this.globalState = new Map();
    this.agentStates = new Map();
    if (initialData) {
      for (const [k, v] of Object.entries(initialData)) {
        this.setGlobal(k, v, 'system');
      }
    }
  }

  /**
   * Set global shared state, accessible by all agents in the swarm.
   */
  public setGlobal(key: string, value: any, updatedBy: string, metadata?: Record<string, any>) {
    this.globalState.set(key, {
      value,
      updatedBy,
      timestamp: Date.now(),
      metadata
    });
  }

  /**
   * Get global shared state.
   */
  public getGlobal<T = any>(key: string): T | undefined {
    return this.globalState.get(key)?.value as T;
  }

  /**
   * Get the full entry (with metadata/timestamp) for audit logs.
   */
  public getGlobalEntry(key: string): MemoryEntry | undefined {
    return this.globalState.get(key);
  }

  /**
   * Set state specific to a single agent (isolated memory).
   */
  public setAgentScoped(agentName: string, key: string, value: any, metadata?: Record<string, any>) {
    if (!this.agentStates.has(agentName)) {
      this.agentStates.set(agentName, new Map());
    }
    this.agentStates.get(agentName)!.set(key, {
      value,
      updatedBy: agentName,
      timestamp: Date.now(),
      metadata
    });
  }

  /**
   * Get agent-specific state.
   */
  public getAgentScoped<T = any>(agentName: string, key: string): T | undefined {
    return this.agentStates.get(agentName)?.get(key)?.value as T;
  }

  /**
   * Generates a structural snapshot of the memory to be injected 
   * into the LLM system prompt context, ensuring situational awareness.
   */
  public getSnapshot(agentName?: string): Record<string, any> {
    const snapshot: Record<string, any> = { global: {} };
    for (const [k, entry] of this.globalState.entries()) {
      // Exclude internal control primitives like 'nextAgent' from standard context if needed
      if (k !== 'nextAgent') {
        snapshot.global[k] = entry.value;
      }
    }
    
    if (agentName && this.agentStates.has(agentName)) {
      snapshot.local = {};
      for (const [k, entry] of this.agentStates.get(agentName)!.entries()) {
        snapshot.local[k] = entry.value;
      }
    }
    
    return snapshot;
  }

  /**
   * For swarm routing specifically.
   */
  public setNextAgent(agentName: string) {
    this.setGlobal('nextAgent', agentName, 'system');
  }

  public getNextAgent(): string | undefined {
    return this.getGlobal<string>('nextAgent');
  }

  public clearNextAgent() {
    this.globalState.delete('nextAgent');
  }
}
