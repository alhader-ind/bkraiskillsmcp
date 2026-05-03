import React from 'react';
import { 
  Server, Shield, Box, Cpu,
  Activity, Monitor, HardDrive
} from 'lucide-react';
import { InfoCard } from '../../../components/ui/InfoCard';
import { InfoRow } from '../../../components/ui/InfoRow';

/**
 * Renders the native environment report details including host specs, network limits, 
 * building dynamics, and security variables.
 * 
 * @returns {React.JSX.Element} The rendered environment report.
 */
export const EnvironmentReport = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <section>
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-slate-800">
        <Activity className="w-5 h-5 text-indigo-600" /> Host Specifications
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard 
          icon={Monitor} 
          iconColorClass="text-slate-400" 
          title="Operating System" 
          subtitle="Linux Environment" 
          details="Containerized runtime" 
        />
        <InfoCard 
          icon={Cpu} 
          iconColorClass="text-blue-500" 
          title="CPU Architecture" 
          subtitle="x86_64" 
          details="Dynamic allocation" 
        />
        <InfoCard 
          icon={HardDrive} 
          iconColorClass="text-emerald-500" 
          title="Memory Limits" 
          subtitle="Container Allocated Memory" 
          details="Ephemeral disk" 
        />
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-slate-800">
        <Server className="w-5 h-5 text-blue-600" /> Infrastructure Limits & Network
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <h4 className="font-medium text-slate-900">Sandbox Context</h4>
          <p className="text-sm text-slate-600 mt-2">
            The application executes inside a sandboxed Cloud Run container environment. This implies ephemeral storage limits, statelessness constraints, and isolation from arbitrary host networks.
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <h4 className="font-medium text-slate-900 border-l-2 border-red-500 pl-2">Port Configuration</h4>
          <p className="text-sm text-slate-600 mt-2">
            <strong>Port 3000 is strictly enforced.</strong> All external traffic routes via an nginx reverse proxy exclusively to port 3000. Any dev server must be configured on port 3000 to be reachable.
          </p>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-slate-800">
        <Box className="w-5 h-5 text-emerald-600" /> Build System Dynamics
      </h3>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-100">
          <InfoRow 
            tagColorClass="bg-emerald-100 text-emerald-800 overflow-hidden" 
            tagText="Build Phase"
            description={<> Triggered via <code className="bg-slate-100 px-1 py-0.5 rounded text-pink-600">npm run build</code> with <code className="bg-slate-100 px-1 py-0.5 rounded text-pink-600">NODE_ENV=production</code>. Everything must compile during this phase. No separate `build:server` scripts are guaranteed.</>}
          />
          <InfoRow 
            tagColorClass="bg-blue-100 text-blue-800" 
            tagText="SPA Hosting"
            description={<>For pure SPAs (React/Vue/Svelte), the system auto-injects a static file server targeting the <code className="bg-slate-100 px-1 py-0.5 rounded text-pink-600">dist/</code> output folder. No custom `start` script is needed.</>}
          />
          <InfoRow 
            tagColorClass="bg-purple-100 text-purple-800" 
            tagText="Full-Stack Hosting"
            description={<>For custom backend servers (e.g., Express), a <code className="bg-slate-100 px-1 py-0.5 rounded text-pink-600">"start": "node server.ts"</code> script must be explicitly defined in package.json.</>}
          />
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-slate-800">
        <Shield className="w-5 h-5 text-amber-600" /> Security & Secrets Management
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-amber-50 p-5 rounded-xl border border-amber-200">
          <h4 className="font-medium text-amber-900 border-l-2 border-amber-600 pl-2">Client Environment Variables</h4>
          <p className="text-sm text-amber-800 mt-2">
            No UI elements should be built for API key input. All secrets must be declared in <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900">.env.example</code> so the platform can securely prompt users.
          </p>
        </div>
        <div className="bg-amber-50 p-5 rounded-xl border border-amber-200">
          <h4 className="font-medium text-amber-900 border-l-2 border-amber-600 pl-2">SDK Boot Safety</h4>
          <p className="text-sm text-amber-800 mt-2">
            Third-party SDKs must lazily initialize to prevent "infinite starting" loops if environment variables are missing at boot time.
          </p>
        </div>
      </div>
    </section>
  </div>
);
