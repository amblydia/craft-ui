"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/craft/button";
import { Checkbox } from "@/components/craft/checkbox";
import { Input } from "@/components/craft/input";

const schema = z.object({
  name: z.string().trim().min(3, "Use at least 3 characters."),
  publicWorld: z.boolean(),
});

type Values = z.infer<typeof schema>;

export function InputForm() {
  const id = useId();
  const [saved, setSaved] = useState<string | null>(null);
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<Values>({
    defaultValues: { name: "", publicWorld: false },
    resolver: zodResolver(schema),
  });

  return (
    <form
      className="flex w-full max-w-sm flex-col gap-4"
      noValidate
      onSubmit={handleSubmit((values) => setSaved(values.name))}
    >
      <div className="flex flex-col gap-2">
        <label
          className="font-craft-display text-(length:--craft-label-size)"
          htmlFor={id}
        >
          World name
        </label>
        <Input
          aria-describedby={errors.name ? `${id}-error` : undefined}
          error={Boolean(errors.name)}
          id={id}
          {...register("name")}
        />
        {errors.name ? (
          <p className="text-sm" id={`${id}-error`} role="alert">
            {errors.name.message}
          </p>
        ) : null}
      </div>
      <Controller
        control={control}
        name="publicWorld"
        render={({ field }) => (
          <Checkbox
            checked={field.value}
            label="Public world"
            onCheckedChange={field.onChange}
          />
        )}
      />
      <Button type="submit">Create world</Button>
      <p aria-live="polite" className="min-h-6 text-sm">
        {saved ? `Created ${saved}.` : null}
      </p>
    </form>
  );
}
