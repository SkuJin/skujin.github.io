import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal as TerminalIcon, 
  Cpu, 
  ArrowRight, 
  Maximize2, 
  Minus, 
  X,
  Play,
  RotateCcw
} from 'lucide-react';

const BOOT_LOGS = [
  { text: 'initializing GRUB bootloader...', delay: 100 },
  { text: '[    0.000000] Linux version 6.2.3-skujin (gcc version 12.2.0)', delay: 150 },
  { text: '[    0.000000] CPU0: AMD Ryzen 5 2500X (4 Cores / 8 Threads)', delay: 100 },
  { text: '[    0.024102] Core temperature monitoring active', delay: 80 },
  { text: '[    0.035412] BIOS-provided physical RAM map: 16384MB system memory', delay: 100 },
  { text: '[    0.120542] ACPI: Core revision 20260614', delay: 70 },
  { text: '[    0.340012] SCSI subsystem initialized', delay: 90 },
  { text: '[    0.412401] USB controller protocol setup [OK]', delay: 110 },
  { text: '[    0.509820] PCI root hub allocation: assigned channels [OK]', delay: 60 },
  { text: '[    0.720111] Serial: 8250/16550 driver loaded, sharing enabled', delay: 120 },
  { text: '[    0.910340] EXT4-fs (sda1): mounted filesystem with ordered data (writeback).', delay: 140 },
  { text: '[    1.155420] NetFilter v4: firewall protocols configured', delay: 80 },
  { text: '[    1.390111] systemd[1]: status OK: starting services...', delay: 150 },
  { text: '[    1.423533] starting host status checks: system-ip online', delay: 110 },
  { text: '[    1.602102] skujin-auth-layer: loading root permissions... [OK]', delay: 130 },
  { text: '[    1.834011] loading environment modules: .env decrypted', delay: 100 },
  { text: '[    2.000000] CzechRepublic/Prague region coordinates set.', delay: 120 },
  { text: '[    2.150491] Loading portfolio dependencies (TypeScript/React)...', delay: 160 },
  { text: '==================================================', delay: 50 },
  { text: 'Welcome to skujin v2.06 LTS (linux-x86_64)', delay: 100 },
  { text: 'All units active. Type "help" to start exploring.', delay: 150 }
];

interface CommandResult {
  command: string;
  output: React.ReactNode;
}

export default function App() {
  const [booting, setBooting] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('skujin_terminal_booted') !== 'true';
    }
    return true;
  });
  const [bootLines, setBootLines] = useState<string[]>(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('skujin_terminal_booted') === 'true') {
      return BOOT_LOGS.map(log => log.text);
    }
    return [];
  });
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<CommandResult[]>([
    {
      command: 'systemctl status page',
      output: (
        <div className="space-y-1">
          <p className="text-zinc-500 font-mono text-[11px]">System initialized successfully.</p>
          <p className="text-zinc-300">
            Hey! I'm <span className="text-purple-400 font-semibold">skujin</span>.
          </p>
          <p className="text-zinc-400 text-xs">
            Type <span className="text-zinc-200 underline">./help.sh</span> below to list available processes, or click any quick command shortcut to run it immediately.
          </p>
        </div>
      )
    }
  ]);
  
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom of logs/terminal
  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Run through the Linux Boot logs
  useEffect(() => {
    if (!booting) return;
    let active = true;
    let idx = 0;
    let timer: NodeJS.Timeout;

    const printNextLine = () => {
      if (!active) return;
      if (idx < BOOT_LOGS.length) {
        const currentLog = BOOT_LOGS[idx];
        if (currentLog) {
          setBootLines((prev) => [...prev, currentLog.text]);
          timer = setTimeout(printNextLine, currentLog.delay);
          idx++;
        }
      } else {
        timer = setTimeout(() => {
          if (active) {
            setBooting(false);
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('skujin_terminal_booted', 'true');
            }
          }
        }, 600);
      }
    };

    printNextLine();
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [booting]);

  // Keep focus on input unless selecting text
  useEffect(() => {
    if (!booting) {
      inputRef.current?.focus();
      scrollToBottom();
    }
  }, [booting, history]);

  const handleSkipBoot = () => {
    setBootLines(BOOT_LOGS.map(log => log.text));
    setBooting(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('skujin_terminal_booted', 'true');
    }
  };

  const handleCommandRun = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    let normalized = trimmed.toLowerCase();

    // Map script execution syntax to clean strings
    if (normalized.startsWith('./') && normalized.endsWith('.sh')) {
      normalized = normalized.slice(2, -3);
    } else if (normalized.startsWith('./')) {
      normalized = normalized.slice(2);
    } else if (normalized.endsWith('.sh')) {
      normalized = normalized.slice(0, -3);
    }

    let output: React.ReactNode = null;

    switch (normalized) {
      case 'help':
        output = (
          <div className="space-y-2 py-1 font-mono text-xs">
            <p className="text-zinc-400">Available commands to query the system:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 pl-2">
              <div>
                <span className="text-purple-400 font-semibold block sm:inline sm:w-32 inline-block">./neofetch.sh</span>
                <span className="text-zinc-500">— display system banner & hardware summary</span>
              </div>
              <div>
                <span className="text-purple-400 font-semibold block sm:inline sm:w-32 inline-block">./about.sh</span>
                <span className="text-zinc-500">— who is skujin & background info</span>
              </div>
              <div>
                <span className="text-purple-400 font-semibold block sm:inline sm:w-32 inline-block">./contact.sh</span>
                <span className="text-zinc-500">— get social accounts and direct lines</span>
              </div>
              <div>
                <span className="text-purple-400 font-semibold block sm:inline sm:w-32 inline-block">clear</span>
                <span className="text-zinc-500">— purge terminal viewport console history</span>
              </div>
            </div>
            <p className="text-[11px] text-zinc-600 mt-2">💡 Tip: You can also click the quick-links underneath the command console.</p>
          </div>
        );
        break;

      case 'neofetch':
        output = (
          <div className="flex flex-col sm:flex-row gap-6 py-2 font-mono text-xs text-zinc-300 leading-relaxed">
            <div className="text-purple-400 font-bold tracking-tighter shrink-0 select-none hidden sm:block">
              <pre className="text-sky-500 leading-none">
{`  ____  _  _ _   _ ___ _ _   _ 
 / ___|| |/ / | | |_  | | \\ | |
 \\___ \\| ' <| |_|  | || |  \\| |
 |____/|_|\\_\\\\___/|___|_|_| \\_|
`}
              </pre>
              <div className="mt-2 text-center text-purple-400 border border-purple-500/10 py-1 bg-purple-950/5">
                OS: skujin-OS v2.06
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-emerald-400 font-bold">skujin@CzechRepublic</p>
              <p className="text-[#52525b]">-------------------------</p>
              <p><span className="text-purple-400">Host</span>: Custom Cloud Run Instance</p>
              <p><span className="text-purple-400">Kernel</span>: 6.2.3-skujin LTS x86_64</p>
              <p><span className="text-purple-400">Uptime</span>: 2 mins, 44 secs</p>
              <p><span className="text-purple-400">Shell</span>: Custom React Terminal Emulator</p>
              <p><span className="text-purple-400">Resolution</span>: Responsive viewport</p>
              <p><span className="text-purple-400">CPU</span>: AMD Ryzen 5 2500X (4) @ 3.500GHz</p>
              <p><span className="text-purple-400">GPU</span>: NVIDIA GeForce GTX 1060 6GB</p>
              <p><span className="text-purple-400">Memory</span>: 2471MiB / 16384MiB (15%)</p>
              <p><span className="text-purple-400">Palette</span>: <span className="bg-red-500 px-1 inline-block"> </span><span className="bg-green-500 px-1 inline-block"> </span><span className="bg-yellow-500 px-1 inline-block"> </span><span className="bg-blue-500 px-1 inline-block"> </span><span className="bg-purple-500 px-1 inline-block"> </span><span className="bg-teal-500 px-1 inline-block"> </span></p>
            </div>
          </div>
        );
        break;

      case 'about':
        output = (
          <div className="space-y-2 py-1 text-zinc-300 text-xs text-justify max-w-[480px]">
            <p className="font-semibold text-white font-mono text-[13px] border-b border-zinc-800 pb-1">
              [ PROFILE_QUERY: skujin ]
            </p>
            <p className="leading-relaxed">
              Based in Prague, CZ. I focus heavily on writing minimalist, high-fidelity systems, beautiful client interactions, clean responsive design modules, and fluid browser components.
            </p>
            <p className="leading-relaxed">
              I hate cluttered setups with slow telemetry, ads, and bloated wrappers. My goal is always to deliver an immediate, tactile sense of performance, lightweight layout, and optimized user flows.
            </p>
          </div>
        );
        break;

      case 'contact':
      case 'socials':
        output = (
          <div className="space-y-2 py-1 font-mono text-xs text-zinc-300">
            <p className="text-zinc-500 text-[11px]">Established connection coordinates:</p>
            <div className="space-y-1 pl-1">
              <p>
                <span className="text-purple-400 w-24 inline-block">Telegram</span>: 
                <a href="https://t.me/skujin" target="_blank" rel="noopener noreferrer" className="text-white hover:underline ml-1">t.me/skujin</a>
              </p>
              <p>
                <span className="text-purple-400 w-24 inline-block">GitHub</span>: 
                <a href="https://github.com/skujin" target="_blank" rel="noopener noreferrer" className="text-white hover:underline ml-1">github.com/skujin</a>
              </p>
              <p>
                <span className="text-purple-400 w-24 inline-block">Email</span>: 
                <a href="mailto:skujinars@gmail.com" className="text-white hover:underline ml-1">skujinars@gmail.com</a>
              </p>
              <p>
                <span className="text-purple-400 w-24 inline-block">Discord</span>: 
                <span className="text-zinc-300 ml-1">skujin#8888</span>
              </p>
            </div>
          </div>
        );
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      default:
        output = (
          <p className="text-red-400 font-mono text-xs">
            bash: command not found: "{trimmed}". Type <span className="underline cursor-pointer" onClick={() => handleCommandRun('help')}>help</span> for available routines.
          </p>
        );
    }

    setHistory((prev) => [...prev, { command: cmd, output }]);
    setInputVal('');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommandRun(inputVal);
  };

  const handleResetBoot = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('skujin_terminal_booted');
    }
    setBootLines([]);
    setBooting(true);
  };

  return (
    <div className="min-h-screen bg-[#040405] text-[#b4b4bb] font-sans flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Matrix/Grid Design */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f2305_1px,transparent_1px),linear-gradient(to_bottom,#1f1f2305_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
      <div className="absolute top-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-purple-900/5 blur-[120px] pointer-events-none" />

      {/* VIEWPORT 1: LINUX BOOTUP SEQUENCE */}
      {booting ? (
        <div className="relative w-full max-w-[560px] bg-[#09090b]/90 border border-zinc-800/80 rounded-xl p-5 shadow-2xl backdrop-blur-md">
          <div className="flex justify-between items-center pb-3 border-b border-zinc-800/60 mb-4">
            <span className="text-xs text-zinc-500 font-mono flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-zinc-600 animate-spin" />
              <span>skujin-system-bootstrap.sh</span>
            </span>
            <button 
              onClick={handleSkipBoot}
              className="text-[10px] bg-zinc-800 hover:bg-zinc-700 font-mono text-zinc-400 px-2 py-0.5 rounded cursor-pointer transition-colors"
            >
              [skip bootloader]
            </button>
          </div>

          <div className="h-80 overflow-y-auto font-mono text-xs text-green-500/90 leading-relaxed scrollbar-none select-none">
            {bootLines.map((line, idx) => (
              <p key={idx} className="whitespace-pre-wrap">{line}</p>
            ))}
            <div ref={terminalEndRef} />
          </div>
        </div>
      ) : (

        /* VIEWPORT 2: THE INTERACTIVE CONSOLE */
        <div className="relative w-full max-w-[620px] bg-[#08080a] border border-zinc-900 rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,0.9)] overflow-hidden transition-all duration-300">
          
          {/* Simulated Window Control Bar */}
          <div className="bg-[#0b0b0e] px-4 py-3 border-b border-[#141418] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
              <span className="text-[11px] font-mono text-zinc-500 ml-2">skujin@CzechRepublic: ~</span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-zinc-600">Active: 6.2.3 LTS</span>
              <button 
                onClick={handleResetBoot}
                title="Restart Machine Logs"
                className="text-zinc-600 hover:text-purple-400 transition-colors p-0.5"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Console Text Logger Screen */}
          <div className="p-5 min-h-[340px] max-h-[380px] overflow-y-auto font-mono text-xs space-y-4 scrollbar-thin select-text">
            
            {/* Display list of entered user history */}
            {history.map((item, idx) => (
              <div key={idx} className="space-y-1.5 leading-relaxed">
                <div className="flex items-center gap-2 text-purple-400">
                  <span className="text-zinc-600 font-bold">skujin@guest:~$</span>
                  <span className="text-white font-medium">{item.command}</span>
                </div>
                <div className="pl-4 border-l border-zinc-900 py-0.5 text-zinc-300">
                  {item.output}
                </div>
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          {/* Form Command Terminal Input area */}
          <form 
            onSubmit={handleFormSubmit} 
            className="flex items-center gap-2 px-5 py-3 border-t border-[#121217] bg-[#060608]"
          >
            <span className="text-zinc-600 font-bold font-mono text-xs select-none shrink-0">skujin@guest:~$</span>
            <input 
              ref={inputRef}
              type="text"
              autoFocus
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Query terminal (e.g. './help.sh', './neofetch.sh')..."
              className="flex-1 bg-transparent border-none text-white text-xs font-mono focus:outline-none focus:ring-0 placeholder-zinc-700 min-w-0"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
            />
            <button 
              type="submit"
              className="text-zinc-500 hover:text-white transition-colors shrink-0"
              title="Run console command"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Click-to-Run Dashboard shortcuts (Absolute Lifesaver for Mobile & Touchscreens) */}
          <div className="px-5 py-3.5 bg-[#09090c] border-t border-[#121217] flex flex-wrap gap-2 items-center justify-between">
            <span className="text-[10px] text-zinc-600 font-mono tracking-wider">QUICK-CLI TRIGGERS:</span>
            <div className="flex flex-wrap gap-1.5">
              {['neofetch', 'about', 'contact'].map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => handleCommandRun(`./${cmd}.sh`)}
                  className="bg-[#121215] hover:bg-[#1c1c24] active:scale-95 text-zinc-400 hover:text-purple-300 text-[10px] font-mono px-2 py-1 rounded border border-zinc-900 transition-all cursor-pointer"
                >
                  ./{cmd}.sh
                </button>
              ))}
              <button
                onClick={() => handleCommandRun('clear')}
                className="bg-[#121215] hover:bg-[#2e1d24] text-zinc-500 hover:text-rose-400 text-[10px] font-mono px-2 py-1 rounded border border-zinc-900 transition-all cursor-pointer"
              >
                clear
              </button>
            </div>
          </div>
          
        </div>
      )}

      {/* Discreet Footer Trademark branding */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-zinc-700 select-none pointer-events-none">
        Czechia // skujin.terminal
      </div>

    </div>
  );
}
