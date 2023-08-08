"use client";

import dynamic from "next/dynamic";
import Image from "next/image";

interface EditorOutputProps {
  content: any;
}

const CustomImageRenderer = ({ data }: any) => (
  <div className="relative w-full min-h-[15rem]">
    <Image alt="image" className="object-contain" fill src={data.file.url} />
  </div>
);

const CustomCodeRenderer = ({ data }: any) => (
  <pre className="bg-gray-800 rounded-md p-4">
    <code className="text-gray-100 text-sm">{data.code}</code>
  </pre>
);

const Output = dynamic(
  async () => (await import("editorjs-react-renderer")).default,
  {
    ssr: false,
  }
);

const style = {
  paragraph: {
    fontSize: "0.0875rem",
    lineHeight: "1.25rem",
  },
};

const renderers = {
  image: CustomImageRenderer,
  code: CustomCodeRenderer,
};

export const EditorOutput = ({ content }: EditorOutputProps) => (
  //@ts-ignore
  <Output
    data={content}
    style={style}
    className="text-sm"
    renderers={renderers}
  />
);
