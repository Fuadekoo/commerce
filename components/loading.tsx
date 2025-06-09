import { Helix } from "ldrs/react";
import "ldrs/react/Helix.css";

type LoadingProps = {
  size?: number | string;
  speed?: number | string;
  color?: string;
};

function Loading({ size = 45, speed = 2.5, color = "black" }: LoadingProps) {
  return (
    <div>
      <Helix size={size} speed={speed} color={color} />
    </div>
  );
}

export default Loading;
