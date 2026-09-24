import { useNavigation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import LoadingScreen from "./LoadingScreen.jsx";

export default function NavigationWrapper() {
  const navigation = useNavigation();
  
  // Show loading screen during navigation
  if (navigation.state === "loading") {
    return <LoadingScreen />;
  }
  
  return <Outlet />;
}
