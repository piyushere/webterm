<script lang="ts">
    import { Terminal } from '@xterm/xterm';
    import '@xterm/xterm/css/xterm.css';
    import { onDestroy, onMount } from 'svelte';
    import { initXtermPlugins } from 'src/lib/xterm-plugins';

    let terminalElement: HTMLElement;

    const term = new Terminal({
        convertEol: true,
        cursorBlink: true,
        rows: 50,
        cols: 150,
    });

    let disposeAddons: () => void;

    const returnToStart = () => term.write('\n$ ');
    const showInitMessage = async () => {
        term.write('\x1b[48:5:0m'); // bg
        term.write('\x1b[38:5:70m'); // fg
        const token = 'Welcome to the Xterm.js demo using Svelte!';
        for (let char of token.split('')) {
            term.write(char);
            await new Promise((resolve) => setTimeout(resolve, 25)); // Simulate sleep
        }
        term.write('\x1b[0m');
        returnToStart();
    };

    const startFakeTerminal = () => {
        showInitMessage().then(() => {
            term.focus();
            term.onKey(({ domEvent, key }) => {
                const printable =
                    !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;
                if (domEvent.key === 'Enter') returnToStart();
                else if (domEvent.key === 'Backspace') {
                    if (term.buffer.active.cursorX > 2) term.write('\b \b');
                } else if (printable) term.write(key);
            });
        });
    };

    const createSessionSocket = async () => {
        const { machineId } = await fetch(
            '/api/machines/create?cols=150&rows=50'
        ).then((res) => res.json());
        const socket = new WebSocket(`/api/machines/ws/${machineId}`);
        socket.onopen = () => console.log('socket connection has been opened');
        socket.onclose = () => startFakeTerminal();
        return socket;
    };

    onMount(() => {
        // Mount the terminal
        term.open(terminalElement);
        createSessionSocket()
            .then((socket) => {
                disposeAddons = initXtermPlugins(term, {
                    attachSocket: socket,
                    webglRendering: true,
                });
                term.focus();
            })
            .catch(() => startFakeTerminal());
        // startFakeTerminal();
    });

    onDestroy(() => {
        disposeAddons?.();
        term.dispose();
    });
</script>

<div
    class="shadow-gray-700 shadow-2xl rounded-2xl p-2 bg-black"
    bind:this={terminalElement}
></div>
