"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import Button from "@/app/components/ui/button";
import TextInput from "@/app/components/ui/text-input";
import { sanitizeLink } from "@/app/lib/utils";
import { verifyLink } from "@/app/actions/verify-link";
import CreateLink from "@/app/actions/create-link";
import { useRouter } from "next/navigation";

export default function CreateLinkForm() {
  const router = useRouter();
  const [link, setLink] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  function handleLinkChange(event: ChangeEvent<HTMLInputElement>) {
    setLink(sanitizeLink(event.target.value));
    setError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!link) {
      return setError("Escolha um link primeiro");
    }

    const isLinkTaken = await verifyLink(link);
    if (isLinkTaken) {
      return setError("Esse link já está em uso");
    }

    const isLinkCreated = await CreateLink(link);

    if(!isLinkCreated) {
      setError("Erro ao criar o link, tente novamente mais tarde");
    }

    router.push(`/${link}`);
  }


  return (
    <>
      <form onSubmit={handleSubmit} className="w-full flex items-center gap-2">
        <span>projectinbio.com/</span>
        <TextInput value={link} onChange={handleLinkChange} />
        <Button className="w-[126px]">Criar</Button>
      </form>
      <div>
        <span className="text-accent-pink">{error}</span>
      </div>
    </>
  );
}