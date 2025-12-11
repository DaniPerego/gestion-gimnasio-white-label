'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { createTransaccion } from '@/lib/actions-transacciones';
import { Socio } from '@prisma/client';

export default function Form({ socios }: { socios: Socio[] }) {
  const initialState = { message: '', errors: {} };
  const [state, dispatch, isPending] = useActionState(createTransaccion, initialState);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Socio */}
        <div className="mb-4">
          <label htmlFor="socioId" className="mb-2 block text-sm font-medium">
            Seleccionar Socio
          </label>
          <div className="relative">
            <select
              id="socioId"
              name="socioId"
              className="peer block w-full rounded-md border border-gray-200 bg-white text-gray-900 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="socio-error"
            >
              <option value="" disabled>
                Seleccione un socio
              </option>
              {socios.map((socio) => (
                <option key={socio.id} value={socio.id}>
                  {socio.nombre} {socio.apellido} - {socio.dni}
                </option>
              ))}
            </select>
          </div>
          <div id="socio-error" aria-live="polite" aria-atomic="true">
            {state.errors?.socioId &&
              state.errors.socioId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Monto */}
        <div className="mb-4">
          <label htmlFor="monto" className="mb-2 block text-sm font-medium">
            Monto
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="monto"
                name="monto"
                type="number"
                step="0.01"
                placeholder="Ingrese el monto"
                className="peer block w-full rounded-md border border-gray-200 bg-white text-gray-900 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="monto-error"
              />
            </div>
          </div>
          <div id="monto-error" aria-live="polite" aria-atomic="true">
            {state.errors?.monto &&
              state.errors.monto.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Concepto */}
        <div className="mb-4">
          <label htmlFor="concepto" className="mb-2 block text-sm font-medium">
            Concepto
          </label>
          <div className="relative">
            <input
              id="concepto"
              name="concepto"
              type="text"
              placeholder="Ej: Pago mensualidad, Compra bebida"
              className="peer block w-full rounded-md border border-gray-200 bg-white text-gray-900 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="concepto-error"
            />
          </div>
          <div id="concepto-error" aria-live="polite" aria-atomic="true">
            {state.errors?.concepto &&
              state.errors.concepto.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Metodo Pago */}
        <div className="mb-4">
          <label htmlFor="metodoPago" className="mb-2 block text-sm font-medium">
            Método de Pago
          </label>
          <div className="relative">
            <select
              id="metodoPago"
              name="metodoPago"
              className="peer block w-full rounded-md border border-gray-200 bg-white text-gray-900 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="metodo-error"
            >
              <option value="" disabled>
                Seleccione un método
              </option>
              <option value="EFECTIVO">Efectivo</option>
              <option value="TARJETA">Tarjeta</option>
              <option value="TRANSFERENCIA">Transferencia</option>
              <option value="OTRO">Otro</option>
            </select>
          </div>
          <div id="metodo-error" aria-live="polite" aria-atomic="true">
            {state.errors?.metodoPago &&
              state.errors.metodoPago.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div aria-live="polite" aria-atomic="true">
            {state.message && (
                <p className="mt-2 text-sm text-red-500" key={state.message}>
                    {state.message}
                </p>
            )}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/admin/transacciones"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <button type="submit" aria-disabled={isPending} className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
            {isPending ? 'Registrando...' : 'Registrar Transacción'}
        </button>
      </div>
    </form>
  );
}
