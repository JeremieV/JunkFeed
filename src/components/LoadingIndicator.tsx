import { Loader2 } from "lucide-react";

export default function LoadingIndicator() {
  return (
    <div className="w-full mx-auto p-4 grow flex justify-center items-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}
