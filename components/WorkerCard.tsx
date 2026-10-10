import Image from "next/image";
import { BadgeCheck, MapPin, MessageCircle, Star } from "lucide-react";
import type { WorkerProfile } from "@/types";
import { createWhatsAppUrl } from "@/lib/whatsapp";
import { Badge, statusVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { statusLabel } from "@/lib/utils";
import { isDemoMode } from "@/lib/demo";

export function WorkerCard({ worker }: { worker: WorkerProfile }) {
  const fullName = `${worker.firstName} ${worker.lastName}`;

  return (
    <article className="premium-card lift-card overflow-hidden rounded-2xl">
      <div className="relative aspect-[4/3] bg-slate-100">
        <Image
          src={worker.photoUrl}
          alt={`Foto de ${fullName}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/35 to-transparent" />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-950">{fullName}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {worker.city}
            </p>
          </div>
          <Badge variant={isDemoMode ? "blue" : statusVariant(worker.verificationStatus)}>
            {isDemoMode ? "Ejemplo" : statusLabel(worker.verificationStatus)}
          </Badge>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
          {worker.rating} · {worker.reviewsCount} referencias
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {worker.serviceTypes.slice(0, 2).map((service) => (
            <Badge key={service} variant="blue">
              {service}
            </Badge>
          ))}
        </div>

        <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
          {worker.description}
        </p>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <Button href={`/perfiles/${worker.id}`} variant="outline" icon={<BadgeCheck className="h-4 w-4" />}>
            Ver perfil
          </Button>
          {!isDemoMode && worker.phone ? (
            <Button
              href={createWhatsAppUrl(worker.phone)}
              external
              variant="secondary"
              icon={<MessageCircle className="h-4 w-4" />}
            >
              Contactar
            </Button>
          ) : (
            <Button href={`/perfiles/${worker.id}`} variant="secondary">
              Conocer más
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
