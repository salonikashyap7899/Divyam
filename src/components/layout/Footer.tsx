import { Link } from "react-router-dom";

export const Footer = () => (
  <footer className="border-t border-border mt-24">
    <div className="container py-12 grid gap-8 md:grid-cols-4">
      <div className="md:col-span-2">
        <div className="font-serif text-2xl">Divyam</div>
        <p className="mt-3 text-sm text-muted-foreground max-w-md">
          A modern home for ancient sciences. Personalized Vastu, numerology, and courses
          taught by traditional teachers.
        </p>
      </div>
      <div>
        <h4 className="text-sm font-medium mb-3">Tools</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/vastu" className="hover:text-foreground">Vastu Analyser</Link></li>
          <li><Link to="/numerology" className="hover:text-foreground">Numerology</Link></li>
          <li><Link to="/courses" className="hover:text-foreground">Courses</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-sm font-medium mb-3">Account</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/login" className="hover:text-foreground">Sign in</Link></li>
          <li><Link to="/my-courses" className="hover:text-foreground">My courses</Link></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-border">
      <div className="container py-5 text-xs text-muted-foreground flex flex-wrap justify-between gap-2">
        <span>© {new Date().getFullYear()} Divyam. Built with care.</span>
        <span>For guidance, not medical or legal advice.</span>
      </div>
    </div>
  </footer>
);
