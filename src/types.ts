import { ReactNode } from 'react';

/**
 * Represents a skill presented in the Skills Knowledge Base.
 */
export interface Skill {
  name: string;
  id: string;
  icon: ReactNode;
  color: string;
  description: string;
  examples: string[];
}
