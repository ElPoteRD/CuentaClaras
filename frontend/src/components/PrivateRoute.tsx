import { useEffect, useState } from "react";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "@/hooks/use-login"

export default function PrivateRoute({ children }: { children: ReactNode }) {
  const { loadSession } = useLogin();

  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  useEffect(() => {
    const existToken = localStorage.getItem("yourexam-token");
    if (!existToken) {
      navigate("/");
    } else {
      loadSession();

      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  return <>{children}</>;
}
