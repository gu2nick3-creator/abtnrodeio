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

export const AdminTropeiros = () => <AdminCrudPage title="Tropeiros" type="tropeiros" />;
export const AdminTouros = () => <AdminCrudPage title="Touros" type="touros" />;
export const AdminEventos = () => <AdminCrudPage title="Eventos" type="eventos" />;
export const AdminAvaliacoes = () => <AdminCrudPage title="Avaliações" type="avaliacoes" />;
export const AdminFotos = () => <AdminCrudPage title="Galeria" type="galeria" />;
export const AdminVideos = () => <AdminCrudPage title="Galeria" type="galeria" />;
export const AdminUsuarios = () => <AdminCrudPage title="Usuários" type="usuarios" />;
