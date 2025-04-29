'use client'
import { use } from "react";

interface DottedBgProps {
  color?: string;
}

const DottedBg = ({ color = "#ccc" }: DottedBgProps) => {
  return (
    <style jsx global>{`
          .dotted-bg {
            background-image: radial-gradient(circle, ${color} 1px, transparent 1px);
            background-size: 5px 5px;
          }
        `}</style>
  )
}

export default DottedBg;
