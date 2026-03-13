import { useMemo, useState } from "react";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { useArenaStore } from "@/lib/arenaStore";
import type { Bull, Event, GalleryItem, Tropeiro, TropeiroUser } from "@/data/mockData";

type CrudKey = "tropeiros" | "touros" | "eventos" | "fotos" | "videos" | "usuarios";

type Props = { title: string; type: CrudKey };

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block space-y-2 text-sm"><span className="text-muted-foreground">{label}</span>{children}</label>
);

const TextInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} className={`w-full bg-background border border-gold rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-primary ${props.className ?? ""}`} />;
const TextArea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...props} className={`w-full bg-background border border-gold rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-primary min-h-28 ${props.className ?? ""}`} />;
const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => <select {...props} className={`w-full bg-background border border-gold rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-primary ${props.className ?? ""}`} />;

const AdminCrudPage = ({ title, type }: Props) => {
  const store = useArenaStore();
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const datasets = useMemo(() => ({
    tropeiros: store.data.tropeiros,
    touros: store.data.bulls,
    eventos: store.data.events,
    fotos: store.data.gallery.filter((item) => item.type === "photo"),
    videos: store.data.gallery.filter((item) => item.type === "video"),
    usuarios: store.data.users,
  }), [store.data]);

  const data = datasets[type] as Array<Record<string, unknown>>;
  const filtered = data.filter((item) => JSON.stringify(item).toLowerCase().includes(search.toLowerCase()));

  const closeModal = () => { setOpen(false); setEditingId(null); };

  const renderForm = () => {
    if (type === "tropeiros") return <TropeiroForm id={editingId} onClose={closeModal} />;
    if (type === "touros") return <BullForm id={editingId} onClose={closeModal} />;
    if (type === "eventos") return <EventForm id={editingId} onClose={closeModal} />;
    if (type === "usuarios") return <UserForm id={editingId} onClose={closeModal} />;
    return <GalleryForm id={editingId} onClose={closeModal} type={type === "fotos" ? "photo" : "video"} />;
  };

  const removeItem = (id: number) => {
    if (!window.confirm("Deseja remover este registro?")) return;
    if (type === "tropeiros") store.deleteTropeiro(id);
    if (type === "touros") store.deleteBull(id);
    if (type === "eventos") store.deleteEvent(id);
    if (type === "usuarios") store.deleteUser(id);
    if (type === "fotos" || type === "videos") store.deleteGalleryItem(id);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div><h1 className="text-3xl font-semibold uppercase text-gradient-gold">{title}</h1><p className="text-muted-foreground text-sm mt-1">{data.length} registros</p></div>
          <button onClick={() => setOpen(true)} className="bg-gradient-gold text-primary-foreground uppercase tracking-wider px-5 py-2 rounded text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"><Plus className="w-4 h-4" />Novo</button>
        </div>
        <div className="relative max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input type="text" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-card border border-gold rounded pl-10 pr-4 py-2.5 text-sm" /></div>
        <div className="bg-card border border-gold rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full"><thead><tr className="border-b border-border bg-primary/5">{getColumns(type).map((col) => <th key={col.key} className="text-left py-3 px-4 text-xs uppercase tracking-wider text-primary">{col.label}</th>)}<th className="text-right py-3 px-4 text-xs uppercase tracking-wider text-primary">Ações</th></tr></thead><tbody>{filtered.length ? filtered.map((item) => <tr key={String(item.id)} className="border-b border-border/50 hover:bg-muted/30 transition-colors">{getColumns(type).map((col) => <td key={col.key} className="py-3 px-4 text-sm">{String(item[col.key] ?? "")}</td>)}<td className="py-3 px-4 text-right"><div className="flex gap-2 justify-end"><button onClick={() => { setEditingId(Number(item.id)); setOpen(true); }} className="p-1.5 rounded hover:bg-muted"><Edit className="w-4 h-4" /></button><button onClick={() => removeItem(Number(item.id))} className="p-1.5 rounded hover:bg-muted text-destructive"><Trash2 className="w-4 h-4" /></button></div></td></tr>) : <tr><td colSpan={getColumns(type).length + 1} className="py-10 text-center text-muted-foreground">Nenhum registro encontrado.</td></tr>}</tbody></table>
          </div>
        </div>
        {open && <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-auto"><div className="max-w-3xl mx-auto bg-card border border-gold rounded-2xl p-6 mt-10"><div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-semibold">{editingId ? "Editar registro" : "Novo registro"}</h2><button onClick={closeModal} className="text-muted-foreground hover:text-foreground">Fechar</button></div>{renderForm()}</div></div>}
      </div>
    </AdminLayout>
  );
};

const getColumns = (type: CrudKey) => {
  const map = {
    tropeiros: [{ key: "name", label: "Nome" }, { key: "team", label: "Equipe" }, { key: "city", label: "Cidade" }, { key: "bullCount", label: "Touros" }, { key: "phone", label: "Telefone" }],
    touros: [{ key: "name", label: "Nome" }, { key: "score", label: "Nota" }, { key: "tropeiro", label: "Tropeiro" }, { key: "age", label: "Idade" }, { key: "weight", label: "Peso" }, { key: "events", label: "Eventos" }],
    eventos: [{ key: "name", label: "Nome" }, { key: "date", label: "Data" }, { key: "city", label: "Cidade" }, { key: "status", label: "Status" }, { key: "bullCount", label: "Touros" }],
    fotos: [{ key: "title", label: "Título" }, { key: "category", label: "Categoria" }, { key: "bull", label: "Touro" }, { key: "tropeiro", label: "Tropeiro" }],
    videos: [{ key: "title", label: "Título" }, { key: "category", label: "Categoria" }, { key: "event", label: "Evento" }, { key: "tropeiro", label: "Tropeiro" }],
    usuarios: [{ key: "username", label: "Usuário" }, { key: "tropeiroId", label: "ID Tropeiro" }, { key: "active", label: "Ativo" }],
  } as const;
  return map[type];
};

const TropeiroForm = ({ id, onClose }: { id: number | null; onClose: () => void }) => {
  const { data, addTropeiro, updateTropeiro } = useArenaStore();
  const current = data.tropeiros.find((item) => item.id === id);
  const [form, setForm] = useState({ name: current?.name ?? "", phone: current?.phone ?? "", team: current?.team ?? "", description: current?.description ?? "", city: current?.city ?? "", instagram: current?.instagram ?? "", facebook: current?.facebook ?? "", image: current?.image ?? "" });
  return <form className="grid md:grid-cols-2 gap-4" onSubmit={(e) => { e.preventDefault(); if (id) updateTropeiro(id, form); else addTropeiro(form); onClose(); }}><Field label="Nome"><TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Field><Field label="Telefone"><TextInput value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field><Field label="Equipe"><TextInput value={form.team} onChange={(e) => setForm({ ...form, team: e.target.value })} /></Field><Field label="Cidade"><TextInput value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></Field><Field label="Instagram"><TextInput value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} /></Field><Field label="Facebook"><TextInput value={form.facebook} onChange={(e) => setForm({ ...form, facebook: e.target.value })} /></Field><div className="md:col-span-2"><Field label="URL da imagem"><TextInput value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} /></Field></div><div className="md:col-span-2"><Field label="Descrição"><TextArea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field></div><div className="md:col-span-2 flex justify-end gap-3"><button type="button" onClick={onClose} className="border border-gold rounded-lg px-4 py-2">Cancelar</button><button type="submit" className="bg-gradient-gold text-primary-foreground rounded-lg px-5 py-2 font-semibold">Salvar</button></div></form>;
};

const BullForm = ({ id, onClose }: { id: number | null; onClose: () => void }) => {
  const { data, addBull, updateBull } = useArenaStore();
  const current = data.bulls.find((item) => item.id === id);
  const [form, setForm] = useState({ name: current?.name ?? "", age: current?.age ?? 0, weight: current?.weight ?? 0, score: current?.score ?? 0, tropeiroId: current?.tropeiroId ?? (data.tropeiros[0]?.id ?? 0), company: current?.company ?? "", city: current?.city ?? "", events: current?.events ?? 0, wins: current?.wins ?? 0, image: current?.image ?? "", tropeiro: current?.tropeiro ?? "", history: current?.history ?? [] as Bull["history"] });
  return <form className="grid md:grid-cols-2 gap-4" onSubmit={(e) => { e.preventDefault(); const tropeiro = data.tropeiros.find((item) => item.id === Number(form.tropeiroId)); const payload = { ...form, tropeiroId: Number(form.tropeiroId), tropeiro: tropeiro?.name ?? "", city: form.city || tropeiro?.city || "" }; if (id) updateBull(id, payload); else addBull(payload); onClose(); }}><Field label="Nome"><TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Field><Field label="Tropeiro"><Select value={String(form.tropeiroId)} onChange={(e) => setForm({ ...form, tropeiroId: Number(e.target.value) })}>{data.tropeiros.length ? data.tropeiros.map((item) => <option key={item.id} value={item.id}>{item.name}</option>) : <option value="0">Cadastre um tropeiro antes</option>}</Select></Field><Field label="Idade"><TextInput type="number" value={form.age} onChange={(e) => setForm({ ...form, age: Number(e.target.value) })} /></Field><Field label="Peso"><TextInput type="number" value={form.weight} onChange={(e) => setForm({ ...form, weight: Number(e.target.value) })} /></Field><Field label="Nota"><TextInput type="number" step="0.1" value={form.score} onChange={(e) => setForm({ ...form, score: Number(e.target.value) })} /></Field><Field label="Companhia"><TextInput value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></Field><Field label="Cidade"><TextInput value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></Field><Field label="Eventos"><TextInput type="number" value={form.events} onChange={(e) => setForm({ ...form, events: Number(e.target.value) })} /></Field><Field label="Vitórias"><TextInput type="number" value={form.wins} onChange={(e) => setForm({ ...form, wins: Number(e.target.value) })} /></Field><Field label="URL da imagem"><TextInput value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} /></Field><div className="md:col-span-2 flex justify-end gap-3"><button type="button" onClick={onClose} className="border border-gold rounded-lg px-4 py-2">Cancelar</button><button type="submit" className="bg-gradient-gold text-primary-foreground rounded-lg px-5 py-2 font-semibold">Salvar</button></div></form>;
};

const EventForm = ({ id, onClose }: { id: number | null; onClose: () => void }) => {
  const { data, addEvent, updateEvent } = useArenaStore();
  const current = data.events.find((item) => item.id === id);
  const [form, setForm] = useState({ name: current?.name ?? "", date: current?.date ?? "", dateEnd: current?.dateEnd ?? "", location: current?.location ?? "", city: current?.city ?? "", status: current?.status ?? "Em breve" as Event["status"], image: current?.image ?? "", description: current?.description ?? "", bullCount: current?.bullCount ?? 0 });
  return <form className="grid md:grid-cols-2 gap-4" onSubmit={(e) => { e.preventDefault(); if (id) updateEvent(id, form); else addEvent(form); onClose(); }}><Field label="Nome"><TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Field><Field label="Status"><Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Event["status"] })}><option>Em breve</option><option>Em andamento</option><option>Encerrado</option></Select></Field><Field label="Data inicial"><TextInput value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></Field><Field label="Data final"><TextInput value={form.dateEnd} onChange={(e) => setForm({ ...form, dateEnd: e.target.value })} /></Field><Field label="Local"><TextInput value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></Field><Field label="Cidade"><TextInput value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></Field><Field label="Touros previstos"><TextInput type="number" value={form.bullCount} onChange={(e) => setForm({ ...form, bullCount: Number(e.target.value) })} /></Field><Field label="URL da imagem"><TextInput value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} /></Field><div className="md:col-span-2"><Field label="Descrição"><TextArea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field></div><div className="md:col-span-2 flex justify-end gap-3"><button type="button" onClick={onClose} className="border border-gold rounded-lg px-4 py-2">Cancelar</button><button type="submit" className="bg-gradient-gold text-primary-foreground rounded-lg px-5 py-2 font-semibold">Salvar</button></div></form>;
};

const GalleryForm = ({ id, onClose, type }: { id: number | null; onClose: () => void; type: GalleryItem["type"] }) => {
  const { data, addGalleryItem, updateGalleryItem } = useArenaStore();
  const current = data.gallery.find((item) => item.id === id);
  const categoryOptions = type === "photo"
    ? ["Ação", "Bastidores", "Evento", "Touro", "Tropeiro"]
    : ["Destaque", "Evento", "Entrevista", "Touro", "Tropeiro"];
  const [form, setForm] = useState({
    type,
    url: current?.url ?? "",
    title: current?.title ?? "",
    category: current?.category ?? categoryOptions[0],
    bull: current?.bull ?? "",
    event: current?.event ?? "",
    tropeiro: current?.tropeiro ?? "",
  });

  return <form className="grid md:grid-cols-2 gap-4" onSubmit={(e) => {
    e.preventDefault();
    const payload = {
      ...form,
      bull: form.bull || undefined,
      event: form.event || undefined,
      tropeiro: form.tropeiro || undefined,
    };
    if (id) updateGalleryItem(id, payload); else addGalleryItem(payload);
    onClose();
  }}>
    <Field label="Título"><TextInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></Field>
    <Field label="Categoria"><Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{categoryOptions.map((option) => <option key={option} value={option}>{option}</option>)}</Select></Field>
    <Field label="Touro"><Select value={form.bull} onChange={(e) => setForm({ ...form, bull: e.target.value })}><option value="">Selecionar touro</option>{data.bulls.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}</Select></Field>
    <Field label="Evento"><Select value={form.event} onChange={(e) => setForm({ ...form, event: e.target.value })}><option value="">Selecionar evento</option>{data.events.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}</Select></Field>
    <Field label="Tropeiro"><Select value={form.tropeiro} onChange={(e) => setForm({ ...form, tropeiro: e.target.value })}><option value="">Selecionar tropeiro</option>{data.tropeiros.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}</Select></Field>
    <Field label="URL da mídia"><TextInput value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} /></Field>
    <div className="md:col-span-2 flex justify-end gap-3"><button type="button" onClick={onClose} className="border border-gold rounded-lg px-4 py-2">Cancelar</button><button type="submit" className="bg-gradient-gold text-primary-foreground rounded-lg px-5 py-2 font-semibold">Salvar</button></div>
  </form>;
};

const UserForm = ({ id, onClose }: { id: number | null; onClose: () => void }) => {
  const { data, addUser, updateUser } = useArenaStore();
  const current = data.users.find((item) => item.id === id);
  const [form, setForm] = useState({ tropeiroId: current?.tropeiroId ?? (data.tropeiros[0]?.id ?? 0), username: current?.username ?? "", password: current?.password ?? "", active: current?.active ?? true });
  const availableTropeiros = data.tropeiros;
  return <form className="grid md:grid-cols-2 gap-4" onSubmit={(e) => { e.preventDefault(); if (id) updateUser(id, { ...form, tropeiroId: Number(form.tropeiroId) }); else addUser({ ...form, tropeiroId: Number(form.tropeiroId) }); onClose(); }}><div className="md:col-span-2 p-4 rounded-lg border border-gold text-sm text-muted-foreground">Aqui o administrador cria o login do tropeiro. Esse usuário entra pela página <strong>/login</strong>.</div><Field label="Tropeiro vinculado"><Select value={String(form.tropeiroId)} onChange={(e) => setForm({ ...form, tropeiroId: Number(e.target.value) })}>{availableTropeiros.length ? availableTropeiros.map((item) => <option key={item.id} value={item.id}>{item.name}</option>) : <option value="0">Cadastre um tropeiro antes</option>}</Select></Field><Field label="Usuário"><TextInput value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required /></Field><Field label="Senha"><TextInput value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></Field><Field label="Status"><Select value={String(form.active)} onChange={(e) => setForm({ ...form, active: e.target.value === "true" })}><option value="true">Ativo</option><option value="false">Inativo</option></Select></Field><div className="md:col-span-2 flex justify-end gap-3"><button type="button" onClick={onClose} className="border border-gold rounded-lg px-4 py-2">Cancelar</button><button type="submit" className="bg-gradient-gold text-primary-foreground rounded-lg px-5 py-2 font-semibold">Salvar</button></div></form>;
};

export const AdminTropeiros = () => <AdminCrudPage title="Tropeiros" type="tropeiros" />;
export const AdminTouros = () => <AdminCrudPage title="Touros" type="touros" />;
export const AdminEventos = () => <AdminCrudPage title="Eventos" type="eventos" />;
export const AdminAvaliacoes = () => <AdminCrudPage title="Avaliações" type="touros" />;
export const AdminFotos = () => <AdminCrudPage title="Fotos" type="fotos" />;
export const AdminVideos = () => <AdminCrudPage title="Vídeos" type="videos" />;
export const AdminUsuarios = () => <AdminCrudPage title="Usuários" type="usuarios" />;
