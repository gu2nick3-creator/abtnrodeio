import { CalendarDays, ShieldCheck, Skull, Users } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { useArenaStore } from "@/lib/arenaStore";

const AdminDashboard = () => {
  const { data } = useArenaStore();
  const stats = [
    { label: "Tropeiros", value: data.tropeiros.length, icon: Users },
    { label: "Touros", value: data.bulls.length, icon: Skull },
    { label: "Eventos", value: data.events.length, icon: CalendarDays },
    { label: "Logins", value: data.users.length, icon: ShieldCheck },
  ];
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold uppercase text-gradient-gold">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Visão geral da plataforma</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => <div key={stat.label} className="bg-card border border-gold rounded-xl p-5"><stat.icon className="w-6 h-6 text-primary mb-3" /><p className="text-3xl font-bold">{stat.value}</p><p className="text-sm text-muted-foreground mt-1">{stat.label}</p></div>)}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-card border border-gold rounded-xl p-6"><h3 className="text-lg text-primary mb-4">Últimos tropeiros</h3>{data.tropeiros.length ? <div className="space-y-3">{data.tropeiros.slice(-5).reverse().map((item) => <div key={item.id} className="flex justify-between border-b border-border pb-3"><span>{item.name}</span><span className="text-muted-foreground text-sm">{item.team}</span></div>)}</div> : <p className="text-muted-foreground">Nenhum cadastro ainda.</p>}</div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
