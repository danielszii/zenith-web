import { FormEvent, ReactNode, useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  ImagePlus,
  LockKeyhole,
  LogOut,
  Mail,
  Medal,
  Search,
  ShieldCheck,
  Trophy,
  Upload,
  Users,
} from "lucide-react";
import { Logo } from "./Logo";
import { getApiError, hasApiStatus, zenithApi } from "../services/zenithApi";
import type {
  Athlete,
  AthleteStats,
  Championship,
  Club,
  Match,
  MatchOfficial,
  SessionUser,
  Standing,
  UserRole,
} from "../types/api";

type Tab = "account" | "clubs" | "athletes" | "championships" | "matches";
type Run = (
  action: () => Promise<unknown>,
  success: string,
  reload?: boolean,
) => Promise<boolean>;
const field =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--input-background)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none focus:ring-2 focus:ring-[var(--primary)]";
const primary =
  "rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-[var(--primary-foreground)] disabled:opacity-50";
const secondary =
  "rounded-xl border border-[var(--border)] bg-[var(--surface-glass)] px-3 py-2 text-sm hover:bg-[var(--surface-glass-hover)]";
const danger =
  "rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400";
const panel =
  "rounded-2xl border border-[var(--border)] bg-[var(--surface-glass)] p-5";
const blankClub = {
  nome: "",
  brasao: "",
  cores_oficiais: "",
  responsavel: "",
  cnpj: "",
};
const blankAthlete = {
  nome: "",
  cpf: "",
  rg: "",
  foto_perfil: "",
  data_nasc: "",
  status: "ativo",
  peso: "",
  altura: "",
  tipo_sanguineo: "",
  id_clube: "",
};
const blankChampionship = {
  nome: "",
  formato: "",
  data_inicio: "",
  data_fim: "",
  criterios_desempate: "",
  status: "planejado" as Championship["status"],
  modalidade: "futsal" as Championship["modalidade"],
  categoria: "profissional" as Championship["categoria"],
};
const blankMatch = {
  id_campeonato: "",
  id_mandante: "",
  id_visitante: "",
  data: "",
  hora: "",
  local: "",
};
const dateOnly = (value: string) => value?.slice(0, 10) || "";

async function uploadOrContinue(file: File, kind: "atleta" | "clube") {
  try {
    return await zenithApi.media.upload(file, kind);
  } catch (error) {
    if (
      hasApiStatus(error, 503) &&
      window.confirm(
        "O armazenamento de imagens ainda não foi configurado. Deseja concluir o cadastro sem imagem? Você poderá adicioná-la depois.",
      )
    ) {
      return null;
    }
    throw error;
  }
}

export function ManagementPage() {
  const [tab, setTab] = useState<Tab>("account");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{
    error?: boolean;
    text: string;
  } | null>(null);
  const [user, setUser] = useState<SessionUser | null>(() => {
    try {
      return JSON.parse(localStorage.getItem("@zenith:user") || "null");
    } catch {
      return null;
    }
  });
  const [clubs, setClubs] = useState<Club[]>([]);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    const expireSession = () => {
      setUser(null);
      setNotice({ error: true, text: 'Sua sessão expirou. Entre novamente.' });
    };
    window.addEventListener('zenith:session-expired', expireSession);
    return () => window.removeEventListener('zenith:session-expired', expireSession);
  }, []);

  const reload = useCallback(async (role?: UserRole) => {
    setBusy(true);
    try {
      const data = await Promise.all([
        zenithApi.clubs.list(),
        role === "mesario" ? Promise.resolve([]) : zenithApi.athletes.list(),
        zenithApi.championships.list(),
        zenithApi.matches.list(),
      ]);
      setClubs(data[0]);
      setAthletes(data[1]);
      setChampionships(data[2]);
      setMatches(data[3]);
    } catch (error) {
      setNotice({ error: true, text: getApiError(error) });
    } finally {
      setBusy(false);
    }
  }, []);
  useEffect(() => {
    if (user) void reload(user.role);
    else setTab('account');
  }, [reload, user]);
  const run: Run = async (action, success, shouldReload = true) => {
    setBusy(true);
    setNotice(null);
    try {
      await action();
      if (shouldReload) await reload(user?.role);
      setNotice({ text: success });
      return true;
    } catch (error) {
      setNotice({ error: true, text: getApiError(error) });
      return false;
    } finally {
      setBusy(false);
    }
  };
  const tabs = [
    ["account", "Acesso", ShieldCheck],
    ["clubs", "Clubes", Users],
    ["athletes", "Atletas", Medal],
    ["championships", "Campeonatos", Trophy],
    ["matches", "Partidas", CalendarDays],
  ] as const;
  const visibleTabs = user?.role === "mesario"
    ? tabs.filter(([id]) => id === "account" || id === "matches")
    : tabs;

  if (!user) {
    return <LoginPage busy={busy} notice={notice} run={run} setUser={setUser} />;
  }

  return (
    <main className="page-enter app-shell w-full flex-1 py-8 lg:py-10">
      <div className="grid min-h-[72vh] gap-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <aside className="h-fit rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3 lg:sticky lg:top-24">
          <div className="border-b border-[var(--border)] px-3 pb-4 pt-2">
            <p className="text-[.62rem] font-black uppercase tracking-[.2em] text-[var(--primary)]">Gestão Zenith</p>
            <strong className="mt-2 block truncate text-sm">{user.nome}</strong>
            <span className="text-xs capitalize text-[var(--muted-foreground)]">{user.role}</span>
          </div>
          <nav className="scrollbar-hide mt-3 flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {visibleTabs.map(([id, label, Icon]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${tab === id ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"}`}
              >
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
          </nav>
        </aside>
        <section className="min-w-0">
          <header className="mb-6 flex flex-col justify-between gap-4 border-b border-[var(--border)] pb-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-[var(--primary)]">Portal de gestão</p>
              <h1 className="font-display mt-2 text-5xl tracking-wide sm:text-6xl">{visibleTabs.find(([id]) => id === tab)?.[1]}</h1>
              <p className="mt-2 max-w-xl text-sm text-[var(--muted-foreground)]">Gerencie os dados oficiais exibidos no portal e enviados ao aplicativo.</p>
            </div>
            <button className={secondary} onClick={() => void reload(user.role)}>
              {busy ? "Sincronizando…" : "Atualizar dados"}
            </button>
          </header>
          {notice && (
            <div className={`mb-5 rounded-xl border p-4 text-sm ${notice.error ? "border-red-500/30 bg-red-500/10 text-red-300" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"}`}>
              {notice.text}
            </div>
          )}
      {tab === "account" && (
        <Account user={user} setUser={setUser} run={run} busy={busy} />
      )}
      {tab === "clubs" && <Clubs clubs={clubs} run={run} busy={busy} />}
      {tab === "athletes" && (
        <Athletes athletes={athletes} clubs={clubs} run={run} busy={busy} />
      )}
      {tab === "championships" && (
        <Championships
          championships={championships}
          clubs={clubs}
          run={run}
          busy={busy}
        />
      )}
      {tab === "matches" && (
        <Matches
          matches={matches}
          championships={championships}
          clubs={clubs}
          run={run}
          busy={busy}
          user={user}
        />
      )}
        </section>
      </div>
    </main>
  );
}

function LoginPage({
  busy,
  notice,
  run,
  setUser,
}: {
  busy: boolean;
  notice: { error?: boolean; text: string } | null;
  run: Run;
  setUser: (user: SessionUser) => void;
}) {
  const [credentials, setCredentials] = useState({ email: "", senha: "" });

  const signIn = async (event: FormEvent) => {
    event.preventDefault();
    await run(
      async () => {
        const session = await zenithApi.login(credentials.email, credentials.senha);
        localStorage.setItem("@zenith:token", session.token);
        localStorage.setItem("@zenith:user", JSON.stringify(session.usuario));
        setUser(session.usuario);
      },
      "Login realizado.",
      false,
    );
  };

  return (
    <main className="page-enter flex min-h-[calc(100vh-72px)] flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Logo full className="mb-7 justify-center" />
          <p className="eyebrow mt-6">Área Zenith</p>
          <h1 className="font-display mt-3 text-5xl leading-none sm:text-6xl">ACESSE SUA CONTA</h1>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-[var(--muted-foreground)]">
            Entre para acessar o espaço da sua organização, competição ou equipe operacional.
          </p>
        </div>

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-glass)] p-6 shadow-2xl shadow-black/20 sm:p-8">
          {notice?.error && (
            <div role="alert" className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              {notice.text}
            </div>
          )}

          <form className="space-y-5" onSubmit={signIn}>
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">E-mail</span>
              <span className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--input-background)] px-4 focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[color:var(--primary)]/15">
                <Mail className="h-4 w-4 shrink-0 text-[var(--muted-foreground)]" />
                <input
                  className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-none"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="voce@exemplo.com"
                  value={credentials.email}
                  onChange={(event) => setCredentials({ ...credentials, email: event.target.value })}
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Senha</span>
              <span className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--input-background)] px-4 focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[color:var(--primary)]/15">
                <LockKeyhole className="h-4 w-4 shrink-0 text-[var(--muted-foreground)]" />
                <input
                  className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-none"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="Digite sua senha"
                  value={credentials.senha}
                  onChange={(event) => setCredentials({ ...credentials, senha: event.target.value })}
                />
              </span>
            </label>

            <button type="submit" className="button-primary min-h-12 w-full" disabled={busy}>
              {busy ? "Entrando…" : "Entrar"}
              {!busy && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
        </section>

        <p className="mt-5 text-center text-xs text-[var(--muted-foreground)]">
          O acesso é fornecido pela organização responsável pela sua conta.
        </p>
      </div>
    </main>
  );
}

function Account({
  user,
  setUser,
  run,
  busy,
}: {
  user: SessionUser;
  setUser: (u: SessionUser | null) => void;
  run: Run;
  busy: boolean;
}) {
  const [register, setRegister] = useState({
    nome: "",
    email: "",
    senha: "",
    role: "gestor" as UserRole,
  });
  const logout = () => {
    localStorage.removeItem("@zenith:token");
    localStorage.removeItem("@zenith:user");
    setUser(null);
  };
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className={panel}>
        <h2 className="mb-4 text-xl font-semibold">Sua conta</h2>
        <div className="space-y-3">
          <p className="font-medium">{user.nome}</p>
          <p className="text-sm text-[var(--muted-foreground)]">
            {user.email} · {user.role}
          </p>
          <button className={danger} onClick={logout}>
            <LogOut className="mr-2 inline h-4 w-4" />
            Sair
          </button>
        </div>
      </section>
      {user?.role === 'admin' && <section className={panel}>
        <h2 className="mb-4 text-xl font-semibold">
          Cadastrar usuário do portal
        </h2>
        <form
          className="grid gap-3 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            void run(
              () => zenithApi.register(register),
              "Usuário criado.",
              false,
            );
          }}
        >
          <input
            className={field}
            required
            placeholder="Nome"
            value={register.nome}
            onChange={(e) => setRegister({ ...register, nome: e.target.value })}
          />
          <input
            className={field}
            type="email"
            required
            placeholder="E-mail"
            value={register.email}
            onChange={(e) =>
              setRegister({ ...register, email: e.target.value })
            }
          />
          <input
            className={field}
            type="password"
            required
            minLength={8}
            placeholder="Senha"
            value={register.senha}
            onChange={(e) =>
              setRegister({ ...register, senha: e.target.value })
            }
          />
          <select
            className={field}
            value={register.role}
            onChange={(e) =>
              setRegister({ ...register, role: e.target.value as UserRole })
            }
          >
            <option value="gestor">Gestor</option>
            <option value="admin">Administrador</option>
            <option value="mesario">Mesário (app)</option>
          </select>
          <button className={primary} disabled={busy}>
            Criar usuário
          </button>
        </form>
      </section>}
    </div>
  );
}

function SearchField({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <label className="mb-4 flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--input-background)] px-3">
      <Search className="h-4 w-4 text-[var(--muted-foreground)]" />
      <input className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </label>
  );
}

function ImageUploadField({
  label,
  hint,
  value,
  preview,
  portrait = false,
  onSelect,
}: {
  label: string;
  hint: string;
  value?: string;
  preview?: string;
  portrait?: boolean;
  onSelect: (file: File) => void;
}) {
  const image = preview || value;
  return (
    <label className="group block cursor-pointer rounded-2xl border border-dashed border-[var(--border)] bg-[var(--input-background)] p-3 transition hover:border-[var(--primary)]">
      <input
        className="sr-only"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onSelect(file);
          event.target.value = "";
        }}
      />
      <span className="flex items-center gap-4">
        <span className={`grid shrink-0 place-items-center overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--muted)] ${portrait ? "h-24 w-20" : "h-20 w-20"}`}>
          {image ? (
            <img src={image} alt="Pré-visualização" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus className="h-7 w-7 text-[var(--muted-foreground)]" />
          )}
        </span>
        <span className="min-w-0 flex-1">
          <strong className="block text-sm">{label}</strong>
          <span className="mt-1 block text-xs leading-5 text-[var(--muted-foreground)]">{hint}</span>
          <span className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-[var(--primary)]">
            <Upload className="h-4 w-4" /> {image ? "Trocar imagem" : "Selecionar imagem"}
          </span>
        </span>
      </span>
    </label>
  );
}

function Clubs({
  clubs,
  run,
  busy,
}: {
  clubs: Club[];
  run: Run;
  busy: boolean;
}) {
  const [form, setForm] = useState(blankClub);
  const [editId, setEditId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [query, setQuery] = useState("");
  const resetImage = () => {
    if (imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview("");
  };
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const ok = await run(
      async () => {
        const payload = { ...form, cnpj: form.cnpj || undefined };
        if (imageFile) {
          const uploaded = await uploadOrContinue(imageFile, "clube");
          if (uploaded) payload.brasao = uploaded.url;
        }
        return editId
          ? zenithApi.clubs.update(editId, payload)
          : zenithApi.clubs.create(payload);
      },
      editId ? "Clube atualizado." : "Clube criado.",
    );
    if (ok) {
      setEditId(null);
      setForm(blankClub);
      resetImage();
    }
  };
  return (
    <Layout
      title="Clubes"
      form={
        <form className="space-y-3" onSubmit={submit}>
          {(
            ["nome", "responsavel", "cnpj", "cores_oficiais"] as const
          ).map((key) => (
            <input
              key={key}
              className={field}
              required={["nome", "responsavel"].includes(key)}
              placeholder={
                {
                  nome: "Nome",
                  responsavel: "Responsável",
                  cnpj: "CNPJ",
                  cores_oficiais: "Cores oficiais",
                }[key]
              }
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          ))}
          <ImageUploadField
            label="Escudo do clube"
            hint="PNG, JPG ou WebP · máximo 4 MB"
            value={form.brasao}
            preview={imagePreview}
            onSelect={(file) => {
              resetImage();
              setImageFile(file);
              setImagePreview(URL.createObjectURL(file));
            }}
          />
          <button className={primary} disabled={busy}>
            {editId ? "Salvar" : "Cadastrar"}
          </button>
          {editId && (
            <button
              type="button"
              className={`${secondary} ml-2`}
              onClick={() => {
                setEditId(null);
                setForm(blankClub);
                resetImage();
              }}
            >
              Cancelar
            </button>
          )}
        </form>
      }
      list={<>
        <SearchField value={query} onChange={setQuery} placeholder="Buscar clube" />
        {clubs.filter((club) => `${club.nome} ${club.responsavel} ${club.cnpj}`.toLowerCase().includes(query.toLowerCase())).map((c) => (
        <Row
          key={c.id_clube}
          title={c.nome}
          subtitle={`${c.responsavel || "Sem responsável"} · ${c.cnpj || "Sem CNPJ"}`}
          leading={c.brasao ? <img src={c.brasao} alt="" className="h-full w-full object-contain p-1" /> : <Users className="h-5 w-5" />}
        >
          <button
            className={secondary}
            onClick={() => {
              resetImage();
              setEditId(c.id_clube);
              setForm({
                nome: c.nome,
                brasao: c.brasao || "",
                cores_oficiais: c.cores_oficiais || "",
                responsavel: c.responsavel || "",
                cnpj: c.cnpj || "",
              });
            }}
          >
            Editar
          </button>
          <button
            className={danger}
            onClick={() =>
              confirm("Excluir clube?") &&
              void run(
                () => zenithApi.clubs.remove(c.id_clube),
                "Clube excluído.",
              )
            }
          >
            Excluir
          </button>
        </Row>
      ))}</>}
    />
  );
}

function Athletes({
  athletes,
  clubs,
  run,
  busy,
}: {
  athletes: Athlete[];
  clubs: Club[];
  run: Run;
  busy: boolean;
}) {
  const [form, setForm] = useState(blankAthlete);
  const [editId, setEditId] = useState<string | null>(null);
  const [stats, setStats] = useState<AthleteStats | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [query, setQuery] = useState("");
  const resetImage = () => {
    if (imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview("");
  };
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const ok = await run(
      async () => {
        const uploaded = imageFile ? await uploadOrContinue(imageFile, "atleta") : null;
        const payload = {
          ...form,
          cpf: form.cpf || undefined,
          rg: form.rg || undefined,
          tipo_sanguineo: form.tipo_sanguineo || undefined,
          foto_perfil: uploaded?.url || form.foto_perfil || undefined,
          peso: form.peso ? Number(form.peso) : undefined,
          altura: form.altura ? Number(form.altura) : undefined,
        };
        return editId
          ? zenithApi.athletes.update(editId, payload)
          : zenithApi.athletes.create(payload);
      },
      editId ? "Atleta atualizado." : "Atleta criado.",
    );
    if (ok) {
      setEditId(null);
      setForm(blankAthlete);
      resetImage();
    }
  };
  const edit = (a: Athlete) => {
    resetImage();
    setEditId(a.id_atleta);
    setForm({
      nome: a.nome,
      cpf: a.cpf || "",
      rg: a.rg || "",
      foto_perfil: a.foto_perfil || "",
      data_nasc: dateOnly(a.data_nasc),
      status: a.status,
      peso: a.peso?.toString() || "",
      altura: a.altura?.toString() || "",
      tipo_sanguineo: a.tipo_sanguineo || "",
      id_clube: a.id_clube,
    });
  };
  return (
    <>
      <Layout
        title="Atletas"
        form={
          <form className="grid gap-3 sm:grid-cols-2" onSubmit={submit}>
            <input
              className={field}
              required
              placeholder="Nome"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />
            <input
              className={field}
              placeholder="CPF (opcional)"
              value={form.cpf}
              onChange={(e) => setForm({ ...form, cpf: e.target.value })}
            />
            <input
              className={field}
              placeholder="RG (opcional)"
              value={form.rg}
              onChange={(e) => setForm({ ...form, rg: e.target.value })}
            />
            <ImageUploadField
              label="Foto do atleta"
              hint="Prefira uma foto vertical e nítida · máximo 4 MB"
              value={form.foto_perfil}
              preview={imagePreview}
              portrait
              onSelect={(file) => {
                resetImage();
                setImageFile(file);
                setImagePreview(URL.createObjectURL(file));
              }}
            />
            <input
              className={field}
              required
              type="date"
              value={form.data_nasc}
              onChange={(e) => setForm({ ...form, data_nasc: e.target.value })}
            />
            <select
              className={field}
              value={form.tipo_sanguineo}
              onChange={(e) =>
                setForm({ ...form, tipo_sanguineo: e.target.value })
              }
            >
              <option value="">Tipo sanguíneo (opcional)</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((tipo) => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
            <select
              className={field}
              required
              value={form.id_clube}
              onChange={(e) => setForm({ ...form, id_clube: e.target.value })}
            >
              <option value="">Clube</option>
              {clubs.map((c) => (
                <option key={c.id_clube} value={c.id_clube}>
                  {c.nome}
                </option>
              ))}
            </select>
            <input
              className={field}
              type="number"
              step=".01"
              placeholder="Peso"
              value={form.peso}
              onChange={(e) => setForm({ ...form, peso: e.target.value })}
            />
            <input
              className={field}
              type="number"
              step=".01"
              placeholder="Altura"
              value={form.altura}
              onChange={(e) => setForm({ ...form, altura: e.target.value })}
            />
            <input
              className={field}
              required
              placeholder="Status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            />
            <button className={primary} disabled={busy}>
              {editId ? "Salvar" : "Cadastrar"}
            </button>
          </form>
        }
        list={<>
          <SearchField value={query} onChange={setQuery} placeholder="Buscar atleta ou clube" />
          {athletes.filter((athlete) => `${athlete.nome} ${clubs.find((club) => club.id_clube === athlete.id_clube)?.nome || ""}`.toLowerCase().includes(query.toLowerCase())).map((a) => (
          <Row
            key={a.id_atleta}
            title={a.nome}
            subtitle={`${clubs.find((c) => c.id_clube === a.id_clube)?.nome || "Sem clube"} · ${a.status}`}
            leading={a.foto_perfil ? <img src={a.foto_perfil} alt="" className="h-full w-full object-cover" /> : <Medal className="h-5 w-5" />}
          >
            <button
              className={secondary}
              onClick={async () => {
                try {
                  setStats(await zenithApi.athletes.stats(a.id_atleta));
                } catch (e) {
                  alert(getApiError(e));
                }
              }}
            >
              Estatísticas
            </button>
            <button className={secondary} onClick={() => edit(a)}>
              Editar
            </button>
            <button
              className={danger}
              onClick={() =>
                confirm("Excluir atleta?") &&
                void run(
                  () => zenithApi.athletes.remove(a.id_atleta),
                  "Atleta excluído.",
                )
              }
            >
              Excluir
            </button>
          </Row>
        ))}</>}
      />
      {stats && (
        <section className={`${panel} mt-6`}>
          <button className="float-right" onClick={() => setStats(null)}>
            ×
          </button>
          <h3 className="text-lg font-semibold">{stats.jogador.nome}</h3>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5">
            {Object.entries(stats.estatisticas).map(([key, value]) => (
              <div key={key} className="rounded-xl bg-[var(--muted)] p-3">
                <p className="text-xs text-[var(--muted-foreground)]">
                  {key.replaceAll("_", " ")}
                </p>
                <strong className="text-2xl">{value}</strong>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function Championships({
  championships,
  clubs,
  run,
  busy,
}: {
  championships: Championship[];
  clubs: Club[];
  run: Run;
  busy: boolean;
}) {
  const [form, setForm] = useState(blankChampionship);
  const [editId, setEditId] = useState<string | null>(null);
  const [enroll, setEnroll] = useState({ id_campeonato: "", id_clube: "" });
  const [table, setTable] = useState<Standing[]>([]);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const ok = await run(
      () =>
        editId
          ? zenithApi.championships.update(editId, form)
          : zenithApi.championships.create(form),
      editId ? "Campeonato atualizado." : "Campeonato criado.",
    );
    if (ok) {
      setEditId(null);
      setForm(blankChampionship);
    }
  };
  const edit = (c: Championship) => {
    setEditId(c.id_campeonato);
    setForm({
      nome: c.nome,
      formato: c.formato || "",
      data_inicio: dateOnly(c.data_inicio),
      data_fim: dateOnly(c.data_fim),
      criterios_desempate: c.criterios_desempate || "",
      status: c.status,
      modalidade: c.modalidade,
      categoria: c.categoria,
    });
  };
  return (
    <div className="space-y-6">
      <Layout
        title="Campeonatos"
        form={
          <form className="grid gap-3 sm:grid-cols-2" onSubmit={submit}>
            <input
              className={field}
              required
              placeholder="Nome"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />
            <input
              className={field}
              placeholder="Formato"
              value={form.formato}
              onChange={(e) => setForm({ ...form, formato: e.target.value })}
            />
            <input
              className={field}
              required
              type="date"
              value={form.data_inicio}
              onChange={(e) =>
                setForm({ ...form, data_inicio: e.target.value })
              }
            />
            <input
              className={field}
              required
              type="date"
              value={form.data_fim}
              onChange={(e) => setForm({ ...form, data_fim: e.target.value })}
            />
            <select
              className={field}
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value as Championship["status"],
                })
              }
            >
              <option>planejado</option>
              <option>em andamento</option>
              <option>finalizado</option>
            </select>
            <select
              className={field}
              value={form.modalidade}
              onChange={(e) =>
                setForm({
                  ...form,
                  modalidade: e.target.value as Championship["modalidade"],
                })
              }
            >
              <option>futsal</option>
              <option>futebol</option>
            </select>
            <select
              className={field}
              value={form.categoria}
              onChange={(e) =>
                setForm({
                  ...form,
                  categoria: e.target.value as Championship["categoria"],
                })
              }
            >
              <option>profissional</option>
              <option>sub-21</option>
              <option>sub-19</option>
              <option>sub-17</option>
            </select>
            <input
              className={field}
              placeholder="Critérios de desempate"
              value={form.criterios_desempate}
              onChange={(e) =>
                setForm({ ...form, criterios_desempate: e.target.value })
              }
            />
            <button className={primary} disabled={busy}>
              {editId ? "Salvar" : "Criar"}
            </button>
          </form>
        }
        list={championships.map((c) => (
          <Row
            key={c.id_campeonato}
            title={c.nome}
            subtitle={`${c.modalidade} · ${c.categoria} · ${c.status}`}
          >
            <button
              className={secondary}
              onClick={async () => {
                try {
                  setTable(
                    await zenithApi.championships.standings(c.id_campeonato),
                  );
                } catch (e) {
                  alert(getApiError(e));
                }
              }}
            >
              Tabela
            </button>
            <button className={secondary} onClick={() => edit(c)}>
              Editar
            </button>
            <button
              className={danger}
              onClick={() =>
                confirm("Excluir campeonato?") &&
                void run(
                  () => zenithApi.championships.remove(c.id_campeonato),
                  "Campeonato excluído.",
                )
              }
            >
              Excluir
            </button>
          </Row>
        ))}
      />
      <section className={panel}>
        <h3 className="mb-3 text-lg font-semibold">Inscrever clube</h3>
        <div className="flex flex-wrap gap-3">
          <select
            className={`${field} max-w-sm`}
            value={enroll.id_campeonato}
            onChange={(e) =>
              setEnroll({ ...enroll, id_campeonato: e.target.value })
            }
          >
            <option value="">Campeonato</option>
            {championships.map((c) => (
              <option key={c.id_campeonato} value={c.id_campeonato}>
                {c.nome}
              </option>
            ))}
          </select>
          <select
            className={`${field} max-w-sm`}
            value={enroll.id_clube}
            onChange={(e) => setEnroll({ ...enroll, id_clube: e.target.value })}
          >
            <option value="">Clube</option>
            {clubs.map((c) => (
              <option key={c.id_clube} value={c.id_clube}>
                {c.nome}
              </option>
            ))}
          </select>
          <button
            className={primary}
            disabled={!enroll.id_campeonato || !enroll.id_clube}
            onClick={() =>
              void run(
                () =>
                  zenithApi.championships.enroll(
                    enroll.id_campeonato,
                    enroll.id_clube,
                  ),
                "Clube inscrito.",
              )
            }
          >
            Inscrever
          </button>
        </div>
      </section>
      {table.length > 0 && (
        <section className={panel}>
          <h3 className="mb-3 text-lg font-semibold">Classificação</h3>
          {table.map((s) => (
            <Row
              key={s.id_clube}
              title={`${s.clube} — ${s.pontos} pts`}
              subtitle={`${s.jogos} jogos · ${s.vitorias} vitórias · saldo ${s.saldo_gols}`}
            />
          ))}
        </section>
      )}
    </div>
  );
}

function Matches({
  matches,
  championships,
  clubs,
  run,
  busy,
  user,
}: {
  matches: Match[];
  championships: Championship[];
  clubs: Club[];
  run: Run;
  busy: boolean;
  user: SessionUser | null;
}) {
  const [form, setForm] = useState(blankMatch);
  const [officials, setOfficials] = useState<MatchOfficial[]>([]);
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  useEffect(() => {
    if (user?.role === "admin") void zenithApi.matches.officials().then(setOfficials).catch(() => setOfficials([]));
  }, [user]);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (await run(() => zenithApi.matches.create(form), "Partida agendada."))
      setForm(blankMatch);
  };
  return (
    <Layout
      title="Partidas"
      form={
        <form className="grid gap-3 sm:grid-cols-2" onSubmit={submit}>
          <select
            className={field}
            required
            value={form.id_campeonato}
            onChange={(e) =>
              setForm({ ...form, id_campeonato: e.target.value })
            }
          >
            <option value="">Campeonato</option>
            {championships.map((c) => (
              <option key={c.id_campeonato} value={c.id_campeonato}>
                {c.nome}
              </option>
            ))}
          </select>
          <select
            className={field}
            required
            value={form.id_mandante}
            onChange={(e) => setForm({ ...form, id_mandante: e.target.value })}
          >
            <option value="">Mandante</option>
            {clubs.map((c) => (
              <option key={c.id_clube} value={c.id_clube}>
                {c.nome}
              </option>
            ))}
          </select>
          <select
            className={field}
            required
            value={form.id_visitante}
            onChange={(e) => setForm({ ...form, id_visitante: e.target.value })}
          >
            <option value="">Visitante</option>
            {clubs.map((c) => (
              <option key={c.id_clube} value={c.id_clube}>
                {c.nome}
              </option>
            ))}
          </select>
          <input
            className={field}
            type="date"
            required
            value={form.data}
            onChange={(e) => setForm({ ...form, data: e.target.value })}
          />
          <input
            className={field}
            type="time"
            required
            value={form.hora}
            onChange={(e) => setForm({ ...form, hora: e.target.value })}
          />
          <input
            className={field}
            required
            placeholder="Local"
            value={form.local}
            onChange={(e) => setForm({ ...form, local: e.target.value })}
          />
          <button className={primary} disabled={busy}>
            Agendar
          </button>
        </form>
      }
      list={matches.map((m) => (
        <Row
          key={m.id_partida}
          title={`${m.mandante?.nome || "Mandante"} ${m.gols_mandante ?? 0} × ${m.gols_visitante ?? 0} ${m.visitante?.nome || "Visitante"}`}
          subtitle={`${dateOnly(m.data)} ${m.hora?.slice(0, 5)} · ${m.status}`}
        >
          {user?.role === "admin" && (
            <select
              className={secondary}
              value={assignments[m.id_partida] || ""}
              onChange={(event) => {
                const usuarioId = event.target.value;
                setAssignments({ ...assignments, [m.id_partida]: usuarioId });
                if (usuarioId) void run(() => zenithApi.matches.assign(m.id_partida, usuarioId), "Partida enviada ao aplicativo do mesário.", false);
              }}
            >
              <option value="">Atribuir mesário</option>
              {officials.map((official) => <option key={official.id_usuario} value={official.id_usuario}>{official.nome}</option>)}
            </select>
          )}
          <button
            className={danger}
            onClick={() =>
              confirm("Excluir partida?") &&
              void run(
                () => zenithApi.matches.remove(m.id_partida),
                "Partida excluída.",
              )
            }
          >
            Excluir
          </button>
        </Row>
      ))}
    />
  );
}

function Layout({
  title,
  form,
  list,
}: {
  title: string;
  form: ReactNode;
  list: ReactNode;
}) {
  return (
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(22rem,25rem)_minmax(0,1fr)]">
      <section className={`${panel} xl:sticky xl:top-24`}>
        <p className="text-[.62rem] font-black uppercase tracking-[.18em] text-[var(--primary)]">{title.includes("Partida") ? "Nova operação" : "Novo cadastro"}</p>
        <h2 className="mb-5 mt-1 text-xl font-semibold">{title}</h2>
        {form}
      </section>
      <section className={panel}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div><p className="text-[.62rem] font-black uppercase tracking-[.18em] text-[var(--primary)]">Base oficial</p><h2 className="mt-1 text-xl font-semibold">Registros</h2></div>
        </div>
        <div className="space-y-3">{list}</div>
      </section>
    </div>
  );
}
function Row({
  title,
  subtitle,
  leading,
  children,
}: {
  title: string;
  subtitle: string;
  leading?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 transition hover:border-[color:var(--primary)]/40 md:flex-row md:items-center">
      <div className="flex min-w-0 items-center gap-3">
        {leading && <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-[var(--muted)] text-[var(--primary)]">{leading}</span>}
        <div className="min-w-0">
          <p className="truncate font-semibold">{title}</p>
          <p className="truncate text-sm text-[var(--muted-foreground)]">{subtitle}</p>
        </div>
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}
