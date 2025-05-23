import { WebglAddon } from '@xterm/addon-webgl';
import { AttachAddon } from '@xterm/addon-attach';
import type { Terminal } from '@xterm/xterm';

interface IPluginOptions {
    webglRendering?: boolean;
    attachSocket?: WebSocket;
}

type IXtermPlugin = WebglAddon | AttachAddon;

export const initXtermPlugins = (
    term: Terminal,
    { attachSocket, webglRendering }: IPluginOptions
) => {
    const plugins: IXtermPlugin[] = [];

    // load WebGL addon
    if (webglRendering) {
        const xtermWebGlAddon = new WebglAddon();
        plugins.push(xtermWebGlAddon);
    }

    // connect to a pty socket
    if (attachSocket) {
        const attachAddon = new AttachAddon(attachSocket);
        plugins.push(attachAddon);
    }

    plugins.forEach((pluginInstance) => term.loadAddon(pluginInstance));

    return () => {
        plugins.forEach((pluginInstance) => pluginInstance.dispose());
    };
};
