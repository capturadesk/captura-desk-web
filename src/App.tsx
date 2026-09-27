import { AnalyticsConsent } from "./components/analytics-consent";
import { useState, type ReactNode } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  Copy,
  Monitor,
  MousePointer2,
  FileText,
  ShieldCheck,
  Sparkles,
  FolderOpen,
  Share2,
  Github,
  Menu,
  CircleHelp,
  ChevronDown,
  CheckCircle2,
  Code2,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";
import { pages, repository, relativeRoot, type Page } from "./site";
const setup =
  "git clone https://github.com/capturadesk/captura-desk.git\ncd captura-desk\nnpm ci\nnpm start";
function CopySetup() {
  const [message, setMessage] = useState("");
  async function copy() {
    try {
      await navigator.clipboard.writeText(setup);
      setMessage("Copied");
    } catch {
      setMessage("Select the commands below to copy them.");
    }
  }
  return (
    <div className="code-block">
      <div className="code-heading">
        <span>Windows terminal</span>
        <Button size="sm" variant="ghost" onClick={copy}>
          <Copy />
          Copy commands
        </Button>
      </div>
      <pre>
        <code>{setup}</code>
      </pre>
      <span role="status" className="copy-status">
        {message}
      </span>
    </div>
  );
}
function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}
function External({
  children,
  href = repository,
}: {
  children: ReactNode;
  href?: string;
}) {
  return (
    <a className="text-link" href={href}>
      {children}
      <ArrowUpRight size={14} />
    </a>
  );
}
function PageHeading({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="page-heading">
      <Eyebrow>{label}</Eyebrow>
      <h1>{title}</h1>
      <p>{children}</p>
    </div>
  );
}
function FAQ({ items }: { items: { question: string; answer: ReactNode }[] }) {
  return (
    <div className="faq-list">
      {items.map((item) => (
        <details key={item.question}>
          <summary>
            {item.question}
            <ChevronDown size={17} />
          </summary>
          <div className="faq-answer">{item.answer}</div>
        </details>
      ))}
    </div>
  );
}
export function App({ page }: { page: Page }) {
  const root = relativeRoot(page);
  const href = (key: Page) => root + (pages[key].path ? pages[key].path + "/" : "");
  const nav = [
    ["home", "Overview"],
    ["getting-started", "Getting started"],
    ["changelog", "Changelog"],
  ] as const;
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href={href("home")} aria-label="Captura Desk home">
            <img src={root + "images/icon.png"} width="30" height="30" alt="" />
            Captura Desk
          </a>
          <nav aria-label="Main navigation" className="desktop-nav">
            {nav.map(([key, label]) => (
              <a
                key={key}
                href={href(key)}
                aria-current={key === page ? "page" : undefined}
              >
                {label}
              </a>
            ))}
            <a href={repository} aria-label="Captura Desk on GitHub">
              <Github size={18} />
            </a>
          </nav>
          <Button asChild className="header-cta" size="sm">
            <a href={href("download")}>
              Get Captura Desk
              <ArrowUpRight />
            </a>
          </Button>
          <details className="mobile-menu">
            <summary aria-label="Navigation menu">
              <Menu size={22} />
            </summary>
            <nav aria-label="Mobile navigation">
              {nav.map(([key, label]) => (
                <a
                  key={key}
                  href={href(key)}
                  aria-current={key === page ? "page" : undefined}
                >
                  {label}
                </a>
              ))}
              <a href={href("download")}>Get Captura Desk</a>
              <a href={href("support")}>Support</a>
              <a href={repository}>GitHub</a>
            </nav>
          </details>
        </div>
      </header>
      <main id="main">
        {page === "home" && (
          <>
            <section className="container hero">
              <div className="hero-intro">
                <div>
                  <div className="status-badge">
                    <span />
                    In development for Windows
                  </div>
                  <h1>
                    Turn your workflow
                    <br />
                    <span>into clear documentation.</span>
                  </h1>
                  <p className="hero-description">
                    Capture your screen as you work. Turn the details into clear guides,
                    reports, and summaries with AI. Review, edit, and share.
                  </p>
                  <div className="button-row">
                    <Button asChild size="lg">
                      <a href={href("getting-started")}>
                        Get started
                        <ArrowRight />
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <a href="#how-it-works">
                        <ArrowRight size={14} />
                        See how it works
                      </a>
                    </Button>
                  </div>
                  <p className="hero-note">
                    <Monitor size={14} />
                    Windows desktop app<span aria-hidden="true">/</span>Your AI provider
                    <span aria-hidden="true">/</span>Your files
                  </p>
                </div>
              </div>
              <figure className="product-shot">
                <a
                  href={root + "images/workspace.jpg"}
                  aria-label="Open full-size screenshot of the Captura Desk sample workflow"
                >
                  <img
                    src={root + "images/workspace.jpg"}
                    width="1440"
                    height="960"
                    alt="Captura Desk showing a sample payment workflow, editable documentation, screenshot evidence, and a list of recorded steps."
                    fetchPriority="high"
                  />
                </a>
                <figcaption>
                  Actual app interface with the built-in sample workflow.
                  <span>Record. Review. Refine.</span>
                </figcaption>
              </figure>
            </section>
            <section className="principles container" aria-label="Product principles">
              <div>
                <FolderOpen />
                <span>Organized in projects</span>
              </div>
              <div>
                <ShieldCheck />
                <span>Recordings stay local</span>
              </div>
              <div>
                <Sparkles />
                <span>Bring your own AI key</span>
              </div>
              <div>
                <Share2 />
                <span>Share a single HTML file</span>
              </div>
            </section>
            <section className="section container" id="how-it-works">
              <div className="section-heading">
                <div>
                  <Eyebrow>HOW IT WORKS</Eyebrow>
                  <h2>
                    From screen to document.
                    <br />
                    In three steps.
                  </h2>
                </div>
                <p>
                  Record the task, give it direction,
                  <br />
                  and share something useful.
                </p>
              </div>
              <div className="steps-grid">
                {[
                  {
                    n: "01",
                    icon: MousePointer2,
                    title: "Capture as you go",
                    text: "Choose a display and start recording. Clicks capture the screen around each action. Pause when needed, or take a manual screenshot.",
                  },
                  {
                    n: "02",
                    icon: Sparkles,
                    title: "Tell it what matters",
                    text: "Write project instructions, select the captures to send, and generate a draft with your own OpenAI or Claude API key.",
                  },
                  {
                    n: "03",
                    icon: Share2,
                    title: "Refine. Then share.",
                    text: "Review the evidence, edit in Markdown, or ask AI for changes. Export a single HTML file that opens in a browser.",
                  },
                ].map((step) => (
                  <article className="step-card" key={step.n}>
                    <div className="step-top">
                      <step.icon size={21} />
                      <span>{step.n}</span>
                    </div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </article>
                ))}
              </div>
            </section>
            <section className="usecase-section">
              <div className="container section">
                <Eyebrow>BUILT AROUND YOUR WORK</Eyebrow>
                <h2>One recording. The document you need.</h2>
                <p className="section-lead">
                  Procedures, tutorials, or findings. Your instructions set the direction.
                </p>
                <Tabs defaultValue="operations">
                  <TabsList aria-label="Documentation use cases" className="usecase-tabs">
                    <TabsTrigger value="operations">Operations</TabsTrigger>
                    <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
                    <TabsTrigger value="insights">Screen summaries</TabsTrigger>
                  </TabsList>
                  {[
                    {
                      id: "operations",
                      icon: FolderOpen,
                      title: "Make a repeatable process easy to follow.",
                      text: "Turn a task you know by heart into a clear procedure someone else can use. Keep the supporting screenshots close to the explanation.",
                      prompt:
                        "Write a concise procedure for the operations team. Include prerequisites and a final verification. Flag anything unclear.",
                      label: "Example document outline",
                      items: [
                        "Before you begin",
                        "Complete the task",
                        "Verify the result",
                      ],
                    },
                    {
                      id: "onboarding",
                      icon: CircleHelp,
                      title: "Show someone where to start.",
                      text: "Walk through an application once, then turn that recording into an approachable guide. Adjust the explanation to the person reading it.",
                      prompt:
                        "Create a beginner-friendly tutorial. Explain unfamiliar terms and describe what the reader should see at each step.",
                      label: "Example document outline",
                      items: [
                        "What this feature does",
                        "Your first walkthrough",
                        "What to do next",
                      ],
                    },
                    {
                      id: "insights",
                      icon: FileText,
                      title: "Document what the screen tells you.",
                      text: "Capture a dashboard or report and ask for findings. Group the visible information instead of narrating every navigation click.",
                      prompt:
                        "Summarize the visible figures by region. Preserve dates, units, and filters. Flag unreadable values instead of guessing.",
                      label: "Example document outline",
                      items: [
                        "Scope and filters",
                        "Findings by region",
                        "Questions to verify",
                      ],
                    },
                  ].map((item) => (
                    <TabsContent value={item.id} key={item.id}>
                      <div className="usecase-content">
                        <div>
                          <h3>{item.title}</h3>
                          <p>{item.text}</p>
                          <div className="prompt-box">
                            <span>
                              <Sparkles size={14} />
                              PROJECT INSTRUCTIONS
                            </span>
                            <p>{item.prompt}</p>
                          </div>
                        </div>
                        <div className="outline-card">
                          <item.icon size={23} />
                          <span className="tiny-label">{item.label}</span>
                          {item.items.map((text, i) => (
                            <div className="outline-row" key={text}>
                              <span>{String(i + 1).padStart(2, "0")}</span>
                              {text}
                              <Check size={15} />
                            </div>
                          ))}
                          <p>Review every draft against its source screenshots.</p>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </section>
            <section className="section container control-section">
              <div>
                <Eyebrow>LOCAL BY DEFAULT</Eyebrow>
                <h2>
                  Your work,
                  <br />
                  on your terms.
                </h2>
                <p className="section-lead">
                  Organize locally. Choose what to send.
                  <br />
                  Keep the original while your document evolves.
                </p>
                <External href={href("privacy")}>How your data is handled</External>
              </div>
              <div className="feature-list">
                {[
                  [
                    "A workspace for each context",
                    "Separate projects and workspaces keep different tasks organized. Back up a workspace and restore it into a separate one.",
                  ],
                  [
                    "AI when you choose it",
                    "Recording and manual editing work locally. Generating a draft sends selected captures to your chosen provider. API usage is billed separately by that provider.",
                  ],
                  [
                    "Originals worth keeping",
                    "Generated revisions are separate documents. Highlight or redact screenshots before sharing; source images remain stored locally.",
                  ],
                  [
                    "A document people can open",
                    "Export a self-contained HTML file with embedded screenshots, or Markdown with an image folder. No Captura Desk account is needed to read the export.",
                  ],
                ].map(([title, text]) => (
                  <article key={title}>
                    <CheckCircle2 size={19} />
                    <div>
                      <h3>{title}</h3>
                      <p>{text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
            <section className="section container faq-section">
              <div>
                <Eyebrow>COMMON QUESTIONS</Eyebrow>
                <h2>Before you start.</h2>
                <a className="text-link" href={href("support")}>
                  More help
                  <ArrowRight size={15} />
                </a>
              </div>
              <FAQ
                items={[
                  {
                    question: "Can I download it now?",
                    answer: (
                      <>
                        A Windows installer is not available yet. You can{" "}
                        <a href={href("getting-started")}>
                          run the development version from source
                        </a>{" "}
                        with Windows and Node.js. We will add a direct download when an
                        installer is ready.
                      </>
                    ),
                  },
                  {
                    question: "Do I need an AI API key?",
                    answer:
                      "Only for AI generation and AI edits. Recording, manual editing, and exporting work without a key. Connect your own OpenAI or Anthropic API key; provider API charges are separate.",
                  },
                  {
                    question: "Does it send my screen to AI automatically?",
                    answer:
                      "No. Captures are saved locally. You choose the screenshots and confirm the provider before generating a draft. Review both before and after frames, and save redactions before sending.",
                  },
                  {
                    question:
                      "Can I share a document with someone who does not use the app?",
                    answer:
                      "Yes. HTML export puts the text and screenshots in one file that opens offline in a browser. Markdown export is also available; share its screenshot folder alongside the document.",
                  },
                ]}
              />
            </section>
            <section className="container bottom-cta">
              <img src={root + "images/icon.png"} width="42" height="42" alt="" />
              <div>
                <h2>Start with a workflow you know.</h2>
                <p>Run the Windows development build and create your first document.</p>
              </div>
              <Button asChild size="lg">
                <a href={href("getting-started")}>
                  Get started
                  <ArrowRight />
                </a>
              </Button>
            </section>
          </>
        )}
        {page === "download" && (
          <div className="container page-body">
            <PageHeading label="WINDOWS DESKTOP APP" title="Captura Desk for Windows.">
              Captura Desk is in active development. The source is available now; a
              Windows installer is still ahead.
            </PageHeading>
            <div className="download-grid">
              <section className="download-card">
                <Monitor size={30} />
                <div className="status-badge">
                  <span />
                  Installer coming soon
                </div>
                <h2>Captura Desk for Windows</h2>
                <p>
                  There is no installer to download yet. This site will link to a
                  published Windows build when one is available.
                </p>
                <Button asChild variant="outline">
                  <a href={repository + "/releases"}>
                    Check GitHub releases
                    <ArrowUpRight />
                  </a>
                </Button>
              </section>
              <section className="download-source">
                <Eyebrow>AVAILABLE TODAY</Eyebrow>
                <h2>Run it from source.</h2>
                <p>
                  You will need Windows, Git, and Node.js 22.18 or newer. This is a
                  development build with platform testing still in progress.
                </p>
                <CopySetup />
                <a href={href("getting-started")} className="text-link">
                  Full setup guide
                  <ArrowRight size={15} />
                </a>
              </section>
            </div>
            <div className="note">
              <ShieldCheck size={20} />
              <p>
                <strong>AI is optional.</strong> Connect your own OpenAI or Anthropic API
                key if you want generated drafts. Recording, manual editing, and export do
                not require a key.
              </p>
            </div>
          </div>
        )}
        {page === "getting-started" && (
          <div className="container page-body">
            <PageHeading label="GETTING STARTED" title="Your first useful document.">
              From a local recording to a guide you can share. Start with a short task and
              a few non-sensitive screens.
            </PageHeading>
            <div className="guide-layout">
              <nav aria-label="On this page" className="toc">
                <span>ON THIS PAGE</span>
                {[
                  ["setup", "Run the app"],
                  ["record", "Record a task"],
                  ["generate", "Generate a draft"],
                  ["edit", "Review and edit"],
                  ["share", "Share the result"],
                ].map(([id, label], i) => (
                  <a href={"#" + id} key={id}>
                    <span>0{i + 1}</span>
                    {label}
                  </a>
                ))}
              </nav>
              <div className="prose guide-content">
                <section id="setup">
                  <Eyebrow>01 / SET UP</Eyebrow>
                  <h2>Run Captura Desk.</h2>
                  <p>
                    The current version runs from source on Windows. Install Git and
                    Node.js 22.18 or newer, then run:
                  </p>
                  <CopySetup />
                  <p>
                    The app opens after the build finishes. For development with live
                    reload, use <code>npm run dev</code>.
                  </p>
                  <p className="muted">
                    An installer is not available yet. Mixed-DPI displays, elevated
                    applications, and long sessions still need broader testing.
                  </p>
                </section>
                <section id="record">
                  <Eyebrow>02 / CAPTURE</Eyebrow>
                  <h2>Record a task you know.</h2>
                  <ol>
                    <li>
                      Create a project in your workspace. Add instructions describing the
                      document you want.
                    </li>
                    <li>
                      Choose <strong>New recording</strong>, name the task, and select the
                      display. Use <strong>Identify displays</strong> if you are unsure.
                    </li>
                    <li>
                      Start recording and work in the selected display. Clicks save
                      screenshots. Use <strong>Capture now</strong> or{" "}
                      <kbd>Ctrl + Shift + S</kbd> for a manual capture during recording.
                    </li>
                    <li>
                      Pause before showing anything sensitive. Choose{" "}
                      <strong>Finish</strong> when the task is complete.
                    </li>
                  </ol>
                  <p>
                    Review the captured steps and both before/after images. The before
                    frame is sampled; it is not guaranteed to show the exact instant
                    before your click.
                  </p>
                </section>
                <section id="generate">
                  <Eyebrow>03 / ADD DIRECTION</Eyebrow>
                  <h2>Generate a draft, if you want one.</h2>
                  <ol>
                    <li>
                      Open <strong>AI providers</strong>. Save your OpenAI or Anthropic
                      API key and test the connection.
                    </li>
                    <li>
                      In <strong>Workspace settings</strong>, select a provider and a
                      model supporting images and structured output.
                    </li>
                    <li>
                      Choose <strong>Generate documentation</strong>. Review the captures,
                      exclude sensitive ones, and confirm which provider receives them.
                    </li>
                    <li>
                      Review the draft and choose <strong>Save as new document</strong> to
                      preserve the original.
                    </li>
                  </ol>
                  <div className="note">
                    <Sparkles size={20} />
                    <p>
                      Up to 200 selected captures can be processed in batches. Longer
                      recordings make multiple requests and may take longer or cost more.
                      Provider API billing is separate.
                    </p>
                  </div>
                  <p>
                    To redact an image, enlarge it and choose{" "}
                    <strong>Annotate screenshot</strong>. Save edits for both frames
                    before AI generation or export.
                  </p>
                </section>
                <section id="edit">
                  <Eyebrow>04 / REFINE</Eyebrow>
                  <h2>Make the draft your own.</h2>
                  <p>
                    Click a description to edit its Markdown. Click away to see headings,
                    lists, and tables formatted. Changes save automatically.
                  </p>
                  <p>
                    Ask AI for a change such as <em>"Make this shorter"</em>. Text
                    refinement sends the document text and your instructions, without
                    uploading screenshots again. Always check the result against the
                    evidence.
                  </p>
                  <p>
                    Use the document selector to move between the original and revisions.
                    Screenshot edits apply across revisions that share the same capture.
                  </p>
                </section>
                <section id="share">
                  <Eyebrow>05 / HAND IT OVER</Eyebrow>
                  <h2>Share one file.</h2>
                  <p>
                    Select the revision you want, then choose{" "}
                    <strong>Export &gt; HTML - single file</strong>. The file includes
                    formatted text and screenshots with saved annotations. It opens
                    offline in a browser.
                  </p>
                  <p>
                    For Markdown, choose <strong>Markdown with images</strong> and share
                    the image folder with the document. Exports use the selected revision.
                  </p>
                  <p>
                    Keep a separate workspace backup through{" "}
                    <strong>Workspace settings &gt; Back up workspace</strong>. A
                    shareable document is not a backup of the project.
                  </p>
                  <External href={repository + "/blob/main/README.md"}>
                    Complete app documentation
                  </External>
                </section>
              </div>
            </div>
          </div>
        )}
        {page === "changelog" && (
          <div className="container page-body">
            <PageHeading label="CHANGELOG" title="Product updates.">
              Follow the changes that make recording, editing, and sharing a little
              easier. These are development updates, not published release announcements.
            </PageHeading>
            <div className="timeline">
              <div className="timeline-label">
                <span className="status-badge">
                  <span />
                  Unreleased
                </span>
                <p>Current development</p>
              </div>
              <article className="prose">
                <h2>A clearer path from capture to document.</h2>
                <ul>
                  <li>
                    <strong>Single-file sharing.</strong> Export formatted HTML with
                    embedded, annotated screenshots.
                  </li>
                  <li>
                    <strong>Markdown editing.</strong> Write raw Markdown while focused
                    and preview formatting when you click away.
                  </li>
                  <li>
                    <strong>Documents shaped by your prompt.</strong> Generate procedures,
                    reports, or summaries with multiple sources per section.
                  </li>
                  <li>
                    <strong>Longer recordings.</strong> Process up to 200 sources using
                    sequential batches and a text-only merge.
                  </li>
                  <li>
                    <strong>Review and refine.</strong> Compare AI drafts, request text
                    edits, and save separate revisions.
                  </li>
                  <li>
                    <strong>Control over your captures.</strong> Manual screenshots,
                    redaction, highlighting, and step reordering.
                  </li>
                  <li>
                    <strong>Workspace backup and restore.</strong> Preserve recordings and
                    revisions without exporting API keys.
                  </li>
                  <li>
                    <strong>A new app icon.</strong> Consistent branding in the title bar
                    and desktop window.
                  </li>
                </ul>
                <External href={repository + "/blob/main/CHANGELOG.md"}>
                  Read the complete changelog
                </External>
              </article>
            </div>
            <div className="timeline">
              <div className="timeline-label">
                <span className="tiny-label">INITIAL BASELINE</span>
                <p>Development milestone</p>
              </div>
              <article className="prose">
                <h2>The foundation.</h2>
                <p>
                  Windows recording, before/after screenshots, local workspaces and
                  projects, progressive capture saving, interrupted-session recovery, and
                  Markdown export.
                </p>
                <p className="muted">
                  The app package version is 0.2.0. This does not mean a 0.2.0 installer
                  has been released.
                </p>
              </article>
            </div>
          </div>
        )}
        {page === "privacy" && (
          <div className="container page-body">
            <PageHeading label="PRIVACY & DATA" title="Know where your work goes.">
              Captura Desk records locally. AI is an explicit action. Here is what that
              means in practice.
            </PageHeading>
            <div className="privacy-summary">
              <div>
                <FolderOpen />
                <h2>On your device</h2>
                <p>Recordings, documents, revisions, and original screenshot files.</p>
              </div>
              <div>
                <Sparkles />
                <h2>When you choose AI</h2>
                <p>
                  Selected screenshots and task instructions go directly to your chosen
                  provider.
                </p>
              </div>
              <div>
                <Share2 />
                <h2>When you share</h2>
                <p>The exported document contains text and its referenced screenshots.</p>
              </div>
            </div>
            <div className="prose narrow">
              <h2>Local storage</h2>
              <p>
                The Windows app stores its database under{" "}
                <code>%APPDATA%\captura-desk</code> and original screenshots in its{" "}
                <code>captures</code> folder. Recording, manual editing, and export stay
                local. No recording begins until you start it.
              </p>
              <h2>AI requests</h2>
              <p>
                Generation sends selected screenshots, capture context, the recording
                title and description, and project instructions directly to OpenAI or
                Anthropic. Long selections use multiple requests followed by a text-only
                merge. AI refinement sends document text and editing instructions without
                reading screenshot files.
              </p>
              <p>
                You choose what to send and confirm the provider. Your provider's billing
                and retention policies apply. Canceling cannot recall data already sent or
                guarantee that provider billing stops.
              </p>
              <h2>API keys</h2>
              <p>
                API keys are encrypted using the operating system's credential protection
                through Electron safeStorage. They are shared across your local workspaces
                and can be removed in AI providers. Workspace backups do not contain API
                keys.
              </p>
              <h2>Redactions and original images</h2>
              <p>
                Saved redactions are flattened into screenshots used for AI generation and
                export. The original unredacted images remain on your device, and
                workspace backups contain originals. Redacting an image does not remove
                text already copied into a document, a previous export, or an earlier AI
                request.
              </p>
              <h2>Deletion and backups</h2>
              <p>
                Removing a document step keeps the source capture. Deleting a generated
                revision keeps the original recording. Deleting a recording or workspace
                removes its associated source data, but previously exported files and
                backups remain wherever you saved them.
              </p>
              <h2>This website</h2>
              <p>
                This website offers optional Google Analytics when configured. Google
                Analytics loads only after you choose Allow analytics. It helps us
                understand page visits and usage, using cookies and sending data to
                Google. Advertising consent stays disabled. This measures website visits,
                not your desktop recordings, documents, or API keys.
              </p>
              <p>
                You can decline analytics or change your choice using Cookie settings in
                the footer when analytics is enabled. We remember your choice in this
                browser for up to 90 days. Withdrawing consent stops future collection and
                clears accessible Google Analytics cookies; it does not delete data
                already sent to Google. Without JavaScript, analytics does not load.
              </p>
              <p>
                We remove query strings and fragments from the page address and referrer
                supplied by this integration. Google may also process technical
                information such as browser, device, and network information. See{" "}
                <a href="https://policies.google.com/privacy">Google's privacy policy</a>.
              </p>
              <p>
                The site has no advertising tags, account system, or signup forms.
                SiteGround may process request logs under its own policies. GitHub and AI
                provider websites have their own data practices.
              </p>
              <h2>Questions or concerns</h2>
              <p>
                <a href={repository + "/issues"}>Open a GitHub issue</a> for general
                questions. Public issues are visible to others: do not include API keys,
                personal data, or unredacted screenshots.
              </p>
            </div>
          </div>
        )}
        {page === "support" && (
          <div className="container page-body">
            <PageHeading label="HELP & SUPPORT" title="Let's get you unstuck.">
              Start with the checks below. If something still does not work, a clear issue
              report helps us reproduce it.
            </PageHeading>
            <div className="support-grid">
              <article className="link-card">
                <FileText />
                <h2>Read the guide</h2>
                <p>From your first recording to a file you can share.</p>
                <a className="text-link" href={href("getting-started")}>
                  Getting started
                  <ArrowRight size={15} />
                </a>
              </article>
              <article className="link-card">
                <Github />
                <h2>Report an issue</h2>
                <p>Describe the problem, expected result, and steps to reproduce it.</p>
                <External href={repository + "/issues"}>GitHub issues</External>
              </article>
              <article className="link-card">
                <Code2 />
                <h2>Explore the source</h2>
                <p>Read the implementation and development documentation.</p>
                <External>View repository</External>
              </article>
            </div>
            <div className="narrow">
              <FAQ
                items={[
                  {
                    question: "My recording has no captures.",
                    answer:
                      "Check that you selected the display you are working on, started the recording, and are not paused. Use the floating toolbar to compare clicks received with accepted captures. Captura Desk controls are excluded. Try Capture now to check screenshot capture separately.",
                  },
                  {
                    question: "AI generation fails.",
                    answer:
                      "Test the connection in AI providers. Verify that your API account has access and billing, and choose a model supporting images and structured output. Try a smaller selection. Failed or canceled multi-batch runs do not save a partial draft; retrying can incur additional charges.",
                  },
                  {
                    question: "My exported images are missing.",
                    answer:
                      "For Markdown exports, keep the sibling screenshot folder next to the Markdown file. For simpler sharing, export HTML - single file instead. If a source screenshot is unavailable, check the original recording in the app.",
                  },
                  {
                    question: "Which revision does Export use?",
                    answer:
                      "It exports the document currently selected in the document selector and flushes pending text edits first. Select the revision you want before exporting.",
                  },
                  {
                    question: "How do I make a useful bug report?",
                    answer: (
                      <>
                        Include your Windows version, display count and scaling, app
                        version or commit, and reproducible steps. For AI problems,
                        include the provider and model name.{" "}
                        <strong>Never post an API key or sensitive screenshots.</strong>{" "}
                        Existing logs or screenshots should be reviewed before you share
                        them.
                      </>
                    ),
                  },
                ]}
              />
              <div className="note">
                <CircleHelp size={20} />
                <p>
                  Captura Desk is in development. Support happens through GitHub issues;
                  there is no guaranteed response time.
                </p>
              </div>
            </div>
          </div>
        )}
        {page === "not-found" && (
          <div className="container page-body">
            <PageHeading label="404 / PAGE NOT FOUND" title="This page is not here.">
              The link may have changed. The overview is a good place to start.
            </PageHeading>
            <Button asChild>
              <a href={href("home")}>
                Back to Captura Desk
                <ArrowRight />
              </a>
            </Button>
          </div>
        )}
      </main>
      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <a className="brand" href={href("home")}>
              <img src={root + "images/icon.png"} width="26" height="26" alt="" />
              Captura Desk
            </a>
            <p>
              Capture the work.
              <br />
              Keep the knowledge.
            </p>
            <span className="footer-note">Built for Windows. In development.</span>
          </div>
          <nav aria-label="Product links">
            <span>PRODUCT</span>
            <a href={href("home")}>Overview</a>
            <a href={href("download")}>Availability</a>
            <a href={href("changelog")}>Changelog</a>
          </nav>
          <nav aria-label="Resources">
            <span>RESOURCES</span>
            <a href={href("getting-started")}>Getting started</a>
            <a href={href("privacy")}>Privacy & data</a>
            <a href={href("support")}>Support</a>
            <a href={repository}>
              GitHub
              <ArrowUpRight size={12} />
            </a>
          </nav>
        </div>
        <div className="container footer-bottom">
          <span>Captura Desk</span>
          <span>A desktop tool for sharing what you know.</span>
          <AnalyticsConsent privacyHref={href("privacy")} />
        </div>
      </footer>
    </>
  );
}
