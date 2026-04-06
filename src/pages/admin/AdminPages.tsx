import { useMemo, useState } from "react";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { useArenaStore } from "@/lib/arenaStore";
import type { Bull, Evaluation, Event, GalleryItem } from "@/data/mockData";

type CrudKey = "tropeiros" | "touros" | "eventos" | "avaliacoes" | "galeria" | "usuarios";

type Props = { title: string; type: CrudKey };

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block space-y-2 text-sm">
    <span className="text-muted-foreground">{label}</span>
    {children}
  </label>
);

const TextInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`w-full bg-background border border-gold rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-primary ${props.className ?? ""}`}
  />
);

const TextArea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    className={`w-full bg-background border border-gold rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-primary min-h-28 ${props.className ?? ""}`}
  />
);

const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    {...props}
    className={`w-full bg-background border border-gold rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-primary ${props.className ?? ""}`}
  />
);

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const MediaUploadField = ({
  label,
  accept,
  value,
  onChange,
  previewType,
}: {
  label: string;
  accept: string;
  value: string;
  onChange: (value: string) => void;
  previewType: "image" | "video";
}) => (
  <div className="md:col-span-2 space-y-3">
    <Field label={label}>
      <input
        type="file"
        accept={accept}
        className="w-full bg-background border border-gold rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-primary"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const base64 = await readFileAsDataUrl(file);
          onChange(base64);
        }}
      />
    </Field>

    {value && previewType === "image" ? (
      <img
        src={value}
        alt="Preview"
        className="w-full max-w-sm h-48 object-cover rounded-lg border border-gold"
      />
    ) : null}

    {value && previewType === "video" ? (
      <video
        src={value}
        controls
        className="w-full max-w-sm h-48 object-cover rounded-lg border border-gold"
      />
    ) : null}
  </div>
);

const AdminCrudPage = ({ title, type }: Props) => {
  const store = useArenaStore();
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const datasets = useMemo(
    () => ({
      tropeiros: store.data.tropeiros,
      touros: store.data.bulls,
      eventos: store.data.events,
      avaliacoes: store.data.evaluations,
      galeria: store.data.gallery,
      usuarios: store.data.users,
    }),
    [store.data]
  );

  const data = datasets[type] as Array<Record<string, unknown>>;
  const filtered = data.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
  );

  const closeModal = () => {
    setOpen(false);
    setEditingId(null);
  };

  const renderForm = () => {
    if (type === "tropeiros") return <TropeiroForm id={editingId} onClose={closeModal} />;
    if (type === "touros") return <BullForm id={editingId} onClose={closeModal} />;
    if (type === "eventos") return <EventForm id={editingId} onClose={closeModal} />;
    if (type === "avaliacoes") return <EvaluationForm id={editingId} onClose={closeModal} />;
    if (type === "usuarios") return <UserForm id={editingId} onClose={closeModal} />;
    return <GalleryForm id={editingId} onClose={closeModal} />;
  };

  const removeItem = async (id: number) => {
    if (!window.confirm("Deseja remover este registro?")) return;
    if (type === "tropeiros") await store.deleteTropeiro(id);
    if (type === "touros") await store.deleteBull(id);
    if (type === "eventos") await store.deleteEvent(id);
    if (type === "avaliacoes") await store.deleteEvaluation(id);
    if (type === "usuarios") await store.deleteUser(id);
    if (type === "galeria") await store.deleteGalleryItem(id);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold uppercase text-gradient-gold">{title}</h1>
            <p className="text-muted-foreground text-sm mt-1">{data.length} registros</p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="bg-gradient-gold text-primary-foreground uppercase tracking-wider px-5 py-2 rounded text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Novo
          </button>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-gold rounded pl-10 pr-4 py-2.5 text-sm"
          />
        </div>

        <div className="bg-card border border-gold rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-primary/5">
                  {getColumns(type).map((col) => (
                    <th
                      key={col.key}
                      className="text-left py-3 px-4 text-xs uppercase tracking-wider text-primary"
                    >
                      {col.label}
                    </th>
                  ))}
                  <th className="text-right py-3 px-4 text-xs uppercase tracking-wider text-primary">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody>
                {filtered.length ? (
                  filtered.map((item) => (
                    <tr
                      key={String(item.id)}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      {getColumns(type).map((col) => (
                        <td key={col.key} className="py-3 px-4 text-sm">
                          {String(item[col.key] ?? "")}
                        </td>
                      ))}
                      <td className="py-3 px-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => {
                              setEditingId(Number(item.id));
                              setOpen(true);
                            }}
                            className="p-1.5 rounded hover:bg-muted"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeItem(Number(item.id))}
                            className="p-1.5 rounded hover:bg-muted text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={getColumns(type).length + 1}
                      className="py-10 text-center text-muted-foreground"
                    >
                      Nenhum registro encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {open && (
          <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-auto">
            <div className="max-w-3xl mx-auto bg-card border border-gold rounded-2xl p-6 mt-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">
                  {editingId ? "Editar registro" : "Novo registro"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Fechar
                </button>
              </div>
              {renderForm()}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

const getColumns = (type: CrudKey) =>
  ({
    tropeiros: [
      { key: "name", label: "Nome" },
      { key: "team", label: "Companhia" },
      { key: "city", label: "Cidade" },
      { key: "bullCount", label: "Touros" },
      { key: "phone", label: "Telefone" },
    ],
    touros: [
      { key: "name", label: "Nome" },
      { key: "score", label: "Nota" },
      { key: "tropeiro", label: "Tropeiro" },
      { key: "age", label: "Idade" },
      { key: "weight", label: "Peso" },
      { key: "events", label: "Eventos" },
    ],
    eventos: [
      { key: "name", label: "Nome" },
      { key: "date", label: "Data" },
      { key: "city", label: "Cidade" },
      { key: "status", label: "Status" },
      { key: "bullCount", label: "Touros" },
    ],
    avaliacoes: [
      { key: "nome", label: "Nome" },
      { key: "nota", label: "Nota" },
      { key: "touro_nome", label: "Touro" },
      { key: "tropeiro_nome", label: "Tropeiro" },
      { key: "evento_nome", label: "Evento" },
    ],
    galeria: [
      { key: "title", label: "Título" },
      { key: "type", label: "Tipo" },
      { key: "category", label: "Categoria" },
      { key: "tropeiro", label: "Tropeiro" },
    ],
    usuarios: [
      { key: "username", label: "Usuário" },
      { key: "tropeiroId", label: "ID Tropeiro" },
      { key: "active", label: "Ativo" },
    ],
  }[type]);

const TropeiroForm = ({ id, onClose }: { id: number | null; onClose: () => void }) => {
  const { data, addTropeiro, updateTropeiro, uploadMedia } = useArenaStore();
  const current = data.tropeiros.find((item) => item.id === id);

  const [form, setForm] = useState({
    name: current?.name ?? "",
    phone: current?.phone ?? "",
    team: current?.team ?? "",
    description: current?.description ?? "",
    city: current?.city ?? "",
    instagram: current?.instagram ?? "",
    facebook: current?.facebook ?? "",
    image: current?.image ?? "",
    video: current?.video ?? "",
    state: current?.state ?? "",
    image_fit: current?.image_fit ?? "cover",
  });

  return (
    <form
      className="grid md:grid-cols-2 gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const payload = { ...form };

        if (payload.image.startsWith("data:")) {
          payload.image = await uploadMedia(payload.image, "image", "abtn/tropeiros");
        }

        if (payload.video.startsWith("data:")) {
          payload.video = await uploadMedia(payload.video, "video", "abtn/tropeiros/videos");
        }

        if (id) await updateTropeiro(id, payload);
        else await addTropeiro(payload);

        onClose();
      }}
    >
      <Field label="Nome">
        <TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      </Field>

      <Field label="Telefone">
        <TextInput value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      </Field>

      <Field label="Companhia">
        <TextInput value={form.team} onChange={(e) => setForm({ ...form, team: e.target.value })} />
      </Field>

      <Field label="Cidade">
        <TextInput value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
      </Field>

      <Field label="Estado">
        <TextInput value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
      </Field>

      <Field label="Instagram">
        <TextInput value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} />
      </Field>

      <Field label="Facebook">
        <TextInput value={form.facebook} onChange={(e) => setForm({ ...form, facebook: e.target.value })} />
      </Field>

      <Field label="Modo da imagem">
        <Select
          value={form.image_fit}
          onChange={(e) =>
            setForm({
              ...form,
              image_fit: e.target.value as "cover" | "contain" | "fill" | "cover-top",
            })
          }
        >
          <option value="cover">Preencher</option>
          <option value="contain">Mostrar inteira</option>
          <option value="fill">Esticar</option>
          <option value="cover-top">Preencher focando topo</option>
        </Select>
      </Field>

      <MediaUploadField
        label="Foto do tropeiro"
        accept="image/*"
        value={form.image}
        onChange={(value) => setForm({ ...form, image: value })}
        previewType="image"
      />

      <MediaUploadField
        label="Vídeo do tropeiro"
        accept="video/*"
        value={form.video}
        onChange={(value) => setForm({ ...form, video: value })}
        previewType="video"
      />

      <div className="md:col-span-2">
        <Field label="Descrição">
          <TextArea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </Field>
      </div>

      <div className="md:col-span-2 flex justify-end gap-3">
        <button type="button" onClick={onClose} className="border border-gold rounded-lg px-4 py-2">
          Cancelar
        </button>
        <button type="submit" className="bg-gradient-gold text-primary-foreground rounded-lg px-5 py-2 font-semibold">
          Salvar
        </button>
      </div>
    </form>
  );
};

const BullForm = ({ id, onClose }: { id: number | null; onClose: () => void }) => {
  const { data, addBull, updateBull, uploadMedia } = useArenaStore();
  const current = data.bulls.find((item) => item.id === id);

  const [form, setForm] = useState({
    nome: (current as any)?.nome ?? current?.name ?? "",
    idade: (current as any)?.idade ?? current?.age ?? 0,
    peso: (current as any)?.peso ?? current?.weight ?? 0,
    nota: (current as any)?.nota ?? current?.score ?? 0,
    tropeiro_id: (current as any)?.tropeiro_id ?? current?.tropeiroId ?? (data.tropeiros[0]?.id ?? 0),
    cidade: (current as any)?.cidade ?? current?.city ?? "",
    eventos: (current as any)?.eventos ?? current?.events ?? 0,
    vitorias: (current as any)?.vitorias ?? current?.wins ?? 0,
    foto_url: (current as any)?.foto_url ?? current?.image ?? "",
    historico: (current as any)?.historico ?? "",
    observacoes: (current as any)?.observacoes ?? "",
  });

  return (
    <form
      className="grid md:grid-cols-2 gap-4"
      onSubmit={async (e) => {
        e.preventDefault();

        if (!form.nome.trim()) {
          alert("Preencha o nome do touro");
          return;
        }

        let fotoUrl = form.foto_url;

        if (fotoUrl && fotoUrl.startsWith("data:")) {
          fotoUrl = await uploadMedia(fotoUrl, "image", "abtn/touros");
        }

        const payload = {
          nome: form.nome.trim(),
          idade: Number(form.idade) || 0,
          peso: Number(form.peso) || 0,
          nota: Number(form.nota) || 0,
          historico: form.historico || "",
          observacoes: form.observacoes || "",
          foto_url: fotoUrl || "",
          tropeiro_id: Number(form.tropeiro_id) || null,
          cidade: form.cidade || "",
          eventos: Number(form.eventos) || 0,
          vitorias: Number(form.vitorias) || 0,
        };

        if (id) await updateBull(id, payload as any);
        else await addBull(payload as any);

        onClose();
      }}
    >
      <Field label="Nome">
        <TextInput
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          required
        />
      </Field>

      <Field label="Tropeiro">
        <Select
          value={String(form.tropeiro_id)}
          onChange={(e) => setForm({ ...form, tropeiro_id: Number(e.target.value) })}
        >
          {data.tropeiros.length ? (
            data.tropeiros.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))
          ) : (
            <option value="0">Cadastre um tropeiro antes</option>
          )}
        </Select>
      </Field>

      <Field label="Idade">
        <TextInput
          type="number"
          value={form.idade}
          onChange={(e) => setForm({ ...form, idade: Number(e.target.value) })}
        />
      </Field>

      <Field label="Peso">
        <TextInput
          type="number"
          value={form.peso}
          onChange={(e) => setForm({ ...form, peso: Number(e.target.value) })}
        />
      </Field>

      <Field label="Nota">
        <TextInput
          type="number"
          step="0.1"
          value={form.nota}
          onChange={(e) => setForm({ ...form, nota: Number(e.target.value) })}
        />
      </Field>

      <Field label="Cidade">
        <TextInput
          value={form.cidade}
          onChange={(e) => setForm({ ...form, cidade: e.target.value })}
        />
      </Field>

      <Field label="Eventos">
        <TextInput
          type="number"
          value={form.eventos}
          onChange={(e) => setForm({ ...form, eventos: Number(e.target.value) })}
        />
      </Field>

      <Field label="Vitórias">
        <TextInput
          type="number"
          value={form.vitorias}
          onChange={(e) => setForm({ ...form, vitorias: Number(e.target.value) })}
        />
      </Field>

      <MediaUploadField
        label="Foto do touro"
        accept="image/*"
        value={form.foto_url}
        onChange={(value) => setForm({ ...form, foto_url: value })}
        previewType="image"
      />

      <div className="md:col-span-2">
        <Field label="Histórico">
          <TextArea
            value={form.historico}
            onChange={(e) => setForm({ ...form, historico: e.target.value })}
          />
        </Field>
      </div>

      <div className="md:col-span-2">
        <Field label="Observações">
          <TextArea
            value={form.observacoes}
            onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
          />
        </Field>
      </div>

      <div className="md:col-span-2 flex justify-end gap-3">
        <button type="button" onClick={onClose} className="border border-gold rounded-lg px-4 py-2">
          Cancelar
        </button>
        <button type="submit" className="bg-gradient-gold text-primary-foreground rounded-lg px-5 py-2 font-semibold">
          Salvar
        </button>
      </div>
    </form>
  );
};

const EventForm = ({ id, onClose }: { id: number | null; onClose: () => void }) => {
  const { data, addEvent, updateEvent, uploadMedia } = useArenaStore();
  const current = data.events.find((item) => item.id === id);

  const [form, setForm] = useState({
    name: current?.name ?? "",
    date: current?.date ?? "",
    dateEnd: current?.dateEnd ?? "",
    location: current?.location ?? "",
    city: current?.city ?? "",
    status: current?.status ?? ("Em breve" as Event["status"]),
    image: current?.image ?? "",
    description: current?.description ?? "",
    bullCount: current?.bullCount ?? 0,
  });

  return (
    <form
      className="grid md:grid-cols-2 gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const payload = { ...form };
        if (payload.image.startsWith("data:")) {
          payload.image = await uploadMedia(payload.image, "image", "abtn/eventos");
        }
        if (id) await updateEvent(id, payload);
        else await addEvent(payload);
        onClose();
      }}
    >
      <Field label="Nome">
        <TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      </Field>

      <Field label="Status">
        <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Event["status"] })}>
          <option>Em breve</option>
          <option>Em andamento</option>
          <option>Encerrado</option>
        </Select>
      </Field>

      <Field label="Data inicial">
        <TextInput type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
      </Field>

      <Field label="Data final">
        <TextInput type="date" value={form.dateEnd} onChange={(e) => setForm({ ...form, dateEnd: e.target.value })} />
      </Field>

      <Field label="Local">
        <TextInput value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
      </Field>

      <Field label="Cidade">
        <TextInput value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
      </Field>

      <Field label="Touros previstos">
        <TextInput type="number" value={form.bullCount} onChange={(e) => setForm({ ...form, bullCount: Number(e.target.value) })} />
      </Field>

      <MediaUploadField
        label="Imagem do evento"
        accept="image/*"
        value={form.image}
        onChange={(value) => setForm({ ...form, image: value })}
        previewType="image"
      />

      <div className="md:col-span-2">
        <Field label="Descrição">
          <TextArea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </Field>
      </div>

      <div className="md:col-span-2 flex justify-end gap-3">
        <button type="button" onClick={onClose} className="border border-gold rounded-lg px-4 py-2">
          Cancelar
        </button>
        <button type="submit" className="bg-gradient-gold text-primary-foreground rounded-lg px-5 py-2 font-semibold">
          Salvar
        </button>
      </div>
    </form>
  );
};

const GalleryForm = ({ id, onClose }: { id: number | null; onClose: () => void }) => {
  const { data, addGalleryItem, updateGalleryItem, uploadMedia } = useArenaStore();
  const current = data.gallery.find((item) => item.id === id);

  const [form, setForm] = useState({
    type: current?.type ?? ("photo" as GalleryItem["type"]),
    url: current?.url ?? "",
    title: current?.title ?? "",
    category: current?.category ?? "Ação",
    bull: current?.bull ?? "",
    event: current?.event ?? "",
    tropeiro: current?.tropeiro ?? "",
  });

  return (
    <form
      className="grid md:grid-cols-2 gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const payload = { ...form };
        if (payload.url.startsWith("data:")) {
          payload.url = await uploadMedia(
            payload.url,
            payload.type === "video" ? "video" : "image",
            `abtn/galeria/${payload.type === "video" ? "videos" : "fotos"}`
          );
        }
        if (id) await updateGalleryItem(id, payload);
        else await addGalleryItem(payload);
        onClose();
      }}
    >
      <Field label="Título">
        <TextInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
      </Field>

      <Field label="Tipo">
        <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as GalleryItem["type"], url: "" })}>
          <option value="photo">Foto</option>
          <option value="video">Vídeo</option>
        </Select>
      </Field>

      <Field label="Categoria">
        <TextInput value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
      </Field>

      <Field label="Touro">
        <Select value={form.bull} onChange={(e) => setForm({ ...form, bull: e.target.value })}>
          <option value="">Selecionar touro</option>
          {data.bulls.map((item) => (
            <option key={item.id} value={(item as any).name ?? (item as any).nome}>
              {(item as any).name ?? (item as any).nome}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Evento">
        <Select value={form.event} onChange={(e) => setForm({ ...form, event: e.target.value })}>
          <option value="">Selecionar evento</option>
          {data.events.map((item) => (
            <option key={item.id} value={item.name}>
              {item.name}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Tropeiro">
        <Select value={form.tropeiro} onChange={(e) => setForm({ ...form, tropeiro: e.target.value })}>
          <option value="">Selecionar tropeiro</option>
          {data.tropeiros.map((item) => (
            <option key={item.id} value={item.name}>
              {item.name}
            </option>
          ))}
        </Select>
      </Field>

      <MediaUploadField
        label={form.type === "video" ? "Arquivo de vídeo" : "Arquivo de imagem"}
        accept={form.type === "video" ? "video/*" : "image/*"}
        value={form.url}
        onChange={(value) => setForm({ ...form, url: value })}
        previewType={form.type === "video" ? "video" : "image"}
      />

      <div className="md:col-span-2 flex justify-end gap-3">
        <button type="button" onClick={onClose} className="border border-gold rounded-lg px-4 py-2">
          Cancelar
        </button>
        <button type="submit" className="bg-gradient-gold text-primary-foreground rounded-lg px-5 py-2 font-semibold">
          Salvar
        </button>
      </div>
    </form>
  );
};

const EvaluationForm = ({ id, onClose }: { id: number | null; onClose: () => void }) => {
  const { data, addEvaluation, updateEvaluation, uploadMedia } = useArenaStore();
  const current = data.evaluations.find((item) => item.id === id);

  const [form, setForm] = useState({
    nome: current?.nome ?? "",
    foto_url: current?.foto_url ?? "",
    nota: current?.nota ?? 0,
    comentarios: current?.comentarios ?? "",
    data_avaliacao: current?.data_avaliacao?.slice(0, 10) ?? "",
    touro_id: current?.touro_id ?? 0,
    tropeiro_id: current?.tropeiro_id ?? 0,
    evento_id: current?.evento_id ?? 0,
  });

  return (
    <form
      className="grid md:grid-cols-2 gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const payload = { ...form };
        if (payload.foto_url.startsWith("data:")) {
          payload.foto_url = await uploadMedia(payload.foto_url, "image", "abtn/avaliacoes");
        }
        if (id) await updateEvaluation(id, payload);
        else await addEvaluation(payload);
        onClose();
      }}
    >
      <Field label="Nome da avaliação">
        <TextInput value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
      </Field>

      <Field label="Nota">
        <TextInput type="number" step="0.1" value={form.nota} onChange={(e) => setForm({ ...form, nota: Number(e.target.value) })} />
      </Field>

      <Field label="Data">
        <TextInput type="date" value={form.data_avaliacao} onChange={(e) => setForm({ ...form, data_avaliacao: e.target.value })} />
      </Field>

      <Field label="Touro">
        <Select value={String(form.touro_id)} onChange={(e) => setForm({ ...form, touro_id: Number(e.target.value) })}>
          <option value="0">Selecionar</option>
          {data.bulls.map((item) => (
            <option key={item.id} value={item.id}>
              {(item as any).name ?? (item as any).nome}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Tropeiro">
        <Select value={String(form.tropeiro_id)} onChange={(e) => setForm({ ...form, tropeiro_id: Number(e.target.value) })}>
          <option value="0">Selecionar</option>
          {data.tropeiros.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Evento">
        <Select value={String(form.evento_id)} onChange={(e) => setForm({ ...form, evento_id: Number(e.target.value) })}>
          <option value="0">Selecionar</option>
          {data.events.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </Select>
      </Field>

      <MediaUploadField
        label="Foto da avaliação"
        accept="image/*"
        value={form.foto_url}
        onChange={(value) => setForm({ ...form, foto_url: value })}
        previewType="image"
      />

      <div className="md:col-span-2">
        <Field label="Comentários">
          <TextArea value={form.comentarios} onChange={(e) => setForm({ ...form, comentarios: e.target.value })} />
        </Field>
      </div>

      <div className="md:col-span-2 flex justify-end gap-3">
        <button type="button" onClick={onClose} className="border border-gold rounded-lg px-4 py-2">
          Cancelar
        </button>
        <button type="submit" className="bg-gradient-gold text-primary-foreground rounded-lg px-5 py-2 font-semibold">
          Salvar
        </button>
      </div>
    </form>
  );
};

const UserForm = ({ id, onClose }: { id: number | null; onClose: () => void }) => {
  const { data, addUser, updateUser } = useArenaStore();
  const current = data.users.find((item) => item.id === id);

  const [form, setForm] = useState({
    tropeiroId: current?.tropeiroId ?? (data.tropeiros[0]?.id ?? 0),
    username: current?.username ?? "",
    password: "",
    active: current?.active ?? true,
  });

  return (
    <form
      className="grid md:grid-cols-2 gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        if (id) await updateUser(id, { ...form, tropeiroId: Number(form.tropeiroId) });
        else await addUser({ ...form, tropeiroId: Number(form.tropeiroId) });
        onClose();
      }}
    >
      <div className="md:col-span-2 p-4 rounded-lg border border-gold text-sm text-muted-foreground">
        Aqui o administrador cria o login do tropeiro. Depois que ele entrar em <strong>/login</strong>,
        poderá editar o próprio perfil.
      </div>

      <Field label="Tropeiro vinculado">
        <Select value={String(form.tropeiroId)} onChange={(e) => setForm({ ...form, tropeiroId: Number(e.target.value) })}>
          {data.tropeiros.length ? (
            data.tropeiros.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))
          ) : (
            <option value="0">Cadastre um tropeiro antes</option>
          )}
        </Select>
      </Field>

      <Field label="Usuário">
        <TextInput value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
      </Field>

      <Field label="Senha">
        <TextInput
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder={id ? "Preencha só se quiser trocar" : "Digite a senha"}
          required={!id}
        />
      </Field>

      <Field label="Status">
        <Select value={String(form.active)} onChange={(e) => setForm({ ...form, active: e.target.value === "true" })}>
          <option value="true">Ativo</option>
          <option value="false">Inativo</option>
        </Select>
      </Field>

      <div className="md:col-span-2 flex justify-end gap-3">
        <button type="button" onClick={onClose} className="border border-gold rounded-lg px-4 py-2">
          Cancelar
        </button>
        <button type="submit" className="bg-gradient-gold text-primary-foreground rounded-lg px-5 py-2 font-semibold">
          Salvar
        </button>
      </div>
    </form>
  );
};

export const AdminTropeiros = () => <AdminCrudPage title="Tropeiros" type="tropeiros" />;
export const AdminTouros = () => <AdminCrudPage title="Touros" type="touros" />;
export const AdminEventos = () => <AdminCrudPage title="Eventos" type="eventos" />;
export const AdminAvaliacoes = () => <AdminCrudPage title="Avaliações" type="avaliacoes" />;
export const AdminFotos = () => <AdminCrudPage title="Galeria" type="galeria" />;
export const AdminVideos = () => <AdminCrudPage title="Galeria" type="galeria" />;
export const AdminUsuarios = () => <AdminCrudPage title="Usuários" type="usuarios" />;
