"use client";
import { ArrowUpFromLine, UserPen } from "lucide-react";
import Modal from "../../ui/modal";
import { startTransition, useState } from "react";
import TextInput from "../../ui/text-input";
import Button from "../../ui/button";
import { compressFiles, handleImageInput, triggerImageInput } from "@/app/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { saveProfile } from "@/app/actions/save-profile";
import { ProfileData } from "@/app/server/get-profile-data";

export default function EditUserCard({ profileData }: {profileData?: ProfileData}) {
  const router = useRouter();
  const { profileId } = useParams();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [yourName, setYourName] = useState<string>(profileData?.name || "");
  const [yourDescription, setYourDescription] = useState<string>(profileData?.description || "");

  async function handleSaveProfile() {
    setIsSavingProfile(true);

    const imagesInput = document.getElementById("profile-pic-input") as HTMLInputElement;

    if(!imagesInput.files) {
      return;
    }

    const compressedFile = await compressFiles(Array.from(imagesInput.files));

    if(!profileId) {
      return;
    }
  
    const formaData = new FormData();
    formaData.append("profileId", profileId as string);
    formaData.append("profilePic", compressedFile[0]);
    formaData.append("yourName", yourName); 
    formaData.append("yourDescription", yourDescription);

    await saveProfile(formaData)

    startTransition(() => {
      setIsModalOpen(false);
      setIsSavingProfile(false);
      router.refresh();
    });
  }
  
    return (
    <>
      <button onClick={() => setIsModalOpen(true)}>
        <UserPen />
      </button>
      <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
        <div className="bg-background-primary p-8 rounded-[20px] flex flex-col justify-between gap-10">
          <p className="text-white font-bold text-xl">Editar perfil</p>
          <div className="flex gap-10">
            <div className="flex flex-col items-center gap-3 text-xs">
              <div className="w-[100px] h-[100px] rounded-xl bg-background-tertiary overflow-hidden">
                {
                  profilePic ? (
                  <img src={profilePic} alt="User Avatar" className="object-cover object-center" />    
                  ) : (
                    <button onClick={() => triggerImageInput("profile-pic-input")} className="w-full h-full">100x100</button>
                  )
                }
              </div>
              <button onClick={() => triggerImageInput("profile-pic-input")} className="text-white flex items-center gap-2">
                <ArrowUpFromLine className="size-4" />
                <span>Adicionar foto</span>
              </button>
              <input id="profile-pic-input" type="file" className="hidden" accept="image/*" onChange={(event) => setProfilePic(handleImageInput(event))} />
            </div>
            <div className="flex flex-col gap-4 w-[293px]">
              <div className="flex flex-col gap-1">
                <label htmlFor="your-name" className="text-white font-bold">Seu nome</label>
                <TextInput id="your-name" placeholder="Digite seu nome" value={yourName} onChange={(event) => setYourName(event.target.value)} />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="your-description" className="text-white font-bold">Sua descrição</label>
                <TextInput id="your-description" placeholder="Digite uma breve descrição sobre você" className="h-36" value={yourDescription} onChange={(event) => setYourDescription(event.target.value)} />
              </div>
            </div>
          </div>
          <div className="flex gap-4 justify-end">
            <button onClick={() => setIsModalOpen(false)} className="font-bold text-white">Voltar</button>
            <Button onClick={handleSaveProfile} disabled={isSavingProfile}>Salvar</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}