"use client"

import { useTransition } from "react"
import { usePathname, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type FilterOption = {
  label: string
  value: string
}

type LandingPageFilterProps = {
  label: string
  parameter: "city" | "cuisine"
  options: FilterOption[]
  selectedValue: string
}

export function LandingPageFilter({
  label,
  parameter,
  options,
  selectedValue,
}: LandingPageFilterProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function navigate(value: string) {
    const params = new URLSearchParams()

    if (value && value !== "all") {
      params.set(parameter, value)
    }

    const query = params.toString()
    const destination = query ? `${pathname}?${query}` : pathname

    startTransition(() => {
      router.push(destination, {
        scroll: false,
      })
    })
  }

  return (
    <div
      className="flex flex-col gap-4 rounded-lg border bg-muted/30 p-4 sm:flex-row sm:items-end"
      aria-busy={isPending}
    >
      <div className="w-full space-y-2 sm:max-w-sm">
        <label
          htmlFor={`${parameter}-landing-filter`}
          className="text-sm font-medium"
        >
          {label}
        </label>

        <Select
          value={selectedValue || "all"}
          onValueChange={navigate}
          disabled={isPending}
        >
          <SelectTrigger id={`${parameter}-landing-filter`} className="w-full">
            <SelectValue placeholder={`All ${label.toLowerCase()}s`} />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All {label.toLowerCase()}s</SelectItem>

            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        type="button"
        variant="outline"
        disabled={!selectedValue || isPending}
        onClick={() => navigate("")}
      >
        Clear filter
      </Button>
    </div>
  )
}
