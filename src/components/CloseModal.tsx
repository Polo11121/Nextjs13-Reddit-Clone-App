"use client";

import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

export const CloseModal = () => {
  const router = useRouter();

  const closeModalHandler = () => router.back();

  return (
    <Button
      onClick={closeModalHandler}
      className="h-6 w-6 p-0 rounded-md"
      variant="subtle"
      aria-label="close modal"
    >
      <X className="h-4 w-4" />
    </Button>
  );
};
