"use client";
import { Button } from "@heroui/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function Theme() {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      isIconOnly
      color="primary"
      variant="flat"
      radius="full"
      onPress={() => setTheme((prev) => (prev == "light" ? "dark" : "light"))}
    >
      {theme == "dark" ? (
        <Sun className="size-6 stroke-warning-600 fill-warning-600 " />
      ) : (
        <Moon className="size-6 stroke-none fill-warning-600 " />
      )}
    </Button>
  );
}
