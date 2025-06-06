import { useEffect, useState } from "react";
import { useLoading } from "../components/loading/LoadingContext";

function Screen() {
  const { setLoading } = useLoading();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch('https://httpstat.us/200?sleep=5000');
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setLoading]);

  if (!data) return null;

  return (
    <div className="app">
      <h1>Datos:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default Screen;