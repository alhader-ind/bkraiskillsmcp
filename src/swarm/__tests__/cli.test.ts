import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SyncEngine } from '../core/SyncEngine';
import { GitHubAdapter } from '../core/GitHubAdapter';
import fs from 'fs';
import path from 'path';

// Construct shared mocks to observe calls
const mockFetchDirectoryContents = vi.fn().mockResolvedValue([
    { name: 'mock-skill.md', type: 'file', download_url: 'https://mock.url/mock-skill.md', path: 'skills/mock-skill.md' }
]);
const mockFetchFile = vi.fn().mockResolvedValue({
    content: '---\nname: Mock Skill\ndescription: A mocked skill\n---\n\n# Instructions',
    etag: 'abcd',
    status: 200
});

// Mock the GitHubAdapter to prevent actual network calls during tests.
vi.mock('../core/GitHubAdapter', () => {
    return {
        GitHubAdapter: class MockGitHubAdapter {
            fetchDirectoryContents = mockFetchDirectoryContents;
            fetchFile = mockFetchFile;
        }
    }
});

// Mock fs to intercept writes
vi.mock('fs', async (importOriginal) => {
    const actual = await importOriginal<typeof import('fs')>();
    return {
        ...actual,
        default: {
            ...actual,
            mkdirSync: vi.fn(),
            writeFileSync: vi.fn(),
            existsSync: vi.fn().mockReturnValue(true),
            readdirSync: vi.fn().mockReturnValue(['cloudflare-mock-skill.md']),
            readFileSync: vi.fn().mockReturnValue('---\nname: Mock Skill\ndescription: A mocked skill\n---\n\n# Instructions'),
            copyFileSync: vi.fn()
        }
    };
});

describe('SyncEngine Architecture Tests', () => {
    let engine: SyncEngine;
    
    beforeEach(() => {
        vi.clearAllMocks();
        engine = new SyncEngine({ srcDir: './test-raw', destDir: './test-public' });
    });

    it('should initialize successfully', () => {
        expect(engine).toBeDefined();
    });

    it('should map remote paths to local download directories properly', async () => {
        const SOURCES = [
            { name: 'Cloudflare', repo: 'cloudflare/skills', branch: 'main', basePath: '' }
        ];

        await engine.fetchRemoteSkills(SOURCES, 'mock_token');
        
        // Assert that GitHubAdapter methods were called
        expect(mockFetchDirectoryContents).toHaveBeenCalledWith(SOURCES[0], { token: 'mock_token' });
        expect(mockFetchFile).toHaveBeenCalledWith('https://mock.url/mock-skill.md', { token: 'mock_token' }, undefined);

        // Verify that file output writes mapped correctly to the configured srcDir
        const writeFileSync = fs.writeFileSync as any;
        const callArgs = writeFileSync.mock.calls.find((call: any) => typeof call[0] === 'string' && call[0].includes('test-raw'));
        expect(callArgs).toBeDefined();
        // Uses normalized paths
        expect(callArgs[0]).toContain(path.normalize('test-raw/cloudflare-mock-skill.md'));
    });
});
