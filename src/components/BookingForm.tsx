'use client';
import { useRef, useState, type FormEvent } from 'react';
import { IconBrandWhatsapp, IconSend, IconUpload } from '@tabler/icons-react';
import { booking, whatsappUrl } from '@/content';
import InkSection from './InkSection';
import Accent from './Accent';

type Field = 'name' | 'whatsapp' | 'idea' | 'place' | 'size';
type Errors = Partial<Record<Field, string>>;
const ORDER: Field[] = ['name', 'whatsapp', 'idea', 'place', 'size'];

function validate(v: Record<Field, string>): Errors {
  const e: Errors = {};
  if (!v.name) e.name = booking.errors.name;
  if (v.whatsapp.replace(/\D/g, '').length < 10) e.whatsapp = booking.errors.whatsapp;
  if (v.idea.length < 10) e.idea = booking.errors.idea;
  if (!v.place) e.place = booking.errors.place;
  if (!v.size) e.size = booking.errors.size;
  return e;
}

function buildMessage(v: Record<Field, string>, file: string) {
  const m = booking.message;
  return [
    m.greeting,
    '',
    `*${m.name}:* ${v.name}`,
    `*${m.whatsapp}:* ${v.whatsapp}`,
    `*${m.idea}:* ${v.idea}`,
    `*${m.place}:* ${v.place}`,
    `*${m.size}:* ${v.size}`,
    ...(file ? ['', m.reference(file)] : []),
  ].join('\n');
}

/** Formulário de agendamento: valida e abre o WhatsApp com a mensagem pronta. */
export default function BookingForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [fileName, setFileName] = useState('');
  const [done, setDone] = useState<{ first: string; url: string } | null>(null);
  const f = booking.fields;

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const v = Object.fromEntries(ORDER.map((k) => [k, String(fd.get(k) ?? '').trim()])) as Record<Field, string>;
    const errs = validate(v);
    setErrors(errs);
    const firstBad = ORDER.find((k) => errs[k]);
    if (firstBad) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstBad}"]`)?.focus();
      return;
    }
    const url = whatsappUrl(buildMessage(v, fileName));
    window.open(url, '_blank', 'noopener,noreferrer');
    setDone({ first: v.name.split(' ')[0], url });
  };

  const clear = (k: Field) => errors[k] && setErrors((e) => ({ ...e, [k]: undefined }));

  const field = (k: Field) => ({
    id: `f-${k}`,
    name: k,
    'aria-invalid': !!errors[k],
    'aria-describedby': `f-${k}-err`,
    onInput: () => clear(k),
  });
  const err = (k: Field) => (
    <div className="err" id={`f-${k}-err`} aria-live="polite">
      {errors[k] ?? ''}
    </div>
  );

  return (
    <InkSection id="ag">
      <span className="lbl rv scr">{booking.label}</span>
      <h2 className="big rv">
        <Accent {...booking.title} />
      </h2>
      {done ? (
        <div className="ok" role="status">
          {booking.success(done.first)}
          <br />
          <a href={done.url} target="_blank" rel="noopener noreferrer">
            {booking.successFallback}
          </a>
        </div>
      ) : (
        <form ref={formRef} noValidate onSubmit={submit}>
          <div className="f">
            <input {...field('name')} placeholder=" " autoComplete="name" />
            <label htmlFor="f-name">{f.name}</label>
            {err('name')}
          </div>
          <div className="f">
            <input {...field('whatsapp')} placeholder=" " inputMode="tel" type="tel" autoComplete="tel" />
            <label htmlFor="f-whatsapp">{f.whatsapp}</label>
            {err('whatsapp')}
          </div>
          <div className="f w">
            <textarea {...field('idea')} placeholder=" " />
            <label htmlFor="f-idea">{f.idea}</label>
            {err('idea')}
          </div>
          <div className="f fx">
            <select {...field('place')} defaultValue="" onChange={() => clear('place')}>
              <option value="">{f.choose}</option>
              {booking.places.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
            <label htmlFor="f-place">{f.place}</label>
            {err('place')}
          </div>
          <div className="f fx">
            <select {...field('size')} defaultValue="" onChange={() => clear('size')}>
              <option value="">{f.choose}</option>
              {booking.sizes.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <label htmlFor="f-size">{f.size}</label>
            {err('size')}
          </div>
          <div className="f w">
            <label className="up" htmlFor="f-file">
              <IconUpload aria-hidden="true" stroke={1.5} /> <span>{fileName || f.file}</span>
            </label>
            <input
              type="file"
              id="f-file"
              name="file"
              accept="image/*"
              className="sr"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')}
            />
          </div>
          <div className="f w f-actions">
            <button type="submit" className="mb mag">
              {booking.submit} <IconSend aria-hidden="true" stroke={1.5} />
            </button>
            <a className="mb mag alt" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
              <IconBrandWhatsapp aria-hidden="true" stroke={1.5} /> {booking.whatsappButton}
            </a>
          </div>
        </form>
      )}
    </InkSection>
  );
}
