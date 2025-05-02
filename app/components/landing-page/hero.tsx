import ProjectCard from "../common/project-card";
import TotalVisits from "../common/total-visits";
import UserCard from "../common/user-card/user-card";
import Button from "../ui/button";
import TextInput from "../ui/text-input"

export default function Hero() {
  return (
    <div className="flex h-screen">
      <div className="w-full flex flex-col gap-2 mt-[35vh]">
        <h1 className="text-5xl font-bold text-white leading-[64px]">Seus projetos pessoais em um unico link</h1>
        <h2 className="text-xl leading-6">
          Crie sua propria pagina de projetos e compartilhe eles com o mundo
          <br />
          Acompanhe o engajamento com Analytics de cliques
        </h2>
        <div className="flex items-center gap-2 w-full mt-[10vh]">
          <span className="text-white text-xl">projectinbio.com/</span>
          {/* <CreateNow /> */}
          <TextInput placeholder="Seu link" />
          <Button>Criar agora</Button>
        </div>
      </div>
      <div className="w-full flex items-center justify-center bg-[radial-gradient(circle_at_50%_50%,#4B2DBB,transparent_55%)]">
        <div className="relative">
          <UserCard />
          <div className="absolute -bottom-[7%] -right-[45%]">
            <TotalVisits />
          </div>
          <div className="absolute top-[20%] -left-[45%] -z-10">
            <ProjectCard title="Projeto 1" content="Descricao do projeto 1" imageSrc="/project1.jpg" />
          </div>
          <div className="absolute -top-[5%] -left-[55%] -z-10">
            <ProjectCard title="Projeto 2" content="Descricao do projeto 2" imageSrc="/project2.jpg" />
          </div>
        </div>
      </div>
    </div>
  );
}