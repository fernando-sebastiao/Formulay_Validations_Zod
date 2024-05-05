import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { string, z } from "zod";
import "./index.css";

//Schema => Representação de uma estrutura de dados
//[x] => Validação com zod
//[x] => fields array
const createUserFormSchema = z.object({
  name: z
    .string()
    .nonempty("O nome é obrigatório!")
    .transform((name) => {
      return (
        name
          .trim()
          .split(" ")
          //Para poder colocar cada palavra após o espaço em maiúscula
          .map((word) => {
            return word[0].toLocaleUpperCase().concat(word.substring(1));
          })
          .join(" ")
      );
    }),
  email: z
    .string()
    .nonempty("O email é obrigatório!")
    .toLowerCase()
    .email("Formato de email inválido!")
    .refine((email) => {
      return email.endsWith("@rocketseat.com");
    }, "O email precisa ser da Rocketseat"),
  password: string().min(6, "A senha precisa no minímo 6 caracteres"),
  techs: z
    .array(
      z.object({
        title: z.string().nonempty("O titulo é obrigatório!"),
        knowledge: z.coerce.number().min(1).max(100),
      })
    )
    .min(2, "Insira pelo menos duas tecnológias!")
    .refine((techs) => {
      return techs.some((tech) => tech.knowledge > 50);
    }, "Você está aprendendo!"),
});

type createUserformData = z.infer<typeof createUserFormSchema>;

function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<createUserformData>({
    resolver: zodResolver(createUserFormSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "techs",
  });

  function addNewTech() {
    append({ title: "", knowledge: 0 });
  }

  console.log(errors);
  const [output, setOutput] = useState("");
  function createUser(data: createUserformData) {
    setOutput(JSON.stringify(data, null, 2));
  }
  return (
    <main className="h-screen bg-zinc-950 flex flex-col  items-center text-zinc-300 justify-center  gap-10">
      <form
        //what is bellow is call by *High order function* is like a function into other function and return other function
        onSubmit={handleSubmit(createUser)}
        className="flex flex-col w-full gap-4 max-w-xs"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="name">Nome</label>
          <input
            className="px-3 border border-zinc-800 rounded h-9 shadow-sm bg-zinc-900 text-white"
            type="text"
            {...register("name")}
          />
          {errors.name && (
            <span className="text-xs text-red-400">{errors.name.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email</label>
          <input
            className="px-3 border border-zinc-800 rounded h-9 shadow-sm bg-zinc-900 text-white"
            type="email"
            {...register("email")}
          />
          {errors.email && (
            <span className="text-xs text-red-400">{errors.email.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password">Senha</label>
          <input
            className="px-3 border border-zinc-800 rounded h-9 shadow-sm bg-zinc-900 text-white"
            type="password"
            {...register("password")}
          />
          {errors.password && (
            <span className="text-xs text-red-400">
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="" className="flex items-center justify-between">
            Tecnologias
            <button
              type="button"
              className="text-emerald-500 text-sm"
              onClick={addNewTech}
            >
              Adicionar
            </button>
          </label>
          {fields.map((fields, index) => {
            return (
              <div className="flex gap-2" key={fields.id}>
                <div className="flex-1 flex flex-col gap-1">
                  <input
                    className="px-3 border border-zinc-800 rounded h-9 shadow-sm bg-zinc-900 text-white"
                    type="text"
                    {...register(`techs.${index}.title`)}
                  />

                  {errors.techs?.[index]?.title && (
                    <span className="text-xs text-red-400">
                      {errors.techs?.[index]?.title?.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <input
                    className="px-3 border border-zinc-800 rounded h-9 shadow-sm bg-zinc-900 text-white w-16"
                    type="number"
                    {...register(`techs.${index}.knowledge`)}
                  />
                  {errors.techs?.[index]?.knowledge && (
                    <span className="text-xs text-red-400">
                      {errors.techs?.[index]?.knowledge?.message}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
          {errors.techs && (
            <span className="text-xs text-red-400">{errors.techs.message}</span>
          )}
        </div>

        <button
          className="bg-emerald-500 rounded font-semibold text-white h-10 hover:bg-emerald-600"
          type="submit"
        >
          Salvar
        </button>
        <pre>{output}</pre>
      </form>
    </main>
  );
}

export default App;
