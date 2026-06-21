import { Fragment } from "react"
import Link from "next/link"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { createBreadcrumbStructuredData } from "@/lib/seo/structured-data"
import { JsonLd } from "../seo/json-ld"

export type BreadcrumbEntry = {
  label: string
  href: string
}

type BreadcrumbsProps = {
  items: BreadcrumbEntry[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          {items.map((item, index) => {
            const current = index === items.length - 1

            return (
              <Fragment key={item.href}>
                {index > 0 && <BreadcrumbSeparator />}

                <BreadcrumbItem>
                  {current ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={item.href}>{item.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <JsonLd
        data={createBreadcrumbStructuredData(items)}
      />
    </>
  )
}
