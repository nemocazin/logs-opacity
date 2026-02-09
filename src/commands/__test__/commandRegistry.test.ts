import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as vscode from 'vscode';
import { registerCommands } from '../commandRegistry';
import * as changeToggleCommand from '../toggleCommand';
import * as changeOpacityCommand from '../changeOpacityCommand';
import * as changeColorCommand from '../changeColorCommand';

// Mock vscode module
vi.mock('vscode', () => ({
    commands: {
        registerCommand: vi.fn(),
    },
}));

// Mock changeOpacityCommand module
vi.mock('../toggleCommand', () => ({
    handleToggleCommand: vi.fn(),
}));

// Mock changeOpacityCommand module
vi.mock('../changeOpacityCommand', () => ({
    handleChangeOpacityCommand: vi.fn(),
}));

// Mock changeColorCommand module
vi.mock('../changeColorCommand', () => ({
    handleChangeColorCommand: vi.fn(),
}));

describe('commandRegistry', () => {
    let mockContext: vscode.ExtensionContext;
    let mockDisposable: vscode.Disposable;
    let registerCommandMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.clearAllMocks();

        // Create mock disposable
        mockDisposable = {
            dispose: vi.fn(),
        };

        // Create mock context
        mockContext = {
            subscriptions: [],
        } as unknown as vscode.ExtensionContext;

        // Setup registerCommand mock
        registerCommandMock = vi.mocked(vscode.commands.registerCommand);
        registerCommandMock.mockReturnValue(mockDisposable);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('registerCommands', () => {
        it('should register toggle command', () => {
            registerCommands(mockContext);

            expect(registerCommandMock).toHaveBeenCalledWith(
                'unobtrusive-logs.toggle',
                changeToggleCommand.handleToggleCommand,
            );
        });

        it('should register change opacity command', () => {
            registerCommands(mockContext);

            expect(registerCommandMock).toHaveBeenCalledWith(
                'unobtrusive-logs.changeOpacity',
                changeOpacityCommand.handleChangeOpacityCommand,
            );
        });

        it('should register change color command', () => {
            registerCommands(mockContext);

            expect(registerCommandMock).toHaveBeenCalledWith(
                'unobtrusive-logs.changeColor',
                changeColorCommand.handleChangeColorCommand,
            );
        });

        it('should register command twice', () => {
            registerCommands(mockContext);

            expect(registerCommandMock).toHaveBeenCalledTimes(5);
        });

        it('should add command to context subscriptions', () => {
            registerCommands(mockContext);

            expect(mockContext.subscriptions).toContain(mockDisposable);
        });

        it('should use correct commands identifier', () => {
            registerCommands(mockContext);

            const calls = registerCommandMock.mock.calls;
            expect(calls.length).toBeGreaterThan(0);

            const commandId1 = calls[0]?.[0] as string;
            expect(commandId1).toBe('unobtrusive-logs.toggle');

            const commandId2 = calls[1]?.[0] as string;
            expect(commandId2).toBe('unobtrusive-logs.changeOpacity');

            const commandId3 = calls[2]?.[0] as string;
            expect(commandId3).toBe('unobtrusive-logs.changeColor');
        });

        it('should pass handleToggleCommand as callback', () => {
            registerCommands(mockContext);

            const calls = registerCommandMock.mock.calls;
            expect(calls.length).toBeGreaterThan(0);
            const callback = calls[0]?.[1] as typeof changeToggleCommand.handleToggleCommand;

            expect(callback).toBe(changeToggleCommand.handleToggleCommand);
        });

        it('should pass handleChangeOpacityCommand as callback', () => {
            registerCommands(mockContext);

            const calls = registerCommandMock.mock.calls;
            expect(calls.length).toBeGreaterThan(0);
            const callback = calls[1]?.[1] as typeof changeOpacityCommand.handleChangeOpacityCommand;

            expect(callback).toBe(changeOpacityCommand.handleChangeOpacityCommand);
        });

        it('should pass handleChangeColorCommand as callback', () => {
            registerCommands(mockContext);

            const calls = registerCommandMock.mock.calls;
            expect(calls.length).toBeGreaterThan(0);
            const callback = calls[2]?.[1] as typeof changeColorCommand.handleChangeColorCommand;

            expect(callback).toBe(changeColorCommand.handleChangeColorCommand);
        });

        it('should not throw when registering commands', () => {
            expect(() => registerCommands(mockContext)).not.toThrow();
        });

        it('should handle multiple registrations', () => {
            registerCommands(mockContext);
            registerCommands(mockContext);

            expect(registerCommandMock).toHaveBeenCalledTimes(10);
            expect(mockContext.subscriptions.length).toBe(10);
        });

        it('should preserve existing subscriptions', () => {
            const existingDisposable = { dispose: vi.fn() };
            mockContext.subscriptions.push(existingDisposable);

            registerCommands(mockContext);

            expect(mockContext.subscriptions.length).toBe(6);
            expect(mockContext.subscriptions).toContain(existingDisposable);
            expect(mockContext.subscriptions).toContain(mockDisposable);
        });

        it('should register command before adding to subscriptions', () => {
            const callOrder: string[] = [];

            registerCommandMock.mockImplementation(() => {
                callOrder.push('register');
                return mockDisposable;
            });

            const originalPush = mockContext.subscriptions.push;
            mockContext.subscriptions.push = function (...args) {
                callOrder.push('subscribe');
                return originalPush.apply(this, args);
            };

            registerCommands(mockContext);

            expect(callOrder).toEqual([
                'register',
                'register',
                'register',
                'register',
                'register',
                'subscribe',
                'subscribe',
                'subscribe',
                'subscribe',
                'subscribe',
            ]);
        });

        it('should work with empty context subscriptions', () => {
            mockContext.subscriptions.splice(0);

            registerCommands(mockContext);

            expect(mockContext.subscriptions.length).toBe(5);
            expect(mockContext.subscriptions[0]).toBe(mockDisposable);
        });

        it('should return undefined', () => {
            const result = registerCommands(mockContext);

            expect(result).toBeUndefined();
        });

        it('should register command that can be disposed', () => {
            registerCommands(mockContext);

            const disposable = mockContext.subscriptions[0];
            expect(disposable).toBeDefined();
            expect(disposable).toHaveProperty('dispose');

            const hasDisposeFunction = disposable && typeof disposable.dispose === 'function';
            expect(hasDisposeFunction).toBe(true);
        });

        it('should create disposable from registerCommand return value', () => {
            const customDisposable = { dispose: vi.fn() };
            registerCommandMock.mockReturnValue(customDisposable);

            registerCommands(mockContext);

            expect(mockContext.subscriptions[0]).toBe(customDisposable);
        });
    });
});
