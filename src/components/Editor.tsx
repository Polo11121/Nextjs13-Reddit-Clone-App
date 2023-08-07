"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CreatePostRequest, PostValidator } from "@/lib/validators/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadFiles } from "@/lib/uploadthing";
import { toast } from "@/hooks/useToast";
import { useCreatePost } from "@/actions/useCreatePost";
import TextAreaAutoSize from "react-textarea-autosize";
import type EditorJS from "@editorjs/editorjs";

interface EditorProps {
  subredditId: string;
}

export const Editor = ({ subredditId }: EditorProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const ref = useRef<EditorJS>();
  const _titleRef = useRef<HTMLTextAreaElement>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePostRequest>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      subredditId,
      title: "",
      content: null,
    },
  });
  const { mutate: createPost } = useCreatePost();

  const initializeEditor = useCallback(async () => {
    const EditorJs = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const Table = (await import("@editorjs/table")).default;
    const Code = (await import("@editorjs/code")).default;
    const LinkTool = (await import("@editorjs/link")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;
    const ImageTool = (await import("@editorjs/image")).default;
    const List = (await import("@editorjs/list")).default;
    const Embed = (await import("@editorjs/embed")).default;

    if (!ref.current) {
      const editor = new EditorJs({
        holder: "editor",
        onReady() {
          ref.current = editor;
        },
        placeholder: "Type here to wrtie your post...",
        inlineToolbar: true,
        data: {
          blocks: [],
        },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "/api/link",
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const [res] = await uploadFiles([file], "imageUploader");

                  return {
                    success: 1,
                    file: {
                      url: res.fileUrl,
                    },
                  };
                },
              },
            },
          },
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed,
        },
      });
    }
  }, []);

  const submitHandler = async (data: CreatePostRequest) => {
    const blocks = await ref.current?.save();

    const payload: CreatePostRequest = {
      title: data.title,
      content: blocks,
      subredditId: subredditId,
    };

    createPost(payload);
  };
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(errors).length) {
      for (const [_key, value] of Object.entries(errors)) {
        toast({
          title: "something went wrong",
          description: (value as { message: string }).message,
          variant: "destructive",
        });
      }
    }
  }, [errors]);

  useEffect(() => {
    const init = async () => await initializeEditor();

    setTimeout(() => _titleRef.current?.focus(), 0);

    if (isMounted) {
      init();
    }

    return () => {
      ref.current?.destroy();
      ref.current = undefined;
    };
  }, [isMounted, initializeEditor]);

  const { ref: titleRef, ...rest } = register("title");

  return (
    <div className="w-full p-4 bg-zinc-50 rounded-lg border border-zinc-200">
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="w-fit"
        id="subreddit-post-form"
      >
        <div className="prose prose-stone dart:prose-invert">
          <TextAreaAutoSize
            ref={(e) => {
              titleRef(e);

              // @ts-ignore
              _titleRef.current = e;
            }}
            {...rest}
            placeholder="Title"
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
          />
          <div id="editor" className="min-h-[500px]" />
        </div>
      </form>
    </div>
  );
};
