import "./index.css";
import {useState, useEffect} from "react";
import {createClient} from "@supabase/supabase-js";
import {Auth} from "@supabase/auth-ui-react";
import {ThemeSupa} from "@supabase/auth-ui-shared";
import Home from "./Home";

const supabase = createClient(
  "https://chkqmcqzbtcninwptkfz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoa3FtY3F6YnRjbmlud3B0a2Z6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkwMzAwMDQsImV4cCI6MjA0NDYwNjAwNH0.QxgDPZ_FIhBw_l8HYvcunb7U1U_WAwNULoyTXDSzZ2A"
);

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({data: {session}}) => {
      setSession(session);
    });

    const {
      data: {subscription},
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return <Auth supabaseClient={supabase} appearance={{theme: ThemeSupa}} />;
  } else {
    return <Home />;
  }
}
