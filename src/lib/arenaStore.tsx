import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { emptyArenaData, type ArenaData, type AuthSession, type Bull, type Event, type GalleryItem, type Tropeiro, type TropeiroUser } from "@/data/mockData";

const STORAGE_KEY = "arena_masters_data_v2";
const SESSION_KEY = "arena_masters_session_v2";

type BullInput = Omit<Bull, "id" | "image"> & { image?: string };
type TropeiroInput = Omit<Tropeiro, "id" | "image" | "bullCount"> & { image?: string };
type EventInput = Omit<Event, "id" | "image"> & { image?: string };
type GalleryInput = Omit<GalleryItem, "id">;
type UserInput = Omit<TropeiroUser, "id">;

interface ArenaStoreContextValue {
  data: ArenaData;
  session: AuthSession | null;
  adminCredentials: { username: string; password: string };
  addBull: (input: BullInput) => void;
  updateBull: (id: number, input: BullInput) => void;
  deleteBull: (id: number) => void;
  addTropeiro: (input: TropeiroInput) => number;
  updateTropeiro: (id: number, input: TropeiroInput) => void;
  deleteTropeiro: (id: number) => void;
  addEvent: (input: EventInput) => void;
  updateEvent: (id: number, input: EventInput) => void;
  deleteEvent: (id: number) => void;
  addGalleryItem: (input: GalleryInput) => void;
  updateGalleryItem: (id: number, input: GalleryInput) => void;
  deleteGalleryItem: (id: number) => void;
  addUser: (input: UserInput) => void;
  updateUser: (id: number, input: UserInput) => void;
  deleteUser: (id: number) => void;
  loginTropeiro: (username: string, password: string) => { ok: boolean; message: string };
  loginAdmin: (username: string, password: string) => { ok: boolean; message: string };
  logout: () => void;
}

const ArenaStoreContext = createContext<ArenaStoreContextValue | undefined>(undefined);

const loadData = (): ArenaData => {
  if (typeof window === "undefined") return emptyArenaData;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return emptyArenaData;
  try {
    const parsed = JSON.parse(raw) as Partial<ArenaData>;
    return {
      bulls: parsed.bulls ?? [],
      tropeiros: parsed.tropeiros ?? [],
      events: parsed.events ?? [],
      gallery: parsed.gallery ?? [],
      users: parsed.users ?? [],
    };
  } catch {
    return emptyArenaData;
  }
};

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

const ADMIN_CREDENTIALS = { username: "admin", password: "abtn123@" } as const;

const nextId = (items: { id: number }[]) => (items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1);

export const ArenaStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<ArenaData>(() => loadData());
  const [session, setSession] = useState<AuthSession | null>(() => loadSession());

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (session) {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } else {
      window.localStorage.removeItem(SESSION_KEY);
    }
  }, [session]);

  const normalizeTropeiroCount = (tropeiros: Tropeiro[], bulls: Bull[]) =>
    tropeiros.map((tropeiro) => ({
      ...tropeiro,
      bullCount: bulls.filter((bull) => bull.tropeiroId === tropeiro.id).length,
    }));

  const value = useMemo<ArenaStoreContextValue>(() => ({
    data,
    session,
    adminCredentials: ADMIN_CREDENTIALS,
    addBull: (input) => {
      setData((prev) => {
        const bull: Bull = { ...input, id: nextId(prev.bulls), image: input.image ?? "" };
        const bulls = [...prev.bulls, bull];
        return { ...prev, bulls, tropeiros: normalizeTropeiroCount(prev.tropeiros, bulls) };
      });
    },
    updateBull: (id, input) => {
      setData((prev) => {
        const bulls = prev.bulls.map((bull) => bull.id === id ? { ...bull, ...input, image: input.image ?? bull.image } : bull);
        return { ...prev, bulls, tropeiros: normalizeTropeiroCount(prev.tropeiros, bulls) };
      });
    },
    deleteBull: (id) => {
      setData((prev) => {
        const bulls = prev.bulls.filter((bull) => bull.id !== id);
        const gallery = prev.gallery.filter((item) => item.bull !== prev.bulls.find((bull) => bull.id === id)?.name);
        return { ...prev, bulls, gallery, tropeiros: normalizeTropeiroCount(prev.tropeiros, bulls) };
      });
    },
    addTropeiro: (input) => {
      const id = nextId(data.tropeiros);
      setData((prev) => ({
        ...prev,
        tropeiros: [...prev.tropeiros, { ...input, id, image: input.image ?? "", bullCount: 0 }],
      }));
      return id;
    },
    updateTropeiro: (id, input) => {
      setData((prev) => {
        const existing = prev.tropeiros.find((tropeiro) => tropeiro.id === id);
        const oldName = existing?.name ?? "";
        const bulls = prev.bulls.map((bull) => bull.tropeiroId === id ? { ...bull, tropeiro: input.name, company: bull.company } : bull);
        const gallery = prev.gallery.map((item) => item.tropeiro === oldName ? { ...item, tropeiro: input.name } : item);
        const tropeiros = normalizeTropeiroCount(prev.tropeiros.map((tropeiro) => tropeiro.id === id ? { ...tropeiro, ...input, image: input.image ?? tropeiro.image } : tropeiro), bulls);
        return { ...prev, tropeiros, bulls, gallery };
      });
    },
    deleteTropeiro: (id) => {
      setData((prev) => ({
        ...prev,
        tropeiros: prev.tropeiros.filter((tropeiro) => tropeiro.id !== id),
        bulls: prev.bulls.filter((bull) => bull.tropeiroId !== id),
        users: prev.users.filter((user) => user.tropeiroId !== id),
        gallery: prev.gallery.filter((item) => item.tropeiro !== prev.tropeiros.find((tropeiro) => tropeiro.id === id)?.name),
      }));
      if (session?.tropeiroId === id) setSession(null);
    },
    addEvent: (input) => setData((prev) => ({ ...prev, events: [...prev.events, { ...input, id: nextId(prev.events), image: input.image ?? "" }] })),
    updateEvent: (id, input) => setData((prev) => ({ ...prev, events: prev.events.map((event) => event.id === id ? { ...event, ...input, image: input.image ?? event.image } : event) })),
    deleteEvent: (id) => setData((prev) => ({
      ...prev,
      events: prev.events.filter((event) => event.id !== id),
      gallery: prev.gallery.filter((item) => item.event !== prev.events.find((event) => event.id === id)?.name),
    })),
    addGalleryItem: (input) => setData((prev) => ({ ...prev, gallery: [...prev.gallery, { ...input, id: nextId(prev.gallery) }] })),
    updateGalleryItem: (id, input) => setData((prev) => ({ ...prev, gallery: prev.gallery.map((item) => item.id === id ? { ...item, ...input } : item) })),
    deleteGalleryItem: (id) => setData((prev) => ({ ...prev, gallery: prev.gallery.filter((item) => item.id !== id) })),
    addUser: (input) => setData((prev) => ({ ...prev, users: [...prev.users, { ...input, id: nextId(prev.users) }] })),
    updateUser: (id, input) => setData((prev) => ({ ...prev, users: prev.users.map((user) => user.id === id ? { ...user, ...input } : user) })),
    deleteUser: (id) => {
      setData((prev) => ({ ...prev, users: prev.users.filter((user) => user.id !== id) }));
      if (session && data.users.find((user) => user.id === id)?.username === session.username) setSession(null);
    },
    loginTropeiro: (username, password) => {
      const user = data.users.find((item) => item.username.trim().toLowerCase() === username.trim().toLowerCase() && item.password === password);
      if (!user) return { ok: false, message: "Usuário ou senha inválidos." };
      if (!user.active) return { ok: false, message: "Esse acesso está inativo." };
      setSession({ role: "tropeiro", tropeiroId: user.tropeiroId, username: user.username });
      return { ok: true, message: "Login realizado com sucesso." };
    },
    loginAdmin: (username, password) => {
      if (username.trim().toLowerCase() !== ADMIN_CREDENTIALS.username || password !== ADMIN_CREDENTIALS.password) {
        return { ok: false, message: "Credenciais do administrador inválidas." };
      }
      setSession({ role: "admin", username: ADMIN_CREDENTIALS.username });
      return { ok: true, message: "Login administrativo realizado com sucesso." };
    },
    logout: () => setSession(null),
  }), [data, session]);

  return <ArenaStoreContext.Provider value={value}>{children}</ArenaStoreContext.Provider>;
};

export const useArenaStore = () => {
  const context = useContext(ArenaStoreContext);
  if (!context) throw new Error("useArenaStore must be used within ArenaStoreProvider");
  return context;
};
