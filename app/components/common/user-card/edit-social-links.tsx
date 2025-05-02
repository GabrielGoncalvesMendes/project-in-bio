"use client";

import { Github, Instagram, Linkedin, Plus, Twitter } from "lucide-react";
import Modal from "../../ui/modal";
import { startTransition, useState } from "react";
import Button from "../../ui/button";
import { useParams, useRouter } from "next/navigation";
import { createSocialLinks } from "@/app/actions/create-social-links";
import TextInput from "../../ui/text-input";

export default function EditSocialLinks({socialMedias} : { socialMedias?: { github: string, linkedin: string, instagram: string, twitter: string } }) { 
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSavingSocialLinks, setIsSavingSocialLinks] = useState(false);

  const [github, setGithub] = useState(socialMedias?.github || "");
  const [linkedin, setLinkedin] = useState(socialMedias?.linkedin || "");
  const [instagram, setInstagram] = useState(socialMedias?.instagram || "");
  const [twitter, setTwitter] = useState(socialMedias?.twitter || "");
  
  const { profileId } = useParams();

  async function handleAddSocialLinks() { 
    setIsSavingSocialLinks(true);

    if(!profileId) {
      return;
    }
  
    await createSocialLinks({
      profileId: profileId as string,
      github,
      linkedin,
      instagram, 
      twitter,
    });

    startTransition(() => {
      setIsModalOpen(false);
      setIsSavingSocialLinks(false);
      router.refresh();
    });
  }

  return (
    <>
      <button className="p-3 rounded-xl bg-[#1E1E1E] hover:bg-[#2E2E2E]" onClick={() => setIsModalOpen(true)}>
        <Plus />  
      </button>
      <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
        <div className="bg-background-primary p-8 rounded-[20px] flex flex-col justify-between gap-10 w-[514px]">
          <p className="text-white font-bold text-xl">Adicionar redes sociais</p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 w-full">
              <Github />
              <TextInput 
                type="text" 
                placeholder="Link Github"
                value={github}
                onChange={(event) => setGithub(event.target.value)}
              ></TextInput>
            </div>
            <div className="flex items-center gap-2 w-full">
              <Linkedin />
              <TextInput 
                type="text" 
                placeholder="Link Github"
                value={linkedin}
                onChange={(event) => setLinkedin(event.target.value)}
              ></TextInput>
            </div>
            <div className="flex items-center gap-2 w-full">
              <Instagram />
              <TextInput 
                type="text" 
                placeholder="Link Github"
                value={instagram}
                onChange={(event) => setInstagram(event.target.value)}
              ></TextInput>
            </div>
            <div className="flex items-center gap-2 w-full">
              <Twitter />
              <TextInput 
                type="text" 
                placeholder="Link Github"
                value={twitter}
                onChange={(event) => setTwitter(event.target.value)}
              ></TextInput>
            </div>
          </div>
          <div className="flex gap-4 justify-end">
            <button onClick={() => setIsModalOpen(false)} className="font-bold text-white">Voltar</button>
            <Button onClick={handleAddSocialLinks} disabled={isSavingSocialLinks}>Salvar</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}