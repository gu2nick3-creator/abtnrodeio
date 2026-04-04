import { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useArenaStore } from "@/lib/arenaStore";

const readFileAsDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onloadend = () => resolve(String(reader.result || ""));
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

const TropeiroProfilePage = () => {
  const { id } = useParams();
  const { data, session, updateOwnProfile, uploadMedia } = useArenaStore();
  const tropeiro = data.tropeiros.find((item) => item.id === Number(id));
  const bulls = data.bulls.filter((bull) => bull.tropeiroId === Number(id));
  const isOwner = session?.role === "tropeiro" && session?.tropeiroId === tropeiro?.id;
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: tropeiro?.name ?? "",
    phone: tropeiro?.phone ?? "",
    team: tropeiro?.team ?? "",
    description: tropeiro?.description ?? "",
    city: tropeiro?.city ?? "",
    instagram: tropeiro?.instagram ?? "",
    facebook: tropeiro?.facebook ?? "",
    image: tropeiro?.image ?? "",
    video: tropeiro?.video ?? "",
    state: tropeiro?.state ?? "",
    image_fit: tropeiro?.image_fit ?? "cover",
    username: session?.username ?? "",
    password: "",
  });

  if (!tropeiro) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        Tropeiro não encontrado.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 grid lg:grid-cols-[320px_1fr] gap-8">
          <aside className="bg-card border border-gold rounded-xl p-6 h-fit">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-muted mx-auto mb-4">
              <img
                src={form.image || "/placeholder.svg"}
                alt={tropeiro.name}
                className="w-full h-full"
                style={{
                  objectFit:
                    form.image_fit === "contain"
                      ? "contain"
                      : form.image_fit === "fill"
                      ? "fill"
                      : "cover",
                  objectPosition: form.image_fit === "cover-top" ? "top" : "center",
                }}
              />
            </div>

            <h1 className="text-2xl font-semibold uppercase text-gradient-gold text-center">
              {tropeiro.name}
            </h1>

            {isOwner && (
              <p className="text-center text-primary text-sm mt-2">
                Você está logado nesta conta e pode editar o próprio perfil.
              </p>
            )}

            <div className="space-y-3 mt-6 text-sm">
              <p><span className="text-muted-foreground">Companhia:</span> {tropeiro.team}</p>
              <p><span className="text-muted-foreground">Cidade:</span> {tropeiro.city}</p>
              <p><span className="text-muted-foreground">Telefone:</span> {tropeiro.phone || "—"}</p>
              <p><span className="text-muted-foreground">Instagram:</span> {tropeiro.instagram || "—"}</p>
              <p><span className="text-muted-foreground">Facebook:</span> {tropeiro.facebook || "—"}</p>
            </div>
          </aside>

          <section className="space-y-6">
            <div className="bg-card border border-gold rounded-xl p-6">
              <h2 className="text-2xl font-semibold mb-4">Sobre o tropeiro</h2>
              <p className="text-muted-foreground leading-relaxed">
                {tropeiro.description || "Descrição ainda não cadastrada."}
              </p>
            </div>

            {tropeiro.video && (
              <div className="bg-card border border-gold rounded-xl p-6">
                <h2 className="text-2xl font-semibold mb-4">Vídeo do perfil</h2>
                <video src={tropeiro.video} controls className="w-full rounded-xl border border-gold" />
              </div>
            )}

            {isOwner && (
              <div className="bg-card border border-gold rounded-xl p-6">
                <h2 className="text-2xl font-semibold mb-6">Editar meu perfil</h2>

                <form
                  className="grid md:grid-cols-2 gap-4"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setSaving(true);
                    setMessage("");

                    const payload = { ...form };

                    if (payload.image.startsWith("data:")) {
                      payload.image = await uploadMedia(payload.image, "image", "abtn/tropeiros");
                    }

                    if (payload.video.startsWith("data:")) {
                      payload.video = await uploadMedia(payload.video, "video", "abtn/tropeiros/videos");
                    }

                    const result = await updateOwnProfile(payload);
                    setMessage(result.message);
                    setSaving(false);

                    if (result.ok) {
                      setForm((prev) => ({ ...prev, password: "" }));
                    }
                  }}
                >
                  <div>
                    <label className="block text-sm mb-2 text-muted-foreground">Nome</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-background border border-gold rounded-lg px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-muted-foreground">Telefone</label>
                    <input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full bg-background border border-gold rounded-lg px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-muted-foreground">Companhia</label>
                    <input
                      value={form.team}
                      onChange={(e) => setForm({ ...form, team: e.target.value })}
                      className="w-full bg-background border border-gold rounded-lg px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-muted-foreground">Cidade</label>
                    <input
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full bg-background border border-gold rounded-lg px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-muted-foreground">Estado</label>
                    <input
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      className="w-full bg-background border border-gold rounded-lg px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-muted-foreground">Instagram</label>
                    <input
                      value={form.instagram}
                      onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                      className="w-full bg-background border border-gold rounded-lg px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-muted-foreground">Facebook</label>
                    <input
                      value={form.facebook}
                      onChange={(e) => setForm({ ...form, facebook: e.target.value })}
                      className="w-full bg-background border border-gold rounded-lg px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-muted-foreground">Usuário de login</label>
                    <input
                      value={form.username}
                      onChange={(e) => setForm({ ...form, username: e.target.value })}
                      className="w-full bg-background border border-gold rounded-lg px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-muted-foreground">Nova senha</label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full bg-background border border-gold rounded-lg px-4 py-3"
                      placeholder="Preencha só se quiser trocar"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-muted-foreground">Modo da imagem</label>
                    <select
                      value={form.image_fit}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          image_fit: e.target.value as "cover" | "contain" | "fill" | "cover-top",
                        })
                      }
                      className="w-full bg-background border border-gold rounded-lg px-4 py-3"
                    >
                      <option value="cover">Preencher</option>
                      <option value="contain">Mostrar inteira</option>
                      <option value="fill">Esticar</option>
                      <option value="cover-top">Preencher focando topo</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm mb-2 text-muted-foreground">Foto do perfil</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full bg-background border border-gold rounded-lg px-4 py-3"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setForm({ ...form, image: await readFileAsDataUrl(file) });
                      }}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm mb-2 text-muted-foreground">Vídeo do perfil</label>
                    <input
                      type="file"
                      accept="video/*"
                      className="w-full bg-background border border-gold rounded-lg px-4 py-3"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setForm({ ...form, video: await readFileAsDataUrl(file) });
                      }}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm mb-2 text-muted-foreground">Descrição</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full min-h-32 bg-background border border-gold rounded-lg px-4 py-3"
                    />
                  </div>

                  {message && (
                    <p className="md:col-span-2 text-sm text-primary">{message}</p>
                  )}

                  <div className="md:col-span-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-gradient-gold text-primary-foreground rounded-lg px-5 py-3 font-semibold disabled:opacity-60"
                    >
                      {saving ? "Salvando..." : "Salvar alterações"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-card border border-gold rounded-xl p-6">
              <h2 className="text-2xl font-semibold mb-6">Touros vinculados</h2>

              {!bulls.length ? (
                <p className="text-muted-foreground">Nenhum touro vinculado a este tropeiro.</p>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {bulls.map((bull) => (
                    <div key={bull.id} className="border border-gold rounded-lg overflow-hidden bg-background">
                      <div className="h-44">
                        <img src={bull.image || "/placeholder.svg"} alt={bull.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold uppercase">{bull.name}</h3>
                        <p className="text-primary font-bold mt-1">{bull.score}</p>
                        <p className="text-muted-foreground text-sm">{bull.company}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TropeiroProfilePage;
