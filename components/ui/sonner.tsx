"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--color-white)",
          "--normal-text": "var(--color-percussion)",
          "--normal-border": "var(--color-white)",

        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
