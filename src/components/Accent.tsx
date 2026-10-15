/** Título com um trecho em itálico vermelho. */
export default function Accent({ before, accent, after }: { before: string; accent: string; after: string }) {
  return (
    <>
      {before}
      <i>{accent}</i>
      {after}
    </>
  );
}
