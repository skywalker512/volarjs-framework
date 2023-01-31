import type { LanguageServiceRuntimeContext } from '../types';
import { ExecuteCommandContext } from '@volar/language-service';
import * as vscode from 'vscode-languageserver-protocol';

const randomCommandId = Math.random().toString(36).slice(2); // TODO

export const executePluginCommand = `volar.${randomCommandId}.executePluginCommand`;

export type ExecutePluginCommandArgs = [
	string, // uri
	string | undefined, // plugin id
	vscode.Command, // original command
];

export function register(context: LanguageServiceRuntimeContext) {

	return async (command: string, args: ExecutePluginCommandArgs, executeCommandContext: ExecuteCommandContext) => {

		if (command === executePluginCommand) {

			const [_uri, pluginId, originalCommand] = args as ExecutePluginCommandArgs;

			if (pluginId !== undefined) {

				const plugin = context.plugins[pluginId];

				await plugin?.doExecuteCommand?.(originalCommand.command, originalCommand.arguments, executeCommandContext);
			}
			else {

				for (const plugin of Object.values(context.plugins)) {

					await plugin.doExecuteCommand?.(originalCommand.command, originalCommand.arguments, executeCommandContext);
				}
			}
		}
	};
}
