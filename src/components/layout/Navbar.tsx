import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Compass, Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { to: "/", label: "Home" },
  { to: "/vastu", label: "Vastu" },
  { to: "/numerology", label: "Numerology" },
  { to: "/courses", label: "Courses" },
  { to: "/my-courses", label: "My Courses" },
];

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full gradient-hero text-gold">
            <Compass className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <div className="font-serif text-xl">Divyam</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Vastu · Numerology</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === "/"}
              className={({ isActive }) =>
                `px-3 py-2 text-sm rounded-md transition-colors ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`
              }>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <Button variant="outline" size="sm" onClick={async () => { await signOut(); navigate("/"); }}>Sign out</Button>
          ) : (
            <Button variant="gold" size="sm" asChild><Link to="/login">Sign in</Link></Button>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(o => !o)} aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container py-3 flex flex-col gap-1">
            {links.map(l => (
              <NavLink key={l.to} to={l.to} end={l.to === "/"} onClick={() => setOpen(false)}
                className={({ isActive }) => `px-3 py-2 rounded-md text-sm ${isActive ? "bg-secondary" : ""}`}>
                {l.label}
              </NavLink>
            ))}
            <div className="pt-2">
              {user ? (
                <Button variant="outline" className="w-full" onClick={async () => { await signOut(); setOpen(false); navigate("/"); }}>Sign out</Button>
              ) : (
                <Button variant="gold" className="w-full" asChild><Link to="/login" onClick={() => setOpen(false)}>Sign in</Link></Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
