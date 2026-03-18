import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { emptyArenaData, type ArenaData, type AuthSession, type Bull, type Evaluation, type Event, type GalleryItem, type Tropeiro, type TropeiroUser } from "@/data/mockData";
import { api } from "@/lib/api";

const SESSION_KEY = "arena_session_v3";

type BullInput = Omit<Bull, "id" | "history"> & { history?: Bull["history"] };
type TropeiroInput = Omit<Tropeiro, "id" | "bullCount">;
type EventInput = Omit<Event, "id">;
type GalleryInput = Omit<GalleryItem, "id">;
type UserInput = Omit<TropeiroUser, "id">;
type EvaluationInput = Omit<Evaluation, "id" | "touro_nome" | "tropeiro_nome" | "evento_nome">;
type OwnProfileInput = TropeiroInput & { username: string; password?: string };

interface ArenaStoreContextValue {
  data: ArenaData;
  session: AuthSession | null;
  adminCredentials: { username: string; password: string };
  isLoading: boolean;
  refreshData: () => Promise<void>;
  addBull: (input: BullInput) => Promise<void>;
  updateBull: (id: number, input: BullInput) => Promise<void>;
  deleteBull: (id: number) => Promise<void>;
  addTropeiro: (input: TropeiroInput) => Promise<number | undefined>;
  updateTropeiro: (id: number, input: TropeiroInput) => Promise<void>;
  deleteTropeiro: (id: number) => Promise<void>;
  addEvent: (input: EventInput) => Promise<void>;
  updateEvent: (id: number, input: EventInput) => Promise<void>;
  deleteEvent: (id: number) => Promise<void>;
  addGalleryItem: (input: GalleryInput) => Promise<void>;
  updateGalleryItem: (id: number, input: GalleryInput) => Promise<void>;
  deleteGalleryItem: (id: number) => Promise<void>;
  addUser: (input: UserInput) => Promise<void>;
  updateUser: (id: number, input: UserInput) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  addEvaluation: (input: EvaluationInput) => Promise<void>;
  updateEvaluation: (id: number, input: EvaluationInput) => Promise<void>;
  deleteEvaluation: (id: number) => Promise<void>;
  loginTropeiro: (username: string, password: string) => Promise<{ ok: boolean; message: string }>;
  loginAdmin: (username: string, password: string) => Promise<{ ok: boolean; message: string }>;
  updateOwnProfile: (input: OwnProfileInput) => Promise<{ ok: boolean; message: string }>;
  uploadMedia: (file: string, tipo: "image" | "video", folder?: string) => Promise<string>;
  logout: () => void;
}

const ArenaStoreContext = createContext<ArenaStoreContextValue | undefined>(undefined);

const loadSession = (): AuthSession | null => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
};

const ADMIN_CREDENTIALS = { username: "admin@abtn.com", password: "" } as const;

const toBullPayload = (input: BullInput) => ({
  nome: input.name,
  idade: input.age,
  peso: input.weight,
  nota: input.score,
  historico: JSON.stringify(input.history ?? []),
  observacoes: input.company,
  foto_url: input.image,
  tropeiro_id: input.tropeiroId,
  cidade: input.city,
  eventos: input.events,
  vitorias: input.wins,
});

const toTropeiroPayload = (input: TropeiroInput) => ({
  nome: input.name,
  telefone: input.phone,
  equipe: input.team,
  cidade: input.city,
  estado: input.state,
  descricao: input.description,
  instagram: input.instagram,
  facebook: input.facebook,
  foto_url: input.image,
  video_url: input.video,
});

const toEventPayload = (input: EventInput) => ({
  nome: input.name,
  data_evento: input.date,
  data_fim: input.dateEnd,
  local_evento: input.location,
  cidade: input.city,
  descricao: input.description,
  capa_url: input.image,
  qtd_touros: input.bullCount,
  status: input.status,
});

const toGalleryPayload = (data: ArenaData, input: GalleryInput) => ({
  tipo: input.type === "video" ? "video" : "foto",
  titulo: input.title,
  categoria: input.category,
  url: input.url,
  touro_id: data.bulls.find((bull) => bull.name === input.bull)?.id ?? null,
  tropeiro_id: data.tropeiros.find((tropeiro) => tropeiro.name === input.tropeiro)?.id ?? null,
  evento_id: data.events.find((event) => event.name === input.event)?.id ?? null,
  resource_type: input.type === "video" ? "video" : "image",
});

export const ArenaStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<ArenaData>(emptyArenaData);
  const [session, setSession] = useState<AuthSession | null>(() => loadSession());
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = async () => {
    const bootstrap = await api.bootstrap();
    setData({
      bulls: bootstrap.bulls,
      tropeiros: bootstrap.tropeiros,
      events: bootstrap.events,
      gallery: bootstrap.gallery,
      users: bootstrap.users,
      evaluations: bootstrap.evaluations ?? [],
    });
  };

  useEffect(() => {
    refreshData().finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (session) {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      api.verifySession(session).catch(() => {
        setSession(null);
        window.localStorage.removeItem(SESSION_KEY);
      });
    } else {
      window.localStorage.removeItem(SESSION_KEY);
    }
  }, [session]);

  const requireSession = () => {
    if (!session) throw new Error("Sessão não encontrada");
    return session;
  };

  const value = useMemo<ArenaStoreContextValue>(() => ({
    data,
    session,
    adminCredentials: ADMIN_CREDENTIALS,
    isLoading,
    refreshData,
    addBull: async (input) => {
      await api.create(requireSession(), "api/touros", toBullPayload(input));
      await refreshData();
    },
    updateBull: async (id, input) => {
      await api.update(requireSession(), "api/touros", id, toBullPayload(input));
      await refreshData();
    },
    deleteBull: async (id) => {
      await api.remove(requireSession(), "api/touros", id);
      await refreshData();
    },
    addTropeiro: async (input) => {
      const result = await api.create(requireSession(), "api/tropeiros", toTropeiroPayload(input)) as { id?: number };
      await refreshData();
      return result.id;
    },
    updateTropeiro: async (id, input) => {
      await api.update(requireSession(), "api/tropeiros", id, toTropeiroPayload(input));
      await refreshData();
    },
    deleteTropeiro: async (id) => {
      await api.remove(requireSession(), "api/tropeiros", id);
      await refreshData();
    },
    addEvent: async (input) => {
      await api.create(requireSession(), "api/eventos", toEventPayload(input));
      await refreshData();
    },
    updateEvent: async (id, input) => {
      await api.update(requireSession(), "api/eventos", id, toEventPayload(input));
      await refreshData();
    },
    deleteEvent: async (id) => {
      await api.remove(requireSession(), "api/eventos", id);
      await refreshData();
    },
    addGalleryItem: async (input) => {
      await api.create(requireSession(), "api/midias", toGalleryPayload(data, input));
      await refreshData();
    },
    updateGalleryItem: async (id, input) => {
      await api.update(requireSession(), "api/midias", id, toGalleryPayload(data, input));
      await refreshData();
    },
    deleteGalleryItem: async (id) => {
      await api.remove(requireSession(), "api/midias", id);
      await refreshData();
    },
    addUser: async (input) => {
      await api.create(requireSession(), "api/users", { tropeiro_id: input.tropeiroId, username: input.username, password: input.password, ativo: input.active });
      await refreshData();
    },
    updateUser: async (id, input) => {
      await api.update(requireSession(), "api/users", id, { tropeiro_id: input.tropeiroId, username: input.username, password: input.password, ativo: input.active });
      await refreshData();
    },
    deleteUser: async (id) => {
      await api.remove(requireSession(), "api/users", id);
      await refreshData();
    },
    addEvaluation: async (input) => {
      await api.create(requireSession(), "api/avaliacoes", input);
      await refreshData();
    },
    updateEvaluation: async (id, input) => {
      await api.update(requireSession(), "api/avaliacoes", id, input);
      await refreshData();
    },
    deleteEvaluation: async (id) => {
      await api.remove(requireSession(), "api/avaliacoes", id);
      await refreshData();
    },
    loginTropeiro: async (username, password) => {
      try {
        const result = await api.loginTropeiro(username, password);
        setSession({ role: "tropeiro", tropeiroId: result.user.tropeiro_id, username: result.user.username, token: result.token });
        await refreshData();
        return { ok: true, message: "Login realizado com sucesso." };
      } catch (error) {
        return { ok: false, message: error instanceof Error ? error.message : "Falha no login" };
      }
    },
    loginAdmin: async (username, password) => {
      try {
        const result = await api.loginAdmin(username, password);
        setSession({ role: "admin", username, token: result.token });
        await refreshData();
        return { ok: true, message: "Login administrativo realizado com sucesso." };
      } catch (error) {
        return { ok: false, message: error instanceof Error ? error.message : "Falha no login" };
      }
    },
    updateOwnProfile: async (input) => {
      try {
        await api.updateOwnProfile(requireSession(), {
          ...toTropeiroPayload(input),
          username: input.username,
          password: input.password,
        });
        await refreshData();
        return { ok: true, message: "Perfil atualizado com sucesso." };
      } catch (error) {
        return { ok: false, message: error instanceof Error ? error.message : "Falha ao atualizar perfil" };
      }
    },
    uploadMedia: async (file, tipo, folder) => {
      const uploaded = await api.upload(requireSession(), file, tipo, folder);
      return uploaded.url;
    },
    logout: () => setSession(null),
  }), [data, session, isLoading]);

  return <ArenaStoreContext.Provider value={value}>{children}</ArenaStoreContext.Provider>;
};

export const useArenaStore = () => {
  const context = useContext(ArenaStoreContext);
  if (!context) throw new Error("useArenaStore must be used within ArenaStoreProvider");
  return context;
};
