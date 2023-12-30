import { useLoadScript } from "@react-google-maps/api";
import Map from "../components/map";

export default function Home() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBWre3X8G7M4O62TSKt2dOC2-1ggLb7pP0",
    libraries: ["places"],
  });
  if (!isLoaded) return <div>Loading...</div>;
  return <Map />;
}
