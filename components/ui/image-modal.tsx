"use client";

import * as React from "react";
import { X, Maximize2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

interface ImageModalProps {
  src: string;
  alt: string;
}

export function ImageModal({ src, alt }: ImageModalProps) {
  return (
    <Dialog>
      <DialogTrigger className="flex items-center gap-1 text-[10px] font-bold text-primary hover:underline group">
           <Maximize2 className="h-3 w-3 group-hover:scale-110 transition-transform" />
           View Large
      </DialogTrigger>
      <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none outline-none sm:max-w-4xl">
        <div className="relative flex aspect-square sm:aspect-video w-full items-center justify-center overflow-hidden rounded-[32px] bg-black/90 shadow-2xl">
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-contain"
          />
          <DialogClose className="absolute top-6 right-6 rounded-full bg-white/10 p-2 text-white backdrop-blur-md hover:bg-white/20 transition-colors cursor-pointer">
            <X className="h-6 w-6" />
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
