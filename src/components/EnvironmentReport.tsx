import React from 'react';
import { 
  Server, Shield, Box, Cpu,
  Activity, Monitor, HardDrive
} from 'lucide-react';

/**
 * A sub-component representing a single specification card for the host environment.
 * 
 * @param {object} props - The component properties.
 * @param {React.ElementType} props.icon - The lucide icon to display.
 * @param {string} props.colorClass - The CSS color class for the icon.
 * @param {string} props.title - The primary title of the specification.
 * @param {string} props.subtitle - The secondary subtitle.
 * @param {string} props.details - Further details about the specification.
 * @returns {React.JSX.Element} The rendered SpecCard.
 */
const SpecCard = ({ icon: Icon, colorClass, title, subtitle, details }: { 
  icon: React.ElementType, 
  colorClass: string, 
  title: string, 
  subtitle: string, 
  details: string 
}) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
    <Icon className={`w-8 h-8 ${colorClass} mb-3`} />
    <h4 className="font-semibold text-slate-900">{title}</h4>
    <p className="text-sm text-slate-600 mt-1">{subtitle}<br/>{details}</p>
  </div>
);

/**
 * A sub-component representing a row in the Build System Dynamics section.
 * 
 * @param {object} props - The component properties.
 * @param {string} props.tagColor - The CSS classes for the tag background and text colors.
 * @param {string} props.tagText - The text displayed inside the tag.
 * @param {React.ReactNode} props.description - Detailed description beside the tag.
 * @returns {React.JSX.Element} The rendered BuildPhaseRow.
 */
const BuildPhaseRow = ({ tagColor, tagText, description }: {
  tagColor: string,
  tagText: string,
  description: React.ReactNode
}) => (
  <div className="p-4 flex flex-col md:flex-row gap-4">
    <div className="md:w-1/3">
      <span className={`inline-block px-2 py-1 ${tagColor} rounded text-xs font-semibold uppercase tracking-wider mb-2`}>
        {tagText}
      </span>
    </div>
    <div className="md:w-2/3">
      <p className="text-sm text-slate-700">{description}</p>
    </div>
  </div>
);

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
        <SpecCard 
          icon={Monitor} 
          colorClass="text-slate-400" 
          title="Operating System" 
          subtitle="Linux Environment" 
          details="Containerized runtime" 
        />
        <SpecCard 
          icon={Cpu} 
          colorClass="text-blue-500" 
          title="CPU Architecture" 
          subtitle="x86_64" 
          details="Dynamic allocation" 
        />
        <SpecCard 
          icon={HardDrive} 
          colorClass="text-emerald-500" 
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
          <BuildPhaseRow 
            tagColor="bg-emerald-100 text-emerald-800 overflow-hidden" 
            tagText="Build Phase"
            description={<> Triggered via <code className="bg-slate-100 px-1 py-0.5 rounded text-pink-600">npm run build</code> with <code className="bg-slate-100 px-1 py-0.5 rounded text-pink-600">NODE_ENV=production</code>. Everything must compile during this phase. No separate `build:server` scripts are guaranteed.</>}
          />
          <BuildPhaseRow 
            tagColor="bg-blue-100 text-blue-800" 
            tagText="SPA Hosting"
            description={<>For pure SPAs (React/Vue/Svelte), the system auto-injects a static file server targeting the <code className="bg-slate-100 px-1 py-0.5 rounded text-pink-600">dist/</code> output folder. No custom `start` script is needed.</>}
          />
          <BuildPhaseRow 
            tagColor="bg-purple-100 text-purple-800" 
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
